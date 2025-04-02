
import React, { useState } from 'react';
import { SimulationControlButtons } from '@/components/SimulationControlButtons';
import SimulationAudioControls from '@/components/simulation/SimulationAudioControls';
import AtlasDataSelector from '@/components/simulation/AtlasDataSelector';
import AtlasDataDisplay from '@/components/simulation/AtlasDataDisplay';
import NeuralIntentSimulation from '@/components/simulation/NeuralIntentSimulation';
import { Particle } from '@/utils/particleUtils';
import { SimulationStats } from '@/hooks/useSimulationData';
import { fetchAtlasData, AtlasDataset } from '@/utils/atlasDataIntegration';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type ParticleControlsProps = {
  particles: Particle[];
  stats: SimulationStats;
  isRunning: boolean;
  dataCollectionActive: boolean;
  onExportData: () => void;
  onToggleDataCollection: () => void;
  onResetSimulation: () => Particle[]; // Explicit return type of Particle[]
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
  const [atlasDataset, setAtlasDataset] = useState<AtlasDataset | null>(null);
  const [isLoadingAtlasData, setIsLoadingAtlasData] = useState(false);
  const [activeTab, setActiveTab] = useState('atlas');
  
  const handleAtlasDatasetSelected = async (datasetId: string) => {
    try {
      setIsLoadingAtlasData(true);
      const dataset = await fetchAtlasData(datasetId);
      setAtlasDataset(dataset);
      
      // Display success message
      toast.success(`ATLAS dataset loaded: ${dataset?.name || "Unknown dataset"}`, {
        description: `Successfully loaded ${dataset?.particles.length || 0} particles from CERN's ATLAS experiment.`
      });
      
      return dataset;
    } catch (error) {
      console.error("Error loading ATLAS dataset:", error);
      toast.error("Failed to load ATLAS dataset");
      return null;
    } finally {
      setIsLoadingAtlasData(false);
    }
  };
  
  return (
    <>
      <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm p-3 rounded-lg w-80 z-10">
        <SimulationAudioControls 
          particles={particles} 
          stats={stats}
          isRunning={isRunning}
        />
      </div>
      
      <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm p-3 rounded-lg w-80 z-10">
        <Tabs defaultValue="atlas" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 mb-2">
            <TabsTrigger value="atlas">ATLAS Data</TabsTrigger>
            <TabsTrigger value="neural">Neural Intent</TabsTrigger>
          </TabsList>
          
          <TabsContent value="atlas" className="mt-0">
            <AtlasDataSelector 
              onDatasetSelected={handleAtlasDatasetSelected}
              isLoading={isLoadingAtlasData}
            />
            {atlasDataset && (
              <div className="mt-3">
                <AtlasDataDisplay dataset={atlasDataset} />
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="neural" className="mt-0">
            <NeuralIntentSimulation
              particles={particles}
              stats={stats}
              isRunning={isRunning}
            />
          </TabsContent>
        </Tabs>
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
