
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Send, Info, Database, FileText, Brain, Globe } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { knowledgeBase } from '@/utils/knowledge/intentKnowledgeBase';

interface IntentSimonAdvisorProps {
  onClose?: () => void;
}

const IntentSimonAdvisor: React.FC<IntentSimonAdvisorProps> = ({ onClose }) => {
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState<Array<{type: 'user' | 'bot', text: string}>>([
    {type: 'bot', text: "Hello, I'm IntentSim(on). I've been learning about the intent-based universe model from the simulation data and the textbook. How can I help you understand this fascinating model?"}
  ]);
  const [activeTab, setActiveTab] = useState('chat');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);
  
  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    // Add user message to conversation
    setConversation(prev => [...prev, {type: 'user', text: message}]);
    setIsTyping(true);
    
    // Clear input field
    setMessage('');
    
    // Simulate response (in a real app, this would call an API)
    setTimeout(() => {
      generateResponse(message);
      setIsTyping(false);
    }, 1000);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const generateResponse = (query: string) => {
    // Get response from knowledge base
    const { response } = knowledgeBase.generateResponse(query);
    
    // Sample responses based on common intent-related questions
    let finalResponse = response;
    
    if (!finalResponse || finalResponse.includes("I don't have specific information")) {
      const lowerQuery = query.toLowerCase();
      
      if (lowerQuery.includes('intent field') || lowerQuery.includes('what is intent')) {
        finalResponse = "The Intent Field is the foundational conceptual space of our universe model. It represents fluctuations that give rise to particles. Positive fluctuations create positive charges, negative fluctuations create negative charges, and neutral areas create neutral particles. These fluctuations are the source of all matter and energy in the model.";
      } 
      else if (lowerQuery.includes('charge') || lowerQuery.includes('positive') || lowerQuery.includes('negative')) {
        finalResponse = "In our model, particle charge determines interaction behavior. Positive-charged particles have greater intent to interact and exchange information. Negative-charged particles are less inclined to interact. Neutral particles fall somewhere in between. This asymmetry in interaction intent drives complexity in the system.";
      }
      else if (lowerQuery.includes('interaction') || lowerQuery.includes('exchange')) {
        finalResponse = "Particle interactions are fundamental to complexity emergence. When particles interact, they exchange information based on their charge properties. Positively-charged particles readily share and receive information, while negatively-charged ones are more reluctant. These interactions follow specific probabilistic rules derived from the intent field.";
      }
      else if (lowerQuery.includes('simulation') || lowerQuery.includes('model')) {
        finalResponse = "Our simulation models the emergence of complexity from simple intent-based particles. We start with a quantum field of intent fluctuations, which gives rise to particles with varying charges. These particles follow interaction rules based on their intent values, leading to emergent patterns and eventually complex structures.";
      }
      else if (lowerQuery.includes('complex') || lowerQuery.includes('emergence')) {
        finalResponse = "Complexity in our model emerges through interactions and information exchange between particles. Simple rules at the particle level lead to unforeseen patterns and structures at higher levels. We observe how different initial conditions in the intent field lead to different emergent properties, similar to how fundamental forces in our universe lead to the emergence of stars, planets, and eventually life.";
      }
      else if (lowerQuery.includes('nexus') || lowerQuery.includes('information')) {
        finalResponse = "The Information-Intent Nexus is the foundational theory behind our model. It suggests that the universe did not emerge from randomness or fixed physical constants—but from a primordial field of intent interacting with and shaping information. This theory positions intent not as an abstract concept, but as a driving force capable of organizing matter, energy, and meaning.";
      }
      else if (lowerQuery.includes('filter') || lowerQuery.includes('how intent filters')) {
        finalResponse = "Intent acts as a universal information filter by biasing which interactions are more likely to occur between particles. Positive-intent particles are more likely to exchange information, creating information-rich clusters. This filtering mechanism creates patterns in the noise, allowing complexity to emerge from chaos. The way intent filters information is fundamental to the emergence of structure in our model.";
      }
      else {
        finalResponse = "I'm still learning about the intent universe model. Can you be more specific about what aspect you'd like to know about?";
      }
    }
    
    setConversation(prev => [...prev, {type: 'bot', text: finalResponse}]);
  };
  
  return (
    <Card className="h-full overflow-hidden shadow-xl border border-indigo-800/50 bg-gray-900/90 backdrop-blur-sm">
      <CardHeader className="bg-indigo-950 px-4 py-2 flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center overflow-hidden">
            <Globe className="h-5 w-5 text-white" />
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
                <span className="text-indigo-300">52</span>
              </div>
              <div className="flex justify-between">
                <span>Simulation Data:</span>
                <span className="text-emerald-400">9</span>
              </div>
              <div className="flex justify-between">
                <span>Document Info:</span>
                <span className="text-blue-400">20</span>
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
                <div className="font-medium text-sm text-indigo-200">Particle:</div>
                <div className="text-xs text-gray-400">Entities in our model that arise from intent field fluctuations, carrying properties including charg...</div>
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
                          <div className="w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center mr-2">
                            <span className="text-white text-xs">IS</span>
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
                  <span className="bg-gray-800 px-2 py-1 rounded-full text-xs">9</span>
                </div>
                <div className="pl-7 text-sm text-gray-300">
                  <p>Particle interaction patterns, emergent complexity statistics, charge distribution analytics, and simulation state observations.</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-blue-300">
                  <FileText className="h-5 w-5" />
                  <h3 className="text-lg font-medium">Document Knowledge</h3>
                  <span className="bg-gray-800 px-2 py-1 rounded-full text-xs">20</span>
                </div>
                <div className="pl-7 text-sm text-gray-300">
                  <p>Key concepts extracted from "The Intent-Based Universe" textbook including intent field theory, particle properties, interaction mechanisms, and complexity emergence principles.</p>
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
