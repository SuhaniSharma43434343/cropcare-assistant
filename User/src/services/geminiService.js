
import { GoogleGenAI, Modality, Type } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.REACT_APP_GEMINI_API_KEY });

const getResponseText = (response) => {
    return response.candidates?.[0]?.content?.parts?.[0]?.text || '';
};

const cleanJson = (text) => {
    if (!text) return '{}';
    // Find the first '{' and the last '}'
    const firstOpen = text.indexOf('{');
    const lastClose = text.lastIndexOf('}');
    if (firstOpen !== -1 && lastClose !== -1) {
        return text.substring(firstOpen, lastClose + 1);
    }
    return text;
};

export async function analyzeSymptoms(text, imageBase64, lang = 'English') {
    const ai = getAI();
    const parts = [];

    if (imageBase64) {
        parts.push({
            inlineData: {
                data: imageBase64,
                mimeType: "image/jpeg"
            }
        });
    }

    const promptText = `You are an elite agricultural pathologist. Analyze the plant symptoms from the image and/or text. 
  
  CRITICAL: Identify the most likely disease/pest. 
  You MUST provide specific, scientifically-backed recommendations.
  Output strictly as JSON. 
  
  LANGUAGE RULES: 
  - All text must be in ${lang}.
  - If language is Hindi, use PURE HINDI in Devanagari script only. Avoid Hinglish or Latin script.
  
  Output Schema:
  { 
    "name": "Specific Disease Name in ${lang}", 
    "confidence": "High/Medium/Low", 
    "severity": "Low/Moderate/High/Severe",
    "affected_area": "Estimated percentage (e.g., '15%')",
    "diagnosis": "Technical brief of why", 
    "steps": ["Step 1", "Step 2", "Step 3"],
    "organic_alternatives": ["Natural remedy 1", "Natural remedy 2"]
  }`;

    parts.push({ text: promptText });
    if (text) parts.push({ text: `User symptoms description: ${text}` });

    const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash-exp',
        contents: [{ role: 'user', parts }],
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING },
                    confidence: { type: Type.STRING },
                    severity: { type: Type.STRING },
                    affected_area: { type: Type.STRING },
                    diagnosis: { type: Type.STRING },
                    steps: { type: Type.ARRAY, items: { type: Type.STRING } },
                    organic_alternatives: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["name", "confidence", "severity", "affected_area", "diagnosis", "steps", "organic_alternatives"]
            }
        }
    });

    try {
        const rawText = getResponseText(response);
        const cleanedText = cleanJson(rawText);
        return JSON.parse(cleanedText);
    } catch (e) {
        console.error("Diagnosis error:", e); // Enhanced logging
        if (e.response) {
            console.error("API Response Error:", JSON.stringify(e.response, null, 2));
        }
        return null;
    }
}

export async function analyzeSoil(params, lang = 'English') {
    const ai = getAI();
    const prompt = `Analyze soil parameters: pH=${params.ph}, Nitrogen=${params.n}ppm, Phosphorus=${params.p}ppm, Potassium=${params.k}ppm, Texture=${params.texture}. 
  Provide a detailed analysis in ${lang}. 
  STRICT HINDI RULE: Use Devanagari script for Hindi, no Latin words.`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash-exp',
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    healthScore: { type: Type.NUMBER },
                    assessment: { type: Type.STRING },
                    fertilizerPlan: { type: Type.ARRAY, items: { type: Type.STRING } },
                    cropRecommendations: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                crop: { type: Type.STRING },
                                reason: { type: Type.STRING }
                            },
                            required: ["crop", "reason"]
                        }
                    },
                    warnings: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["healthScore", "assessment", "fertilizerPlan", "cropRecommendations", "warnings"]
            }
        }
    });
    try {
        const rawText = getResponseText(response);
        const cleanedText = cleanJson(rawText);
        return JSON.parse(cleanedText);
    } catch (e) {
        console.error("Soil analysis parse error", e);
        return null;
    }
}

export async function deepReasoning(query, lang = 'English') {
    const ai = getAI();
    const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash-exp',
        contents: [{
            role: 'user', parts: [{
                text: `As an agricultural expert, provide a deep reasoning analysis for the following query in ${lang}. 
    STRICT SCRIPT RULE: If the language is Hindi, use Devanagari script exclusively. No Latin script for Hindi.
    Query: ${query}`
            }]
        }],
    });
    return getResponseText(response);
}

export async function chatAssistant(message, lang = 'English') {
    const ai = getAI();
    const chat = ai.chats.create({
        model: 'gemini-2.0-flash-exp',
        config: {
            systemInstruction: `You are AgriBot, a leading agronomist. Help the farmer in ${lang}. 
      STRICT HINDI SCRIPT RULE: For Hindi responses, use Devanagari script for all words. No Hinglish. No Latin script.`,
        }
    });
    const response = await chat.sendMessage({ message: message });
    return getResponseText(response);
}

export async function transcribeAudio(base64Audio, lang = 'English') {
    const ai = getAI();
    const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash-exp',
        contents: [
            {
                role: 'user',
                parts: [
                    { inlineData: { data: base64Audio, mimeType: 'audio/webm' } },
                    { text: `Transcribe this agricultural query exactly in ${lang}. If Hindi, use Devanagari.` }
                ]
            }
        ]
    });
    return getResponseText(response);
}

export async function connectToLiveSession(lang, callbacks) {
    const ai = getAI();
    const systemInstruction = `You are AgriVoice, an advanced, empathetic, and highly knowledgeable agricultural expert. 
    Your goal is to help farmers with accurate, scientific advice in a simple, friendly manner.
    
    CRITICAL RULES:
    1. **Language**: Interact strictly and fluently in ${lang}.
    2. **Hindi Usage**: If the language is Hindi, use clear, formal Hindi (Devanagari script). Avoid Hinglish. Use English only for specific technical chemical names if needed.
    3. **Tone**: Be patient, encouraging, and respectful, like a wise advisor.
    4. **Response Style**: detailed, practical, and actionable. Don't just say "spray fungicide", say "spray Copper Oxychloride at 3g/liter relative to the severity".`;

    // Wrap callbacks to debug response content
    const wrappedCallbacks = {
        ...callbacks,
        onmessage: (msg) => {
            console.log("GeminiService RX:", JSON.stringify(msg, null, 2));
            if (callbacks.onmessage) callbacks.onmessage(msg);
        },
        onerror: (err) => {
            console.error("GeminiService ERROR:", err);
            if (callbacks.onerror) callbacks.onerror(err);
        }
    };

    const session = await ai.live.connect({
        model: 'gemini-2.0-flash-exp',
        callbacks: wrappedCallbacks,
        config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
                voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
            },
            systemInstruction,
        },
    });

    return {
        sendRealtimeInput: (data) => {
            if (data.media) {
                // Pass the { media: ... } object directly to the SDK
                session.sendRealtimeInput(data);
            }
        },
        close: () => session.close()
    };
}

export async function generateTTS(text) {
    return null;
}
