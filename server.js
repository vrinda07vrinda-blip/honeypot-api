const express = require("express");
const app = express();

app.use(express.json());

// Honeypot endpoint
app.post("/api/honeypot", (req, res) => {
  const auth = req.headers.authorization;

  if (auth !== "Bearer super_secret_honeypot_key_123") {
    return res.status(401).json({
      error: "Unauthorized"
    });
  }

  console.log("🚨 HONEYPOT TRIGGERED 🚨");
  console.log("Message received:", req.body.message);

  res.status(200).json({
    status: "scam_detected",
    confidence: 0.95,
    extracted: {
      message: req.body.message
    }
  });
});

// IMPORTANT: bind to all interfaces
const PORT = 8080;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚨 Honeypot API running on port ${PORT}`);
});
