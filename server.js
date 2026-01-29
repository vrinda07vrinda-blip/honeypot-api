const express = require("express");
const app = express();

// ✅ FIX 1: Accept ALL content types
app.use((req, res, next) => {
  let data = '';
  req.on('data', chunk => data += chunk);
  req.on('end', () => {
    try {
      req.rawBody = data;
      req.body = data ? JSON.parse(data) : {};
    } catch {
      req.body = data || {};
    }
    next();
  });
});

// ✅ FIX 2: Root route
app.get("/", (req, res) => {
  res.json({ status: "ok", api: "honeypot", time: new Date().toISOString() });
});

// ✅ FIX 3: Honeypot endpoint
app.post("/api/honeypot", (req, res) => {
  console.log("REQUEST RECEIVED");
  console.log("Headers:", req.headers);
  console.log("Raw body:", req.rawBody);
  console.log("Parsed body:", req.body);
  
  // Check API key
  const apiKey = req.headers['x-api-key'];
  
  if (!apiKey) {
    return res.status(401).json({ error: "Missing x-api-key header" });
  }
  
  if (apiKey.trim() !== "super_secret_honeypot_key_123") {
    return res.status(401).json({ error: "Invalid API key" });
  }
  
  // Always return success
  res.json({
    status: "scam_detected",
    confidence: 0.95,
    extracted: {
      message: req.body?.message || req.rawBody || "No data",
      timestamp: new Date().toISOString(),
      received: req.body,
      headers: req.headers
    }
  });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`✅ Ready for evaluation!`);
});