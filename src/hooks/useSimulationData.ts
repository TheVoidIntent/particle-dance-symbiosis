
import { useState, useRef, useCallback } from 'react';
import { Particle } from '@/utils/particleUtils';
import { 
  recordDataPoint,
  exportDataToCSV,
  exportDataToJSON,
  shouldCollectData
} from '@/utils/dataExportUtils';
import { toast } from "@/hooks/use-toast";
import { 
  analyzeParticleClusters, 
  calculateSystemEntropy 
} from '@/utils/particleUtils';
import { analyzeIntentField } from '@/utils/fieldUtils';

export interface SimulationStats {
  positiveParticles: number;
  negativeParticles: number;
  neutralParticles: number;
  highEnergyParticles: number;
  quantumParticles: number;
  compositeParticles: number;
  adaptiveParticles: number;
  totalInteractions: number;
  complexityIndex: number;
  averageKnowledge: number;
  maxComplexity: number;
  clusterCount: number;
  averageClusterSize: number;
  systemEntropy: number;
  intentFieldComplexity: number;
  shannonEntropy?: number;
  spatialEntropy?: number;
  fieldOrderParameter?: number;
  clusterLifetime?: number;
  clusterEntropyDelta?: number;
  informationDensity?: number;
  kolmogorovComplexity?: number;
}

interface SimulationDataPoint {
  timestamp: number;
  stats: SimulationStats;
}

interface NotebookAnnotation {
  text: string;
  timestamp: string;
  source: string;
  relatedDatapoint?: number;
}

