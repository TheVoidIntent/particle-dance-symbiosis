
import { useState, useCallback } from 'react';
import { toast } from "sonner";
import { useInflationEvents } from './useInflationEvents';
import { exportSimulationDataAsPDF } from '@/utils/pdfExportUtils';

interface NotebookLmConfig {
  notebookId: string;
  includeMetrics: boolean;
  autoSync: boolean;
  usePdfFormat: boolean; // New option for PDF format
}

export function useNotebookLmIntegration() {
  const [notebookLmConfig, setNotebookLmConfig] = useState<NotebookLmConfig>({
    notebookId: "b2d28cf3-eebe-436c-9cfe-0015c99f99ac", // Your provided ID
    includeMetrics: true,
    autoSync: false,
    usePdfFormat: true // Default to using PDF format
  });
  
  const { exportInflationEventsData } = useInflationEvents();
  
  // Export simulation data to Notebook LM format
  const exportSimulationData = useCallback(async () => {
    try {
      // Get the data in standard JSON format
      const jsonData = exportInflationEventsData();
      
      if (notebookLmConfig.usePdfFormat) {
        // For PDF format
        const simulationTypes = {
          adaptive: jsonData.simulations[0],
          energy_conservation: jsonData.simulations[1],
          baseline: jsonData.simulations[2],
          full_features: jsonData.simulations[3],
          cern_comparison: jsonData.simulations[4]
        };
        
        const pdfFilename = await exportSimulationDataAsPDF(simulationTypes);
        
        if (pdfFilename) {
          toast.success(
            "Data prepared for Notebook LM in PDF format",
            {
              description: "Your data has been exported with all 5 simulation types in PDF format for easy integration with Notebook LM."
            }
          );
        }
      } else {
        // Standard JSON format (original implementation)
        toast.success(
          "Data prepared for Notebook LM",
          {
            description: "Your data has been exported with all 5 simulation types: adaptive, energy conservation, baseline, full features, and CERN comparison."
          }
        );
      }
      
      return true;
    } catch (error) {
      console.error("Error exporting data for Notebook LM:", error);
      toast.error("Failed to export data for Notebook LM");
      return false;
    }
  }, [exportInflationEventsData, notebookLmConfig.usePdfFormat]);
  
  // Open Notebook LM in new tab
  const openNotebookLm = useCallback(() => {
    const url = `https://notebooklm.google.com/notebook/${notebookLmConfig.notebookId}`;
    window.open(url, '_blank');
  }, [notebookLmConfig.notebookId]);
  
  return {
    notebookLmConfig,
    setNotebookLmConfig,
    exportSimulationData,
    openNotebookLm
  };
}
