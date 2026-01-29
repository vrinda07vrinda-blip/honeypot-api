const express = require("express");
const app = express();

// 1. CUSTOM BODY PARSER - Accepts ANYTHING including empty
app.use((req, res, next) => {
  let data = '';
  
  req.on('data', chunk => {
    data += chunk.toString();
  });
  
  req.on('end', () => {
    console.log("📦 Raw body received:", data || "(empty)");
    
    // Store raw body
    req.rawBody = data;
    
    // Try to parse as JSON, but accept anything
    if (data && data.trim()) {
      try {
        req.body = JSON.parse(data);
        console.log("✅ Parsed as JSON:", req.body);
      } catch (e) {
        // Not JSON? Store as text
        req.body = { raw: data };
        console.log("📝 Stored as raw text");
      }
    } else {
      // Empty body? Use empty object
      req.body = {};
      console.log("📭 Empty body, using {}");
    }
    
    next();
  });
});

// 2. ROOT ROUTE
app.get("/", (req, res) => {
  res.json({ 
    status: "active", 
    service: "honeypot-api",
    time: new Date().toISOString() 
  });
});

// 3. HONEYPOT ENDPOINT (BULLETPROOF)
app.post("/api/honeypot", (req, res) => {
  console.log("🎯 Honeypot endpoint called");
  console.log("🔑 API Key header:", req.headers['x-api-key']);
  console.log("📝 Parsed body:", req.body);
  
  // AUTHENTICATION
  const apiKey = req.headers['x-api-key'];
  
  if (!apiKey) {
    return res.status(401).json({ error: "Missing x-api-key header" });
  }
  
  if (apiKey.trim() !== "super_secret_honeypot_key_123") {
    return res.status(401).json({ 
      error: "Invalid API key",
      received: apiKey 
    });
  }
  
  console.log("✅ Authentication successful");
  
  // EXTRACT DATA (accepts ANY format)
  let extractedData = {};
  
  if (req.body && typeof req.body === 'object') {
    if (req.body.message) {
      extractedData.message = req.body.message;
    } else if (req.body.raw) {
      extractedData.raw_message = req.body.raw;
    } else {
      extractedData = req.body;
    }
  } else if (req.rawBody) {
    extractedData.raw_content = req.rawBody;
  }
  
  // REQUIRED RESPONSE FORMAT
  res.status(200).json({
    status: "scam_detected",
    confidence: 0.95,
    extracted: {
      ...extractedData,
      timestamp: new Date().toISOString(),
      request_id: `req_${Date.now()}`,
      note: "Honeypot triggered successfully"
    }
  });
});

// 4. ERROR HANDLER
app.use((err, req, res, next) => {
  console.error("🔥 Unhandled error:", err);
  res.status(500).json({
    status: "error",
    message: "Server error",
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Honeypot API running on port ${PORT}`);
  console.log(`🔗 Root: GET /`);
  console.log(`🎯 Honeypot: POST /api/honeypot`);
  console.log(`🔑 API Key: super_secret_honeypot_key_123`);
});