const express = require("express");
const app = express();
const port = process.env.PORT || 8080;

console.log("🚀 Starting server...");

// ACCEPT ANY CONTENT TYPE
app.use(express.raw({ type: '*/*' }));

// Root route
app.get("/", (req, res) => {
  console.log("✅ Root route accessed");
  res.json({ status: "ok", service: "honeypot-api" });
});

// Honeypot endpoint
app.post("/api/honeypot", (req, res) => {
  console.log("📢 Honeypot endpoint hit");
  
  const apiKey = req.headers['x-api-key'];
  
  if (!apiKey || apiKey.trim() !== "super_secret_honeypot_key_123") {
    return res.status(401).json({
      status: "error",
      reply: "Unauthorized"
    });
  }
  
  res.json({
    status: "success",
    reply: "Why is my account being suspended?"
  });
});

// CRITICAL FIX: Proper server startup
const server = app.listen(port, "0.0.0.0", () => {
  console.log(`✅ Server successfully running on port ${port}`);
  console.log(`🌍 Test: http://localhost:${port}/`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, closing server...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, closing server...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

// Prevent process from exiting
console.log("🔄 Server process active, waiting for connections...");