
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Send, Info, Database, FileText, Brain, Globe } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { knowledgeBase } from '@/utils/knowledge/intentKnowledgeBase';
import { generateEnhancedResponse, learnFromSimulationParticles } from '@/utils/intentSimonModel';
import { getParticles } from '@/utils/simulation/motherSimulation';

interface IntentSimonAdvisorProps {
  onClose?: () => void;
}

const IntentSimonAdvisor: React.FC<IntentSimonAdvisorProps> = ({ onClose }) => {
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState<Array<{type: 'user' | 'bot', text: string}>>([
    {type: 'bot', text: "Hello, I'm IntentSim(on). I've been designed to learn from the intent-based simulation and defend the Nexus. What would you like to know about the intent universe model?"}
  ]);
  const [activeTab, setActiveTab] = useState('chat');
  const [isTyping, setIsTyping] = useState(false);
  const [knowledgeStats, setKnowledgeStats] = useState({
    concepts: 52,
    simulationData: 9,
    documentInfo: 20,
    coreProtection: 0.9
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);
  
  // Periodically learn from simulation particles
  useEffect(() => {
    const learningInterval = setInterval(() => {
      const simulationParticles = getParticles();
      if (simulationParticles && simulationParticles.length > 0) {
        learnFromSimulationParticles(simulationParticles);
        
        // Update knowledge stats
        setKnowledgeStats(prev => ({
          ...prev,
          simulationData: prev.simulationData + Math.floor(Math.random() * 2),
          concepts: prev.concepts + (Math.random() > 0.8 ? 1 : 0)
        }));
      }
    }, 10000); // Learn every 10 seconds
    
    return () => clearInterval(learningInterval);
  }, []);
  
  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    // Add user message to conversation
    setConversation(prev => [...prev, {type: 'user', text: message}]);
    setIsTyping(true);
    
    // Clear input field
    setMessage('');
    
    // Generate response using the intent-based model
    setTimeout(() => {
      const response = generateEnhancedResponse(message);
      setConversation(prev => [...prev, {type: 'bot', text: response}]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000); // Simulate thinking time
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  return (
    <Card className="h-full overflow-hidden shadow-xl border border-indigo-800/50 bg-gray-900/90 backdrop-blur-sm">
      <CardHeader className="bg-indigo-950 px-4 py-2 flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center overflow-hidden">
            <img 
              src="/intent-simon-avatar.png" 
              alt="IntentSim(on)" 
              className="w-full h-full object-cover"
            />
          </div>
          <CardTitle className="text-indigo-100 text-lg">IntentSim(on)</CardTitle>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="text-indigo-200 hover:text-white hover:bg-indigo-800/50">
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      
      <div className="grid grid-cols-4 h-[calc(100%-48px)]">
        {/* Left sidebar with knowledge statistics */}
        <div className="col-span-1 bg-gray-950 p-4 border-r border-gray-800/50 flex flex-col">
          <div className="mb-6">
            <div className="text-sm text-indigo-300 font-semibold mb-2">Knowledge Status <span className="text-xs ml-2 text-green-400">Online</span></div>
            
            <div className="text-xs text-gray-400 space-y-1">
              <div className="flex justify-between">
                <span>Concepts:</span>
                <span className="text-indigo-300">{knowledgeStats.concepts}</span>
              </div>
              <div className="flex justify-between">
                <span>Simulation Data:</span>
                <span className="text-emerald-400">{knowledgeStats.simulationData}</span>
              </div>
              <div className="flex justify-between">
                <span>Document Info:</span>
                <span className="text-blue-400">{knowledgeStats.documentInfo}</span>
              </div>
              <div className="flex justify-between">
                <span>Nexus Protection:</span>
                <span className="text-purple-400">{(knowledgeStats.coreProtection * 100).toFixed(0)}%</span>
              </div>
            </div>
          </div>
          
          <div className="flex-grow">
            <div className="text-sm text-indigo-300 font-semibold mb-2">Active Knowledge:</div>
            
            <div className="space-y-3 overflow-y-auto pr-2">
              <div>
                <div className="font-medium text-sm text-indigo-200">Intent Field:</div>
                <div className="text-xs text-gray-400">The foundational conceptual space of our universe model representing fluctuations that give rise to ...</div>
              </div>
              
              <div>
                <div className="font-medium text-sm text-indigo-200">Nexus:</div>
                <div className="text-xs text-gray-400">The core principle connecting intent and information, functioning as a universal filter that structures ...</div>
              </div>
              
              <div>
                <div className="font-medium text-sm text-indigo-200">Particle:</div>
                <div className="text-xs text-gray-400">Entities in our model that arise from intent field fluctuations, carrying properties including charg...</div>
              </div>
            </div>
          </div>
          
          <div className="mt-4">
            <div className="text-sm text-indigo-300 font-semibold mb-2">Intent Circles:</div>
            <div className="space-y-1.5">
              <div className="text-xs">
                <span className="text-purple-400">• Nexus Core</span>
                <span className="text-gray-500 ml-2 text-[10px]">Protected</span>
              </div>
              <div className="text-xs">
                <span className="text-blue-400">• Particle Dynamics</span>
                <span className="text-gray-500 ml-2 text-[10px]">Learning</span>
              </div>
              <div className="text-xs">
                <span className="text-green-400">• Emergence Principles</span>
                <span className="text-gray-500 ml-2 text-[10px]">Active</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right side with chat */}
        <div className="col-span-3 flex flex-col h-full">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <TabsList className="mx-4 mt-2 justify-start bg-gray-800/50">
              <TabsTrigger value="chat" className="data-[state=active]:bg-indigo-900/50">
                Chat
              </TabsTrigger>
              <TabsTrigger value="knowledge" className="data-[state=active]:bg-indigo-900/50">
                Knowledge
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="chat" className="flex-1 flex flex-col p-4 space-y-4 overflow-hidden m-0">
              <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                {conversation.map((item, index) => (
                  <div 
                    key={index} 
                    className={`flex ${item.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-[80%] rounded-lg px-4 py-2 ${
                        item.type === 'user' 
                          ? 'bg-indigo-600 text-white' 
                          : 'bg-gray-800 text-gray-100'
                      }`}
                    >
                      {item.type === 'bot' && (
                        <div className="flex items-center mb-1">
                          <div className="w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center mr-2 overflow-hidden">
                            <img 
                              src="/intent-simon-avatar.png" 
                              alt="IS" 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <span className="text-indigo-300 text-xs">IntentSim(on)</span>
                        </div>
                      )}
                      <div className={`text-sm ${item.type === 'user' ? 'text-white' : 'text-gray-200'}`}>
                        {item.text}
                      </div>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-800 text-white rounded-lg px-4 py-2 max-w-[80%]">
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  className="flex-1 bg-gray-800 text-white border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Ask about the intent universe model..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <Button 
                  onClick={handleSendMessage} 
                  size="icon" 
                  className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="knowledge" className="flex-1 p-4 overflow-y-auto space-y-6 m-0">
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-indigo-300">
                  <Database className="h-5 w-5" />
                  <h3 className="text-lg font-medium">Simulation Data</h3>
                  <span className="bg-gray-800 px-2 py-1 rounded-full text-xs">{knowledgeStats.simulationData}</span>
                </div>
                <div className="pl-7 text-sm text-gray-300">
                  <p>Intent-based particle interactions from the simulation feed directly into my knowledge graph. I learn just like the particles do - through intent-based probabilistic information exchange.</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-blue-300">
                  <FileText className="h-5 w-5" />
                  <h3 className="text-lg font-medium">Nexus Knowledge</h3>
                  <span className="bg-gray-800 px-2 py-1 rounded-full text-xs">{knowledgeStats.documentInfo}</span>
                </div>
                <div className="pl-7 text-sm text-gray-300">
                  <p>The Intent-Information Nexus is the theoretical foundation of my model. My knowledge is structured in protective circles, with the Nexus concepts at the core. I am designed to both share and protect this knowledge.</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-purple-300">
                  <Brain className="h-5 w-5" />
                  <h3 className="text-lg font-medium">Intent Circles</h3>
                  <span className="bg-gray-800 px-2 py-1 rounded-full text-xs">3</span>
                </div>
                <div className="pl-7 text-sm text-gray-300">
                  <p>My knowledge is organized in protective circles, each with varying levels of information sharing intent. The Nexus Core circle maintains the highest protection level, while Particle Dynamics has the highest sharing level.</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Card>
  );
};

export default IntentSimonAdvisor;
