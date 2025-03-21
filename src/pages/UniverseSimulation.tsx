
import React, { useState, useEffect, useCallback } from 'react';
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon, Download, Save } from "lucide-react";
import { ParticleCanvas } from '@/components/ParticleCanvas';
import SimulationData from '@/components/SimulationData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AnomalyEvent } from '@/utils/particleUtils';
import { useToast } from "@/hooks/use-toast";

// Enhanced stats type
interface SimulationStats {
  positiveParticles: number;
  negativeParticles: number;
  neutralParticles: number;
  highEnergyParticles: number;
  quantumParticles: number;
  compositeParticles: number;
  adaptiveParticles: number;
  totalInteractions: number;
  complexityIndex: number;
  averageKnowledge: number;
  maxComplexity: number;
  clusterCount: number;
  averageClusterSize: number;
  systemEntropy: number;
  intentFieldComplexity: number;
}

// Enhanced simulation history
interface SimulationDataPoint {
  timestamp: number;
  stats: SimulationStats;
}

const UniverseSimulation = () => {
  // Simulation parameters
  const [intentFluctuationRate, setIntentFluctuationRate] = useState(0.01);
  const [maxParticles, setMaxParticles] = useState(100);
  const [learningRate, setLearningRate] = useState(0.1);
  const [particleCreationRate, setParticleCreationRate] = useState(1);
  const [viewMode, setViewMode] = useState<'2d' | '3d'>('2d');
  const [renderMode, setRenderMode] = useState<'particles' | 'field' | 'density' | 'combined'>('particles');
  const [useAdaptiveParticles, setUseAdaptiveParticles] = useState(false);
  const [energyConservation, setEnergyConservation] = useState(false);
  const [probabilisticIntent, setProbabilisticIntent] = useState(false);
  const [running, setRunning] = useState(true);
  const [anomalies, setAnomalies] = useState<AnomalyEvent[]>([]);
  const [simulationHistory, setSimulationHistory] = useState<SimulationDataPoint[]>([]);
  const [stats, setStats] = useState<SimulationStats>({
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
    maxComplexity: 1,
    clusterCount: 0,
    averageClusterSize: 0,
    systemEntropy: 0,
    intentFieldComplexity: 0
  });
  const { toast } = useToast();
  
  // Handle anomaly detection
  const handleAnomalyDetected = useCallback((anomaly: AnomalyEvent) => {
    setAnomalies(prev => [...prev.slice(-9), anomaly]);
  }, []);
  
  // Handle stats update
  const handleStatsUpdate = useCallback((newStats: SimulationStats) => {
    setStats(newStats);
    
    // Save history every 10 seconds (approximate)
    if (Math.random() < 0.05) { // ~5% chance each update, assuming updates are about every 0.5s
      setSimulationHistory(prev => {
        const newHistory = [...prev, {
          timestamp: Date.now(),
          stats: { ...newStats }
        }];
        
        // Limit history to last 30 data points to prevent memory issues
        return newHistory.slice(-30);
      });
    }
  }, []);
  
  // Download simulation data
  const handleDownloadData = useCallback(() => {
    if (simulationHistory.length === 0) {
      toast({
        title: "No Data Available",
        description: "Run the simulation longer to generate downloadable data.",
        variant: "destructive",
      });
      return;
    }
    
    const dataStr = JSON.stringify({
      parameters: {
        intentFluctuationRate,
        maxParticles,
        learningRate,
        particleCreationRate,
        useAdaptiveParticles,
        energyConservation,
        probabilisticIntent
      },
      history: simulationHistory,
      anomalies
    }, null, 2);
    
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `universe-simulation-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Data Downloaded",
      description: "Your simulation data has been saved as a JSON file.",
      variant: "default",
    });
  }, [simulationHistory, anomalies, intentFluctuationRate, maxParticles, learningRate, particleCreationRate, useAdaptiveParticles, energyConservation, probabilisticIntent, toast]);
  
  return (
    <div className="min-h-screen bg-background">
      <div className="section-container py-8">
        <h1 className="text-3xl font-bold mb-6">Universe Simulation</h1>
        
        <Alert className="mb-6">
          <InfoIcon className="h-4 w-4" />
          <AlertTitle>Advanced Intent Field Universe Model</AlertTitle>
          <AlertDescription>
            This simulation demonstrates a universe born from intent field fluctuations. 
            Particles now feature advanced interactions including memory effects, 
            reinforcement learning adaptive behaviors, and cluster formation capabilities. 
            The system demonstrates emergent complexity through phase transitions and 
            maintains energy conservation principles.
          </AlertDescription>
        </Alert>

        <Tabs defaultValue="simulation" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="simulation">Live Simulation</TabsTrigger>
            <TabsTrigger value="anomalies">Anomalies & Events</TabsTrigger>
            <TabsTrigger value="data">Historical Data</TabsTrigger>
          </TabsList>
          
          <TabsContent value="simulation">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-card rounded-lg shadow-sm overflow-hidden h-[500px]">
                <ParticleCanvas 
                  intentFluctuationRate={intentFluctuationRate} 
                  maxParticles={maxParticles}
                  learningRate={learningRate}
                  particleCreationRate={particleCreationRate}
                  viewMode={viewMode}
                  renderMode={renderMode}
                  useAdaptiveParticles={useAdaptiveParticles}
                  energyConservation={energyConservation}
                  probabilisticIntent={probabilisticIntent}
                  running={running}
                  onStatsUpdate={handleStatsUpdate}
                  onAnomalyDetected={handleAnomalyDetected}
                />
              </div>
              
              <div className="space-y-6">
                <Card className="p-4">
                  <CardHeader className="p-0 pb-2">
                    <CardTitle className="text-xl">Simulation Controls</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0 space-y-4">
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
                    
                    <div className="space-y-2">
                      <Label>Render Mode</Label>
                      <RadioGroup 
                        value={renderMode} 
                        onValueChange={(value) => setRenderMode(value as 'particles' | 'field' | 'density' | 'combined')}
                        className="grid grid-cols-2 gap-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="particles" id="particles" />
                          <Label htmlFor="particles">Particles</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="field" id="field" />
                          <Label htmlFor="field">Intent Field</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="density" id="density" />
                          <Label htmlFor="density">Density</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="combined" id="combined" />
                          <Label htmlFor="combined">Combined</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-2">
                      <div className="flex items-center space-x-2">
                        <Switch 
                          id="adaptiveParticles" 
                          checked={useAdaptiveParticles} 
                          onCheckedChange={setUseAdaptiveParticles} 
                        />
                        <Label htmlFor="adaptiveParticles">Enable Adaptive Particles</Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch 
                          id="energyConservation" 
                          checked={energyConservation} 
                          onCheckedChange={setEnergyConservation} 
                        />
                        <Label htmlFor="energyConservation">Energy Conservation</Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch 
                          id="probabilisticIntent" 
                          checked={probabilisticIntent} 
                          onCheckedChange={setProbabilisticIntent} 
                        />
                        <Label htmlFor="probabilisticIntent">Probabilistic Intent Fields</Label>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <Button 
                        variant={running ? "destructive" : "default"} 
                        onClick={() => setRunning(!running)}
                      >
                        {running ? "Pause Simulation" : "Resume Simulation"}
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        onClick={handleDownloadData}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Save Data
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="p-4">
                  <CardHeader className="p-0 pb-2">
                    <CardTitle className="text-xl">Particle Statistics</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0 space-y-1 text-sm">
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
                      <span className="text-yellow-500">High-Energy Particles:</span>
                      <span>{stats.highEnergyParticles}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-500">Quantum Particles:</span>
                      <span>{stats.quantumParticles}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-400">Composite Particles:</span>
                      <span>{stats.compositeParticles || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-pink-400">Adaptive Particles:</span>
                      <span>{stats.adaptiveParticles || 0}</span>
                    </div>
                    <div className="border-t border-gray-200 dark:border-gray-800 my-1"></div>
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
                    <div className="border-t border-gray-200 dark:border-gray-800 my-1"></div>
                    <div className="flex justify-between">
                      <span>Cluster Count:</span>
                      <span>{stats.clusterCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Avg. Cluster Size:</span>
                      <span>{stats.averageClusterSize.toFixed(1)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>System Entropy:</span>
                      <span>{stats.systemEntropy.toFixed(3)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Field Complexity:</span>
                      <span>{stats.intentFieldComplexity.toFixed(3)}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="anomalies">
            <Card>
              <CardHeader>
                <CardTitle>Anomalies & Significant Events</CardTitle>
                <CardDescription>
                  System-detected phase transitions, emergent behaviors, and other significant events.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {anomalies.length === 0 ? (
                  <div className="text-center py-10 text-gray-500">
                    <p>No anomalies detected yet.</p>
                    <p className="text-sm mt-2">Continue running the simulation to observe emergent behaviors.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {anomalies.slice().reverse().map((anomaly, index) => (
                      <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium">
                            {anomaly.type.split('_').map(word => 
                              word.charAt(0).toUpperCase() + word.slice(1)
                            ).join(' ')}
                          </h3>
                          <span className="text-xs text-gray-500">t={anomaly.timestamp}</span>
                        </div>
                        <p className="text-sm mb-2">{anomaly.description}</p>
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Affected Particles: {anomaly.affectedParticles}</span>
                          <span>Severity: {(anomaly.severity * 100).toFixed(0)}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="data">
            <SimulationData />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UniverseSimulation;
