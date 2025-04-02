
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Send, Bot, User, RefreshCw } from 'lucide-react';
import { toast } from "sonner";

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface GeminiChatProps {
  initialMessage?: string;
  placeholder?: string;
  className?: string;
}

const GeminiChat: React.FC<GeminiChatProps> = ({
  initialMessage = "Hello! I'm Gemini Gem Intentional, the IntentSim.org AI assistant. I can help answer questions about the intent-based universe model, particle interactions, and the conceptual framework behind this simulation. What would you like to know?",
  placeholder = "Ask about intent fields, particles, or universe formation...",
  className = "",
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '0',
      text: initialMessage,
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // This is a simulated response generator
  // In a real implementation, you would connect to an actual API
  const generateBotResponse = async (userMessage: string): Promise<string> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Example logic to generate responses based on keywords
    const userMessageLower = userMessage.toLowerCase();
    
    if (userMessageLower.includes('intent') && userMessageLower.includes('field')) {
      return "The intent field is the foundational conceptual space of our universe model. It represents fluctuations that give rise to particles with varying charges. Positive fluctuations create positive charges, negative fluctuations create negative charges, and neutral fluctuations create neutral particles. These intent field fluctuations are the seed of all complexity in our model.";
    } else if (userMessageLower.includes('particle') && (userMessageLower.includes('create') || userMessageLower.includes('formation'))) {
      return "Particles in our model arise from intent field fluctuations. They carry properties including charge (positive, negative, or neutral) and an inherent 'intent to know' that drives them to explore and interact. Positive particles have a stronger desire to interact, negative particles are less inclined to exchange information, and neutral particles fall somewhere in between.";
    } else if (userMessageLower.includes('charge') && userMessageLower.includes('color')) {
      return "In our model, particles are grouped by both charge and color. The charge (positive, negative, neutral) affects how much the particle wants to interact with others. Color is another property that determines how particles group together and form patterns in the intent field.";
    } else if (userMessageLower.includes('complex') || userMessageLower.includes('evolution')) {
      return "The system evolves in complexity as particles interact, exchange information, and form patterns. We see emergent properties similar to those in our own universe - clusters forming, information networks developing, and interactions becoming increasingly sophisticated over time. All of this emerges from simple intent-based rules.";
    } else if (userMessageLower.includes('simulate') || userMessageLower.includes('run')) {
      return "You can run the simulation right here on IntentSim.org. Try adjusting parameters like intent fluctuation rate, maximum particles, learning rate, and particle creation rate to see how they affect the evolution of the system. The system follows real physical rules while incorporating the 'intent to know' as a fundamental property.";
    } else if (userMessageLower.includes('hello') || userMessageLower.includes('hi') || userMessageLower.includes('hey')) {
      return "Hello! I'm Gemini Gem Intentional, the IntentSim.org AI assistant. I'd be happy to explain our intent-based universe model or answer questions about how the simulation works. What aspects are you most curious about?";
    } else {
      return "That's an interesting question about our intent-based universe model. The fundamental idea is that universe formation begins with an intent field that fluctuates, creating particles with varying charges, colors, and an inherent 'intent to know.' These particles then interact based on these properties, creating increasing complexity over time. Would you like to know more about a specific aspect of this model?";
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isProcessing) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: input.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsProcessing(true);

    try {
      // Get bot response
      const response = await generateBotResponse(userMessage.text);
      
      // Add bot message
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error generating response:', error);
      toast.error("Sorry, I couldn't generate a response. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: '0',
        text: initialMessage,
        sender: 'bot',
        timestamp: new Date(),
      },
    ]);
    if (inputRef.current) {
      inputRef.current.focus();
    }
    toast.success("Chat history cleared");
  };

  return (
    <Card className={`flex flex-col h-full overflow-hidden shadow-lg border border-gray-200 dark:border-gray-800 ${className}`}>
      <div className="flex items-center justify-between bg-gradient-to-r from-purple-900 to-indigo-900 p-3">
        <div className="flex items-center">
          <Bot className="h-6 w-6 text-white mr-2" />
          <h2 className="text-white font-semibold">Gemini Gem Intentional</h2>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={clearChat}
          className="text-white hover:bg-white/10"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
      
      <ScrollArea className="flex-grow p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.sender === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                }`}
              >
                <div className="flex items-center mb-1">
                  {message.sender === 'user' ? (
                    <User className="h-4 w-4 mr-1" />
                  ) : (
                    <Bot className="h-4 w-4 mr-1" />
                  )}
                  <span className="text-xs opacity-75">
                    {message.sender === 'user' ? 'You' : 'Gemini'}
                  </span>
                </div>
                <p className="text-sm whitespace-pre-wrap">{message.text}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      
      <div className="p-3 border-t border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={isProcessing}
            className="flex-grow"
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={!input.trim() || isProcessing}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default GeminiChat;
