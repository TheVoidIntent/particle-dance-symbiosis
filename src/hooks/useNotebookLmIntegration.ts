import { useCallback } from 'react';
import { useInflationEvents } from './useInflationEvents';

interface UseNotebookLmIntegrationProps {
  onExportForNotebook: () => void;
}

/**
 * Hook for integrating with Google NotebookLM
 */
export function useNotebookLmIntegration() {
  const inflationEventsHook = useInflationEvents();
  
  // For the current state of the universe
  const onExportForNotebook = useCallback(() => {
    const { 
      exportInflationEventsData,
      downloadCurrentDataAsPDF
    } = inflationEventsHook;
    
    // Export the data
    exportInflationEventsData();
    
    // Trigger a download
    downloadCurrentDataAsPDF();
  }, [inflationEventsHook]);
  
  return {
    onExportForNotebook
  };
}

export default useNotebookLmIntegration;
