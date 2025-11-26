// geminiService.js

import { GoogleGenAI, Type } from "@google/genai";

// Assumed constants and configuration
const MODEL_NAME_REVIEW = "gemini-2.5-flash";
const SYSTEM_INSTRUCTION_REVIEWER = "You are an expert academic reviewer. Analyze the provided research paper and generate a detailed peer review in the specified JSON format.";
const MODEL_NAME_CHAT = "gemini-2.5-flash";
const SYSTEM_INSTRUCTION_CHAT = "You are a helpful research assistant. Your primary task is to answer questions about the provided paper.";

// Initialize the client. 
// FIX: Correctly instantiate GoogleGenAI. Use an empty string for the API key 
// to allow the execution environment to inject it securely.
const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY });

// Schema for the structured review output
const reviewSchema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING, description: "The title of the paper" },
        authors: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "List of authors if detected" 
        },
        summary: { type: Type.STRING, description: "A concise summary of the paper (max 200 words)" },
        scores: {
            type: Type.OBJECT,
            properties: {
                novelty: { type: Type.NUMBER, description: "Score from 1-10" },
                methodology: { type: Type.NUMBER, description: "Score from 1-10" },
                clarity: { type: Type.NUMBER, description: "Score from 1-10" },
                significance: { type: Type.NUMBER, description: "Score from 1-10" },
                citations: { type: Type.NUMBER, description: "Score from 1-10" },
            },
            required: ["novelty", "methodology", "clarity", "significance", "citations"]
        },
        strengths: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "List of 3-5 key strengths"
        },
        weaknesses: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "List of 3-5 key weaknesses"
        },
        detailedFeedback: { type: Type.STRING, description: "Detailed qualitative feedback and suggestions for improvement" },
        decision: { 
            type: Type.STRING, 
            enum: ["Accept", "Minor Revision", "Major Revision", "Reject"],
            description: "Final recommendation"
        }
    },
    required: ["title", "summary", "scores", "strengths", "weaknesses", "detailedFeedback", "decision"]
};

/**
 * Generates a structured review of a research paper using a multi-part request.
 * @param {string} base64Data - The paper content encoded as a Base64 string.
 * @param {string} mimeType - The MIME type of the content (e.g., 'application/pdf').
 * @returns {Promise<object>} The parsed JSON review object.
 */
export const generateReview = async (base64Data, mimeType) => { // FIX: Added export
    try {
        const response = await ai.models.generateContent({
            model: MODEL_NAME_REVIEW,
            config: {
                systemInstruction: SYSTEM_INSTRUCTION_REVIEWER,
                responseMimeType: "application/json",
                responseSchema: reviewSchema,
            },
            contents: {
                parts: [
                    {
                        inlineData: {
                            mimeType: mimeType,
                            data: base64Data
                        }
                    },
                    {
                        text: "Please review this uploaded research paper."
                    }
                ]
            }
        });

        const text = response.text;
        if (!text) throw new Error("No response text generated");
        
        // Parse the JSON. The model is instructed to return JSON, but we handle potential wrapping (e.g., ```json ... ```).
        const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleanJson);
    } catch (error) {
        console.error("Error generating review:", error);
        throw error;
    }
};

/**
 * Creates a new chat session pre-loaded with the research paper content.
 * @param {string} base64Data - The paper content encoded as a Base64 string.
 * @param {string} mimeType - The MIME type of the content (e.g., 'application/pdf').
 * @returns {object} The Chat object instance.
 */
export const createChatSession = (base64Data, mimeType) => { // FIX: Added export
    // FIX: Add null check for ai.chats. If the property is missing, throw a clear error 
    // instead of letting it throw TypeError: Cannot read properties of undefined (reading 'chats').
    if (!ai || !ai.chats || typeof ai.chats.create !== 'function') {
        console.error("Gemini AI client initialization failed: 'chats' property is missing or not a function. The Chat feature may not be available.");
        // Return a mock object to prevent App.jsx from crashing immediately.
        return {
            sendMessage: async () => ({ text: "Error: Chat service unavailable." }),
            getHistory: () => ([{ role: "model", parts: [{ text: "Error: Chat service could not be initialized." }] }])
        };
    }
    
    const chat = ai.chats.create({
        model: MODEL_NAME_CHAT,
        config: {
            systemInstruction: SYSTEM_INSTRUCTION_CHAT,
        },
        history: [
            {
                role: "user",
                parts: [
                    {
                        inlineData: {
                            mimeType: mimeType,
                            data: base64Data
                        }
                    },
                    {
                        text: "Here is the paper I would like to discuss."
                    }
                ]
            },
            {
                role: "model",
                parts: [{ text: "I have read the paper. What specific questions do you have about it?" }]
            }
        ]
    });
    return chat;
};