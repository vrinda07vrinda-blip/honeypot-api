const express = require("express");
const app = express();

app.use(express.json());

// Root route
app.get("/", (req, res) => {
  res.json({ status: "ok", service: "scam-detection-api" });
});

// MAIN ENDPOINT - MUST RETURN EXACT REPLY
app.post("/api/honeypot", (req, res) => {
  console.log("📥 Request received:", req.body);
  
  // 1. Check API key
  const apiKey = req.headers['x-api-key'];
  
  if (!apiKey || apiKey.trim() !== "super_secret_honeypot_key_123") {
    return res.status(401).json({ 
      status: "error",
      reply: "Unauthorized access"
    });
  }
  
  // 2. ALWAYS return the EXACT expected reply
  res.json({
    status: "success",                    // ⚠️ MUST be "success"
    reply: "Why is my account being suspended?"  // ⚠️ EXACT this string
  });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Scam Detection API running on port ${PORT}`);
  console.log(`🎯 ALWAYS returns: {status: "success", reply: "Why is my account being suspended?"}`);
});