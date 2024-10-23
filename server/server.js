const express = require("express");
const wifi = require("node-wifi");
const cors = require("cors");
const xss = require("xss");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Sanitize inputs to prevent injection attacks
const sanitizeInput = (input) => xss(input);

app.post("/connect", (req, res) => {
  const ssid = sanitizeInput(req.body.ssid);
  const password = sanitizeInput(req.body.password);
  const duration = Number(req.body.duration);

  wifi.connect({ ssid, password }, (err) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Error connecting to Wi-Fi");
    }
    console.log(`Connected to ${ssid}`);

    setTimeout(() => {
      wifi.disconnect((err) => {
        if (err) {
          console.log(err);
          return res.status(500).send("Error disconnecting from Wi-Fi");
        }
        console.log("Disconnected from Wi-Fi");
        res.send("Disconnected from Wi-Fi");
      });
    }, duration * 60 * 1000);
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
