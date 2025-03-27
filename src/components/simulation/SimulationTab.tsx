
import React from 'react';
import { ParticleCanvas } from '@/components/ParticleCanvas';
import SimulationStats from './SimulationStats';
import { SimulationStats as StatsType } from '@/types/simulation';
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface SimulationTabProps {
  intentFluctuationRate: number;
  maxParticles: number;
  learningRate: number;
  particleCreationRate: number;
  viewMode: '2d' | '3d';
  renderMode: 'particles' | 'field' | 'density' | 'combined';
  useAdaptiveParticles: boolean;
  energyConservation: boolean;
  probabilisticIntent: boolean;
  running: boolean;
  stats: StatsType;
  onStatsUpdate: (stats: StatsType) => void;
  onAnomalyDetected: (anomaly: any) => void;
  setIntentFluctuationRate: (value: number) => void;
  setMaxParticles: (value: number) => void;
  setLearningRate: (value: number) => void;
  setParticleCreationRate: (value: number) => void;
  setViewMode: (value: '2d' | '3d') => void;
  setRenderMode: (value: 'particles' | 'field' | 'density' | 'combined') => void;
  setUseAdaptiveParticles: (value: boolean) => void;
  setEnergyConservation: (value: boolean) => void;
  setProbabilisticIntent: (value: boolean) => void;
  setRunning: (value: boolean) => void;
  handleDownloadData: () => void;
}

const SimulationTab: React.FC<SimulationTabProps> = ({
  intentFluctuationRate,
  maxParticles,
  learningRate,
  particleCreationRate,
  viewMode,
  renderMode,
  useAdaptiveParticles,
  energyConservation,
  probabilisticIntent,
  running,
  stats,
  onStatsUpdate,
  onAnomalyDetected,
  setIntentFluctuationRate,
  setMaxParticles,
  setLearningRate,
  setParticleCreationRate,
  setViewMode,
  setRenderMode,
  setUseAdaptiveParticles,
  setEnergyConservation,
  setProbabilisticIntent,
  setRunning,
  handleDownloadData
}) => {
  return (
    <>
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
        onStatsUpdate={onStatsUpdate}
        onAnomalyDetected={onAnomalyDetected}
      />
      
      <div className="grid grid-cols-3 gap-4 mt-4">
        <SimulationStats stats={stats} />
        <div className="col-span-3 flex justify-end">
          <Button onClick={handleDownloadData} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Download Simulation Data
          </Button>
        </div>
      </div>
    </>
  );
};

export default SimulationTab;
