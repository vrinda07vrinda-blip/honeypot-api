const express = require("express");
const app = express();

// Body parser
app.use(express.json());

// Root route
app.get("/", (req, res) => {
  res.json({ status: "ok", service: "scam-detection-api" });
});

// MAIN ENDPOINT - MUST RETURN CORRECT FORMAT
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
  
  // 2. Extract scam message
  const scamText = req.body?.message?.text || 
                   req.body?.text || 
                   "No message provided";
  
  console.log("🔍 Scam text detected:", scamText);
  
  // 3. Generate intelligent reply based on scam content
  let reply = generateReply(scamText);
  
  // 4. RETURN THE EXACT FORMAT THEY EXPECT
  res.json({
    status: "success",           // ⚠️ MUST be "success" not "scam_detected"
    reply: reply                 // ⚠️ MUST be "reply" not "extracted"
  });
});

// Helper: Generate intelligent replies
function generateReply(scamText) {
  const lowerText = scamText.toLowerCase();
  
  if (lowerText.includes("bank") && lowerText.includes("block")) {
    return "Why is my bank account being blocked? I haven't done anything wrong.";
  }
  
  if (lowerText.includes("verify") && lowerText.includes("immediately")) {
    return "Can you provide official verification documents first?";
  }
  
  if (lowerText.includes("password") || lowerText.includes("login")) {
    return "I never share my passwords. Please contact me through official channels.";
  }
  
  if (lowerText.includes("urgent") || lowerText.includes("emergency")) {
    return "This seems urgent. Let me contact my bank directly to verify.";
  }
  
  if (lowerText.includes("winner") || lowerText.includes("prize")) {
    return "I didn't enter any contest. Please remove me from your list.";
  }
  
  // Default intelligent reply
  return "I need more information before proceeding. Can you provide official reference numbers?";
}

const PORT = process.env.PORT || 8080;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Scam Detection API running on port ${PORT}`);
  console.log(`🎯 Expected format: {status: "success", reply: "..."}`);
});