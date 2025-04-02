
import React from 'react';
import { SimulationControlButtons } from '@/components/SimulationControlButtons';
import SimulationAudioControls from '@/components/simulation/SimulationAudioControls';
import { Particle } from '@/utils/particleUtils';
import { SimulationStats } from '@/hooks/useSimulationData';

type ParticleControlsProps = {
  particles: Particle[];
  stats: SimulationStats;
  isRunning: boolean;
  dataCollectionActive: boolean;
  onExportData: () => void;
  onToggleDataCollection: () => void;
  onResetSimulation: () => any[];
};

export const ParticleControls: React.FC<ParticleControlsProps> = ({
  particles,
  stats,
  isRunning,
  dataCollectionActive,
  onExportData,
  onToggleDataCollection,
  onResetSimulation
}) => {
  return (
    <>
      <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm p-3 rounded-lg w-80 z-10">
        <SimulationAudioControls 
          particles={particles} 
          stats={stats}
          isRunning={isRunning}
        />
      </div>
      
      <SimulationControlButtons 
        dataCollectionActive={dataCollectionActive}
        onExportData={onExportData}
        onToggleDataCollection={onToggleDataCollection}
        onResetSimulation={onResetSimulation}
      />
    </>
  );
};
