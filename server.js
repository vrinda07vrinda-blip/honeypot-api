const express = require("express");
const app = express();

app.use(express.json());

app.post("/api/honeypot", (req, res) => {
  const apiKey = req.headers['x-api-key'];
  
  // 1. Authentication
  if (apiKey !== "super_secret_honeypot_key_123") {
    return res.status(401).json({ error: "Unauthorized" });
  }
  
  const scamData = req.body || {};
  const message = scamData.message || "No message provided";
  
  // 2. Extract intelligence (simplified example)
  const extractedIntel = {
    original_message: message,
    timestamp: new Date().toISOString(),
    has_urgency_keywords: hasUrgencyKeywords(message),
    contains_links: message.includes("http") || message.includes("www."),
    scam_indicators: findScamIndicators(message),
    threat_level: "high",
    recommendation: "Block sender and report"
  };
  
  // 3. ✅ CORRECT RESPONSE FORMAT WITH 'extracted' FIELD
  res.status(200).json({
    status: "scam_detected",      // Required
    confidence: 0.95,             // Required
    extracted: extractedIntel     // ⚠️ REQUIRED - you were missing this!
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
  console.log(`✅ Fixed API running on port ${PORT}`);
});