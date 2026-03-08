const express = require("express");
const app = express();
const port = process.env.PORT || 8080;

// Basic middleware
app.use(express.raw({ type: '*/*' }));

// Simple root route
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

// Start server
app.listen(port, "0.0.0.0", () => {
  console.log(`✅ Server running on port ${port}`);
});