
import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Brain, Send, MessageSquare, BookOpen, Database, Bot } from 'lucide-react';
import { toast } from 'sonner';
import IntentSimon from './IntentSimon';
import SimulationDataHarvester from './knowledge/SimulationDataHarvester';
import { knowledgeBase } from '@/utils/knowledge/intentKnowledgeBase';

interface IntentSimonAdvisorProps {
  className?: string;
  onClose?: () => void;
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'system';
  timestamp: Date;
  confidence?: number;
}

const IntentSimonAdvisor: React.FC<IntentSimonAdvisorProps> = ({
  className = '',
  onClose
}) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      text: "Hello, I'm IntentSim(on). I've been learning about the intent-based universe model from the simulation data and the textbook. How can I help you understand this fascinating model?",
      sender: 'system',
      timestamp: new Date()
    }
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [knowledgeStats, setKnowledgeStats] = useState({
    concepts: 0,
    insights: 0
  });
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() || isProcessing) return;
    
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: input,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsProcessing(true);
    
    // Get response from knowledge base
    try {
      const validationResult = knowledgeBase.defendNexus(input);
      
      // Simulate thinking time
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 500));
      
      const response = knowledgeBase.generateResponse(input);
      
      const systemMessage: Message = {
        id: `system-${Date.now()}`,
        text: response.response,
        sender: 'system',
        timestamp: new Date(),
        confidence: response.confidence
      };
      
      setMessages(prev => [...prev, systemMessage]);
      
      // Add a note about confidence if it's lower
      if (response.confidence < 0.4 && validationResult.defender) {
        // Defender alert with low confidence
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const defenderMessage: Message = {
          id: `defender-${Date.now()}`,
          text: `[${validationResult.defender.role} alert] ${validationResult.explanation} I'll keep learning from the simulation to improve my understanding.`,
          sender: 'system',
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, defenderMessage]);
      }
    } catch (error) {
      console.error("Error generating response:", error);
      
      // Fallback message
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        text: "I apologize, but I encountered an error processing your question. My intent field fluctuations are still stabilizing. Please try again.",
        sender: 'system',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Handle harvest complete
  const handleHarvestComplete = (stats: { concepts: number, insights: number }) => {
    setKnowledgeStats(stats);
    
    // Occasionally give updates about learning
    if (Math.random() < 0.2 && messages.length > 1) {
      const learningMessage: Message = {
        id: `learning-${Date.now()}`,
        text: `I've just analyzed new simulation data. My knowledge now includes ${stats.concepts} concepts based on ${stats.insights} insights from the running simulation.`,
        sender: 'system',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, learningMessage]);
      toast.info("IntentSim(on) has harvested new simulation data");
    }
  };
  
  return (
    <Card className={`flex flex-col h-full border border-indigo-900/30 bg-black/90 backdrop-blur-md shadow-xl ${className}`}>
      <CardHeader className="bg-indigo-950 border-b border-indigo-900/50 pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Brain className="h-6 w-6 text-indigo-400 mr-2" />
            <span className="text-indigo-100">IntentSim(on) Advisor</span>
          </div>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose} className="h-8 px-2 text-gray-400 hover:text-white">
              ✕
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-grow overflow-hidden p-0">
        <div className="grid grid-cols-3 h-full">
          <div className="col-span-1 border-r border-indigo-900/30 p-4 bg-indigo-950/20 flex flex-col items-center">
            <IntentSimon size="md" withKnowledgeDisplay={true} className="mb-4" />
            
            <div className="w-full mt-auto text-xs text-gray-400 bg-black/30 rounded p-2">
              <div className="flex items-center justify-between mb-1">
                <span className="flex items-center">
                  <Database className="w-3 h-3 mr-1" />
                  Simulation Data
                </span>
                <span className="text-indigo-400">{knowledgeStats.insights}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center">
                  <BookOpen className="w-3 h-3 mr-1" />
                  Document Knowledge
                </span>
                <span className="text-indigo-400">20</span>
              </div>
              <div className="mt-2 pt-2 border-t border-gray-800 flex items-center justify-between">
                <span className="flex items-center">
                  <Brain className="w-3 h-3 mr-1" />
                  Total Concepts
                </span>
                <span className="text-indigo-400">{knowledgeStats.concepts}</span>
              </div>
            </div>
          </div>
          
          <div className="col-span-2 flex flex-col h-full">
            <ScrollArea className="flex-grow p-4" ref={scrollRef}>
              <div className="space-y-4">
                {messages.map(message => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-lg p-3 ${
                        message.sender === 'user'
                          ? 'bg-indigo-600 text-white'
                          : message.id.startsWith('defender')
                            ? 'bg-red-900/70 text-white'
                            : message.id.startsWith('learning')
                              ? 'bg-green-900/70 text-white'
                              : 'bg-gray-800 text-gray-100'
                      }`}
                    >
                      <div className="flex items-center mb-1">
                        {message.sender === 'user' ? (
                          <MessageSquare className="h-4 w-4 mr-1 text-indigo-200" />
                        ) : message.id.startsWith('defender') ? (
                          <Brain className="h-4 w-4 mr-1 text-red-300" />
                        ) : message.id.startsWith('learning') ? (
                          <Database className="h-4 w-4 mr-1 text-green-300" />
                        ) : (
                          <Bot className="h-4 w-4 mr-1 text-gray-300" />
                        )}
                        <span className="text-xs opacity-75">
                          {message.sender === 'user' ? 'You' : 'IntentSim(on)'}
                        </span>
                        {message.confidence !== undefined && (
                          <span className={`ml-2 text-xs px-1.5 py-0.5 rounded ${
                            message.confidence > 0.7 
                              ? 'bg-green-900/70 text-green-200'
                              : message.confidence > 0.4
                                ? 'bg-yellow-900/70 text-yellow-200'
                                : 'bg-red-900/70 text-red-200'
                          }`}>
                            {(message.confidence * 100).toFixed(0)}% confidence
                          </span>
                        )}
                      </div>
                      <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                    </div>
                  </div>
                ))}
                
                {isProcessing && (
                  <div className="flex justify-start">
                    <div className="bg-gray-800 text-white rounded-lg p-3 max-w-[85%]">
                      <div className="flex items-center mb-1">
                        <Bot className="h-4 w-4 mr-1 text-gray-300" />
                        <span className="text-xs opacity-75">IntentSim(on)</span>
                      </div>
                      <div className="flex space-x-1 items-center h-5">
                        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" style={{ animationDelay: '200ms' }}></div>
                        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" style={{ animationDelay: '400ms' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
            
            <CardFooter className="p-3 border-t border-indigo-900/30 bg-gray-900/50">
              <form onSubmit={handleSubmit} className="w-full flex">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about intent fields, particles, or charge..."
                  className="flex-grow mr-2 bg-gray-800 border-gray-700 text-white"
                  disabled={isProcessing}
                />
                <Button 
                  type="submit" 
                  disabled={isProcessing || !input.trim()} 
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </CardFooter>
          </div>
        </div>
      </CardContent>
      
      {/* Hidden data harvester component */}
      <SimulationDataHarvester 
        harvesterEnabled={true}
        onHarvestComplete={handleHarvestComplete}
      />
    </Card>
  );
};

export default IntentSimonAdvisor;
