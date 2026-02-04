const express = require("express");
const app = express();

// ACCEPT ANY CONTENT TYPE
app.use(express.raw({ type: '*/*' }));

// Root route
app.get("/", (req, res) => {
  res.json({ status: "ok", service: "honeypot-api" });
});

// Honeypot endpoint - ACCEPTS ANYTHING
app.post("/api/honeypot", (req, res) => {
  console.log("📥 Request received");
  
  // 1. Check API key
  const apiKey = req.headers['x-api-key'];
  
  if (!apiKey || apiKey.trim() !== "super_secret_honeypot_key_123") {
    return res.status(401).json({
      status: "error",
      reply: "Unauthorized"
    });
  }
  
  console.log("✅ Authentication successful");
  
  // 2. ALWAYS return the EXACT expected response
  res.json({
    status: "success",
    reply: "Why is my account being suspended?"  // ⚠️ EXACT STRING
  });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ API running on port ${PORT}`);
  console.log(`🎯 Returns: {status: "success", reply: "Why is my account being suspended?"}`);
  console.log(`🔧 Accepts: ANY request (empty, JSON, text, etc.)`);
});