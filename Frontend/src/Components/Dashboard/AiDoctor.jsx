import React, { useEffect, useState, useRef } from "react";
import { useMyContext } from "../../Context/myContext.jsx";
import { Send, Trash2, UserCircle, Stethoscope } from "lucide-react";

export default function AiDoctor() {
  const { userInfo } = useMyContext();
  const [question, setQuestion] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    const savedChat = localStorage.getItem("aiDoctorChat");
    if (savedChat) setChat(JSON.parse(savedChat));
  }, []);

  useEffect(() => {
    localStorage.setItem("aiDoctorChat", JSON.stringify(chat));
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const handleAsk = async () => {
    if (!question.trim()) return;

    const newChat = [...chat, { role: "user", content: question }];
    setChat(newChat);
    setLoading(true);

    try {
      const res = await fetch("http://localhost:4000/api/ai/ai-doctor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: userInfo._id, question }),
      });

      const data = await res.json();
      const reply = data.response || "⚠️ AI failed to respond properly.";
      setChat([...newChat, { role: "ai", content: reply }]);
    } catch (err) {
      setChat([
        ...newChat,
        {
          role: "ai",
          content: "❌ Something went wrong. Please try again later.",
        },
      ]);
    } finally {
      setQuestion("");
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    setChat([]);
    localStorage.removeItem("aiDoctorChat");
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-gradient-to-br from-white via-gray-50 to-blue-50 shadow-xl rounded-3xl border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-3xl font-bold text-blue-800 flex items-center gap-2">
            <Stethoscope size={28} /> AI Doctor
          </h2>
          <p className="text-gray-500">
            Ask any health-related questions and get instant responses.
          </p>
        </div>
        <button
          onClick={handleClearChat}
          className="flex items-center gap-1 text-red-500 hover:text-red-700 transition text-sm"
        >
          <Trash2 size={16} /> Clear
        </button>
      </div>

      <div className="h-[25rem] overflow-y-auto rounded-xl p-4 bg-white shadow-inner border border-gray-100 space-y-4 custom-scrollbar">
        {chat.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`flex items-start gap-3 max-w-[80%] ${
                msg.role === "user" ? "flex-row-reverse" : ""
              }`}
            >
              <div className="p-1">
                {msg.role === "user" ? (
                  <UserCircle size={30} className="text-blue-500" />
                ) : (
                  <Stethoscope size={30} className="text-green-600" />
                )}
              </div>
              <div
                className={`px-4 py-2 text-sm rounded-2xl shadow-md ${
                  msg.role === "user"
                    ? "bg-blue-600 text-white rounded-br-none"
                    : "bg-green-100 text-green-900 rounded-bl-none"
                }`}
              >
                <span className="font-medium">{msg.role === "user" ? "You" : "AI"}:</span>{" "}
                {msg.content}
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-sm text-gray-400 italic">
            <Stethoscope size={18} className="animate-bounce" /> AI Doctor is typing...
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="flex gap-3 mt-6">
        <input
          className="flex-1 px-5 py-3 border border-gray-300 rounded-xl shadow focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-gray-800"
          type="text"
          placeholder="Type your medical query..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAsk()}
        />
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-3 rounded-xl shadow transition flex items-center gap-2"
          onClick={handleAsk}
          disabled={loading}
        >
          <Send size={16} />
          {loading ? "Asking..." : "Ask"}
        </button>
      </div>
    </div>
  );
}
