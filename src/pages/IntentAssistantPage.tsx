import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import IntentAssistant from '@/components/IntentAssistant';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Brain, Cpu, Database, FileText, Code, Zap, MessageSquare, Sparkles } from 'lucide-react';

const IntentAssistantPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('assistant');
  const [assistantAdvice, setAssistantAdvice] = useState<string[]>([]);
  
  const handleAdvice = (advice: string) => {
    setAssistantAdvice(prev => [advice, ...prev].slice(0, 5));
    toast.success("New recommendation received");
  };
  
  return (
    <>
      <Helmet>
        <title>Intent Personal Assistant | IntentSim</title>
        <meta name="description" content="Personal assistant powered by IntentSim data and Information-Intent Nexus" />
      </Helmet>
      
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          <div className="w-full md:w-2/3">
            <h1 className="text-3xl font-bold mb-2 text-blue-700">Intent Personal Assistant</h1>
            <p className="text-gray-600 mb-6">
              Your personal AI assistant trained on all IntentSim data, Information-Intent Nexus framework, 
              and ATLAS/CERN datasets to help advance the scientific model.
            </p>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-6">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="assistant" className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Assistant
                </TabsTrigger>
                <TabsTrigger value="tasks" className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Tasks
                </TabsTrigger>
                <TabsTrigger value="advisor" className="flex items-center gap-2">
                  <Cpu className="w-4 h-4" />
                  Advisor
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="assistant">
                <IntentAssistant onAdvice={handleAdvice} />
              </TabsContent>
              
              <TabsContent value="tasks">
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">Intent-Driven Tasks</CardTitle>
                    <CardDescription className="text-gray-300">
                      Tasks prioritized based on IntentSim advancement
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-4">
                      <li className="bg-slate-700 p-3 rounded-md flex justify-between items-center">
                        <div className="flex items-center">
                          <Badge className="mr-3 bg-green-600">Coding</Badge>
                          <span className="text-white">Refactor particle interaction code</span>
                        </div>
                        <Button variant="outline" size="sm" className="bg-transparent text-white border-white/20 hover:bg-white/10">
                          Start
                        </Button>
                      </li>
                      <li className="bg-slate-700 p-3 rounded-md flex justify-between items-center">
                        <div className="flex items-center">
                          <Badge className="mr-3 bg-amber-600">Research</Badge>
                          <span className="text-white">Draft paper on intent field fluctuations</span>
                        </div>
                        <Button variant="outline" size="sm" className="bg-transparent text-white border-white/20 hover:bg-white/10">
                          Start
                        </Button>
                      </li>
                      <li className="bg-slate-700 p-3 rounded-md flex justify-between items-center">
                        <div className="flex items-center">
                          <Badge className="mr-3 bg-purple-600">Integration</Badge>
                          <span className="text-white">Connect ATLAS dataset to neural network</span>
                        </div>
                        <Button variant="outline" size="sm" className="bg-transparent text-white border-white/20 hover:bg-white/10">
                          Start
                        </Button>
                      </li>
                      <li className="bg-slate-700 p-3 rounded-md flex justify-between items-center">
                        <div className="flex items-center">
                          <Badge className="mr-3 bg-blue-600">Promotion</Badge>
                          <span className="text-white">Create visualization of Circles of Intent</span>
                        </div>
                        <Button variant="outline" size="sm" className="bg-transparent text-white border-white/20 hover:bg-white/10">
                          Start
                        </Button>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="advisor">
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white">Intent Project Advisor</CardTitle>
                    <CardDescription className="text-gray-300">
                      Recommendations based on simulation insights and research trends
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {assistantAdvice.length > 0 ? (
                        assistantAdvice.map((advice, index) => (
                          <div key={index} className="bg-slate-700 p-3 rounded-md">
                            <div className="flex items-center mb-2">
                              <Sparkles className="h-5 w-5 text-yellow-400 mr-2" />
                              <span className="text-white font-medium">Recommendation {index + 1}</span>
                            </div>
                            <p className="text-gray-300 text-sm">{advice}</p>
                          </div>
                        ))
                      ) : (
                        <div className="bg-slate-700 p-4 rounded-md text-center text-gray-400">
                          <p>No recommendations yet. Chat with the assistant to generate insights.</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="w-full md:w-1/3 space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-lg">Data Sources</CardTitle>
                <CardDescription className="text-gray-300">
                  Knowledge integrated into assistant
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <Database className="h-5 w-5 text-blue-400 mr-3" />
                    <div>
                      <p className="text-white text-sm font-medium">IntentSim Simulation Data</p>
                      <p className="text-gray-400 text-xs">300+ simulation runs with parameters</p>
                    </div>
                  </li>
                  <li className="flex items-center">
                    <Brain className="h-5 w-5 text-purple-400 mr-3" />
                    <div>
                      <p className="text-white text-sm font-medium">Information-Intent Nexus</p>
                      <p className="text-gray-400 text-xs">Theoretical framework documentation</p>
                    </div>
                  </li>
                  <li className="flex items-center">
                    <Zap className="h-5 w-5 text-yellow-400 mr-3" />
                    <div>
                      <p className="text-white text-sm font-medium">ATLAS/CERN Datasets</p>
                      <p className="text-gray-400 text-xs">Public particle physics data</p>
                    </div>
                  </li>
                  <li className="flex items-center">
                    <FileText className="h-5 w-5 text-green-400 mr-3" />
                    <div>
                      <p className="text-white text-sm font-medium">Notebook LM Mindmaps</p>
                      <p className="text-gray-400 text-xs">Circles of Intent relationship mapping</p>
                    </div>
                  </li>
                  <li className="flex items-center">
                    <Code className="h-5 w-5 text-red-400 mr-3" />
                    <div>
                      <p className="text-white text-sm font-medium">IntentSim Codebase</p>
                      <p className="text-gray-400 text-xs">Full source code and documentation</p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-lg">Intent Metrics</CardTitle>
                <CardDescription className="text-gray-300">
                  Current simulation insights
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 text-sm">Complexity Index:</span>
                    <span className="text-green-400 font-medium">8.7/10</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 text-sm">Knowledge Transfer:</span>
                    <span className="text-blue-400 font-medium">92%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 text-sm">Intent Field Stability:</span>
                    <span className="text-yellow-400 font-medium">76%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 text-sm">Entropy Gradient:</span>
                    <span className="text-purple-400 font-medium">0.43</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 text-sm">System Self-Organization:</span>
                    <span className="text-red-400 font-medium">High</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default IntentAssistantPage;
