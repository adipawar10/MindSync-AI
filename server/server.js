require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const admin = require("firebase-admin");

// Firebase Setup
const serviceAccount = require("./serviceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// NEW: Function to check Sentiment using Hugging Face
async function checkSentiment(text) {
    try {
        const response = await fetch(
            "https://api-inference.huggingface.co/models/distilbert-base-uncased-finetuned-sst-2-english",
            {
                headers: { Authorization: `Bearer ${process.env.HUGGING_FACE_KEY}` },
                method: "POST",
                body: JSON.stringify({ inputs: text }),
            }
        );
        const result = await response.json();
        // The API returns an array like [[{label: 'NEGATIVE', score: 0.9}]]
        // We just want the top label
        if (result && result[0] && result[0][0]) {
            return result[0][0].label; // Returns "POSITIVE" or "NEGATIVE"
        }
        return "NEUTRAL";
    } catch (error) {
        console.error("Hugging Face Error:", error);
        return "NEUTRAL"; // If it fails, just ignore it
    }
}

app.post('/api/chat', async (req, res) => {
    try {
        // We now receive the User's Email too!
        const { prompt, userEmail } = req.body;
        
        // 1. Check Sentiment (Hugging Face)
        const sentiment = await checkSentiment(prompt);
        console.log(`User Sentiment: ${sentiment}`); // See this in your terminal!

        // 2. Adjust Prompt if User is Stressed
        let finalPrompt = prompt;
        if (sentiment === 'NEGATIVE') {
            finalPrompt = `(Context: The user sounds stressed/negative. Be extra empathetic and supportive.) ${prompt}`;
        }

        // 3. Generate AI Response (Gemini)
        const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });
        const result = await model.generateContent(finalPrompt);
        const response = await result.response;
        const text = response.text();

        // 4. Save to Database (With User Email!)
        await db.collection('chats').add({
            userEmail: userEmail || "Anonymous", // Save who sent it
            userMessage: prompt,
            aiResponse: text,
            sentiment: sentiment, // We even save the mood!
            timestamp: new Date()
        });

        res.json({ reply: text });
        
    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`🚀 MindSync Brain active on http://localhost:${PORT}`);
});