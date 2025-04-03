
import { useCallback, useState } from 'react';
import { useInflationEvents } from './useInflationEvents';

export interface NotebookLmConfig {
  notebookId: string;
  accessToken?: string;
  userName?: string;
  lastExport?: Date;
}

/**
 * Hook for integrating with Google NotebookLM
 */
export function useNotebookLmIntegration() {
  const { inflationEvents, downloadCurrentDataAsPDF } = useInflationEvents();
  const [notebookLmConfig, setNotebookLmConfig] = useState<NotebookLmConfig>({
    notebookId: "nb_" + Math.random().toString(36).substring(2, 10),
  });
  
  // For the current state of the universe
  const onExportForNotebook = useCallback(() => {
    // Export the data
    exportInflationEventsData();
    
    // Trigger a download
    downloadCurrentDataAsPDF();
  }, [downloadCurrentDataAsPDF]);
  
  // Export simulation data to Google NotebookLM
  const exportSimulationData = useCallback((datasetId?: string, format: string = 'json') => {
    console.log(`Exporting simulation data with ATLAS dataset ${datasetId} in ${format} format`);
    downloadCurrentDataAsPDF();
    
    return {
      success: true,
      filename: `simulation_data_${new Date().toISOString().slice(0, 10)}.${format}`,
      inflationEventCount: inflationEvents.length
    };
  }, [inflationEvents, downloadCurrentDataAsPDF]);
  
  // Open Google NotebookLM
  const openNotebookLm = useCallback(() => {
    console.log("Opening Google NotebookLM in a new tab");
    window.open('https://notebooklm.google.com', '_blank');
  }, []);
  
  // Export inflation events data
  const exportInflationEventsData = useCallback(() => {
    console.log(`Exporting ${inflationEvents.length} inflation events`);
    const data = {
      inflationEvents,
      exportedAt: new Date().toISOString(),
      totalEvents: inflationEvents.length
    };
    
    // In a real app, you'd send this to an API
    console.log("Exported inflation events data:", data);
    
    return data;
  }, [inflationEvents]);
  
  return {
    onExportForNotebook,
    exportSimulationData,
    openNotebookLm,
    notebookLmConfig,
    exportInflationEventsData
  };
}

export default useNotebookLmIntegration;
