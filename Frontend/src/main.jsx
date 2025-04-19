
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { MyProvider } from "./Context/myContext.jsx";
import { SocketProvider } from "./Context/SocketProvider.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <MyProvider>
      <SocketProvider>
        <App />
      </SocketProvider>
    </MyProvider>
  </BrowserRouter>
);
