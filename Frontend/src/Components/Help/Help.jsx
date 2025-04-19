import React, { useRef, useEffect, useState } from 'react';

const Help = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [alertReceived, setAlertReceived] = useState(false);

  useEffect(() => {
    // Request camera access
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      })
      .catch(err => console.error("Error accessing webcam:", err));
  }, []);

  const captureFrame = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    // Match canvas size to video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(async blob => {
      if (blob) {
        const formData = new FormData();
        // IMPORTANT: Use the key 'file' to match backend expectation
        formData.append('file', blob, 'frame.jpg');

        try {
          const response = await fetch('http://localhost:4000/api/v1/help/detect', {
            method: 'POST',
            body: formData,
          });

          if (!response.ok) {
            console.error('Flask returned error:', await response.text());
            return;
          }

          const result = await response.json();
          console.log(result)

          if (result.accident) {
            setAlertReceived(true);
            // Optional: reset alert after 3 seconds
            setTimeout(() => setAlertReceived(false), 3000);
          }
        } catch (error) {
          console.error('Error sending frame to backend:', error);
        }
      }
    }, 'image/jpeg', 0.8);
  };

  useEffect(() => {
    const intervalId = setInterval(captureFrame, 5000); // every 1 second
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
      <h2>Live Video Stream</h2>
      <video ref={videoRef} style={{ width: '100%', maxWidth: '600px' }}></video>
      <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
      {alertReceived && (
        <div style={{ color: 'red', fontWeight: 'bold', marginTop: '10px' }}>
          🚨 Accident Detected
        </div>
      )}
    </div>
  );
};

export default Help;
