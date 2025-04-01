import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { ParticleCanvas } from '@/components/ParticleCanvas';
import SimulationStats from '@/components/simulation/SimulationStats';
import NotebookLmExport from '@/components/NotebookLmExport';
import { SimulationStats as StatsType } from '@/types/simulation';
import { Button } from "@/components/ui/button";
import { FileText, Zap } from "lucide-react";
import { toast } from "sonner";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { setupDailyDataExport, getNearestExportTime } from '@/utils/dailyDataExport';
import { getSimulationStats } from '@/utils/simulation/state';
import { useInflationEvents } from '@/hooks/useInflationEvents';

const initialStats: StatsType = {
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
  const [stats, setStats] = useState<StatsType>(initialStats);
  const [nextExportTime, setNextExportTime] = useState<string>("");
  const [lastExportTime, setLastExportTime] = useState<string>("");
  const { downloadCurrentDataAsPDF } = useInflationEvents();

  useEffect(() => {
    const exportSchedule = setupDailyDataExport({
      onExportStart: () => {
        toast.info("Exporting daily simulation data as PDF...");
      },
      onExportComplete: (filename) => {
        setLastExportTime(new Date().toLocaleTimeString());
        toast.success(`Daily PDF export complete: ${filename}`);
      }
    });

    const updateNextExportTime = () => {
      const nextTime = getNearestExportTime();
      setNextExportTime(nextTime.toLocaleTimeString());
    };

    updateNextExportTime();
    const timeInterval = setInterval(updateNextExportTime, 60000);

    const statsInterval = setInterval(() => {
      const motherStats = getSimulationStats();
      if (motherStats && motherStats.particleCount > 0) {
        setStats(prevStats => ({
          ...prevStats,
          positiveParticles: motherStats.particleTypes.positive,
          negativeParticles: motherStats.particleTypes.negative,
          neutralParticles: motherStats.particleTypes.neutral,
          highEnergyParticles: motherStats.particleTypes.highEnergy,
          quantumParticles: motherStats.particleTypes.quantum,
          compositeParticles: motherStats.particleTypes.composite,
          adaptiveParticles: motherStats.particleTypes.adaptive,
          totalInteractions: motherStats.interactionsCount
        }));
      }
    }, 1000);

    return () => {
      clearInterval(timeInterval);
      clearInterval(statsInterval);
      if (exportSchedule.cleanup) exportSchedule.cleanup();
    };
  }, []);

  const handleStatsUpdate = (newStats: any) => {
    setStats(prevStats => ({
      ...prevStats,
      ...newStats,
      positiveParticles: newStats.positiveParticles ?? prevStats.positiveParticles,
      negativeParticles: newStats.negativeParticles ?? prevStats.negativeParticles,
      neutralParticles: newStats.neutralParticles ?? prevStats.neutralParticles,
      highEnergyParticles: newStats.highEnergyParticles ?? prevStats.highEnergyParticles,
      quantumParticles: newStats.quantumParticles ?? prevStats.quantumParticles,
      compositeParticles: newStats.compositeParticles ?? prevStats.compositeParticles,
      adaptiveParticles: newStats.adaptiveParticles ?? prevStats.adaptiveParticles,
      totalInteractions: newStats.totalInteractions ?? prevStats.totalInteractions,
      averageKnowledge: newStats.averageKnowledge ?? prevStats.averageKnowledge,
      complexityIndex: newStats.complexityIndex ?? prevStats.complexityIndex,
      systemEntropy: newStats.systemEntropy ?? prevStats.systemEntropy
    }));
  };

  const handleDownloadCurrentData = () => {
    downloadCurrentDataAsPDF();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto py-8 px-4">
        <Helmet>
          <title>IntentSim.org | Continuous Universe Simulation</title>
          <meta name="description" content="Continuous simulation exploring universe creation through intent field fluctuations." />
        </Helmet>

        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500">
            IntentSim.org
          </h1>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            Continuously running simulation exploring the emergence of particles from intent field fluctuations.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-10">
          <div className="lg:col-span-3">
            <Card className="mb-4">
              <CardContent className="p-0">
                <div className="relative aspect-video w-full border rounded overflow-hidden">
                  <ParticleCanvas
                    intentFluctuationRate={0.01}
                    maxParticles={200}
                    learningRate={1}
                    particleCreationRate={2}
                    viewMode="2d"
                    renderMode="particles"
                    useAdaptiveParticles={true}
                    energyConservation={false}
                    probabilisticIntent={true}
                    running={true}
                    onStatsUpdate={handleStatsUpdate}
                    onAnomalyDetected={() => {}}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex justify-between items-center">
                  <span>Real-time Simulation Statistics</span>
                  <Button 
                    onClick={handleDownloadCurrentData}
                    variant="outline" 
                    size="sm"
                    className="ml-2"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Download as PDF
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SimulationStats stats={stats} />
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <NotebookLmExport />

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Continuous Data Export</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Zap className="h-4 w-4 text-yellow-400" />
                      <span className="font-medium">Next Export:</span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 ml-6">{nextExportTime || "Calculating..."}</p>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <FileText className="h-4 w-4 text-green-400" />
                      <span className="font-medium">Last Export:</span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 ml-6">
                      {lastExportTime || "No exports yet"}
                    </p>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Simulation data is automatically exported daily as PDF files with detailed metrics for easy viewing in Notebook LM.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">About This Simulation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  This continuous simulation models a proto-universe born from intent field fluctuations. 
                  Particles emerge with different charges based on the fluctuations:
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <span className="h-5 w-5 rounded-full bg-blue-500 mr-2 flex-shrink-0 mt-0.5"></span>
                    <span><strong>Positive charge:</strong> More inclined to interact and exchange information</span>
                  </li>
                  <li className="flex items-start">
                    <span className="h-5 w-5 rounded-full bg-red-500 mr-2 flex-shrink-0 mt-0.5"></span>
                    <span><strong>Negative charge:</strong> Less inclined to interact</span>
                  </li>
                  <li className="flex items-start">
                    <span className="h-5 w-5 rounded-full bg-gray-500 mr-2 flex-shrink-0 mt-0.5"></span>
                    <span><strong>Neutral charge:</strong> Moderate interaction tendency</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UniverseSimulation;
