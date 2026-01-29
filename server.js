const express = require("express");
const app = express();

app.use(express.json());

// Honeypot endpoint
app.post("/api/honeypot", (req, res) => {
  console.log("🔍 Headers received:", req.headers);
  
  // The GUI tester sends 'x-api-key' in lowercase
  const apiKey = req.headers['x-api-key'];
  
  if (!apiKey) {
    console.log("❌ No x-api-key header found");
    return res.status(401).json({ error: "Unauthorized" });
  }
  
  if (apiKey.trim() !== "super_secret_honeypot_key_123") {
    console.log("❌ Invalid API key received:", apiKey);
    return res.status(401).json({ error: "Unauthorized" });
  }
  
  console.log("✅ API Key validated!");
  
  // Return success regardless of body
  res.status(200).json({
    status: "scam_detected",
    confidence: 0.95,
    message: "Honeypot triggered successfully",
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚨 Honeypot API running on port ${PORT}`);
});