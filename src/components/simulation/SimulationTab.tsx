
import React from 'react';
import { ParticleCanvas } from '@/components/ParticleCanvas';
import SimulationStats from './SimulationStats';
import { SimulationStats as StatsType } from '@/types/simulation';
import { Button } from "@/components/ui/button";
import { Download, NotebookText, FileText, Upload, BookOpen, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { useNotebookIntegration } from '@/hooks/useNotebookIntegration';

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
  const { 
    addAnnotation, 
    importAnnotations, 
    exportForNotebookLM 
  } = useNotebookIntegration();

  const handleAddQuickAnnotation = () => {
    const text = prompt("Enter a quick observation about the current simulation:");
    if (text && text.trim()) {
      addAnnotation(text, stats);
      toast.success("Observation added to notebook");
    }
  };

  const handleExportForNotebook = () => {
    // Create a formatted version of the data specifically for notebook analysis
    const simulationData = {
      simulationParams: {
        intentFluctuationRate,
        maxParticles,
        learningRate,
        particleCreationRate,
        useAdaptiveParticles,
        energyConservation,
        probabilisticIntent
      },
      currentStats: stats,
      timestamp: new Date().toISOString()
    };
    
    exportForNotebookLM(simulationData);
  };
  
  const handleImportFromNotebook = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        importAnnotations(e.target.result.toString());
      }
    };
    
    reader.readAsText(file);
    event.target.value = '';
  };

  const openNotebookApp = () => {
    window.open("https://notebooklm.google/", "_blank");
  };

  // Debug output to help identify the issue
  console.log("SimulationTab stats:", stats);

  return (
    <>
      <div className="relative">
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
        
        {/* Current Particle Count Display */}
        <div className="absolute top-2 right-2 bg-black/50 text-white px-3 py-2 rounded-md text-sm">
          Particles: {stats ? (stats.positiveParticles + stats.negativeParticles + stats.neutralParticles) : 0}
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4 mt-4">
        <SimulationStats stats={stats} />
        <div className="col-span-3 flex flex-wrap justify-end gap-2">
          <Button
            onClick={handleAddQuickAnnotation}
            variant="outline"
            className="bg-purple-900/10"
          >
            <BookOpen className="mr-2 h-4 w-4" />
            Add Observation
          </Button>
          
          <Button 
            onClick={() => document.getElementById('import-from-notebook')?.click()} 
            variant="outline" 
            className="bg-purple-900/10"
          >
            <Upload className="mr-2 h-4 w-4" />
            Import from Notebook LM
          </Button>
          <input 
            id="import-from-notebook" 
            type="file" 
            accept=".json" 
            onChange={handleImportFromNotebook} 
            className="hidden" 
          />
          
          <Button 
            onClick={handleExportForNotebook} 
            variant="outline" 
            className="bg-purple-900/10"
          >
            <NotebookText className="mr-2 h-4 w-4" />
            Export for Notebook LM
          </Button>
          
          <Button 
            onClick={openNotebookApp}
            variant="outline" 
            className="bg-purple-900/10"
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            Open Notebook LM
          </Button>
          
          <Button 
            onClick={handleDownloadData} 
            variant="outline"
          >
            <Download className="mr-2 h-4 w-4" />
            Download Simulation Data
          </Button>
        </div>
      </div>
    </>
  );
};

export default SimulationTab;
