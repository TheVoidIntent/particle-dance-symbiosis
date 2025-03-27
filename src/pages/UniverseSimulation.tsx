
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SimulationTab from '@/components/simulation/SimulationTab';
import SimulationControls from '@/components/simulation/SimulationControls';
import NotebookAnnotations from '@/components/NotebookAnnotations';
import NotebookInsights from '@/components/simulation/NotebookInsights';
import { SimulationStats } from '@/types/simulation';
import { exportDataToJSON } from '@/utils/dataExportUtils';

const initialStats: SimulationStats = {
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
  intentFieldComplexity: 0,
  shannonEntropy: 0,
  spatialEntropy: 0,
  fieldOrderParameter: 0,
  clusterLifetime: 0,
  clusterEntropyDelta: 0,
  informationDensity: 0,
  kolmogorovComplexity: 0
};

const UniverseSimulation: React.FC = () => {
  const [intentFluctuationRate, setIntentFluctuationRate] = useState<number>(0.01);
  const [maxParticles, setMaxParticles] = useState<number>(100);
  const [learningRate, setLearningRate] = useState<number>(1);
  const [particleCreationRate, setParticleCreationRate] = useState<number>(1);
  const [viewMode, setViewMode] = useState<'2d' | '3d'>('2d');
  const [renderMode, setRenderMode] = useState<'particles' | 'field' | 'density' | 'combined'>('particles');
  const [useAdaptiveParticles, setUseAdaptiveParticles] = useState<boolean>(false);
  const [energyConservation, setEnergyConservation] = useState<boolean>(false);
  const [probabilisticIntent, setProbabilisticIntent] = useState<boolean>(false);
  const [running, setRunning] = useState<boolean>(true);
  const [stats, setStats] = useState<SimulationStats>(initialStats);
  const [activeTab, setActiveTab] = useState<string>("simulation");

  // Debug output to track stats updates
  useEffect(() => {
    console.log("Current stats in UniverseSimulation:", stats);
  }, [stats]);

  const handleStatsUpdate = (newStats: SimulationStats) => {
    console.log("Stats update received:", newStats);
    setStats(newStats);
  };

  const handleAnomalyDetected = (anomaly: any) => {
    console.log('Anomaly detected:', anomaly);
  };

  const handleDownloadData = () => {
    exportDataToJSON();
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Helmet>
        <title>Universe Simulation | Intent Field Fluctuations</title>
        <meta name="description" content="Explore universe creation through intent field fluctuations in this interactive simulation." />
      </Helmet>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500">
          Universe Simulation
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Explore the emergence of particles from intent field fluctuations and observe complex behaviors.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <SimulationControls
            intentFluctuationRate={intentFluctuationRate}
            setIntentFluctuationRate={setIntentFluctuationRate}
            maxParticles={maxParticles}
            setMaxParticles={setMaxParticles}
            particleCreationRate={particleCreationRate}
            setParticleCreationRate={setParticleCreationRate}
            probabilisticIntent={probabilisticIntent}
            setProbabilisticIntent={setProbabilisticIntent}
            visualizationMode={'particles'} 
            setVisualizationMode={() => {}}
            running={running}
            setRunning={setRunning}
          />
          
          <NotebookInsights className="mt-6" />
        </div>

        <div className="lg:col-span-3">
          <Tabs 
            defaultValue="simulation" 
            value={activeTab} 
            onValueChange={setActiveTab} 
            className="w-full"
          >
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="simulation">Simulation</TabsTrigger>
              <TabsTrigger value="notebook">Notebook LM</TabsTrigger>
            </TabsList>
            <TabsContent value="simulation" className="border rounded-md p-4">
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
            <TabsContent value="notebook" className="border rounded-md p-4">
              <NotebookAnnotations currentStats={stats} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default UniverseSimulation;
