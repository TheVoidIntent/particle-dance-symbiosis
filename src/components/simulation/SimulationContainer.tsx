
import React from 'react';
import { ParticleCanvas } from '@/components/ParticleCanvas';
import { SimulationStats } from '@/hooks/useSimulationData';
import { AnomalyEvent } from '@/utils/particleUtils';

type SimulationContainerProps = {
  intentFluctuationRate: number;
  maxParticles: number;
  learningRate: number;
  particleCreationRate: number;
  viewMode: '2d' | '3d';
  running: boolean;
  renderMode: 'particles' | 'field' | 'density' | 'combined';
  useAdaptiveParticles: boolean;
  energyConservation: boolean;
  probabilisticIntent: boolean;
  onStatsUpdate: (stats: SimulationStats) => void;
  onAnomalyDetected?: (anomaly: AnomalyEvent) => void;
};

export const SimulationContainer: React.FC<SimulationContainerProps> = (props) => {
  return (
    <div className="w-full h-full relative overflow-hidden">
      <ParticleCanvas {...props} />
    </div>
  );
};
