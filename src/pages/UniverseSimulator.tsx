import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import SimulationCanvas from '@/components/simulation/SimulationCanvas';
import SimulationControls from '@/components/simulation/SimulationControls';
import SimulationStats from '@/components/simulation/SimulationStats';
import SimulationAudioControls from '@/components/simulation/SimulationAudioControls';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useParticleSimulation } from '@/hooks/simulation';
import { useSimpleAudio } from '@/hooks/useSimpleAudio';
import { SimulationStats as StatsType, Particle } from '@/types/simulation';

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
  
  // Audio state
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [audioVolume, setAudioVolume] = useState(0.7);
  
  // Initialize simple audio system
  const simpleAudio = useSimpleAudio(audioEnabled, audioVolume);
  
  // Simulation stats
  const [stats, setStats] = useState<StatsType>({
    particleCount: 0,
    positiveParticles: 0,
    negativeParticles: 0,
    neutralParticles: 0,
    highEnergyParticles: 0,
    quantumParticles: 0,
    compositeParticles: 0,
    adaptiveParticles: 0,
    totalInteractions: 0,
    complexityIndex: 0,
    averageKnowledge: 0,
    maxComplexity: 0,
    clusterCount: 0,
    averageClusterSize: 0,
    systemEntropy: 0,
    intentFieldComplexity: 0
  });

  const { toast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const simulation = useParticleSimulation({
    initialParticleCount: 30,
    config: {
      maxParticles,
      intentFluctuationRate,
      interactionRadius: 30,
      boundaryCondition: 'wrap',
      inflationEnabled: true
    },
    canvasRef
  });

  // Show welcome toast when component mounts
  useEffect(() => {
    toast({
      title: "Welcome to Universe Simulator",
      description: "Adjust parameters to see how particles emerge and interact based on intent field fluctuations.",
    });
  }, [toast]);

  // Update stats when the simulation changes
  useEffect(() => {
    const interval = setInterval(() => {
      if (simulation.particles.length > 0) {
        const positiveParticles = simulation.particles.filter(p => p.charge === 'positive').length;
        const negativeParticles = simulation.particles.filter(p => p.charge === 'negative').length;
        const neutralParticles = simulation.particles.filter(p => p.charge === 'neutral').length;
        const highEnergyParticles = simulation.particles.filter(p => p.type === 'high-energy').length || 0;
        const quantumParticles = simulation.particles.filter(p => p.type === 'quantum').length || 0;
        const compositeParticles = simulation.particles.filter(p => p.type === 'composite').length || 0;
        const adaptiveParticles = simulation.particles.filter(p => p.type === 'adaptive').length || 0;
        
        const totalKnowledge = simulation.particles.reduce((sum, p) => sum + (p.knowledge || 0), 0);
        const averageKnowledge = simulation.particles.length > 0 ? totalKnowledge / simulation.particles.length : 0;
        
        setStats({
          particleCount: simulation.particles.length,
          positiveParticles,
          negativeParticles,
          neutralParticles,
          highEnergyParticles,
          quantumParticles,
          compositeParticles,
          adaptiveParticles,
          totalInteractions: simulation.interactionsCount,
          complexityIndex: simulation.emergenceIndex,
          averageKnowledge,
          maxComplexity: 1,
          clusterCount: 0,
          averageClusterSize: 0,
          systemEntropy: 0,
          intentFieldComplexity: simulation.intentFieldComplexity
        });
      }
    }, 500);
    
    return () => clearInterval(interval);
  }, [simulation]);

  // Toggle simulation based on running state
  useEffect(() => {
    if (running) {
      simulation.startSimulation();
    } else {
      simulation.stopSimulation();
    }
  }, [running, simulation]);

  // Handle particle creation rate
  useEffect(() => {
    if (!running) return;
    
    const createParticlesInterval = setInterval(() => {
      if (simulation.particles.length < maxParticles) {
        const newParticle = simulation.createParticle();
        
        if (audioEnabled) {
          simpleAudio.playSound('creation', { charge: newParticle.charge });
        }
      }
    }, 1000 / particleCreationRate);
    
    return () => clearInterval(createParticlesInterval);
  }, [running, simulation, particleCreationRate, maxParticles, audioEnabled, simpleAudio]);
  
  // Handle audio toggle
  const handleToggleAudio = () => {
    const newState = simpleAudio.toggleAudio();
    setAudioEnabled(newState);
    
    toast({
      title: newState ? "Simulation Audio Enabled" : "Simulation Audio Disabled",
      description: newState 
        ? "You can now hear particles interacting and field fluctuations." 
        : "Simulation will run silently.",
    });
  };
  
  // Handle volume change
  const handleVolumeChange = (value: number) => {
    setAudioVolume(value / 100);
    simpleAudio.updateVolume(value / 100);
  };
  
  // Handle interactions for audio (this would be connected to the canvas)
  const handleParticleInteraction = (particle1: any, particle2: any) => {
    if (audioEnabled) {
      simpleAudio.playSound('interaction', { particle1, particle2 });
    }
  };
  
  // Handle field fluctuations for audio
  const handleFieldFluctuation = (intensity: number, x: number, y: number) => {
    if (audioEnabled) {
      simpleAudio.playSound('fluctuation', { intensity });
    }
  };
  
  // Handle emergence events
  const handleEmergenceEvent = (complexity: number) => {
    if (audioEnabled) {
      simpleAudio.playSound('emergence', { complexity });
    }
  };

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
                className="w-full h-[500px] rounded-md"
                onParticleInteraction={handleParticleInteraction}
                onFieldFluctuation={handleFieldFluctuation}
                onEmergenceEvent={handleEmergenceEvent}
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
                  
                  <SimulationAudioControls
                    audioEnabled={audioEnabled}
                    onToggleAudio={handleToggleAudio}
                    audioVolume={audioVolume * 100}
                    onVolumeChange={handleVolumeChange}
                    isRunning={running}
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
              <SimulationStats stats={stats} />
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
