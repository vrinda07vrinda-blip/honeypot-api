import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = "Bearer super_secret_honeypot_key_123";

app.post("/api/honeypot", (req, res) => {
  // Read API key from GUVI header
  const apiKey = req.headers["x-api-key"];

  if (!apiKey || apiKey !== API_KEY) {
    return res.status(401).json({
      status: "unauthorized",
      message: "Invalid API key",
    });
  }

  // GUVI sends NO body → handle safely
  const message = req.body?.message || "No message provided";

  // Honeypot response (fake success)
  return res.status(200).json({
    status: "success",
    honeypot: true,
    received_message: message,
    alert: "Suspicious activity logged",
  });
});

// Health check (optional but good)
app.get("/", (req, res) => {
  res.send("Honeypot API is live");
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚨 Honeypot API running on port ${PORT}`);
});
