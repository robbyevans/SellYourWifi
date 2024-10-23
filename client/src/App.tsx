import React, { useState, useEffect } from "react";
import ToastMessage from "./ToastMessage";
import { IoEyeOffSharp, IoEyeOutline } from "react-icons/io5";
import "./_app.scss";

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
  const [countdown, setCountdown] = useState<number | null>(null);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showToast, setShowToast] = useState<boolean>(false);

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
        setStatus("Success: " + result);
        startCountdown(duration * 60); // Start countdown in seconds
      } else {
        setStatus("Error: Failed to connect");
      }
    } catch (error) {
      setStatus("Error: Unable to connect");
      console.error(error);
    }
  };

  const startCountdown = (totalSeconds: number) => {
    setCountdown(totalSeconds);

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null) return null;

        const remainingTime = prev - 1;
        if (remainingTime <= totalSeconds * 0.1 && !showToast) {
          setShowToast(true); // Show the Toast when 10% of time is left
        }

        if (remainingTime <= 0) {
          clearInterval(interval);
          disconnectWifi();
          setShowToast(false); // Reset Toast state
          return null;
        }
        return remainingTime;
      });
    }, 1000);
    setIntervalId(interval);
  };

  const disconnectWifi = async () => {
    try {
      const response = await fetch("http://localhost:3001/disconnect", {
        method: "POST",
      });
      if (response.ok) {
        setStatus("Disconnected from Wi-Fi");
      } else {
        setStatus("Error: Failed to disconnect");
      }
    } catch (error) {
      setStatus("Error: Unable to disconnect");
      console.error(error);
    }
  };

  useEffect(() => {
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [intervalId]);

  const getStatusClass = () => {
    if (!status) return "";
    if (status.startsWith("Error")) return "error";
    if (status.startsWith("Success")) return "success";
    return "";
  };

  return (
    <div className="App">
      <h1>Wi-Fi Connection Manager</h1>
      <div className="form-group">
        <label>Wi-Fi SSID:</label>
        <input
          type="text"
          value={ssid}
          onChange={(e) => setSsid(e.target.value)}
          placeholder="Enter Wi-Fi SSID"
        />
      </div>
      <div className="form-group">
        <label className="password">Password:</label>
        <div className="password-container">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter Wi-Fi Password"
          />
          <button
            type="button"
            className="show-password"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <IoEyeOffSharp /> : <IoEyeOutline />}
          </button>
        </div>
      </div>
      <div className="form-group">
        <label className="duration">Connect for:</label>
        <select
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
        >
          <option value={0.5}>30 seconds</option>
          <option value={5}>5 minutes</option>
          <option value={10}>10 minutes</option>
          <option value={30}>30 minutes</option>
        </select>
      </div>
      <div className="form-group">
        <button className="connect-btn" onClick={handleConnect}>
          Connect to Wi-Fi
        </button>
      </div>
      {countdown !== null && (
        <p className="countdown">Countdown: {countdown} seconds</p>
      )}
      <p className={`info ${getStatusClass()}`}>Status: {status}</p>

      {showToast && (
        <ToastMessage
          onClose={() => setShowToast(false)}
          onRecharge={() => alert("Recharge option clicked!")}
          duration={5000} // Auto-close after 3 seconds
        />
      )}
    </div>
  );
};

export default App;
