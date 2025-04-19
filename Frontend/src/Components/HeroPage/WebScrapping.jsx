import { MapContainer, TileLayer, Circle, Popup } from 'react-leaflet';
import { useEffect, useState } from 'react';
import 'leaflet/dist/leaflet.css';

export default function HotspotMap() {
  const [hotspots, setHotspots] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/api/hotspots")
      .then(res => res.json())
      .then(data => {
        console.log("🔥 Hotspots from backend:", data);
        setHotspots(data);
      })
      .catch(err => console.error("Failed to fetch hotspot data:", err));
  }, []);
  
  console.log("Hotpots are:"+hotspots);
  const getColor = (title) => {
    const lower = title.toLowerCase();
    if (lower.includes("epidemic") || lower.includes("pandemic")) return "red";
    if (lower.includes("flood")) return "blue";
    if (lower.includes("earthquake")) return "orange";
    return "purple";
  };

  const getRadius = (severity) => {
    if (!severity || isNaN(severity)) return 80000;
    return 50000 + severity * 30000;
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-tr from-[#0f0c29] via-[#302b63] to-[#24243e] text-white font-inter">
      
      {/* Header */}
      <header className="text-center py-8 shadow-lg border-b border-white/10 bg-opacity-90 backdrop-blur-sm">
        <h1 className="text-5xl font-black text-pink-300 drop-shadow-sm tracking-wide animate-fade-in">
          🌍 Global Crisis Hotspot Map
        </h1>
        <p className="mt-3 text-lg text-purple-200 font-medium">Real-time disaster & epidemic tracking made visual</p>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 flex-col md:flex-row gap-6 p-6 md:p-10">

        {/* Map Section */}
        <div className="w-full md:w-3/4 rounded-3xl overflow-hidden shadow-2xl border border-white/10 transition hover:shadow-indigo-500/20">
          <MapContainer
            center={[20, 0]}
            zoom={2}
            minZoom={2}
            maxZoom={6}
            scrollWheelZoom={true}
            style={{ height: "80vh", width: "100%" }}
            maxBounds={[[-90, -180], [90, 180]]}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              className="brightness-90"
            />
            {hotspots.map((spot, idx) => (
              <Circle
                key={idx}
                center={[spot.lat, spot.lon]}
                radius={getRadius(spot.severity)}
                pathOptions={{
                  color: getColor(spot.title),
                  fillOpacity: 0.6,
                }}
              >
                <Popup className="text-sm">
                  <div className="font-semibold text-base mb-1">{spot.title}</div>
                  <div className="text-gray-700">{spot.location}</div>
                  <div className="text-gray-600">📅 {spot.date}</div>
                  <div className="text-gray-700 mt-1">🔥 Severity: {spot.severity || "N/A"}</div>
                </Popup>
              </Circle>
            ))}
          </MapContainer>
        </div>

        {/* Legend Section */}
        <div className="w-full md:w-1/4 bg-[#1f1f2e] border border-white/10 rounded-3xl p-6 shadow-xl animate-slide-up">
          <h2 className="text-2xl font-bold text-pink-200 mb-4">🧭 Legend</h2>
          <ul className="space-y-4 text-sm">
            <li className="flex items-center">
              <span className="w-4 h-4 bg-red-500 rounded-full mr-3 shadow-md"></span>
              <span className="text-white">Epidemics / Pandemics</span>
            </li>
            <li className="flex items-center">
              <span className="w-4 h-4 bg-blue-500 rounded-full mr-3 shadow-md"></span>
              <span className="text-white">Floods</span>
            </li>
            <li className="flex items-center">
              <span className="w-4 h-4 bg-orange-500 rounded-full mr-3 shadow-md"></span>
              <span className="text-white">Earthquakes</span>
            </li>
            <li className="flex items-center">
              <span className="w-4 h-4 bg-purple-500 rounded-full mr-3 shadow-md"></span>
              <span className="text-white">Other Incidents</span>
            </li>
          </ul>

          {/* Tip */}
          <div className="mt-8 bg-white/5 rounded-xl px-4 py-3 text-sm text-purple-300 border border-white/10 shadow-inner">
            <span className="font-semibold">💡 Tip:</span> Zoom in and click a hotspot to view detailed info.
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center text-sm py-6 text-purple-300 border-t border-white/10">
        &copy; {new Date().getFullYear()} HealthChain Maps • All rights reserved.
      </footer>
    </div>
  );
}
