
import React, { useState, useEffect, useRef } from 'react';
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import { ParticleCanvas } from '@/components/ParticleCanvas';

const UniverseSimulation = () => {
  // Simulation parameters
  const [intentFluctuationRate, setIntentFluctuationRate] = useState(0.01);
  const [maxParticles, setMaxParticles] = useState(100);
  const [learningRate, setLearningRate] = useState(0.1);
  const [particleCreationRate, setParticleCreationRate] = useState(1);
  const [viewMode, setViewMode] = useState<'2d' | '3d'>('2d');
  const [running, setRunning] = useState(true);
  const [stats, setStats] = useState({
    positiveParticles: 0,
    negativeParticles: 0,
    neutralParticles: 0,
    highEnergyParticles: 0,
    quantumParticles: 0,
    totalInteractions: 0,
    complexityIndex: 0
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="section-container py-8">
        <h1 className="text-3xl font-bold mb-6">Universe Simulation</h1>
        
        <Alert className="mb-6">
          <InfoIcon className="h-4 w-4" />
          <AlertTitle>Intent Field Universe Model</AlertTitle>
          <AlertDescription>
            This simulation demonstrates a universe born from intent field fluctuations. 
            Particles arise from these fluctuations and are imprinted with the "intent to know," 
            causing them to explore and interact. Particles can now exchange information to form 
            composite structures with greater complexity, allowing the system to evolve into more 
            sophisticated configurations.
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-card rounded-lg shadow-sm overflow-hidden h-[500px]">
            <ParticleCanvas 
              intentFluctuationRate={intentFluctuationRate} 
              maxParticles={maxParticles}
              learningRate={learningRate}
              particleCreationRate={particleCreationRate}
              viewMode={viewMode}
              running={running}
              onStatsUpdate={setStats}
            />
          </div>
          
          <div className="space-y-6 bg-card p-6 rounded-lg shadow-sm">
            <div>
              <h2 className="text-xl font-semibold mb-4">Simulation Controls</h2>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="intentFluctuation">Intent Fluctuation Rate</Label>
                    <span className="text-sm text-muted-foreground">{intentFluctuationRate}</span>
                  </div>
                  <Slider 
                    id="intentFluctuation"
                    min={0.001} 
                    max={0.05} 
                    step={0.001} 
                    value={[intentFluctuationRate]} 
                    onValueChange={(value) => setIntentFluctuationRate(value[0])} 
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="maxParticles">Maximum Particles</Label>
                    <span className="text-sm text-muted-foreground">{maxParticles}</span>
                  </div>
                  <Slider 
                    id="maxParticles"
                    min={10} 
                    max={300} 
                    step={10} 
                    value={[maxParticles]} 
                    onValueChange={(value) => setMaxParticles(value[0])} 
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="learningRate">Learning Rate</Label>
                    <span className="text-sm text-muted-foreground">{learningRate}</span>
                  </div>
                  <Slider 
                    id="learningRate"
                    min={0.01} 
                    max={0.5} 
                    step={0.01} 
                    value={[learningRate]} 
                    onValueChange={(value) => setLearningRate(value[0])} 
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="particleCreationRate">Particle Creation Rate</Label>
                    <span className="text-sm text-muted-foreground">{particleCreationRate}</span>
                  </div>
                  <Slider 
                    id="particleCreationRate"
                    min={0.1} 
                    max={5} 
                    step={0.1} 
                    value={[particleCreationRate]} 
                    onValueChange={(value) => setParticleCreationRate(value[0])} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>View Mode</Label>
                  <RadioGroup 
                    value={viewMode} 
                    onValueChange={(value) => setViewMode(value as '2d' | '3d')}
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="2d" id="2d" />
                      <Label htmlFor="2d">2D</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="3d" id="3d" />
                      <Label htmlFor="3d">3D</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <Button 
                  variant={running ? "destructive" : "default"} 
                  className="w-full"
                  onClick={() => setRunning(!running)}
                >
                  {running ? "Pause Simulation" : "Resume Simulation"}
                </Button>
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-4">Statistics</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Positive Particles:</span>
                  <span>{stats.positiveParticles}</span>
                </div>
                <div className="flex justify-between">
                  <span>Negative Particles:</span>
                  <span>{stats.negativeParticles}</span>
                </div>
                <div className="flex justify-between">
                  <span>Neutral Particles:</span>
                  <span>{stats.neutralParticles}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-yellow-500 font-medium">High-Energy Particles:</span>
                  <span>{stats.highEnergyParticles}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-500 font-medium">Quantum Particles:</span>
                  <span>{stats.quantumParticles}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-400 font-medium">Composite Particles:</span>
                  <span>{stats.compositeParticles || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Interactions:</span>
                  <span>{stats.totalInteractions}</span>
                </div>
                <div className="flex justify-between">
                  <span>Complexity Index:</span>
                  <span>{stats.complexityIndex.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Avg. Knowledge:</span>
                  <span>{stats.averageKnowledge ? stats.averageKnowledge.toFixed(2) : '0.00'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Max Complexity:</span>
                  <span>{stats.maxComplexity ? stats.maxComplexity.toFixed(1) : '1.0'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UniverseSimulation;
