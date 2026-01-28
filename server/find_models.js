require('dotenv').config();
const apiKey = process.env.GEMINI_API_KEY;

async function printModels() {
  console.log("🔍 Asking Google for your available models...");
  
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const data = await response.json();

    if (data.models) {
      console.log("\n✅ SUCCESS! Here are the exact names you can use:");
      console.log("------------------------------------------------");
      data.models.forEach(model => {
        // We only care about models that support 'generateContent' (Chat)
        if (model.supportedGenerationMethods && model.supportedGenerationMethods.includes("generateContent")) {
            console.log(`Model Name: ${model.name}`);
        }
      });
      console.log("------------------------------------------------");
    } else {
      console.log("❌ Error: No models found. Response:", data);
    }
  } catch (error) {
    console.error("❌ Network Error:", error.message);
  }
}

printModels();