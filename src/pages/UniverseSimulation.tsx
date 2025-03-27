
import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import MotherSimulationControl from "@/components/MotherSimulationControl";
import { AnomalyEvent } from '@/utils/particleUtils';
import SimulationTab from '@/components/simulation/SimulationTab';
import AnomaliesTab from '@/components/simulation/AnomaliesTab';
import SimulationData from '@/components/SimulationData';
import EntropyAnalysisTab from '@/components/simulation/EntropyAnalysisTab';
import { SimulationStats, SimulationDataPoint } from '@/types/simulation';
import SimulationConfigPanel from '@/components/SimulationConfigPanel';

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
    
    // Provide notification for significant anomalies
    if (anomaly.severity > 0.7) {
      toast({
        title: "Significant Anomaly Detected",
        description: anomaly.description,
        variant: "destructive",
      });
    }
  }, [toast]);

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

  const handleResetSimulation = useCallback(() => {
    setAnomalies([]);
    setSimulationHistory([]);
    toast({
      title: "Simulation Reset",
      description: "The simulation has been reset to initial conditions.",
      variant: "default",
    });
  }, [toast]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <Helmet>
        <title>Universe Simulation | intentSim.org</title>
        <meta name="description" content="Experience interactive simulation of intent field fluctuations creating universe particles" />
      </Helmet>
      
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
            Universe Simulation Explorer
          </h1>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            Explore how universe particles arise from intent field fluctuations and develop complexity through interactions
          </p>
        </div>
        
        {/* Mother Simulation Control - Background Process */}
        <div className="mb-8 bg-card rounded-lg p-6 shadow-sm">
          <h2 className="text-2xl font-bold mb-4">Persistent Simulation</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            This simulation runs in the background, continuously evolving even when you navigate away from this page.
          </p>
          <MotherSimulationControl />
        </div>
        
        {/* Interactive Simulation */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Interactive Simulation</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Experiment with different parameters to see how they affect particle behavior and emergent complexity.
          </p>
          
          <Tabs defaultValue="simulation" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="simulation">Live Simulation</TabsTrigger>
              <TabsTrigger value="anomalies">Anomalies & Events</TabsTrigger>
              <TabsTrigger value="data">Historical Data</TabsTrigger>
              <TabsTrigger value="entropy">Entropy Analysis</TabsTrigger>
            </TabsList>
            
            <TabsContent value="simulation">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3 h-[600px] bg-card rounded-lg shadow-sm overflow-hidden">
                  <div className="w-full h-full">
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
                  </div>
                </div>
                
                <div>
                  <SimulationConfigPanel
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
                    handleResetSimulation={handleResetSimulation}
                  />
                </div>
              </div>
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
        
        {/* Theoretical Background */}
        <div className="bg-card rounded-lg p-6 shadow-sm">
          <h2 className="text-2xl font-bold mb-4">Theoretical Foundation</h2>
          <div className="prose dark:prose-invert max-w-none">
            <p>
              This simulation explores a model where universe particles arise from fluctuations in an intent field - 
              a quantum field with the intrinsic property of "intent to know itself."
            </p>
            <ul className="mt-4 space-y-2">
              <li><strong>Positive Fluctuations:</strong> Result in positively charged particles with higher propensity to interact and share information.</li>
              <li><strong>Negative Fluctuations:</strong> Form negatively charged particles that are more resistant to information exchange.</li>
              <li><strong>Neutral Fluctuations:</strong> Create neutral particles with moderate interaction tendencies.</li>
            </ul>
            <p className="mt-4">
              As particles interact, they gain knowledge and complexity, leading to emergent phenomena and eventually 
              to more complex structures. The system evolves following principles that balance deterministic physics with 
              the inherent "desire to know" embedded in each particle.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UniverseSimulation;
