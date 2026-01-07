import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Mic, MicOff, Volume2, Sparkles, Send, User, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import MobileLayout from "@/components/layout/MobileLayout";

interface Message {
  id: string;
  type: "user" | "assistant";
  text: string;
  timestamp: Date;
}

const VoiceAssistant = () => {
  const navigate = useNavigate();
  const [isListening, setIsListening] = useState(false);
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "assistant",
      text: "Hello! I'm your CropCare AI assistant. Ask me anything about plant diseases, treatments, or farming tips. You can type or use voice!",
      timestamp: new Date(),
    },
  ]);

  const examplePrompts = [
    "How to prevent tomato blight?",
    "Best organic pesticides",
    "When to apply fertilizer?",
    "Signs of nutrient deficiency",
  ];

  const handleVoiceToggle = () => {
    setIsListening(!isListening);
    
    if (!isListening) {
      // Simulate voice input
      setTimeout(() => {
        setIsListening(false);
        handleSendMessage("How do I prevent late blight in my tomatoes?");
      }, 3000);
    }
  };

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      text: text.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        text: "To prevent late blight in tomatoes, ensure proper spacing for air circulation, water at the base to keep leaves dry, apply copper-based fungicides preventatively, and remove any infected leaves immediately. Also, avoid overhead watering and plant resistant varieties when possible.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    }, 1500);
  };

  return (
    <MobileLayout showNav={false}>
      <div className="flex flex-col h-screen bg-background safe-area-top">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 bg-card/50 backdrop-blur-sm border-b border-border">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-sm font-display font-semibold">AI Assistant</h1>
              <p className="text-xs text-muted-foreground">Always ready to help</p>
            </div>
          </div>
          
          <Button variant="ghost" size="icon">
            <Volume2 className="w-5 h-5" />
          </Button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`flex gap-3 ${
                  message.type === "user" ? "flex-row-reverse" : ""
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${
                    message.type === "user"
                      ? "bg-primary"
                      : "gradient-primary"
                  }`}
                >
                  {message.type === "user" ? (
                    <User className="w-4 h-4 text-primary-foreground" />
                  ) : (
                    <Bot className="w-4 h-4 text-primary-foreground" />
                  )}
                </div>
                <div
                  className={`max-w-[80%] p-4 rounded-2xl ${
                    message.type === "user"
                      ? "bg-primary text-primary-foreground rounded-br-md"
                      : "glass-card shadow-soft rounded-bl-md"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.text}</p>
                  <p className={`text-xs mt-2 ${
                    message.type === "user" ? "text-primary-foreground/60" : "text-muted-foreground"
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Listening Indicator */}
          {isListening && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-center"
            >
              <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-1 bg-primary rounded-full"
                      animate={{ height: [8, 24, 8] }}
                      transition={{
                        duration: 0.5,
                        repeat: Infinity,
                        delay: i * 0.1,
                      }}
                    />
                  ))}
                </div>
                <span className="text-sm text-primary font-medium">Listening...</span>
              </div>
            </motion.div>
          )}
        </div>

        {/* Example Prompts */}
        {messages.length <= 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-4 pb-4"
          >
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

        {/* Voice Button */}
        <div className="px-4 py-6">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleVoiceToggle}
            className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center shadow-lg transition-all ${
              isListening
                ? "bg-destructive shadow-destructive/30"
                : "gradient-primary shadow-glow"
            }`}
          >
            {/* Pulse Rings */}
            {isListening && (
              <>
                <motion.div
                  className="absolute w-28 h-28 rounded-full border-2 border-destructive/40"
                  animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <motion.div
                  className="absolute w-36 h-36 rounded-full border-2 border-destructive/20"
                  animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                />
              </>
            )}
            
            {isListening ? (
              <MicOff className="w-8 h-8 text-destructive-foreground" />
            ) : (
              <Mic className="w-8 h-8 text-primary-foreground" />
            )}
          </motion.button>
          <p className="text-center text-sm text-muted-foreground mt-3">
            {isListening ? "Tap to stop" : "Tap to speak"}
          </p>
        </div>

        {/* Text Input */}
        <div className="px-4 pb-6 safe-area-bottom">
          <div className="flex gap-2">
            <Input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type your question..."
              className="flex-1 h-12 rounded-xl bg-secondary border-0"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSendMessage(inputText);
                }
              }}
            />
            <Button
              variant="gradient"
              size="icon-lg"
              onClick={() => handleSendMessage(inputText)}
              disabled={!inputText.trim()}
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};

export default VoiceAssistant;
