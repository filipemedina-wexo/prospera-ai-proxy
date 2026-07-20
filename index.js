require("dotenv").config(); // carrega o .env

const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();

app.use(express.json());
app.use(cors());

// Cliente do Gemini usando a KEY do .env / Env Vars
const geminiApiKey = process.env.GEMINI_API_KEY;
const geminiModel = process.env.GEMINI_MODEL || "gemini-3.5-flash";

if (!geminiApiKey) {
    console.error("GEMINI_API_KEY nao configurada.");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(geminiApiKey);

// Rota simples para conversar com o Gemini
app.post("/gemini", async (req, res) => {
    try {
        const { prompt, context } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: "Prompt e obrigatorio." });
        }

        const model = genAI.getGenerativeModel({
            model: geminiModel
        });

        const result = await model.generateContent([
            context || "",
            "\n\nUsuario:\n" + prompt
        ]);

        const text = result.response.text();

        return res.json({ output: text });
    } catch (err) {
        console.error("Erro ao chamar Gemini:", err);
        return res.status(500).json({ error: "Erro ao chamar Gemini." });
    }
});

// Porta
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Prospera AI Proxy rodando na porta ${PORT}`);
});
