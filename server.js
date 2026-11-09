require("dotenv").config();
const express = require("express");
const path = require("path");

const app = express();
app.use(express.json({ limit: "1mb" }));
app.use(express.static(path.join(__dirname, "public")));

app.post("/api/chat", async (req, res) => {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return res.status(503).json({ error: "AI is not configured yet. Add your API key to the .env file." });
    }
    const messages = Array.isArray(req.body.messages) ? req.body.messages : [];
    const safeMessages = messages
      .filter(m => m && ["user", "assistant"].includes(m.role) && typeof m.content === "string")
      .slice(-16)
      .map(m => ({ role: m.role, content: m.content.slice(0, 6000) }));

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are Bilal Abid AI, a helpful, friendly assistant. Answer clearly and accurately. If you are unsure, say so. Do not claim you can answer literally every question." },
          ...safeMessages
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: data.error?.message || "The AI service returned an error." });
    }
    res.json({ answer: data.choices?.[0]?.message?.content || "I couldn't generate an answer. Please try again." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Bilal Abid AI is running at http://localhost:${port}`));
