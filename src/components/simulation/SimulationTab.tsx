
import React from 'react';
import { ParticleCanvas } from '@/components/ParticleCanvas';
import SimulationStats from './SimulationStats';
import { SimulationStats as StatsType } from '@/types/simulation';
import { Button } from "@/components/ui/button";
import { Download, NotebookText, FileText, Upload } from "lucide-react";
import { toast } from "sonner";

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
  const handleExportForNotebook = () => {
    // Create a formatted version of the data specifically for notebook analysis
    const notebookData = {
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
      timestamp: new Date().toISOString(),
      exportType: "notebook_lm_data"
    };
    
    // Create download link
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(notebookData, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `intentSim-notebook-data-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    
    // Save a reference to localStorage so the notebook entries component can find it
    try {
      const existingEntries = localStorage.getItem('notebookLmEntries');
      const entries = existingEntries ? JSON.parse(existingEntries) : [];
      
      // Add a new entry for this export
      const newEntry = {
        id: `export-${Date.now()}`,
        text: `Simulation data with ${stats.positiveParticles + stats.negativeParticles + stats.neutralParticles} particles and complexity index of ${stats.complexityIndex.toFixed(2)}`,
        timestamp: new Date().toISOString(),
        source: "notebook_lm"
      };
      
      entries.unshift(newEntry); // Add to the beginning
      localStorage.setItem('notebookLmEntries', JSON.stringify(entries.slice(0, 20))); // Keep only the latest 20
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
    
    toast.success("Data exported for Notebook LM analysis");
  };
  
  const handleImportFromNotebook = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        if (!e.target?.result) return;
        const result = e.target.result.toString();
        const data = JSON.parse(result);
        
        if (data.annotations && Array.isArray(data.annotations)) {
          // Save the annotations to localStorage
          try {
            const existingEntries = localStorage.getItem('notebookLmEntries');
            const entries = existingEntries ? JSON.parse(existingEntries) : [];
            
            // Add new entries from annotations
            const newEntries = data.annotations.map((anno: any, index: number) => ({
              id: `imported-${Date.now()}-${index}`,
              text: anno.text,
              timestamp: anno.timestamp || new Date().toISOString(),
              source: "notebook_lm",
              audioUrl: anno.audioUrl
            }));
            
            const updatedEntries = [...newEntries, ...entries].slice(0, 20);
            localStorage.setItem('notebookLmEntries', JSON.stringify(updatedEntries));
            
            toast.success(`Imported ${newEntries.length} entries from Notebook LM`);
          } catch (error) {
            console.error('Error saving to localStorage:', error);
            toast.error("Error saving imported data");
          }
        } else {
          toast.error("Invalid file format");
        }
      } catch (error) {
        console.error('Error importing from Notebook LM:', error);
        toast.error("Error parsing imported file");
      }
    };
    
    reader.readAsText(file);
    event.target.value = ''; // Reset the input
  };

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
        <div className="col-span-3 flex flex-wrap justify-end gap-2">
          <Button 
            onClick={() => document.getElementById('import-from-notebook')?.click()} 
            variant="outline" 
            className="bg-purple-900/20"
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
          
          <Button onClick={handleExportForNotebook} variant="outline" className="bg-purple-900/20">
            <NotebookText className="mr-2 h-4 w-4" />
            Export for Notebook LM
          </Button>
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
