require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const admin = require("firebase-admin");
const fetch = require('node-fetch'); 

const serviceAccount = require("./serviceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Sentiment Check
async function checkSentiment(text) {
    try {
        const response = await fetch(
            "https://api-inference.huggingface.co/models/distilbert-base-uncased-finetuned-sst-2-english",
            {
                headers: { 
                    Authorization: `Bearer ${process.env.HUGGING_FACE_KEY}`,
                    "Content-Type": "application/json"
                },
                method: "POST",
                body: JSON.stringify({ inputs: text }),
            }
        );

        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("text/html")) return "NEUTRAL";

        const result = await response.json();
        if (result.error) return "NEUTRAL";
        if (result && result[0] && result[0][0]) return result[0][0].label; 
        return "NEUTRAL";
    } catch (error) {
        return "NEUTRAL"; 
    }
}

app.post('/api/chat', async (req, res) => {
    try {
        const { prompt, userEmail } = req.body;
        
        // 1. Check Sentiment
        const sentiment = await checkSentiment(prompt);
        console.log(`User Sentiment: ${sentiment}`); 

        // 2. Adjust Prompt
        let finalPrompt = prompt;
        if (sentiment === 'NEGATIVE') {
            finalPrompt = `(Context: The user sounds stressed. Be extra empathetic.) ${prompt}`;
        }

        // 3. Generate AI Response 
        // FIX: Using the generic alias 'gemini-flash-latest' avoids the 404 and 429 errors
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
        
        const result = await model.generateContent(finalPrompt);
        const response = await result.response;
        const text = response.text();

        // 4. Save to Database
        await db.collection('chats').add({
            userEmail: userEmail || "Anonymous", 
            userMessage: prompt,
            aiResponse: text,
            sentiment: sentiment, 
            timestamp: new Date()
        });

        res.json({ reply: text });
        
    } catch (error) {
        console.error("AI Error:", error);
        // Better error message for the UI
        res.status(500).json({ error: "I'm having a little trouble connecting. Please try again in a moment." });
    }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`🚀 MindSync Brain active on http://localhost:${PORT}`);
});