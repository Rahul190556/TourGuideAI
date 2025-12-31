import { GoogleGenerativeAI } from "@google/generative-ai";

// Import environment variable
const apiKey = import.meta.env.VITE_GOOGLE_GEMINI_AI_API_KEY;

// Initialize Google Generative AI
let genAI, model;

try {
  genAI = new GoogleGenerativeAI(apiKey);
  model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
  });
} catch (error) {
  console.error("Error initializing Google Generative AI:", error);
  throw new Error("Failed to initialize AI model.");
}

// Default generation configuration
const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

export const createChatSession = async (userPrompt) => {
  const chatSession = model.startChat({
    generationConfig,
    history: [
      {
        role: "user",
        parts: [
          { text: userPrompt },
        ],
      },
    ],
  });

  // Send the prompt and get the response directly
  const result = await chatSession.sendMessage(userPrompt);
  const responseText = result?.response?.text();

  try {
    // Parse the AI response as JSON
    return JSON.parse(responseText);
  } catch (error) {
    console.error("Error parsing AI response:", error);
    throw new Error("Failed to parse AI response as JSON");
  }
};




