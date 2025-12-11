require("dotenv").config(); // carrega o .env

const express = require("express");
const cors = require("cors");
const { GoogleGenAI } = require("@google/genai");

const app = express();

app.use(express.json());
app.use(cors()); // depois a gente pode restringir origens

// Cliente do Gemini usando a KEY do .env
const client = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

// Rota simples para conversar com o Gemini
app.post("/gemini", async (req, res) => {
    try {
        const { prompt, context } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: "Prompt é obrigatório." });
        }

        const model = client.getGenerativeModel({
            model: "gemini-2.0-flash"
        });

        const result = await model.generateContent([
            context || "",
            "\n\nUsuário:\n" + prompt
        ]);

        const text = result.response.text();

        return res.json({ output: text });
    } catch (err) {
        console.error("Erro na API Gemini:", err);
        return res.status(500).json({ error: "Erro ao chamar Gemini." });
    }
});

// Porta local
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Prospera AI Proxy rodando na porta ${PORT}`);
});
