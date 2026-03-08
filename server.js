const express = require("express");
const app = express();

// ACCEPT ANY CONTENT TYPE
app.use(express.raw({ type: '*/*' }));

// Root route
app.get("/", (req, res) => {
  console.log("✅ Root route accessed");
  res.json({ status: "ok", service: "honeypot-api" });
});

// Honeypot endpoint - ACCEPTS ANYTHING
app.post("/api/honeypot", (req, res) => {
  console.log("📢 Honeypot endpoint hit at:", new Date().toISOString());

  // 1. Check API key
  const apiKey = req.headers['x-api-key'];

  if (!apiKey || apiKey.trim() !== "super_secret_honeypot_key_123") {
    console.log("❌ Unauthorized access attempt - invalid API key");
    return res.status(401).json({
      status: "error",
      reply: "Unauthorized"
    });
  }

  console.log("✅ Authentication successful");
  console.log("Request body received:", req.body.toString() || "(empty)");

  // 2. ALWAYS return the EXACT expected response
  res.json({
    status: "success",
    reply: "Why is my account being suspended?"
  });
});

// Catch-all for undefined routes (helps with debugging)
app.use("*", (req, res) => {
  console.log(`❓ Unknown route: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ 
    error: "Not Found", 
    message: `Route ${req.method} ${req.originalUrl} does not exist`,
    availableEndpoints: ["GET /", "POST /api/honeypot"]
  });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server started successfully on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`📍 Test your API:`);
  console.log(`   - GET  https://honeypot-api-1-66il.onrender.com/`);
  console.log(`   - POST https://honeypot-api-1-66il.onrender.com/api/honeypot`);
  console.log(`🔑 Required header: x-api-key: super_secret_honeypot_key_123`);
});