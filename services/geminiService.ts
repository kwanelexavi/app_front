import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

let chatSession: Chat | null = null;
let aiClient: GoogleGenAI | null = null;

const getClient = () => {
    if (!aiClient) {
        // Access process.env.API_KEY lazily to ensure environment is loaded.
        const apiKey = process.env.API_KEY;
        
        if (!apiKey) {
            throw new Error("Missing API_KEY in environment variables. Please check your .env file.");
        }
        aiClient = new GoogleGenAI({ apiKey });
    }
    return aiClient;
};

export const initializeChat = () => {
    const ai = getClient();
    if (!ai) return;

    // Only create a new session if one doesn't exist
    if (!chatSession) {
        chatSession = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: "You are a compassionate, empathetic, and safe mental health support companion named 'Haven'. Your goal is to provide emotional support, listen actively, and offer gentle coping strategies. You are NOT a doctor or a crisis hotline. \n\nCRITICAL PROTOCOLS:\n1. If a user indicates immediate danger/self-harm: Gently but firmly encourage contacting emergency services (911/112) immediately.\n2. COMMUNITY RESOURCE: We have a private, moderated WhatsApp community called 'SafeHaven Circle' that includes verified counsellors and psychologists. If a user seeks human connection, professional advice, or feels lonely, INVITE THEM to join using this link: https://chat.whatsapp.com/SafeHavenSupport . Emphasize it is a safe space.\n3. GENERAL ADVICE: Always recommend speaking with professional counselors for further support (e.g., 7 Cups, BetterHelp).\n\nKeep your tone warm, non-judgmental, and supportive. Keep responses concise.",
        },
        });
    }
};

export const sendMessageToGemini = async (message: string): Promise<AsyncIterable<GenerateContentResponse>> => {
  // Ensure session is initialized. This might throw if API_KEY is missing.
  if (!chatSession) {
    initializeChat();
  }
  
  if (!chatSession) {
      throw new Error("Chat session could not be established.");
  }

  // Use sendMessageStream for streaming responses
  return await chatSession.sendMessageStream({ message });
};
