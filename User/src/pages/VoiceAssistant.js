import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronLeft, Mic, MicOff, Volume2, Sparkles, Send, User, Bot, VolumeX, Phone, PhoneOff, Leaf } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import MobileLayout from "../components/layout/MobileLayout";
import LiveAudioVisualizer from "../components/LiveAudioVisualizer";
import { chatAssistant, transcribeAudio, connectToLiveSession } from "../services/geminiService";
import { toast } from "sonner";

const VoiceAssistant = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState([
    {
      id: "1",
      type: "assistant",
      text: "Hello! I'm your CropCare AI assistant. You can chat with me or start a Live Call for a real-time conversation.",
      timestamp: new Date(),
    },
  ]);

  const [isLiveMode, setIsLiveMode] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [volumeLevel, setVolumeLevel] = useState(0);

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const liveSessionRef = useRef(null);
  const audioContextRef = useRef(null);
  const audioInputRef = useRef(null);
  const processorRef = useRef(null);
  const audioQueueRef = useRef([]);
  const isPlayingRef = useRef(false);
  const effectRan = useRef(false);

  const examplePrompts = [
    "How to prevent tomato blight?",
    "Best organic pesticides",
    "When to apply fertilizer?",
    "Signs of nutrient deficiency",
  ];

  useEffect(() => {
    return () => {
      stopLiveSession();
    };
  }, []);

  const speak = (text) => {
    if (isMuted) return;
    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*#]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    window.speechSynthesis.speak(utterance);
  };

  const startRecording = async () => {
    try {
      // Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        }
      });

      // Check if MediaRecorder is supported
      if (!MediaRecorder.isTypeSupported('audio/webm')) {
        throw new Error('Audio recording not supported in this browser');
      }

      const mimeType = "audio/webm";
      mediaRecorderRef.current = new MediaRecorder(stream, { mimeType });
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: mimeType });
        await handleAudioTranscription(audioBlob);
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => {
          track.stop();
        });
      };

      mediaRecorderRef.current.onerror = (event) => {
        console.error('MediaRecorder error:', event.error);
        toast.error('Recording error occurred');
        setIsListening(false);
        setIsProcessing(false);
      };

      mediaRecorderRef.current.start(1000); // Collect data every second
      setIsListening(true);
      toast.success('Recording started - speak now!');

    } catch (error) {
      console.error("Microphone access error:", error);
      let errorMessage = "Could not access microphone. ";

      if (error.name === 'NotAllowedError') {
        errorMessage += "Please allow microphone access and try again.";
      } else if (error.name === 'NotFoundError') {
        errorMessage += "No microphone found. Please connect a microphone.";
      } else if (error.name === 'NotSupportedError') {
        errorMessage += "Audio recording is not supported in this browser.";
      } else {
        errorMessage += "Please check your microphone settings.";
      }

      toast.error(errorMessage);
      setIsListening(false);
      setIsProcessing(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isListening) {
      mediaRecorderRef.current.stop();
      setIsListening(false);
      setIsProcessing(true);
    }
  };

  const handleVoiceToggle = () => {
    if (isListening) stopRecording();
    else startRecording();
  };

  const handleAudioTranscription = async (audioBlob) => {
    try {
      setIsProcessing(true);

      // Convert blob to base64
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);

      reader.onloadend = async () => {
        try {
          const base64Audio = reader.result.split(',')[1];

          // Check if we have a valid base64 string
          if (!base64Audio || base64Audio.length < 100) {
            throw new Error('Audio recording too short or invalid');
          }

          // Try transcription with fallback
          let transcribedText;
          try {
            transcribedText = await transcribeAudio(base64Audio);
          } catch (transcriptionError) {
            console.warn('Gemini transcription failed, using Web Speech API fallback');
            // Fallback to Web Speech API if available
            if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
              transcribedText = await fallbackSpeechRecognition();
            } else {
              throw new Error('Speech recognition not available');
            }
          }

          if (transcribedText && transcribedText.trim()) {
            const cleanText = transcribedText.trim();
            setInputText(cleanText);
            await handleSendMessage(cleanText);
            toast.success('Audio transcribed successfully!');
          } else {
            toast.error("Could not understand the audio. Please try speaking more clearly.");
          }
        } catch (error) {
          console.error("Transcription error:", error);
          toast.error("Failed to transcribe audio. You can type your question instead.");
        } finally {
          setIsProcessing(false);
        }
      };

      reader.onerror = () => {
        console.error('FileReader error');
        toast.error('Failed to process audio file');
        setIsProcessing(false);
      };

    } catch (error) {
      console.error("Audio processing error:", error);
      toast.error("Failed to process audio.");
      setIsProcessing(false);
    }
  };

  // Fallback speech recognition using Web Speech API
  const fallbackSpeechRecognition = () => {
    return new Promise((resolve, reject) => {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

      if (!SpeechRecognition) {
        reject(new Error('Speech recognition not supported'));
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        resolve(transcript);
      };

      recognition.onerror = (event) => {
        reject(new Error(`Speech recognition error: ${event.error}`));
      };

      recognition.start();
    });
  };

  const handleSendMessage = async (text) => {
    if (!text.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      type: "user",
      text: text.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsProcessing(true);

    try {
      const responseText = await chatAssistant(text);
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        text: responseText,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      speak(responseText);
    } catch (error) {
      console.error("Chat error:", error);
      // Fallback response when API is not available
      const fallbackResponse = getFallbackResponse(text);
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        text: fallbackResponse,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      speak(fallbackResponse);
      toast.error("Using offline mode. For full AI features, please check your internet connection.");
    } finally {
      setIsProcessing(false);
    }
  };

  const getFallbackResponse = (question) => {
    const lowerQuestion = question.toLowerCase();

    if (lowerQuestion.includes('blight') || lowerQuestion.includes('disease')) {
      return "For plant diseases like blight, ensure proper spacing for air circulation, water at the base to keep leaves dry, and apply copper-based fungicides preventatively. Remove infected leaves immediately.";
    }
    if (lowerQuestion.includes('fertilizer') || lowerQuestion.includes('nutrient')) {
      return "Apply balanced NPK fertilizer during growing season. For organic options, use compost, vermicompost, or well-rotted manure. Test soil pH regularly and adjust as needed.";
    }
    if (lowerQuestion.includes('pest') || lowerQuestion.includes('insect')) {
      return "For pest control, use neem oil spray (5ml per liter), encourage beneficial insects, and practice crop rotation. Remove affected plant parts and maintain garden hygiene.";
    }
    if (lowerQuestion.includes('water') || lowerQuestion.includes('irrigation')) {
      return "Water deeply but less frequently. Water early morning or evening to reduce evaporation. Ensure good drainage to prevent root rot. Mulch around plants to retain moisture.";
    }

    return "I'm currently in offline mode. For detailed agricultural advice, please ensure you have an internet connection. In general, maintain proper plant spacing, regular watering, and monitor for signs of disease or pests.";
  };

  const startLiveSession = async () => {
    // Stop any ongoing recording first
    if (mediaRecorderRef.current && isListening) {
      mediaRecorderRef.current.onstop = null;
      mediaRecorderRef.current.stop();
      setIsListening(false);
    }

    setIsLiveMode(true);
    setIsConnected(false);

    toast.info('Starting live session...');

    try {
      // Check for microphone permission first
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 16000,
          echoCancellation: true,
          noiseSuppression: true
        }
      });

      // Initialize audio context
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)({
        sampleRate: 16000
      });

      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }

      // Connect to live session (mock for now)
      liveSessionRef.current = await connectToLiveSession("English", {
        onmessage: handleLiveMessage,
        onerror: (e) => {
          console.error("Live Session Error:", e);
          toast.error(`Live session error: ${e.message || "Connection failed"}`);
          stopLiveSession();
        },
        onclose: () => {
          console.log("Live Session Closed");
          toast.info('Live session ended');
          stopLiveSession();
        }
      });

      // Set up audio processing
      const source = audioContextRef.current.createMediaStreamSource(stream);

      // Use AudioWorklet if available, otherwise fall back to ScriptProcessor
      if (audioContextRef.current.audioWorklet) {
        // Modern approach - would need AudioWorklet implementation
        console.log('AudioWorklet available but not implemented in this demo');
      }

      // Fallback to ScriptProcessor (deprecated but widely supported)
      processorRef.current = audioContextRef.current.createScriptProcessor(4096, 1, 1);

      processorRef.current.onaudioprocess = (e) => {
        const inputData = e.inputBuffer.getChannelData(0);

        // Debug logging (throttled)
        if (Math.random() < 0.01) {
          console.log("Audio Process Tick. Max amp:", Math.max(...inputData), "Ctx state:", audioContextRef.current?.state);
        }

        // Calculate volume level for visualization
        const sum = inputData.reduce((a, b) => a + Math.abs(b), 0);
        const avg = sum / inputData.length;
        setVolumeLevel(Math.min(avg * 10, 1));

        // Process audio for live session
        if (liveSessionRef.current && liveSessionRef.current.sendRealtimeInput) {
          const pcm16 = floatTo16BitPCM(inputData);
          const base64Audio = arrayBufferToBase64(pcm16);

          liveSessionRef.current.sendRealtimeInput({
            media: {
              mimeType: "audio/pcm;rate=16000",
              data: base64Audio
            }
          });
        }
      };

      source.connect(processorRef.current);
      processorRef.current.connect(audioContextRef.current.destination);

      audioInputRef.current = stream;
      setIsConnected(true);
      toast.success("🎙️ Live session connected! Start speaking...");

    } catch (error) {
      console.error("Failed to start live session:", error);

      let errorMessage = "Could not start live call. ";
      if (error.name === 'NotAllowedError') {
        errorMessage += "Please allow microphone access.";
      } else if (error.name === 'NotFoundError') {
        errorMessage += "No microphone found.";
      } else {
        errorMessage += "Please check your microphone settings.";
      }

      toast.error(errorMessage);
      stopLiveSession();
    }
  };

  useEffect(() => {
    if (location.state?.mode === 'live' && !effectRan.current) {
      effectRan.current = true;
      setTimeout(() => {
        startLiveSession();
      }, 500);
    }
  }, [location.state]);

  const stopLiveSession = () => {
    setIsLiveMode(false);
    setIsConnected(false);
    setVolumeLevel(0);

    if (liveSessionRef.current) {
      liveSessionRef.current = null;
    }

    if (audioInputRef.current) {
      audioInputRef.current.getTracks().forEach(track => track.stop());
      audioInputRef.current = null;
    }

    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    audioQueueRef.current = [];
  };

  const handleLiveMessage = async (message) => {
    console.log("RX LIVE MSG:", JSON.stringify(message, null, 2));
    if (message.serverContent?.modelTurn?.parts) {
      for (const part of message.serverContent.modelTurn.parts) {
        if (part.inlineData && part.inlineData.mimeType.startsWith("audio/pcm")) {
          const pcmData = base64ToArrayBuffer(part.inlineData.data);
          playAudioChunk(pcmData);
        }
      }
    }
  };

  const playAudioChunk = (pcmData) => {
    audioQueueRef.current.push(pcmData);
    if (!isPlayingRef.current) {
      playNextChunk();
    }
  };

  const playNextChunk = () => {
    if (audioQueueRef.current.length === 0) {
      isPlayingRef.current = false;
      return;
    }

    isPlayingRef.current = true;
    const pcmData = audioQueueRef.current.shift();

    const ctx = audioContextRef.current;
    if (!ctx) return;

    const float32Data = pcm16ToFloat32(pcmData);
    const buffer = ctx.createBuffer(1, float32Data.length, 24000);
    buffer.getChannelData(0).set(float32Data);

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);
    source.onended = playNextChunk;
    source.start();
  };

  const floatTo16BitPCM = (float32Array) => {
    const buffer = new ArrayBuffer(float32Array.length * 2);
    const view = new DataView(buffer);
    for (let i = 0; i < float32Array.length; i++) {
      let s = Math.max(-1, Math.min(1, float32Array[i]));
      s = s < 0 ? s * 0x8000 : s * 0x7FFF;
      view.setInt16(i * 2, s, true);
    }
    return buffer;
  }

  const arrayBufferToBase64 = (buffer) => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  const base64ToArrayBuffer = (base64) => {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }

  const pcm16ToFloat32 = (buffer) => {
    const int16Array = new Int16Array(buffer);
    const float32Array = new Float32Array(int16Array.length);
    for (let i = 0; i < int16Array.length; i++) {
      float32Array[i] = int16Array[i] / 32768;
    }
    return float32Array;
  }



  return (
    <MobileLayout showNav={false} fullWidth={true}>


      <div className={`flex flex-col h-screen overflow-hidden relative ${isLiveMode ? "text-white" : "bg-background safe-area-top"}`}>
        {isLiveMode && (
          <div
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: 'url(/backgrounds/live_bg.jpg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
          </div>
        )}

        <div className={`flex items-center justify-between px-4 py-4 z-10 border-b transition-colors relative ${isLiveMode ? "bg-black/10 border-white/10 text-white safe-area-top" : "bg-card/50 backdrop-blur-sm border-border text-foreground"}`}>
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className={isLiveMode ? "text-white hover:bg-white/20" : ""}>
            <ChevronLeft className="w-6 h-6" />
          </Button>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-sm font-display font-semibold">AI Assistant</h1>
              <p className={`text-xs ${isLiveMode ? "text-white/80" : "text-muted-foreground"}`}>Powered by Gemini</p>
            </div>
          </div>

          <Button variant="ghost" size="icon" onClick={() => setIsMuted(!isMuted)} className={isLiveMode ? "text-white hover:bg-white/20" : ""}>
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </Button>
        </div>

        {isLiveMode ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-8 relative z-10">
            <div className="relative z-10">
              <div className={`w-32 h-32 rounded-full flex items-center justify-center bg-white/10 backdrop-blur-md shadow-2xl border-4 ${isConnected ? 'border-green-400' : 'border-white/20'} transition-all duration-500`}>
                <Leaf className="w-16 h-16 text-white" />
              </div>
              {isConnected && (
                <>
                  <div className="absolute inset-0 rounded-full border-4 border-green-400/30 animate-ping" />
                  <div className="absolute -inset-4 rounded-full border border-green-400/20 animate-pulse delay-75" />
                </>
              )}
            </div>

            <div className="text-center space-y-2 relative z-10 text-white">
              <h2 className="text-3xl font-display font-bold tracking-tight text-shadow-sm">{isConnected ? "Connected" : "Connecting..."}</h2>
              <p className="text-white/80 font-medium">Speak naturally with AgriVoice</p>
            </div>

            <div className="h-20 w-full flex justify-center items-center relative z-10">
              <LiveAudioVisualizer isActive={isConnected} barColor="#4ade80" volumeLevel={volumeLevel} />
            </div>

            <div className="flex items-center gap-6 relative z-10">
              <Button
                variant="destructive"
                size="lg"
                className="h-16 w-16 rounded-full shadow-xl hover:scale-105 transition-transform flex items-center justify-center p-0"
                onClick={stopLiveSession}
              >
                <Phone size={32} color="white" fill="white" />
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={`flex gap-3 ${message.type === "user" ? "flex-row-reverse" : ""}`}
                  >
                    <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${message.type === "user" ? "bg-primary" : "gradient-primary"}`}>
                      {message.type === "user" ? <User className="w-4 h-4 text-primary-foreground" /> : <Bot className="w-4 h-4 text-primary-foreground" />}
                    </div>
                    <div className={`max-w-[80%] p-4 rounded-2xl ${message.type === "user" ? "bg-primary text-primary-foreground rounded-br-md" : "glass-card shadow-soft rounded-bl-md"}`}>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {isProcessing && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-center">
                  <span className="text-xs text-muted-foreground">Thinking...</span>
                </motion.div>
              )}

              {isListening && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-center">
                  <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
                    <span className="text-sm text-primary font-medium">Listening...</span>
                  </div>
                </motion.div>
              )}
            </div>

            {messages.length <= 1 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="px-4 pb-4">
                <p className="text-xs text-muted-foreground mb-2">Try asking:</p>
                <div className="flex flex-wrap gap-2">
                  {examplePrompts.map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => handleSendMessage(prompt)}
                      className="px-3 py-2 bg-secondary rounded-full text-xs text-secondary-foreground hover:bg-secondary/80 transition-colors"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            <div className="px-4 pb-2 flex gap-4 justify-center">
              <div className="flex flex-col items-center gap-2">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleVoiceToggle}
                  className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all ${isListening ? "bg-destructive text-white" : "bg-card border border-border text-foreground hover:bg-secondary"}`}
                >
                  {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                </motion.button>
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Record</span>
              </div>

              <div className="flex flex-col items-center gap-2">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={startLiveSession}
                  className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg gradient-primary text-white"
                >
                  <Phone className="w-6 h-6" />
                </motion.button>
                <span className="text-[10px] text-primary uppercase tracking-wider font-medium">Live Call</span>
              </div>
            </div>

            <div className="px-4 pb-6 safe-area-bottom pt-2">
              <div className="flex gap-2">
                <Input
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Type your question..."
                  className="flex-1 h-12 rounded-xl bg-secondary border-0"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSendMessage(inputText);
                  }}
                />
                <Button variant="gradient" size="icon-lg" onClick={() => handleSendMessage(inputText)} disabled={!inputText.trim()}>
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </MobileLayout>
  );
};

export default VoiceAssistant;