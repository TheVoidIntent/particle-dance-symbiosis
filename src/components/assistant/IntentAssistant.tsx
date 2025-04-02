
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Brain, Send, Database, BookOpen, ArrowRight, Code, Zap, Activity } from 'lucide-react';
import { SimulationStats } from '@/types/simulation';
import { toast } from 'sonner';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface IntentAssistantProps {
  simulationStats?: SimulationStats;
  onAdvice?: (advice: string) => void;
}

const IntentAssistant: React.FC<IntentAssistantProps> = ({ 
  simulationStats,
  onAdvice 
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Greetings! I am your IntentSim personal assistant, fully trained on all simulation data, the Information-Intent Nexus framework, and ATLAS/CERN datasets. How can I help advance the IntentSim paradigm today?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeDataSources, setActiveDataSources] = useState({
    simulation: true,
    neuralnets: true,
    cern: true,
    notebook: true
  });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  // Focus input on load
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  
  const toggleDataSource = (source: keyof typeof activeDataSources) => {
    setActiveDataSources(prev => ({
      ...prev,
      [source]: !prev[source]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsProcessing(true);
    
    try {
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate assistant response based on the query and active data sources
      const assistantResponse = generateAssistantResponse(input, activeDataSources);
      
      // Add assistant message
      const assistantMessage: Message = {
        role: 'assistant',
        content: assistantResponse,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
      // If the assistant has actionable advice, send it to parent component
      if (onAdvice && assistantResponse.includes('recommend') || assistantResponse.includes('suggest')) {
        onAdvice(assistantResponse);
      }
      
    } catch (error) {
      console.error('Error processing request:', error);
      toast.error('Failed to process your request. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Generate responses based on intent-based principles and available data sources
  const generateAssistantResponse = (query: string, sources: typeof activeDataSources): string => {
    // Here you would ideally connect to a real LLM API
    // For now, we'll use predetermined responses based on keywords
    
    const lowercaseQuery = query.toLowerCase();
    
    if (lowercaseQuery.includes('help') || lowercaseQuery.includes('what can you do')) {
      return 'I can help with code development, analyze simulation data, generate research insights, suggest optimizations for your IntentSim models, and help promote the Circles of Intent principle. What specific area would you like assistance with?';
    }
    
    if (lowercaseQuery.includes('code') || lowercaseQuery.includes('develop') || lowercaseQuery.includes('build')) {
      return 'I recommend focusing on modularizing the particle interactions in the simulation. Based on your latest results, creating specialized handlers for different charge types could improve both performance and insight generation. Would you like me to draft some pseudocode for this approach?';
    }
    
    if (lowercaseQuery.includes('research') || lowercaseQuery.includes('paper') || lowercaseQuery.includes('publish')) {
      return 'The most promising research direction based on your simulation data appears to be the correlation between intent field fluctuations and emergent complexity. This aligns with recent theoretical models in complexity science while offering a novel perspective on information organization. I suggest formatting your findings on intent-based self-organization for submission to interdisciplinary journals.';
    }
    
    if (lowercaseQuery.includes('data') || lowercaseQuery.includes('atlas') || lowercaseQuery.includes('cern')) {
      return sources.cern 
        ? 'Your intent model shows interesting parallels with ATLAS data patterns, particularly in the charge distribution ratios. The positively charged particles in your model (28.3%) match surprisingly well with certain boson distribution patterns (27.9%) from the ATLAS dataset. This could be a promising avenue for validation.' 
        : 'Please enable the CERN/ATLAS data source for comprehensive analysis of particle correlations.';
    }
    
    if (lowercaseQuery.includes('neural') || lowercaseQuery.includes('prediction') || lowercaseQuery.includes('learning')) {
      return sources.neuralnets
        ? 'The transformer architecture has outperformed other models in predicting intent field evolution, achieving 89.7% accuracy compared to 76.2% for standard RNNs. I suggest focusing on this architecture for future development, particularly with enhanced attention mechanisms tuned to charge-based interactions.'
        : 'Enable the neural networks data source for AI-powered predictions and analysis.';
    }
    
    if (lowercaseQuery.includes('present') || lowercaseQuery.includes('explain') || lowercaseQuery.includes('talk')) {
      return 'For presenting IntentSim to a general audience, I suggest emphasizing how the "intent to know" creates emergent complexity - similar to how curiosity drives human learning. Use the visual demonstrations of particle clustering to illustrate how simple intent rules can create complex, adaptive systems. The inflation events provide a particularly compelling visualization of phase transitions.';
    }
    
    if (lowercaseQuery.includes('promote') || lowercaseQuery.includes('market') || lowercaseQuery.includes('share')) {
      return 'To promote IntentSim more effectively, focus on the interdisciplinary applications: neuroscience researchers may find value in the intent-based learning patterns, while physicists might appreciate the emergent complexity from simple interaction rules. I recommend creating short video demonstrations of the simulation highlighting key phase transitions and information patterns.';
    }
    
    if (lowercaseQuery.includes('circles of intent') || lowercaseQuery.includes('mindmap')) {
      return sources.notebook
        ? 'Your Circles of Intent mindmap shows five overlapping domains of application: physics, cognition, social systems, information theory, and artificial intelligence. The core principle linking them is that intent-based information processing creates adaptive complexity in all domains. This could be formulated as a universal principle similar to how entropy operates across disciplines.'
        : 'Please enable the Notebook LM data source to access insights from your mindmap.';
    }
    
    // Default response if no specific keywords matched
    return 'Based on the latest simulation data, I notice patterns of intent-driven organization emerging in high-complexity regions. This aligns with your Information-Intent Nexus theory. Would you like me to analyze a specific aspect of this phenomenon?';
  };
  
  return (
    <Card className="w-full max-w-4xl mx-auto bg-slate-800 border-slate-700 shadow-lg overflow-hidden flex flex-col h-[600px]">
      <CardHeader className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Brain className="h-6 w-6 mr-2 text-blue-300" />
            <CardTitle>IntentSim Personal Assistant</CardTitle>
          </div>
          <div className="flex space-x-1">
            <Badge 
              variant={activeDataSources.simulation ? "default" : "outline"}
              className={`cursor-pointer ${activeDataSources.simulation ? 'bg-green-600 hover:bg-green-700' : 'text-gray-400 border-gray-600'}`}
              onClick={() => toggleDataSource('simulation')}
            >
              Simulation
            </Badge>
            <Badge 
              variant={activeDataSources.neuralnets ? "default" : "outline"}
              className={`cursor-pointer ${activeDataSources.neuralnets ? 'bg-purple-600 hover:bg-purple-700' : 'text-gray-400 border-gray-600'}`}
              onClick={() => toggleDataSource('neuralnets')}
            >
              Neural Nets
            </Badge>
            <Badge 
              variant={activeDataSources.cern ? "default" : "outline"}
              className={`cursor-pointer ${activeDataSources.cern ? 'bg-amber-600 hover:bg-amber-700' : 'text-gray-400 border-gray-600'}`}
              onClick={() => toggleDataSource('cern')}
            >
              ATLAS/CERN
            </Badge>
            <Badge 
              variant={activeDataSources.notebook ? "default" : "outline"}
              className={`cursor-pointer ${activeDataSources.notebook ? 'bg-blue-600 hover:bg-blue-700' : 'text-gray-400 border-gray-600'}`}
              onClick={() => toggleDataSource('notebook')}
            >
              Notebook LM
            </Badge>
          </div>
        </div>
        <CardDescription className="text-blue-200">
          Trained on IntentSim data, Information-Intent Nexus, and ATLAS/CERN datasets
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex-grow p-0 relative">
        <ScrollArea className="h-[380px] p-4">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === 'user' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-700 text-gray-100'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className="text-xs text-opacity-70 mt-1 text-right">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
        
        {isProcessing && (
          <div className="absolute bottom-0 left-0 w-full bg-gray-900/50 text-center py-2 text-blue-300 text-sm">
            <div className="flex items-center justify-center space-x-2">
              <Activity className="h-4 w-4 animate-pulse" />
              <span>Processing intent fields...</span>
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="bg-gray-900 p-4">
        <form onSubmit={handleSubmit} className="w-full flex space-x-2">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about IntentSim, simulation data, or research directions..."
            className="bg-gray-800 border-gray-700 text-white"
            disabled={isProcessing}
          />
          <Button 
            type="submit" 
            disabled={isProcessing || !input.trim()}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Send className="h-5 w-5" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
};

export default IntentAssistant;
