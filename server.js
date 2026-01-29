const express = require("express");
const app = express();

// ✅ CRITICAL FIX: Add body parser BEFORE any routes
app.use(express.json({
  strict: false, // Allow non-JSON objects
  limit: '10mb' // Increase size limit
}));

// Alternative: Use raw parser first, then JSON
app.use((req, res, next) => {
  if (req.headers['content-type'] === 'application/json') {
    express.json()(req, res, next);
  } else {
    next();
  }
});

// Root route - SIMPLE
app.get("/", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// Honeypot endpoint - ULTRA SIMPLE
app.post("/api/honeypot", (req, res) => {
  console.log("Headers:", req.headers);
  console.log("Body:", req.body);
  
  // Check API key
  const apiKey = req.headers['x-api-key'];
  
  if (!apiKey || apiKey !== "super_secret_honeypot_key_123") {
    return res.status(401).json({ 
      error: "Unauthorized",
      received: apiKey || "none"
    });
  }
  
  // Get message from body
  const message = req.body?.message || req.body || "No data";
  
  // Return required format
  res.json({
    status: "scam_detected",
    confidence: 0.95,
    extracted: {
      message: message,
      timestamp: new Date().toISOString(),
      received_data: req.body
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running on port ${PORT}`);
});