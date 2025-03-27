
import React, { useState, useEffect, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import MotherSimulationControl from "@/components/MotherSimulationControl";
import { AnomalyEvent } from '@/utils/particleUtils';
import SimulationTab from '@/components/simulation/SimulationTab';
import AnomaliesTab from '@/components/simulation/AnomaliesTab';
import SimulationData from '@/components/SimulationData';
import EntropyAnalysisTab from '@/components/simulation/EntropyAnalysisTab';
import { SimulationStats, SimulationDataPoint } from '@/types/simulation';

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
            <SimulationTab 
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
              stats={stats}
              onStatsUpdate={handleStatsUpdate}
              onAnomalyDetected={handleAnomalyDetected}
              setIntentFluctuationRate={setIntentFluctuationRate}
              setMaxParticles={setMaxParticles}
              setLearningRate={setLearningRate}
              setParticleCreationRate={setParticleCreationRate}
              setViewMode={setViewMode}
              setRenderMode={setRenderMode}
              setUseAdaptiveParticles={setUseAdaptiveParticles}
              setEnergyConservation={setEnergyConservation}
              setProbabilisticIntent={setProbabilisticIntent}
              setRunning={setRunning}
              handleDownloadData={handleDownloadData}
            />
          </TabsContent>
          
          <TabsContent value="anomalies">
            <AnomaliesTab anomalies={anomalies} />
          </TabsContent>
          
          <TabsContent value="data">
            <SimulationData />
          </TabsContent>
          
          <TabsContent value="entropy">
            <EntropyAnalysisTab stats={stats} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UniverseSimulation;