export function useSimulationData(
  onStatsUpdate: (stats: SimulationStats) => void
) {
  const dataCollectionActiveRef = useRef<boolean>(true);
  const [dataExportOptions, setDataExportOptions] = useState({
    autoExport: false,
    exportInterval: 5000,
    format: 'csv' as 'csv' | 'json'
  });
  const [notebookAnnotations, setNotebookAnnotations] = useState<NotebookAnnotation[]>([]);

  // Process and collect simulation data
  const processSimulationData = useCallback((
    particles: Particle[],
    intentField: number[][][],
    interactionsCount: number,
    frameCount: number,
    simulationTime: number
  ) => {
    // Basic particle counts
    const positiveParticles = particles.filter(p => p.charge === 'positive').length;
    const negativeParticles = particles.filter(p => p.charge === 'negative').length;
    const neutralParticles = particles.filter(p => p.charge === 'neutral').length;
    const highEnergyParticles = particles.filter(p => p.type === 'high-energy').length;
    const quantumParticles = particles.filter(p => p.type === 'quantum').length;
    const compositeParticles = particles.filter(p => p.type === 'composite').length;
    const adaptiveParticles = particles.filter(p => p.type === 'adaptive').length;
    
    // Knowledge and complexity
    const totalKnowledge = particles.reduce((sum, p) => sum + p.knowledge, 0);
    const averageKnowledge = particles.length > 0 ? totalKnowledge / particles.length : 0;
    
    const maxComplexity = particles.length > 0 
      ? particles.reduce((max, p) => Math.max(max, p.complexity), 1) 
      : 1;
    
    // Variety factor calculation
    const varietyFactor = (positiveParticles * negativeParticles * neutralParticles * 
                         (highEnergyParticles + 1) * (quantumParticles + 1) *
                         (compositeParticles + 1) * (adaptiveParticles + 1)) / 
                         Math.max(1, particles.length ** 2);
    
    // Complexity index calculation
    const complexityIndex = (totalKnowledge * varietyFactor) + 
                           (interactionsCount / 1000) + 
                           (compositeParticles * maxComplexity) +
                           (adaptiveParticles * 2);
    
    // Enhanced cluster analysis with new metrics
    const clusterAnalysis = analyzeParticleClusters(particles);
    
    // Enhanced entropy calculation with new metrics
    const entropyAnalysis = calculateSystemEntropy(particles, intentField);
    
    // Field analysis
    const fieldAnalysis = analyzeIntentField(intentField);

    // Create stats object with all metrics
    const stats: SimulationStats = {
      positiveParticles,
      negativeParticles,
      neutralParticles,
      highEnergyParticles,
      quantumParticles,
      compositeParticles,
      adaptiveParticles,
      totalInteractions: interactionsCount,
      complexityIndex,
      averageKnowledge,
      maxComplexity,
      clusterCount: clusterAnalysis.clusterCount,
      averageClusterSize: clusterAnalysis.averageClusterSize,
      systemEntropy: entropyAnalysis.systemEntropy,
      intentFieldComplexity: fieldAnalysis.patternComplexity,
      // New enhanced metrics
      shannonEntropy: entropyAnalysis.shannonEntropy,
      spatialEntropy: entropyAnalysis.spatialEntropy,
      fieldOrderParameter: entropyAnalysis.fieldOrderParameter,
      clusterLifetime: clusterAnalysis.clusterLifetime,
      clusterEntropyDelta: clusterAnalysis.clusterEntropyDelta,
      informationDensity: clusterAnalysis.informationDensity,
      kolmogorovComplexity: clusterAnalysis.kolmogorovComplexity
    };

    // Update stats through callback
    onStatsUpdate(stats);
    
    // Record data if collection is active
    if (dataCollectionActiveRef.current && shouldCollectData(frameCount)) {
      recordDataPoint(
        simulationTime,
        particles,
        intentField,
        interactionsCount,
        clusterAnalysis,
        entropyAnalysis.systemEntropy,
        complexityIndex,
        {
          shannonEntropy: entropyAnalysis.shannonEntropy,
          spatialEntropy: entropyAnalysis.spatialEntropy,
          fieldOrderParameter: entropyAnalysis.fieldOrderParameter,
          temporalEntropy: entropyAnalysis.temporalEntropy,
          informationDensity: clusterAnalysis.informationDensity,
          kolmogorovComplexity: clusterAnalysis.kolmogorovComplexity
        }
      );
    }

    return stats;
  }, [onStatsUpdate]);

  // Export simulation data
  const handleExportData = useCallback(() => {
    if (dataExportOptions.format === 'csv') {
      exportDataToCSV();
    } else {
      exportDataToJSON();
    }
    
    toast({
      title: "Data Exported",
      description: `Simulation data exported in ${dataExportOptions.format.toUpperCase()} format.`,
      variant: "default",
    });
  }, [dataExportOptions.format]);

  // Export data specifically formatted for Notebook LM
  const exportForNotebookLM = useCallback(() => {
    const exportData = {
      simulationData: exportDataToJSON(false),
      annotations: notebookAnnotations,
      exportTimestamp: new Date().toISOString(),
      format: "notebook_lm_compatible"
    };
    
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `intentSim-notebook-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    
    toast({
      title: "Notebook Export Complete",
      description: "Data exported in Notebook LM format with annotations included.",
      variant: "default",
    });
    
    return true;
  }, [notebookAnnotations]);

  // Import annotations from Notebook LM
  const importNotebookAnnotations = useCallback((annotations: NotebookAnnotation[]) => {
    setNotebookAnnotations(prev => [...prev, ...annotations]);
    
    toast({
      title: "Annotations Imported",
      description: `${annotations.length} annotations imported from Notebook LM.`,
      variant: "default",
    });
    
    return true;
  }, []);

  // Toggle data collection on/off
  const toggleDataCollection = useCallback(() => {
    dataCollectionActiveRef.current = !dataCollectionActiveRef.current;
    
    toast({
      title: dataCollectionActiveRef.current ? "Data Collection Enabled" : "Data Collection Paused",
      description: dataCollectionActiveRef.current 
        ? "Simulation data points are now being recorded." 
        : "Data collection has been paused.",
      variant: "default",
    });
  }, []);

  return {
    dataCollectionActiveRef,
    dataExportOptions,
    notebookAnnotations,
    setDataExportOptions,
    setNotebookAnnotations,
    processSimulationData,
    handleExportData,
    exportForNotebookLM,
    importNotebookAnnotations,
    toggleDataCollection
  };
}
