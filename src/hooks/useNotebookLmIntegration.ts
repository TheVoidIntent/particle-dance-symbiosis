
import { useState, useCallback } from 'react';
import { toast } from "sonner";
import { useInflationEvents } from './useInflationEvents';
import { exportSimulationDataAsPDF } from '@/utils/pdfExportUtils';

interface NotebookLmConfig {
  notebookId: string;
  includeMetrics: boolean;
  autoSync: boolean;
}

export function useNotebookLmIntegration() {
  const [notebookLmConfig, setNotebookLmConfig] = useState<NotebookLmConfig>({
    notebookId: "b2d28cf3-eebe-436c-9cfe-0015c99f99ac", // Your provided ID
    includeMetrics: true,
    autoSync: false
  });
  
  const { exportInflationEventsData } = useInflationEvents();
  
  // Export simulation data to Notebook LM format as PDF only
  const exportSimulationData = useCallback(async () => {
    try {
      // Get the data in standard format
      const jsonData = exportInflationEventsData();
      
      // Extract simulation types from jsonData
      const simulationTypes = {
        adaptive: jsonData?.simulations?.[0] || {},
        energy_conservation: jsonData?.simulations?.[1] || {},
        baseline: jsonData?.simulations?.[2] || {},
        full_features: jsonData?.simulations?.[3] || {},
        cern_comparison: jsonData?.simulations?.[4] || {}
      };
      
      const pdfFilename = await exportSimulationDataAsPDF(simulationTypes);
      
      if (pdfFilename) {
        toast.success(
          "Data prepared for Notebook LM",
          {
            description: "Your data has been exported with all 5 simulation types in PDF format for easy integration with Notebook LM."
          }
        );
      }
      
      return true;
    } catch (error) {
      console.error("Error exporting data for Notebook LM:", error);
      toast.error("Failed to export data for Notebook LM");
      return false;
    }
  }, [exportInflationEventsData]);
  
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
