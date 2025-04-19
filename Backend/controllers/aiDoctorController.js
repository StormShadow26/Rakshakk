// controllers/aiDoctorController.js

const { Julep } = require('@julep/sdk');
const yaml = require('yaml');
const User = require('../models/User.model');
const Hospital = require('../models/hospital.model.js');
const History = require('../models/history.model.js');

require('dotenv').config();

const client = new Julep({ apiKey: process.env.JULIP_API_KEY });

let cachedAgentId = null;
let cachedTaskId = null;

// --- 🛠 Real doctorInfo tool function ---
async function getDoctorInfo({ question, userId }) {
  const user1 = await User.findById(userId);
  if (!user1) throw new Error(`User not found: ${userId}`);

  const userLocation = user1.location.coordinates; // [lng, lat]
  console.log(userLocation + " user location");

  const specMatch = question.match(/need a ([A-Za-z]+) doctor/i);
  const specialization = specMatch ? specMatch[1].toLowerCase() : null;

  const allHospitals = await Hospital.find().lean();

  function haversine([lng1, lat1], [lng2, lat2]) {
    const toRad = deg => (deg * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  const withDistance = allHospitals.map(hosp => {
    const coords = hosp.location.coordinates;
    const distanceKm = haversine(userLocation, coords);
    return {
      _id: hosp._id,
      name: `${hosp.firstname} ${hosp.lastname}`,
      email: hosp.email,
      distanceKm: parseFloat(distanceKm.toFixed(2)),
    };
  });

  withDistance.sort((a, b) => a.distanceKm - b.distanceKm);

  return { hospitals: withDistance };
}

async function initializeAgent() {
  if (cachedAgentId) return cachedAgentId;
  const agent = await client.agents.create({
    name: "AI Doctor",
    model: "gpt-4o",
    about: "A virtual doctor providing health and wellness advice.",
    instructions: "Maintain conversation history and give daily guidance based on previous input.",
    tone: "professional",
    personality: "friendly",
    style: "concise",
    temperature: 0.5,
    maxTokens: 1500
  });
  cachedAgentId = agent.id;
  return agent.id;
}

async function initializeTask(agentId) {
  if (cachedTaskId) return cachedTaskId;
  const taskDef = `
name: Health Assistant
description: Answer health-related questions and provide guidance.
main:
  - prompt:
      - role: system
        content: "You are an AI doctor. Keep it concise and professional."
      - role: user
        content: "{{ steps[0].input.prompt }}"
`;
  const task = await client.tasks.create(agentId, yaml.parse(taskDef));
  cachedTaskId = task.id;
  return task.id;
}

async function getOrCreateUser(userId) {
  const u = await client.users.create({
    name: `Patient ${userId}`,
    about: "A patient seeking medical advice",
    metadata: { userId }
  });
  return u.id;
}

function formatHistory(history) {
  return history
    .map(day =>
      day.messages
        .map(m => `${m.role === 'user' ? 'User' : 'AI'}: ${m.content}`)
        .join('\n')
    )
    .join('\n') + '\nAI:';
}

async function askAiDoctor(req, res) {
  try {
    const { userId, question, useTool = false } = req.body;
    if (!userId || !question) {
      return res.status(400).json({ error: "userId and question are required" });
    }

    // ————— 1) Tool mode —————
    if (useTool) {
      const info = await getDoctorInfo({ question, userId });
      return res.json({
        response: `Here are the nearest hospitals sorted by distance:`,
        hospitals: info.hospitals
      });
    }

    // ————— 2) Standard AI flow —————
    const user = await User.findById(userId).populate("chatHistoryDetails");
    if (!user) return res.status(404).json({ error: "User not found" });

    let historyDoc = user.chatHistoryDetails;
    if (!historyDoc) {
      historyDoc = new History({ user: userId, history: [] });
      await historyDoc.save();
      user.chatHistoryDetails = historyDoc._id;
      await user.save();
    }

    if (historyDoc.history.length >= 7) historyDoc.history.shift();

    const today = new Date().toISOString().split("T")[0];
    let todayEntry = historyDoc.history.find(h => h.label === today);
    if (!todayEntry) {
      todayEntry = { label: today, messages: [] };
      historyDoc.history.push(todayEntry);
    }
    todayEntry.messages.push({ role: "user", content: question });

    const prompt = formatHistory(historyDoc.history);
    const agentId = await initializeAgent();
    const taskId = await initializeTask(agentId);
    const julepUserId = await getOrCreateUser(userId);

    const exec = await client.executions.create(taskId, {
      input: { prompt },
      user_id: julepUserId
    });

    let result;
    do {
      result = await client.executions.get(exec.id);
      if (["succeeded", "failed"].includes(result.status)) break;
      await new Promise(r => setTimeout(r, 500));
    } while (true);

    if (result.status !== "succeeded") {
      return res.status(500).json({ error: "AI execution failed", details: result });
    }

    const reply = result.output?.choices?.[0]?.message?.content?.trim();
    if (!reply) {
      return res.status(500).json({ error: "AI returned no reply" });
    }

    todayEntry.messages.push({ role: "ai", content: reply });
    await historyDoc.save();

    return res.json({ response: reply });

  } catch (err) {
    console.error("❌ AI Doctor Error:", err);
    return res.status(500).json({ error: "AI service error", details: err.message });
  }
}

module.exports = { askAiDoctor };
