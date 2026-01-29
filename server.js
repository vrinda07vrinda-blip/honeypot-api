const express = require("express");
const app = express();

app.use(express.json());

// 🔥 ADD THIS ROOT ROUTE FOR UPTIMEROBOT:
app.get("/", (req, res) => {
  console.log("✅ Keep-alive ping from:", req.headers['user-agent']);
  res.status(200).json({
    status: "active",
    service: "honeypot-api",
    endpoint: "/api/honeypot",
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Your existing honeypot endpoint
app.post("/api/honeypot", (req, res) => {
  const apiKey = req.headers['x-api-key'];
  
  if (apiKey !== "super_secret_honeypot_key_123") {
    return res.status(401).json({ error: "Unauthorized" });
  }
  
  const scamData = req.body || {};
  const message = scamData.message || "No message provided";
  
  const extractedIntel = {
    original_message: message,
    timestamp: new Date().toISOString(),
    has_urgency_keywords: hasUrgencyKeywords(message),
    contains_links: message.includes("http") || message.includes("www."),
    scam_indicators: findScamIndicators(message),
    threat_level: "high",
    recommendation: "Block sender and report"
  };
  
  res.status(200).json({
    status: "scam_detected",
    confidence: 0.95,
    extracted: extractedIntel
  });
});

// Helper functions
function hasUrgencyKeywords(text) {
  const urgencyWords = ['urgent', 'immediately', 'now', 'quick', 'hurry', 'limited'];
  return urgencyWords.some(word => text.toLowerCase().includes(word));
}

function findScamIndicators(text) {
  const indicators = ['password', 'bank', 'verify', 'account', 'winner', 'prize', 'login', 'click'];
  return indicators.filter(indicator => text.toLowerCase().includes(indicator));
}

const PORT = process.env.PORT || 8080;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Honeypot API with root route running on port ${PORT}`);
});