
import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bot, Send, User, Mic, Speaker, FileImage, FileUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export interface IntentAssistantProps {
  onAdvice?: (advice: string) => void;
  className?: string;
  initialMessage?: string;
  placeholder?: string;
  voiceStyle?: 'default' | 'professor' | 'friendly';
}

const IntentAssistant: React.FC<IntentAssistantProps> = ({ 
  onAdvice,
  className = '',
  initialMessage = "Hello! I'm your IntentSim assistant. How can I help you explore the intent-based universe model today?",
  placeholder = "Ask about intent fields, particles, or interactions...",
  voiceStyle = 'default'
}) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Array<{role: 'user' | 'assistant', content: string}>>([]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Initialize with welcome message
  useEffect(() => {
    if (initialMessage) {
      setMessages([{ role: 'assistant', content: initialMessage }]);
    }
  }, [initialMessage]);

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

    // Generate a contextual response with appropriate delay
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
    }, 1000 + Math.random() * 1000); // Variable response time for realism
  };

  // Generate varied and contextual responses
  const generateResponse = (userInput: string): string => {
    const userInputLower = userInput.toLowerCase();
    
    // Check for greetings
    if (userInputLower.match(/^(hi|hello|hey|greetings)/)) {
      const greetings = [
        "Hello! I'm your IntentSim assistant. How can I help you explore the intent-based universe model today?",
        "Hi there! Ready to delve into the intent field theory and particle emergence?",
        "Greetings! I'm here to help with your intent-based universe exploration. What would you like to know?"
      ];
      return greetings[Math.floor(Math.random() * greetings.length)];
    }
    
    // Check for questions about intent field
    if (userInputLower.includes('intent') && userInputLower.includes('field')) {
      const intentFieldResponses = [
        "The intent field is the foundation of our universe model. It represents the primordial conceptual space from which particles emerge through fluctuations. These fluctuations determine the charge of particles: positive fluctuations create positive charges, negative fluctuations create negative charges, and neutral fluctuations create neutral charges.",
        "In our model, the intent field is a theoretical construct representing the universe's inherent drive to know itself. It fluctuates, creating variations that manifest as particles with different charges and properties. The field permeates all of spacetime and serves as the substrate from which complexity emerges.",
        "Think of the intent field as a sea of potential. When this field fluctuates positively, it creates particles with greater tendency to interact and exchange information. Negative fluctuations create more isolated particles, while neutral fluctuations create balanced ones. This is how the universe's 'intent to know' manifests in our model."
      ];
      return intentFieldResponses[Math.floor(Math.random() * intentFieldResponses.length)];
    }
    
    // Check for questions about particles
    if (userInputLower.includes('particle')) {
      const particleResponses = [
        "In our model, particles emerge from intent field fluctuations and carry an inherent 'intent to know' that drives them to explore and interact. The charge polarity affects their interaction tendencies - positive charges are more eager to exchange information, negative charges are more isolated, and neutral charges fall somewhere in between.",
        "Particles in our simulation have several key properties: charge (positive, negative, or neutral), knowledge (accumulated through interactions), and complexity (developing over time). Positively charged particles are more social, seeking interactions, while negatively charged ones are more reclusive. Neutral particles balance these tendencies.",
        "As particles interact in our model, they exchange information and potentially form more complex structures. The positive-charged particles, born from positive intent field fluctuations, actively seek to share and gather knowledge. Negative-charged particles tend to maintain their information, while neutral ones adapt based on their surroundings."
      ];
      return particleResponses[Math.floor(Math.random() * particleResponses.length)];
    }
    
    // Check for questions about simulation
    if (userInputLower.includes('simulation') || userInputLower.includes('model')) {
      const simulationResponses = [
        "Our simulation models how an intent-based universe evolves from simple rules to complex structures. You can adjust parameters like fluctuation rate, particle behavior, and more to see how different initial conditions lead to different outcomes. This helps us explore how consciousness might emerge from fundamental properties of reality.",
        "The IntentSim simulation allows you to experiment with different universe configurations. By adjusting the parameters controlling charge behavior, intent fluctuation rates, and interaction tendencies, you can observe how complexity develops over time and how different universe scenarios might unfold.",
        "Our model simulates a universe where intent - the drive to know - is fundamental. By running simulations with different parameters, we can observe patterns of complexity emergence that bear striking similarities to our own universe's evolution. This suggests that consciousness and intent might be more fundamental than previously thought."
      ];
      return simulationResponses[Math.floor(Math.random() * simulationResponses.length)];
    }
    
    // Check for questions about knowledge or consciousness
    if (userInputLower.includes('knowledge') || userInputLower.includes('conscious') || userInputLower.includes('aware')) {
      const knowledgeResponses = [
        "In our model, knowledge is represented as a particle property that increases through interactions. As particles exchange information, their collective knowledge grows, potentially giving rise to emergent properties similar to what we might call consciousness in more complex systems.",
        "Consciousness in our model emerges from the collective interactions and knowledge exchange between particles. The fundamental 'intent to know' drives particles to interact, share information, and form increasingly complex structures, potentially leading to self-organizing systems with properties resembling consciousness.",
        "Our simulation explores the hypothesis that awareness or consciousness could be an emergent property of systems with sufficient complexity arising from simple particles following the 'intent to know' principle. The patterns we observe in our simulations suggest interesting parallels with how consciousness might emerge in natural systems."
      ];
      return knowledgeResponses[Math.floor(Math.random() * knowledgeResponses.length)];
    }
    
    // Check for comments about interesting observations
    if (userInputLower.includes('interesting') || userInputLower.includes('cool') || userInputLower.includes('wow')) {
      const interestingResponses = [
        "I'm glad you find it interesting! The intent-based universe model offers a unique perspective on consciousness and cosmology. Is there a particular aspect you'd like to explore further?",
        "It is fascinating, isn't it? When we model the universe with intent as a fundamental property, we see emergent behaviors that mirror many aspects of our actual universe. What specifically caught your attention?",
        "The beauty of this model is how complex behaviors emerge from simple rules. As particles interact based on their embedded 'intent to know,' the system naturally evolves toward higher complexity, mirroring processes we observe in nature. What part would you like to learn more about?"
      ];
      return interestingResponses[Math.floor(Math.random() * interestingResponses.length)];
    }
    
    // Check for commands or requests for explanation
    if (userInputLower.includes('explain') || userInputLower.includes('tell me') || userInputLower.includes('how does')) {
      return "I'd be happy to explain more about the intent-based universe model. It proposes that universe formation begins with an intent field that fluctuates, creating particles with varying charges and an inherent 'intent to know.' These particles interact based on these properties, creating increasing complexity over time. What specific aspect would you like me to elaborate on?";
    }
    
    // Default responses for anything else
    const defaultResponses = [
      "That's an interesting perspective. In our intent-based model, we see similar patterns emerging from simple rules and interactions. Would you like to know more about a specific aspect?",
      "I see what you're saying. The implications for our understanding of universal consciousness are profound when we consider intent as fundamental. Is there a particular area you'd like to explore further?",
      "Fascinating input. This relates to how particles in our model develop complexity through their interactions and knowledge exchange. Would you like me to elaborate on this process?",
      "I understand. This connects to how intent fields fluctuate and create patterns similar to what we observe in quantum phenomena. What specific aspect interests you most?"
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  useEffect(() => {
    // Scroll to bottom when messages change
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);
  
  return (
    <Card className={`w-full max-w-md mx-auto h-[600px] flex flex-col border-indigo-100 shadow-md ${className}`}>
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
            placeholder={placeholder}
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
