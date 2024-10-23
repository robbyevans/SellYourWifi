import React, { useState } from "react";

interface WifiOptions {
  ssid: string;
  password: string;
  duration: number;
}

const App: React.FC = () => {
  const [ssid, setSsid] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [duration, setDuration] = useState<number>(5);
  const [status, setStatus] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false); // State to toggle password visibility

  const handleConnect = async () => {
    const wifiData: WifiOptions = { ssid, password, duration };
    try {
      setStatus("Connecting...");
      const response = await fetch("http://localhost:3001/connect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(wifiData),
      });

      if (response.ok) {
        const result = await response.text();
        setStatus(result);
      } else {
        setStatus("Failed to connect");
      }
    } catch (error) {
      setStatus("Error: Unable to connect");
      console.error(error);
    }
  };

  return (
    <div className="App">
      <h1>Wi-Fi Connection Manager</h1>
      <div>
        <label>
          Wi-Fi SSID:
          <input
            type="text"
            value={ssid}
            onChange={(e) => setSsid(e.target.value)}
            placeholder="Enter Wi-Fi SSID"
          />
        </label>
      </div>
      <div>
        <label>
          Password:
          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"} // Toggle between text and password
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Wi-Fi Password"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)} // Toggle showPassword state
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                border: "none",
                background: "none",
                cursor: "pointer",
              }}
            >
              {showPassword ? "👁️" : "👁️‍🗨️"}{" "}
              {/* Change the icon based on state */}
            </button>
          </div>
        </label>
      </div>
      <div>
        <label>
          Connect for:
          <select
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
          >
            <option value={0.5}>30 seconds</option>
            <option value={5}>5 minutes</option>
            <option value={10}>10 minutes</option>
            <option value={30}>30 minutes</option>
          </select>
        </label>
      </div>
      <div>
        <button onClick={handleConnect}>Connect to Wi-Fi</button>
      </div>
      <div>
        <p>Status: {status}</p>
      </div>
    </div>
  );
};

export default App;
