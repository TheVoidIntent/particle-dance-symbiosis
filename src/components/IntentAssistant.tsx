
import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bot, Send, User, Mic, Speaker, FileImage, FileUp, ThumbsUp, ThumbsDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  generateEnhancedResponse, 
  recordUserInteraction, 
  addSimulationInsight,
  getSimulationInsightsByTopic
} from '@/utils/intentSimonModel';

export interface IntentAssistantProps {
  onAdvice?: (advice: string) => void;
  className?: string;
  initialMessage?: string;
  placeholder?: string;
  voiceStyle?: 'default' | 'professor' | 'friendly';
  simulationData?: any;
}

const IntentAssistant: React.FC<IntentAssistantProps> = ({ 
  onAdvice,
  className = '',
  initialMessage = "Hello! I'm your IntentSim assistant. How can I help you explore the intent-based universe model today?",
  placeholder = "Ask about intent fields, particles, or interactions...",
  voiceStyle = 'default',
  simulationData
}) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Array<{
    id: string,
    role: 'user' | 'assistant', 
    content: string,
    feedback?: 'positive' | 'negative' | null
  }>>([]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Initialize with welcome message
  useEffect(() => {
    if (initialMessage) {
      setMessages([{ 
        id: `init-${Date.now()}`,
        role: 'assistant', 
        content: initialMessage,
        feedback: null
      }]);
    }
  }, [initialMessage]);

  // Process simulation data when available
  useEffect(() => {
    if (simulationData) {
      // Add insights from simulation data
      if (simulationData.clusterCount && simulationData.clusterCount > 0) {
        addSimulationInsight(
          'cluster_formation',
          `Detected ${simulationData.clusterCount} stable clusters with average complexity of ${simulationData.complexityIndex?.toFixed(2) || 'unknown'}`,
          0.7
        );
      }
      
      if (simulationData.robotCount && simulationData.robotCount > 0) {
        addSimulationInsight(
          'robot_evolution',
          `${simulationData.robotCount} clusters have evolved into high-intelligence entities`,
          0.9
        );
      }
      
      // Get insights about intent fields if we have new data
      if (simulationData.intentFieldComplexity) {
        const fieldInsights = getSimulationInsightsByTopic('intent field', 1);
        
        if (fieldInsights.length === 0 || Date.now() - fieldInsights[0].timestamp > 3600000) {
          addSimulationInsight(
            'intent_field_analysis',
            `Intent field has reached complexity level of ${simulationData.intentFieldComplexity.toFixed(2)}`,
            0.6
          );
        }
      }
    }
  }, [simulationData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const messageId = `msg-${Date.now()}`;
    const userMessage = { 
      id: messageId,
      role: 'user' as const, 
      content: input,
      feedback: null
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Use the enhanced response generation
    setTimeout(() => {
      try {
        const response = generateEnhancedResponse(input);
        
        const assistantMessage = {
          id: `resp-${Date.now()}`,
          role: 'assistant' as const,
          content: response,
          feedback: null
        };
        setMessages(prev => [...prev, assistantMessage]);
        
        if (onAdvice) {
          onAdvice(`IntentSim suggests: Explore the implications of "${input}" further.`);
        }
      } catch (error) {
        console.error("Error generating response:", error);
        
        // Fallback response
        const assistantMessage = {
          id: `resp-${Date.now()}`,
          role: 'assistant' as const,
          content: "I encountered an error processing your request. My neural pathways are still developing. Could you try rephrasing your question?",
          feedback: null
        };
        setMessages(prev => [...prev, assistantMessage]);
      } finally {
        setIsTyping(false);
      }
    }, 1000 + Math.random() * 1000); // Variable response time for realism
  };

  // Handle feedback on assistant messages
  const handleFeedback = (messageId: string, feedback: 'positive' | 'negative') => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId ? { ...msg, feedback } : msg
      )
    );
    
    // Find the message and its corresponding query
    const messageIndex = messages.findIndex(msg => msg.id === messageId);
    if (messageIndex > 0 && messageIndex < messages.length) {
      const assistantMessage = messages[messageIndex];
      const userMessage = messages[messageIndex - 1];
      
      if (assistantMessage.role === 'assistant' && userMessage.role === 'user') {
        // Record feedback in the model
        recordUserInteraction(
          userMessage.content,
          assistantMessage.content,
          feedback
        );
        
        // Show toast based on feedback
        if (feedback === 'positive') {
          toast({
            title: "Feedback Recorded",
            description: "Thanks! I'll use this to improve my responses.",
            variant: "default",
          });
        } else {
          toast({
            title: "Feedback Recorded",
            description: "I'll work on providing better answers in the future.",
            variant: "default",
          });
        }
      }
    }
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
            {messages.map((message) => (
              <div key={message.id} className={`flex items-start ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {message.role === 'assistant' && (
                  <Avatar className="h-8 w-8 mr-3">
                    <AvatarImage src="/intentsim-logo.png" alt="IntentSim" />
                    <AvatarFallback>IS</AvatarFallback>
                  </Avatar>
                )}
                <div className="flex flex-col">
                  <div className={`rounded-lg p-3 text-sm w-fit max-w-[70%] ${message.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'}`}>
                    {message.content}
                  </div>
                  
                  {message.role === 'assistant' && (
                    <div className="flex items-center mt-1 space-x-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className={`h-6 w-6 ${message.feedback === 'positive' ? 'text-green-500' : 'text-gray-400'}`}
                        onClick={() => handleFeedback(message.id, 'positive')}
                      >
                        <ThumbsUp className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className={`h-6 w-6 ${message.feedback === 'negative' ? 'text-red-500' : 'text-gray-400'}`}
                        onClick={() => handleFeedback(message.id, 'negative')}
                      >
                        <ThumbsDown className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
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
