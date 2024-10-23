import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SetupPage: React.FC = () => {
  const [ssid, setSsid] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleWifiSetup = () => {
    if (ssid && password) {
      // Perform Wi-Fi setup here
      navigate("/payment-setup");
    }
  };

  return (
    <div>
      <h1>Link Your Wi-Fi</h1>
      <input
        type="text"
        placeholder="Enter Wi-Fi SSID"
        value={ssid}
        onChange={(e) => setSsid(e.target.value)}
      />
      <input
        type="password"
        placeholder="Enter Wi-Fi Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleWifiSetup}>Connect Wi-Fi</button>
    </div>
  );
};

export default SetupPage;
