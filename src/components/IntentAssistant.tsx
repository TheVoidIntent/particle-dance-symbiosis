
import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bot, Send, User, Mic, Speaker, FileImage, FileUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export interface IntentAssistantProps {
  onAdvice?: (advice: string) => void; // Make this prop optional
}

const IntentAssistant: React.FC<IntentAssistantProps> = ({ onAdvice }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Array<{role: 'user' | 'assistant', content: string}>>([]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user' as const, content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Generate a more contextual response
    setTimeout(() => {
      const assistantMessage = {
        role: 'assistant' as const,
        content: generateResponse(input)
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
      if (onAdvice) {
        onAdvice(`IntentSim suggests: Explore the implications of "${input}" further.`);
      }
    }, 1500);
  };

  // Generate varied and contextual responses
  const generateResponse = (userInput: string): string => {
    const userInputLower = userInput.toLowerCase();
    
    // Check for greetings
    if (userInputLower.match(/^(hi|hello|hey|greetings)/)) {
      return "Hello! I'm your IntentSim assistant. How can I help you explore the intent-based universe model today?";
    }
    
    // Check for questions
    if (userInputLower.includes('?')) {
      if (userInputLower.includes('intent') && userInputLower.includes('field')) {
        return "The intent field is the foundation of our universe model. It represents the primordial conceptual space from which particles emerge through fluctuations. These fluctuations determine the charge of particles: positive fluctuations create positive charges, negative fluctuations create negative charges, and neutral fluctuations create neutral charges.";
      } else if (userInputLower.includes('particle')) {
        return "In our model, particles emerge from intent field fluctuations and carry an inherent 'intent to know' that drives them to explore and interact. The charge polarity affects their interaction tendencies - positive charges are more eager to exchange information, negative charges are more isolated, and neutral charges fall somewhere in between.";
      } else if (userInputLower.includes('simulation')) {
        return "Our simulation models how an intent-based universe evolves from simple rules to complex structures. You can adjust parameters like fluctuation rate, particle behavior, and more to see how different initial conditions lead to different outcomes.";
      } else {
        return "That's a fascinating question about our intent-based universe model. The model explores how consciousness and intent might be fundamental properties of the universe, emerging through field fluctuations and particle interactions. Would you like to know more about a specific aspect?";
      }
    }
    
    // Check for statements or comments
    if (userInputLower.includes('interesting') || userInputLower.includes('cool') || userInputLower.includes('wow')) {
      return "I'm glad you find it interesting! The intent-based universe model offers a unique perspective on cosmology and consciousness. Is there a particular aspect you'd like to explore further?";
    }
    
    // Check for commands or requests
    if (userInputLower.includes('show me') || userInputLower.includes('explain') || userInputLower.includes('tell me')) {
      return "I'd be happy to explain more about the intent-based universe model. It proposes that universe formation begins with an intent field that fluctuates, creating particles with varying charges and an inherent 'intent to know.' These particles interact based on these properties, creating increasing complexity over time. What specific aspect would you like me to elaborate on?";
    }
    
    // Default responses for anything else
    const defaultResponses = [
      "That's an interesting perspective. In our intent-based model, we see similar patterns emerging from simple rules and interactions.",
      "I see what you're saying. The implications for our understanding of universal consciousness are profound when we consider intent as fundamental.",
      "Fascinating input. This relates to how particles in our model develop complexity through their interactions and knowledge exchange.",
      "I understand. This connects to how intent fields fluctuate and create patterns similar to what we observe in quantum phenomena."
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  useEffect(() => {
    // Scroll to bottom when messages change
    scrollAreaRef.current?.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);
  
  return (
    <Card className="w-full max-w-md mx-auto h-[600px] flex flex-col border-indigo-100 shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Bot className="mr-2 h-5 w-5 text-blue-500" />
          Intent Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="overflow-y-auto flex-grow">
        <ScrollArea ref={scrollAreaRef} className="h-full">
          <div className="flex flex-col space-y-4 p-3">
            {messages.map((message, index) => (
              <div key={index} className={`flex items-start ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {message.role === 'assistant' && (
                  <Avatar className="h-8 w-8 mr-3">
                    <AvatarImage src="/intentsim-logo.png" alt="IntentSim" />
                    <AvatarFallback>IS</AvatarFallback>
                  </Avatar>
                )}
                <div className={`rounded-lg p-3 text-sm w-fit max-w-[70%] ${message.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'}`}>
                  {message.content}
                </div>
                {message.role === 'user' && (
                  <Avatar className="h-8 w-8 ml-3">
                    <AvatarImage src="/default-user.jpg" alt="You" />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            {isTyping && (
              <div className="flex items-start justify-start">
                <Avatar className="h-8 w-8 mr-3">
                  <AvatarImage src="/intentsim-logo.png" alt="IntentSim" />
                  <AvatarFallback>IS</AvatarFallback>
                </Avatar>
                <div className="rounded-lg p-3 text-sm w-fit max-w-[70%] bg-gray-100 text-gray-800">
                  <div className="flex space-x-1">
                    <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></div>
                    <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '400ms' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="p-3">
        <form onSubmit={handleSubmit} className="w-full flex items-center">
          <Input
            placeholder="Ask me anything..."
            value={input}
            onChange={handleInputChange}
            className="mr-2 flex-grow"
          />
          <Button type="submit" disabled={isTyping}>
            Send
            <Send className="ml-2 h-4 w-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
};

export default IntentAssistant;
