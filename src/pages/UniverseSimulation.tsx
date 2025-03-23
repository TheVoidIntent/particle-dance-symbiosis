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
import MotherSimulationControl from "@/components/MotherSimulationControl";

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
  shannonEntropy?: number;
  spatialEntropy?: number;
  fieldOrderParameter?: number;
  clusterLifetime?: number;
  clusterEntropyDelta?: number;
  informationDensity?: number;
  kolmogorovComplexity?: number;
}

interface SimulationDataPoint {
  timestamp: number;
  stats: SimulationStats;
}

const UniverseSimulation = () => {
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
    intentFieldComplexity: 0,
    shannonEntropy: 0,
    spatialEntropy: 0,
    fieldOrderParameter: 0,
    clusterLifetime: 0,
    clusterEntropyDelta: 0,
    informationDensity: 0,
    kolmogorovComplexity: 0
  });
  const { toast } = useToast();

  const handleAnomalyDetected = useCallback((anomaly: AnomalyEvent) => {
    setAnomalies(prev => [...prev.slice(-9), anomaly]);
  }, []);

  const handleStatsUpdate = useCallback((newStats: SimulationStats) => {
    setStats(newStats);
    
    if (Math.random() < 0.05) {
      setSimulationHistory(prev => {
        const newHistory = [...prev, {
          timestamp: Date.now(),
          stats: { ...newStats }
        }];
        
        return newHistory.slice(-30);
      });
    }
  }, []);

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-12">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center">Universe Simulation</h1>
        
        {/* Mother Simulation Control */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Persistent Simulation</h2>
          <MotherSimulationControl />
        </div>
        
        {/* Interactive Simulation Controls */}
        <h2 className="text-2xl font-bold mb-4">Interactive Simulation</h2>
        
        <Tabs defaultValue="simulation" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="simulation">Live Simulation</TabsTrigger>
            <TabsTrigger value="anomalies">Anomalies & Events</TabsTrigger>
            <TabsTrigger value="data">Historical Data</TabsTrigger>
            <TabsTrigger value="entropy">Entropy Analysis</TabsTrigger>
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
                    
                    <div className="border-t border-gray-200 dark:border-gray-800 my-1"></div>
                    <div className="flex justify-between text-emerald-500">
                      <span>Shannon Entropy:</span>
                      <span>{stats.shannonEntropy?.toFixed(3) || "0.000"}</span>
                    </div>
                    <div className="flex justify-between text-emerald-500">
                      <span>Spatial Entropy:</span>
                      <span>{stats.spatialEntropy?.toFixed(3) || "0.000"}</span>
                    </div>
                    <div className="flex justify-between text-emerald-500">
                      <span>Field Order:</span>
                      <span>{stats.fieldOrderParameter?.toFixed(3) || "0.000"}</span>
                    </div>
                    <div className="flex justify-between text-emerald-500">
                      <span>Cluster Lifetime:</span>
                      <span>{stats.clusterLifetime?.toFixed(0) || "0"}</span>
                    </div>
                    <div className="flex justify-between text-emerald-500">
                      <span>Info Density:</span>
                      <span>{stats.informationDensity?.toFixed(3) || "0.000"}</span>
                    </div>
                    <div className="flex justify-between text-emerald-500">
                      <span>Kolmogorov:</span>
                      <span>{stats.kolmogorovComplexity?.toFixed(3) || "0.000"}</span>
                    </div>
                    <div className="flex justify-between text-emerald-500">
                      <span>Entropy Delta:</span>
                      <span>{stats.clusterEntropyDelta?.toFixed(3) || "0.000"}</span>
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
          
          <TabsContent value="entropy">
            <Card>
              <CardHeader>
                <CardTitle>Advanced Entropy & Emergence Analysis</CardTitle>
                <CardDescription>
                  In-depth analysis of entropy patterns, clustering behaviors, and information-based emergent properties
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Entropy Analysis</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-card border rounded-lg p-4 text-center">
                        <div className="text-sm text-muted-foreground mb-1">Shannon Entropy</div>
                        <div className="text-2xl font-bold">{stats.shannonEntropy?.toFixed(3) || "0.000"}</div>
                        <div className="text-xs mt-1">Particle Distribution Randomness</div>
                      </div>
                      <div className="bg-card border rounded-lg p-4 text-center">
                        <div className="text-sm text-muted-foreground mb-1">Spatial Entropy</div>
                        <div className="text-2xl font-bold">{stats.spatialEntropy?.toFixed(3) || "0.000"}</div>
                        <div className="text-xs mt-1">Position Distribution Randomness</div>
                      </div>
                      <div className="bg-card border rounded-lg p-4 text-center">
                        <div className="text-sm text-muted-foreground mb-1">Field Order</div>
                        <div className="text-2xl font-bold">{stats.fieldOrderParameter?.toFixed(3) || "0.000"}</div>
                        <div className="text-xs mt-1">Intent Field Alignment (Higher = More Order)</div>
                      </div>
                      <div className="bg-card border rounded-lg p-4 text-center">
                        <div className="text-sm text-muted-foreground mb-1">Entropy Delta</div>
                        <div className={`text-2xl font-bold ${Number(stats.clusterEntropyDelta || 0) < 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {stats.clusterEntropyDelta?.toFixed(3) || "0.000"}
                        </div>
                        <div className="text-xs mt-1">Cluster vs. Non-Cluster Entropy Difference</div>
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-medium mt-6">Clustering Behavior</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-card border rounded-lg p-4 text-center">
                        <div className="text-sm text-muted-foreground mb-1">Cluster Lifetime</div>
                        <div className="text-2xl font-bold">{stats.clusterLifetime?.toFixed(0) || "0"}</div>
                        <div className="text-xs mt-1">Stability of Particle Clusters</div>
                      </div>
                      <div className="bg-card border rounded-lg p-4 text-center">
                        <div className="text-sm text-muted-foreground mb-1">Information Density</div>
                        <div className="text-2xl font-bold">{stats.informationDensity?.toFixed(2) || "0.00"}</div>
                        <div className="text-xs mt-1">Knowledge Concentration in Clusters</div>
                      </div>
                      <div className="bg-card border rounded-lg p-4 text-center">
                        <div className="text-sm text-muted-foreground mb-1">Kolmogorov Complexity</div>
                        <div className="text-2xl font-bold">{stats.kolmogorovComplexity?.toFixed(3) || "0.000"}</div>
                        <div className="text-xs mt-1">System Pattern Complexity</div>
                      </div>
                      <div className="bg-card border rounded-lg p-4 text-center">
                        <div className="text-sm text-muted-foreground mb-1">Active Clusters</div>
                        <div className="text-2xl font-bold">{stats.clusterCount}</div>
                        <div className="text-xs mt-1">Number of Stable Particle Groups</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Interpretation Guide</h3>
                    <div className="bg-muted rounded-lg p-4 space-y-3">
                      <div>
                        <h4 className="font-medium">Shannon Entropy vs Spatial Entropy</h4>
                        <p className="text-sm">
                          Shannon entropy measures disorder in particle types/charges, while spatial entropy measures
                          evenness of particle distribution across space. Lower values indicate more ordered systems.
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium">Negative Entropy Delta</h4>
                        <p className="text-sm">
                          A negative entropy delta means clusters have lower entropy than unclustered particles,
                          suggesting self-organization rather than random grouping. This indicates intent-driven
                          pattern formation.
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium">Information Density & Gravity-Like Effects</h4>
                        <p className="text-sm">
                          High information density in clusters can create gravity-like effects, pulling in other particles.
                          This demonstrates how knowledge/intent can behave similar to a physical force.
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium">Field Order Parameter</h4>
                        <p className="text-sm">
                          Values near 1 indicate an ordered, aligned intent field, while values near 0 indicate a more
                          random, chaotic field. Phase transitions often correlate with sudden changes in this value.
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium">Kolmogorov Complexity</h4>
                        <p className="text-sm">
                          Measures how "compressible" the system's pattern is. Higher values indicate more
                          complex, sophisticated patterns that can't be easily described with simple rules.
                        </p>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4 mt-6">
                      <h3 className="text-lg font-medium mb-2">Real-Time Analysis</h3>
                      <p className="text-sm mb-3">
                        Current system state assessment based on entropy metrics:
                      </p>
                      <div className="bg-card p-3 rounded text-sm">
                        {stats.shannonEntropy && stats.spatialEntropy && stats.fieldOrderParameter ? (
                          stats.shannonEntropy < 0.3 && stats.fieldOrderParameter > 0.7 ? (
                            <span className="text-green-500">
                              Highly ordered system with strong intent field alignment. Structural stability is high.
                            </span>
                          ) : stats.shannonEntropy > 0.7 && stats.fieldOrderParameter < 0.3 ? (
                            <span className="text-red-500">
                              Highly chaotic system with minimal structure. Random interactions dominate.
                            </span>
                          ) : stats.clusterEntropyDelta && stats.clusterEntropyDelta < -0.2 ? (
                            <span className="text-blue-500">
                              Intent-driven self-organization detected. Clusters show significantly more order than surroundings.
                            </span>
                          ) : stats.informationDensity && stats.informationDensity > 5 ? (
                            <span className="text-purple-500">
                              High information gravity detected. Knowledge is concentrating in specific regions.
                            </span>
                          ) : (
                            <span>
                              Balanced system with moderate order and chaos. Normal evolution patterns.
                            </span>
                          )
                        ) : (
                          <span>Gathering data for analysis...</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UniverseSimulation;
