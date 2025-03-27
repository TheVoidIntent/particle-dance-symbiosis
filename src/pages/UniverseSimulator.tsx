
import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import SimulationCanvas from '@/components/simulation/SimulationCanvas';
import SimulationControls from '@/components/simulation/SimulationControls';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

const UniverseSimulator: React.FC = () => {
  // Simulation parameters
  const [intentFluctuationRate, setIntentFluctuationRate] = useState(0.01);
  const [maxParticles, setMaxParticles] = useState(100);
  const [particleCreationRate, setParticleCreationRate] = useState(1);
  const [probabilisticIntent, setProbabilisticIntent] = useState(false);
  const [running, setRunning] = useState(true);
  
  // Particle characteristics
  const [positiveChargeBehavior, setPositiveChargeBehavior] = useState(0.8); // Higher values = more interaction
  const [negativeChargeBehavior, setNegativeChargeBehavior] = useState(0.3); // Lower values = less interaction
  const [neutralChargeBehavior, setNeutralChargeBehavior] = useState(0.5); // Middle ground for interaction
  
  // Visualization options
  const [visualizationMode, setVisualizationMode] = useState<'particles' | 'field' | 'both'>('particles');
  
  const { toast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Show welcome toast when component mounts
  useEffect(() => {
    toast({
      title: "Welcome to Universe Simulator",
      description: "Adjust parameters to see how particles emerge and interact based on intent field fluctuations.",
    });
  }, [toast]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-4 md:p-8">
      <Helmet>
        <title>Universe Simulator | Intent Field Simulation</title>
        <meta name="description" content="Explore how particles emerge from intent field fluctuations and interact based on their charge properties." />
      </Helmet>
      
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
        Universe Simulator
      </h1>
      
      <div className="mb-4 text-center max-w-2xl mx-auto">
        <p className="text-gray-300">
          Explore how particles emerge from intent field fluctuations and interact based on their charge characteristics.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-8">
        <div className="lg:col-span-3">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-0">
              <SimulationCanvas 
                intentFluctuationRate={intentFluctuationRate}
                maxParticles={maxParticles}
                particleCreationRate={particleCreationRate}
                positiveChargeBehavior={positiveChargeBehavior}
                negativeChargeBehavior={negativeChargeBehavior}
                neutralChargeBehavior={neutralChargeBehavior}
                probabilisticIntent={probabilisticIntent}
                visualizationMode={visualizationMode}
                running={running}
              />
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-4">
              <Tabs defaultValue="simulation" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-gray-700">
                  <TabsTrigger value="simulation" className="data-[state=active]:bg-indigo-600">
                    Simulation
                  </TabsTrigger>
                  <TabsTrigger value="particles" className="data-[state=active]:bg-indigo-600">
                    Particles
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="simulation">
                  <SimulationControls 
                    intentFluctuationRate={intentFluctuationRate}
                    setIntentFluctuationRate={setIntentFluctuationRate}
                    maxParticles={maxParticles}
                    setMaxParticles={setMaxParticles}
                    particleCreationRate={particleCreationRate}
                    setParticleCreationRate={setParticleCreationRate}
                    probabilisticIntent={probabilisticIntent}
                    setProbabilisticIntent={setProbabilisticIntent}
                    visualizationMode={visualizationMode}
                    setVisualizationMode={setVisualizationMode}
                    running={running}
                    setRunning={setRunning}
                  />
                </TabsContent>
                
                <TabsContent value="particles">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Particle Characteristics</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Positive Charge Behavior (Interaction Tendency)
                        </label>
                        <input 
                          type="range" 
                          min="0" 
                          max="1" 
                          step="0.01" 
                          value={positiveChargeBehavior} 
                          onChange={(e) => setPositiveChargeBehavior(parseFloat(e.target.value))}
                          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                        />
                        <div className="flex justify-between text-xs text-gray-400 mt-1">
                          <span>Low Interaction</span>
                          <span>High Interaction</span>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Negative Charge Behavior (Interaction Tendency)
                        </label>
                        <input 
                          type="range" 
                          min="0" 
                          max="1" 
                          step="0.01" 
                          value={negativeChargeBehavior} 
                          onChange={(e) => setNegativeChargeBehavior(parseFloat(e.target.value))}
                          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                        />
                        <div className="flex justify-between text-xs text-gray-400 mt-1">
                          <span>Low Interaction</span>
                          <span>High Interaction</span>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Neutral Charge Behavior (Interaction Tendency)
                        </label>
                        <input 
                          type="range" 
                          min="0" 
                          max="1" 
                          step="0.01" 
                          value={neutralChargeBehavior} 
                          onChange={(e) => setNeutralChargeBehavior(parseFloat(e.target.value))}
                          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                        />
                        <div className="flex justify-between text-xs text-gray-400 mt-1">
                          <span>Low Interaction</span>
                          <span>High Interaction</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-700">
                      <div className="prose prose-sm prose-invert">
                        <p>
                          These settings control how particles with different charges interact with each other and 
                          exchange information/knowledge in the simulation.
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-4">
              <h3 className="text-lg font-medium mb-2">Simulation Stats</h3>
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                  <div className="text-sm text-gray-400">Positive Particles:</div>
                  <div className="text-sm text-right">0</div>
                  
                  <div className="text-sm text-gray-400">Negative Particles:</div>
                  <div className="text-sm text-right">0</div>
                  
                  <div className="text-sm text-gray-400">Neutral Particles:</div>
                  <div className="text-sm text-right">0</div>
                  
                  <div className="text-sm text-gray-400">Total Interactions:</div>
                  <div className="text-sm text-right">0</div>
                  
                  <div className="text-sm text-gray-400">Average Knowledge:</div>
                  <div className="text-sm text-right">0</div>
                  
                  <div className="text-sm text-gray-400">Complexity Index:</div>
                  <div className="text-sm text-right">0</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="mt-8 max-w-4xl mx-auto bg-gray-800/50 border border-gray-700 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-3">About the Simulation</h2>
        <p className="text-gray-300 mb-4">
          This simulation explores the emergence of particles from fluctuations in an intent field - a theoretical construct representing the universe's inherent drive to know itself.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-gray-700/50 p-3 rounded-md">
            <h3 className="font-medium text-indigo-400 mb-1">Positive Charge</h3>
            <p className="text-gray-300">
              Particles with positive charge have a higher tendency to interact and exchange information, representing the "inquisitive" aspect of the intent.
            </p>
          </div>
          <div className="bg-gray-700/50 p-3 rounded-md">
            <h3 className="font-medium text-purple-400 mb-1">Negative Charge</h3>
            <p className="text-gray-300">
              Particles with negative charge are less inclined to interact, representing the "withdrawn" aspect of the intent field.
            </p>
          </div>
          <div className="bg-gray-700/50 p-3 rounded-md">
            <h3 className="font-medium text-green-400 mb-1">Neutral Charge</h3>
            <p className="text-gray-300">
              Neutral particles have moderate interaction behaviors, balancing between exploration and preservation of information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UniverseSimulator;
