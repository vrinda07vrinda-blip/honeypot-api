const express = require("express");
const app = express();

// ✅ Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  next();
});

// Root route
app.get("/", (req, res) => {
  res.json({ status: "active", time: new Date().toISOString() });
});

// Honeypot endpoint - SIMPLIFIED VERSION
app.post("/api/honeypot", (req, res) => {
  console.log("🎯 Honeypot endpoint hit");
  
  try {
    // Debug: Log everything
    console.log("Headers received:", JSON.stringify(req.headers));
    console.log("Body received:", JSON.stringify(req.body));
    
    // Check API key
    const apiKey = req.headers['x-api-key'];
    console.log("API Key from header:", apiKey);
    
    if (!apiKey) {
      return res.status(401).json({ error: "Missing API key" });
    }
    
    if (apiKey.trim() !== "super_secret_honeypot_key_123") {
      return res.status(401).json({ error: "Invalid API key" });
    }
    
    console.log("✅ Authentication passed");
    
    // Get message
    const message = req.body?.message || "No message";
    console.log("Message extracted:", message);
    
    // SIMPLE RESPONSE - No complex logic
    res.json({
      status: "scam_detected",
      confidence: 0.95,
      extracted: {
        message: message,
        timestamp: new Date().toISOString(),
        note: "Honeypot triggered"
      }
    });
    
  } catch (error) {
    console.error("💥 CATCH BLOCK ERROR:", error);
    console.error("Error stack:", error.stack);
    res.status(500).json({
      error: "Internal error",
      details: error.message
    });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server started on port ${PORT}`);
}); 