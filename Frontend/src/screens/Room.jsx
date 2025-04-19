import React, { useEffect, useCallback, useState } from "react";
import ReactPlayer from "react-player";
import peer from "../service/Peer";
import { useSocket } from "../Context/SocketProvider";

const RoomPage = () => {
  const socket = useSocket();
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [myStream, setMyStream] = useState();
  const [remoteStream, setRemoteStream] = useState();

  const handleUserJoined = useCallback(({ email, id }) => {
    console.log(`Email ${email} joined room`);
    setRemoteSocketId(id);
  }, []);

  const handleCallUser = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      const offer = await peer.getOffer();
      socket.emit("user:call", { to: remoteSocketId, offer });
      setMyStream(stream);
    } catch (error) {
      if (error.name === "NotReadableError") {
        alert("Camera or microphone is already in use by another application or tab.");
      } else {
        console.error("Error accessing media devices in handleCallUser:", error);
      }
    }
  }, [remoteSocketId, socket]);

  const handleIncommingCall = useCallback(
    async ({ from, offer }) => {
      try {
        setRemoteSocketId(from);
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true,
        });
        setMyStream(stream);
        console.log(`Incoming Call`, from, offer);
        const ans = await peer.getAnswer(offer);
        socket.emit("call:accepted", { to: from, ans });
      } catch (error) {
        if (error.name === "NotReadableError") {
          alert("Camera or microphone is already in use by another application or tab.");
        } else {
          console.error("Error accessing media devices in handleIncommingCall:", error);
        }
      }
    },
    [socket]
  );

  const sendStreams = useCallback(() => {
    for (const track of myStream.getTracks()) {
      peer.peer.addTrack(track, myStream);
    }
  }, [myStream]);

  const handleCallAccepted = useCallback(
    ({ from, ans }) => {
      peer.setLocalDescription(ans);
      console.log("Call Accepted!");
      sendStreams();
    },
    [sendStreams]
  );

  const handleNegoNeeded = useCallback(async () => {
    const offer = await peer.getOffer();
    socket.emit("peer:nego:needed", { offer, to: remoteSocketId });
  }, [remoteSocketId, socket]);

  useEffect(() => {
    peer.peer.addEventListener("negotiationneeded", handleNegoNeeded);
    return () => {
      peer.peer.removeEventListener("negotiationneeded", handleNegoNeeded);
    };
  }, [handleNegoNeeded]);

  const handleNegoNeedIncomming = useCallback(
    async ({ from, offer }) => {
      const ans = await peer.getAnswer(offer);
      socket.emit("peer:nego:done", { to: from, ans });
    },
    [socket]
  );

  const handleNegoNeedFinal = useCallback(async ({ ans }) => {
    await peer.setLocalDescription(ans);
  }, []);

  useEffect(() => {
    peer.peer.addEventListener("track", async (ev) => {
      const remoteStream = ev.streams;
      console.log("GOT TRACKS!!");
      setRemoteStream(remoteStream[0]);
    });
  }, []);

  useEffect(() => {
    socket.on("user:joined", handleUserJoined);
    socket.on("incomming:call", handleIncommingCall);
    socket.on("call:accepted", handleCallAccepted);
    socket.on("peer:nego:needed", handleNegoNeedIncomming);
    socket.on("peer:nego:final", handleNegoNeedFinal);

    return () => {
      socket.off("user:joined", handleUserJoined);
      socket.off("incomming:call", handleIncommingCall);
      socket.off("call:accepted", handleCallAccepted);
      socket.off("peer:nego:needed", handleNegoNeedIncomming);
      socket.off("peer:nego:final", handleNegoNeedFinal);
    };
  }, [
    socket,
    handleUserJoined,
    handleIncommingCall,
    handleCallAccepted,
    handleNegoNeedIncomming,
    handleNegoNeedFinal,
  ]);

  return (
    <div className="min-h-screen bg-white text-blue-900 p-6 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-4">Room Page</h1>
      <h4 className="mb-4 text-lg">{remoteSocketId ? "Connected" : "Waiting for another user..."}</h4>
      <div className="flex gap-4 mb-6">
        {myStream && (
          <button onClick={sendStreams} className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow">
            Send Stream
          </button>
        )}
        {remoteSocketId && (
          <button onClick={handleCallUser} className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 shadow">
            Call
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-6xl">
        {myStream && (
          <div className="bg-blue-50 p-4 rounded-2xl shadow">
            <h2 className="text-xl font-semibold mb-2">My Stream</h2>
            <ReactPlayer playing muted height="480px" width="100%" url={myStream} className="rounded-lg" />
          </div>
        )}
        {remoteStream && (
          <div className="bg-blue-50 p-4 rounded-2xl shadow">
            <h2 className="text-xl font-semibold mb-2">Remote Stream</h2>
            <ReactPlayer playing muted height="480px" width="100%" url={remoteStream} className="rounded-lg" />
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomPage;
