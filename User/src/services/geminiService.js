import { GoogleGenerativeAI } from "@google/generative-ai";

const getAI = () => {
  const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('REACT_APP_GEMINI_API_KEY is not configured');
  }
  return new GoogleGenerativeAI(apiKey);
};

const getResponseText = (response) => {
    return response.response?.text() || '';
};

export async function chatAssistant(message, lang = 'English') {
    try {
        const genAI = getAI();
        const model = genAI.getGenerativeModel({ 
            model: "gemini-pro",
            systemInstruction: `You are AgriBot, a leading agronomist and agricultural expert. Help farmers with practical, scientific advice in ${lang}. 
            Provide detailed, actionable solutions for crop management, disease prevention, pest control, and farming techniques.
            Be encouraging and supportive while maintaining scientific accuracy.`
        });
        
        const result = await model.generateContent(message);
        return getResponseText(result);
    } catch (error) {
        console.error('Chat Assistant Error:', error);
        throw new Error("I'm sorry, I'm having trouble connecting right now. Please check your internet connection and try again.");
    }
}

export async function transcribeAudio(base64Audio, lang = 'English') {
    try {
        const genAI = getAI();
        const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
        
        const result = await model.generateContent([
            {
                inlineData: {
                    data: base64Audio,
                    mimeType: "audio/webm"
                }
            },
            `Transcribe this agricultural query exactly in ${lang}. Return only the transcribed text without any additional formatting.`
        ]);
        
        return getResponseText(result);
    } catch (error) {
        console.error('Transcription Error:', error);
        throw new Error('Failed to transcribe audio. Please try speaking again.');
    }
}

// Mock live session for now since Gemini Live API is not publicly available
export async function connectToLiveSession(lang, callbacks) {
    return new Promise((resolve, reject) => {
        // Simulate connection delay
        setTimeout(() => {
            const mockSession = {
                sendRealtimeInput: (data) => {
                    // Mock processing of audio input
                    console.log('Mock: Received audio input');
                    
                    // Simulate AI response after a delay
                    setTimeout(() => {
                        const responses = [
                            "I can hear you clearly. How can I help with your crops today?",
                            "That's a great question about farming. Let me provide some guidance.",
                            "Based on what you're describing, here's what I recommend for your crops.",
                            "For better crop health, consider these agricultural practices."
                        ];
                        
                        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
                        
                        // Use text-to-speech for response
                        if ('speechSynthesis' in window) {
                            const utterance = new SpeechSynthesisUtterance(randomResponse);
                            utterance.rate = 0.9;
                            utterance.pitch = 1.0;
                            speechSynthesis.speak(utterance);
                        }
                        
                        // Simulate message callback
                        if (callbacks.onmessage) {
                            callbacks.onmessage({
                                serverContent: {
                                    modelTurn: {
                                        parts: [{
                                            text: randomResponse
                                        }]
                                    }
                                }
                            });
                        }
                    }, 1000 + Math.random() * 2000);
                },
                close: () => {
                    if (callbacks.onclose) {
                        callbacks.onclose();
                    }
                }
            };
            
            resolve(mockSession);
        }, 1000);
    });
}