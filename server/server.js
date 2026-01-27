require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const admin = require("firebase-admin");

// Initialize Firebase with the secure key
const serviceAccount = require("./serviceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();

const app = express();

app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.get('/', (req, res) => {
    res.send("MindSync AI Server is Active");
});

app.post('/api/chat', async (req, res) => {
    try {
        const { prompt } = req.body;
        
        // 1. Generate AI Response
        const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        // 2. Save conversation to Firestore
        await db.collection('chats').add({
            userMessage: prompt,
            aiResponse: text,
            timestamp: new Date()
        });

        // 3. Respond to Client
        res.json({ reply: text });
        
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`🚀 MindSync running on port ${PORT}`);
});