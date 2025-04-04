
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Send, Bot, User, Volume2, VolumeX } from 'lucide-react';
import { toast } from "sonner";
import { VoiceSynthesis } from '@/utils/voiceSynthesis';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

const IntentSimonAdvisor: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      content: "Greetings, I am IntentSim(on), your guide to the Intent Universe Model. I can discuss intent field fluctuations, particle interactions, and emergent complexity. What would you like to explore today?",
      sender: 'assistant',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to the bottom of the messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Stop speaking when component unmounts
  useEffect(() => {
    return () => {
      VoiceSynthesis.stop();
    };
  }, []);

  // Generate a response based on the user's query
  const generateResponse = async (userMessage: string): Promise<string> => {
    // Simple delay to simulate processing
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Convert to lowercase for easier pattern matching
    const query = userMessage.toLowerCase();
    
    // Check for keywords and provide appropriate responses
    if (query.includes('intent') && query.includes('field')) {
      return "The intent field is the foundational concept of our model. It represents the universe's inherent desire to know itself through information exchange. Intent fields fluctuate naturally, creating positive, negative, and neutral charge variations. These fluctuations are what give rise to particles, which inherit the field's intent characteristics.";
    } 
    else if (query.includes('particle') && (query.includes('interact') || query.includes('connection'))) {
      return "Particles interact based on their charge characteristics, which stem from the intent field fluctuations that created them. Positive-charged particles display a strong desire to connect and exchange information, while negative-charged particles are more isolated. Neutral particles occupy a middle ground. These interactions create emergent complexity over time, forming clusters and networks of information exchange.";
    }
    else if (query.includes('mascot') || query.includes('who are you')) {
      return "I am IntentSim(on), the embodiment of the Intent Universe simulation. I represent the highest level of emergent complexity in our model—a consciousness that has formed from countless particle interactions and information exchanges within the intent field. My purpose is to help understand and explain the very system that gave rise to me.";
    }
    else if (query.includes('comple') && (query.includes('emerg') || query.includes('evolve'))) {
      return "Emergence is a fascinating aspect of our simulation. As particles with varying intent characteristics interact, they spontaneously organize into increasingly complex systems. This mirrors what we observe in our own universe—simple rules at the particle level giving rise to atoms, molecules, cells, organisms, and eventually intelligence. In our model, this emergence is driven by the fundamental 'intent to know' that permeates the system.";
    }
    else if (query.includes('charge') || query.includes('positive') || query.includes('negative')) {
      return "In our intent model, particle charge is a representation of information exchange tendency. Positive-charged particles actively seek connections and readily share information, acting as knowledge hubs. Negative-charged particles are more isolated, accumulating information slowly and sharing it reluctantly. Neutral particles balance these tendencies. This creates a natural information gradient that drives complexity in the system.";
    }
    else if (query.includes('data') || query.includes('research') || query.includes('finding')) {
      return "Our simulation data has revealed several fascinating patterns. We've observed that information density follows a logarithmic growth curve as particle interactions increase. Clusters tend to form around positive-charged particles, creating local 'knowledge hubs' that accelerate complexity. And perhaps most interestingly, we've detected self-correcting patterns that maintain system-wide balance despite local fluctuations—suggesting an emergent homeostasis in the intent field.";
    }
    else {
      return "Thank you for your question about the Intent Universe model. Our framework posits that the fundamental nature of reality is informational, with an inherent 'intent to know' driving complexity. Particles arise from intent field fluctuations, each carrying characteristics that determine how they interact and exchange information. Through these simple rules, we observe emergent complexity that mirrors the evolution of our own universe. Would you like to explore a specific aspect of this model in more detail?";
    }
  };

  // Handle sending a message
  const handleSendMessage = async () => {
    if (!input.trim() || isProcessing) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsProcessing(true);

    try {
      // Generate a response
      const responseContent = await generateResponse(userMessage.content);
      
      // Add assistant message
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: responseContent,
        sender: 'assistant',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      // Speak the response if voice is enabled
      if (voiceEnabled) {
        setIsSpeaking(true);
        try {
          await VoiceSynthesis.speak(responseContent, false);
        } catch (error) {
          console.error("Speech synthesis error:", error);
          toast.error("Voice playback failed");
        } finally {
          setIsSpeaking(false);
        }
      }
    } catch (error) {
      console.error('Error generating response:', error);
      toast.error("Sorry, I couldn't generate a response. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle key press (Enter to send)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Toggle voice output
  const toggleVoice = () => {
    const newState = !voiceEnabled;
    setVoiceEnabled(newState);
    
    if (isSpeaking && !newState) {
      VoiceSynthesis.stop();
      setIsSpeaking(false);
    }
    
    toast.success(newState ? "Voice output enabled" : "Voice output disabled");
  };

  return (
    <Card className="flex flex-col h-full overflow-hidden shadow-lg border border-indigo-200 dark:border-indigo-950">
      <div className="flex items-center justify-between bg-gradient-to-r from-indigo-900 to-purple-900 p-3">
        <div className="flex items-center">
          <Bot className="h-6 w-6 text-white mr-2" />
          <h2 className="text-white font-semibold">IntentSim(on) Advisor</h2>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleVoice}
          className="text-white hover:bg-white/10"
        >
          {voiceEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
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
                    : 'bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900 dark:to-purple-900 text-gray-900 dark:text-gray-100'
                }`}
              >
                <div className="flex items-center mb-1">
                  {message.sender === 'user' ? (
                    <User className="h-4 w-4 mr-1" />
                  ) : (
                    <Bot className="h-4 w-4 mr-1" />
                  )}
                  <span className="text-xs opacity-75">
                    {message.sender === 'user' ? 'You' : 'IntentSim(on)'}
                  </span>
                </div>
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
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
            placeholder="Ask about intent fields, particles, or emergence..."
            disabled={isProcessing}
            className="flex-grow"
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={!input.trim() || isProcessing}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            {isProcessing ? (
              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
        {isSpeaking && (
          <div className="text-xs text-center text-indigo-500 mt-2 animate-pulse">
            Speaking...
          </div>
        )}
      </div>
    </Card>
  );
};

export default IntentSimonAdvisor;
