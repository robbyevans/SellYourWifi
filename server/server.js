const express = require("express");
const cors = require("cors");
const wifi = require("node-wifi"); // Ensure node-wifi is installed
const { exec } = require("child_process");

const app = express();
app.use(cors());
app.use(express.json()); // For parsing application/json

// Initialize wifi module
wifi.init({
  iface: null, // Use null to allow all available interfaces
});

// Store the active interface
let activeIface = null;

app.post("/connect", async (req, res) => {
  const { ssid, password, duration } = req.body;

  if (!ssid || !password || !duration) {
    return res.status(400).send("Missing parameters");
  }

  try {
    // Connect to the Wi-Fi network
    await wifi.connect({ ssid, password });
    console.log(`Connected to ${ssid}`);

    // Get the current connections to find the active interface
    const connections = await wifi.getCurrentConnections();
    if (connections.length > 0) {
      activeIface = connections[0].iface; // Store the interface of the connected Wi-Fi
      console.log(`Using interface: ${activeIface}`);
    }

    // Set a timeout to disconnect after the given duration
    const disconnectTimeout = setTimeout(async () => {
      if (activeIface) {
        try {
          await disconnectFromWifi(activeIface); // Use the dynamic interface
          console.log(`Disconnected from ${ssid} after ${duration} minutes`);
        } catch (disconnectError) {
          console.error("Error during custom disconnect:", disconnectError);
        }
      }
    }, duration * 60000); // Convert minutes to milliseconds

    res.send(`Connected to ${ssid} for ${duration} minutes`);
  } catch (error) {
    console.error("Error connecting to Wi-Fi:", error);
    res.status(500).send("Failed to connect to Wi-Fi");
  }
});

// Custom disconnect function
const disconnectFromWifi = (iface) => {
  return new Promise((resolve, reject) => {
    exec(`nmcli device disconnect ${iface}`, (error, stdout, stderr) => {
      if (error) {
        reject(`Error disconnecting from Wi-Fi: ${stderr || stdout}`);
      } else {
        resolve(stdout);
      }
    });
  });
};

// New disconnect endpoint
app.post("/disconnect", async (req, res) => {
  try {
    if (activeIface) {
      await disconnectFromWifi(activeIface); // Use the dynamic interface
      activeIface = null; // Reset active interface after disconnecting
      console.log("Disconnected from Wi-Fi");
      res.send("Disconnected from Wi-Fi");
    } else {
      res.status(400).send("No active connection to disconnect");
    }
  } catch (error) {
    console.error("Error disconnecting from Wi-Fi", error);
    res.status(500).send("Failed to disconnect from Wi-Fi");
  }
});

// Start the server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
