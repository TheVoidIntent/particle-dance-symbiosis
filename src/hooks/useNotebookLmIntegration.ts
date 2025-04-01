
import { useState, useCallback } from 'react';
import { toast } from "sonner";
import { useInflationEvents } from './useInflationEvents';
import { exportSimulationDataAsPDF } from '@/utils/pdfExportUtils';
import { fetchAtlasData, mapAtlasDataToSimulationFormat } from '@/utils/atlasDataIntegration';

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
  
  const { exportInflationEventsData, inflationEvents } = useInflationEvents();
  
  // Export simulation data to Notebook LM format as PDF only
  const exportSimulationData = useCallback(async (atlasDatasetId?: string) => {
    try {
      // Show loading toast
      toast.loading("Preparing data export with ATLAS/CERN comparison and inflation events...");
      
      // Get the simulation data in standard format
      const jsonData = exportInflationEventsData();
      
      // Extract simulation types from jsonData with fallbacks for missing data
      const simulationTypes = {
        adaptive: jsonData?.simulations?.[0] || { summary: {} }, // Ensure summary exists
        energy_conservation: jsonData?.simulations?.[1] || { summary: {} },
        baseline: jsonData?.simulations?.[2] || { summary: {} },
        full_features: jsonData?.simulations?.[3] || { summary: {} },
        cern_comparison: jsonData?.simulations?.[4] || { summary: {} }
      };
      
      // Add inflation events to each simulation
      if (inflationEvents.length > 0) {
        Object.keys(simulationTypes).forEach(key => {
          // @ts-ignore - We're adding inflation_events property to the simulation types
          simulationTypes[key].inflation_events = inflationEvents.filter(event => 
            event.type === key || (key === 'adaptive' && !event.type)
          );
          
          // @ts-ignore - Add summary info about inflation events
          simulationTypes[key].summary.inflationEventsCount = 
          // @ts-ignore - We're accessing the inflation_events property
            simulationTypes[key].inflation_events?.length || 0;
        });
      }
      
      // Fetch ATLAS data if a dataset ID is provided
      if (atlasDatasetId) {
        try {
          const atlasData = await fetchAtlasData(atlasDatasetId);
          if (atlasData) {
            // Map ATLAS data to simulation format
            const mappedData = mapAtlasDataToSimulationFormat(atlasData);
            
            // Enhance the CERN comparison with real ATLAS data
            // @ts-ignore - We're adding atlasData property to cern_comparison
            simulationTypes.cern_comparison.atlasData = mappedData;
            simulationTypes.cern_comparison.summary = {
              ...(simulationTypes.cern_comparison.summary || {}),
              atlasDatasetId: atlasData.id,
              atlasDatasetName: atlasData.name,
              atlasParticleCount: atlasData.particles.length,
              atlasCollisionEnergy: atlasData.collisionEnergy,
              correlationScore: calculateCorrelationScore(
                simulationTypes.cern_comparison,
                mappedData
              )
            };
            
            toast.success(
              "ATLAS Data Loaded",
              {
                description: `Successfully integrated data from ATLAS dataset: ${atlasData.name}`
              }
            );
          }
        } catch (error) {
          console.error("Error fetching ATLAS data:", error);
          toast.error("Failed to load ATLAS data, using simulated comparison data");
        }
      }
      
      // Dismiss loading toast
      toast.dismiss();
      
      // Export the data as PDF
      const pdfFilename = await exportSimulationDataAsPDF(simulationTypes);
      
      if (pdfFilename) {
        toast.success(
          "Data prepared for Notebook LM",
          {
            description: "Your data has been exported with all simulation types, inflation events, and ATLAS comparison in PDF format for easy integration with Notebook LM."
          }
        );
      }
      
      return true;
    } catch (error) {
      console.error("Error exporting data for Notebook LM:", error);
      toast.error("Failed to export data for Notebook LM");
      return false;
    }
  }, [exportInflationEventsData, inflationEvents]);
  
  // Open Notebook LM in new tab
  const openNotebookLm = useCallback(() => {
    const url = `https://notebooklm.google.com/notebook/${notebookLmConfig.notebookId}`;
    window.open(url, '_blank');
  }, [notebookLmConfig.notebookId]);
  
  // Simple function to calculate similarity/correlation between simulation and ATLAS data
  const calculateCorrelationScore = (simulationData: any, atlasData: any): number => {
    // This is a simplified correlation calculation
    // In a real implementation, this would involve statistical analysis of distributions
    
    try {
      // Get particle counts by charge
      const simPositive = simulationData.summary?.positiveParticles || 0;
      const simNegative = simulationData.summary?.negativeParticles || 0;
      const simNeutral = simulationData.summary?.neutralParticles || 0;
      
      const atlasPositive = atlasData.simulationData?.filter((p: any) => p.charge === 'positive').length || 0;
      const atlasNegative = atlasData.simulationData?.filter((p: any) => p.charge === 'negative').length || 0;
      const atlasNeutral = atlasData.simulationData?.filter((p: any) => p.charge === 'neutral').length || 0;
      
      // Calculate charge ratio similarity
      const simTotal = simPositive + simNegative + simNeutral || 1;
      const atlasTotal = atlasPositive + atlasNegative + atlasNeutral || 1;
      
      const simPositiveRatio = simPositive / simTotal;
      const simNegativeRatio = simNegative / simTotal;
      const simNeutralRatio = simNeutral / simTotal;
      
      const atlasPositiveRatio = atlasPositive / atlasTotal;
      const atlasNegativeRatio = atlasNegative / atlasTotal;
      const atlasNeutralRatio = atlasNeutral / atlasTotal;
      
      // Compute a simple correlation score based on charge ratio differences
      const positiveCorr = 1 - Math.abs(simPositiveRatio - atlasPositiveRatio);
      const negativeCorr = 1 - Math.abs(simNegativeRatio - atlasNegativeRatio);
      const neutralCorr = 1 - Math.abs(simNeutralRatio - atlasNeutralRatio);
      
      // Return the average correlation score (0 to 1)
      return (positiveCorr + negativeCorr + neutralCorr) / 3;
    } catch (error) {
      console.error("Error calculating correlation score:", error);
      return 0.5; // Return a default value of 0.5 if calculation fails
    }
  };
  
  return {
    notebookLmConfig,
    setNotebookLmConfig,
    exportSimulationData,
    openNotebookLm
  };
}
