
import { useCallback, useState, useEffect } from 'react';
import { useSimpleAudio } from './useSimpleAudio';
import { exportSimulationDataToPDF } from '@/utils/notebookExportUtils';
import { SimulationState } from '@/utils/simulation/state';

export interface NotebookLmConfig {
  notebookId?: string;
  apiKey?: string;
  isEnabled: boolean;
  autoExport: boolean;
  exportInterval: number; // minutes
  includeAudioData: boolean;
}

// Define the shape of the export data to avoid TypeScript errors
interface ExportData {
  simulation: any;
  timestamp: string;
  exportType: string;
  audio?: any; // Make audio property optional
}

/**
 * Hook for integration with NotebookLM
 */
export function useNotebookLmIntegration() {
  const { exportAudioData } = useSimpleAudio(false); // Don't enable audio just for export
  const [config, setConfig] = useState<NotebookLmConfig>(() => {
    // Try to load saved config
    try {
      const savedConfig = localStorage.getItem('notebookLmConfig');
      return savedConfig ? JSON.parse(savedConfig) : {
        notebookId: 'default-notebook',
        isEnabled: true,
        autoExport: false,
        exportInterval: 30,
        includeAudioData: true
      };
    } catch (e) {
      console.error("Error loading NotebookLM config:", e);
      return {
        notebookId: 'default-notebook',
        isEnabled: true,
        autoExport: false,
        exportInterval: 30,
        includeAudioData: true
      };
    }
  });

  // Save config changes
  useEffect(() => {
    try {
      localStorage.setItem('notebookLmConfig', JSON.stringify(config));
    } catch (e) {
      console.error("Error saving NotebookLM config:", e);
    }
  }, [config]);

  /**
   * Export data for NotebookLM
   */
  const onExportForNotebook = useCallback(async (simulationData?: any) => {
    console.log("Exporting data for NotebookLM");
    
    // Combine simulation data with audio data if enabled
    const exportData: ExportData = {
      simulation: simulationData || {},
      timestamp: new Date().toISOString(),
      exportType: "manual"
    };
    
    if (config.includeAudioData) {
      exportData.audio = exportAudioData();
    }
    
    // Log the data we're exporting
    console.log("Export data for NotebookLM:", exportData);
    
    return exportData;
  }, [config.includeAudioData, exportAudioData]);

  /**
   * Export simulation data
   */
  const exportSimulationData = useCallback(async (simulationState?: SimulationState) => {
    console.log("Exporting simulation data");
    
    // Create export package
    const exportData = await onExportForNotebook(simulationState);
    
    // Export to PDF
    if (simulationState) {
      try {
        const pdfFilename = await exportSimulationDataToPDF(simulationState);
        console.log(`Simulation data exported to PDF: ${pdfFilename}`);
        return true;
      } catch (error) {
        console.error("Failed to export simulation data to PDF:", error);
        return false;
      }
    }
    
    return true;
  }, [onExportForNotebook]);

  /**
   * Open NotebookLM with current data
   */
  const openNotebookLm = useCallback(() => {
    console.log("Opening NotebookLM with current data");
    
    // Implementation would open NotebookLM with the current data
    // For now, we'll just simulate this
    const notebookUrl = config.notebookId 
      ? `https://notebooklm.google.com/notebook/${config.notebookId}`
      : 'https://notebooklm.google.com/';
    
    // Open in new tab
    window.open(notebookUrl, '_blank');
    
    return true;
  }, [config.notebookId]);

  /**
   * Update NotebookLM configuration
   */
  const updateConfig = useCallback((newConfig: Partial<NotebookLmConfig>) => {
    setConfig(prev => ({
      ...prev,
      ...newConfig
    }));
  }, []);

  return {
    onExportForNotebook,
    exportSimulationData,
    openNotebookLm,
    notebookLmConfig: config,
    updateConfig
  };
}
