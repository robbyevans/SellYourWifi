const express = require("express");
const cors = require("cors");
const wifi = require("node-wifi"); // Ensure node-wifi is installed

const app = express();
app.use(cors());
app.use(express.json()); // For parsing application/json

// Initialize wifi module
wifi.init({
  iface: null, // network interface, null to use all available interfaces
});

app.post("/connect", async (req, res) => {
  const { ssid, password, duration } = req.body;

  if (!ssid || !password || !duration) {
    return res.status(400).send("Missing parameters");
  }

  try {
    // Connect to the Wi-Fi network
    await wifi.connect({ ssid, password });
    console.log(`Connected to ${ssid}`);

    // Set a timeout to disconnect after the given duration
    setTimeout(async () => {
      await wifi.disconnect();
      console.log(`Disconnected from ${ssid} after ${duration} minutes`);
    }, duration * 60000); // Convert minutes to milliseconds

    res.send(`Connected to ${ssid} for ${duration} minutes`);
  } catch (error) {
    console.error("Error connecting to Wi-Fi", error);
    res.status(500).send("Failed to connect to Wi-Fi");
  }
});

// Start the server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
