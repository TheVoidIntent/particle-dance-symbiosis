
import { useState, useCallback } from 'react';
import { toast } from "sonner";
import { useInflationEvents } from './useInflationEvents';

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
  
  // Export simulation data to Notebook LM format
  const exportSimulationData = useCallback(() => {
    try {
      exportInflationEventsData();
      
      toast.success(
        "Data prepared for Notebook LM",
        {
          description: "Your data has been exported with all 5 simulation types: adaptive, energy conservation, baseline, full features, and CERN comparison."
        }
      );
      
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
