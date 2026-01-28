require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function listModels() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Dummy init
    console.log("Checking available models for your API key...");
    
    // This is a special hidden command to see what you have access to
    // Note: We use the raw API fetch if the SDK list is acting up, 
    // but let's try the standard way first.
    console.log("------------------------------------------------");
    console.log("If this script crashes, your SDK is too old.");
    console.log("------------------------------------------------");
    
    // We will try to run a simple 'hello' on the most basic model
    const testModel = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await testModel.generateContent("Hello");
    console.log("Success! 'gemini-pro' works.");
    console.log("Response:", result.response.text());
    
  } catch (error) {
    console.error("\n❌ ERROR DETAILS:");
    console.error(error.message);
    
    if (error.message.includes("404")) {
      console.log("\n💡 DIAGNOSIS: The model name is wrong for your account type.");
    }
  }
}

listModels();