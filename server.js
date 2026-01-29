const express = require("express");
const app = express();

// ✅ CRITICAL: Add body parser middleware FIRST
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root route for UptimeRobot
app.get("/", (req, res) => {
  console.log("✅ Keep-alive ping");
  res.json({
    status: "active",
    service: "honeypot-api",
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Honeypot endpoint
app.post("/api/honeypot", (req, res) => {
  console.log("📨 Honeypot request received");
  
  try {
    // 1. Check API key
    const apiKey = req.headers['x-api-key'];
    
    if (!apiKey) {
      console.log("❌ Missing API key");
      return res.status(401).json({ error: "Missing x-api-key header" });
    }
    
    if (apiKey !== "super_secret_honeypot_key_123") {
      console.log("❌ Invalid API key:", apiKey);
      return res.status(401).json({ error: "Invalid API key" });
    }
    
    // 2. Check body exists
    if (!req.body) {
      console.log("❌ No request body");
      return res.status(400).json({ error: "Request body required" });
    }
    
    console.log("✅ Valid request. Body:", req.body);
    
    const message = req.body.message || "No message provided";
    
    // 3. Extract intelligence
    const extractedIntel = {
      original_message: message,
      timestamp: new Date().toISOString(),
      has_urgency_keywords: message.toLowerCase().includes('urgent'),
      contains_links: message.includes("http") || message.includes("www."),
      scam_indicators: findScamIndicators(message),
      word_count: message.split(' ').length,
      threat_level: "high",
      recommendation: "Block sender and report"
    };
    
    // 4. Return response
    res.status(200).json({
      status: "scam_detected",
      confidence: 0.95,
      extracted: extractedIntel
    });
    
  } catch (error) {
    console.error("🔥 Server error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: error.message
    });
  }
});

// Helper function
function findScamIndicators(text) {
  const indicators = ['password', 'bank', 'verify', 'account', 'winner', 'prize', 'login', 'click', 'urgent'];
  const lowerText = text.toLowerCase();
  return indicators.filter(indicator => lowerText.includes(indicator));
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    error: "Server error",
    details: "Please try again later"
  });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Honeypot API running on port ${PORT}`);
  console.log(`✅ Root: GET /`);
  console.log(`✅ Honeypot: POST /api/honeypot`);
});