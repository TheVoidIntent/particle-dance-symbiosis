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
  
  // Export simulation data to Notebook LM format
  const exportSimulationData = useCallback(async (atlasDatasetId?: string, exportFormat: string = 'pdf') => {
    try {
      // Show loading toast
      toast.loading(`Preparing data export as ${exportFormat.toUpperCase()} with ATLAS/CERN comparison and inflation events...`);
      
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
          simulationTypes[key].inflation_events = inflationEvents;
          
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
      
      // Handle different export formats
      if (exportFormat === 'pdf') {
        // Export the data as PDF
        const pdfFilename = await exportSimulationDataAsPDF(simulationTypes);
        
        if (pdfFilename) {
          toast.success(
            "Data prepared for Notebook LM",
            {
              description: `Your data has been exported as ${exportFormat.toUpperCase()} with all simulation types, inflation events, and ATLAS comparison.`
            }
          );
        }
      } else if (exportFormat === 'bibtex') {
        // For BibTeX, create a citation format (simplified)
        const timestamp = new Date().toISOString().substring(0, 10);
        const citation = `@dataset{intentSim${timestamp.replace(/-/g, '')},
  title={IntentSim Universe Simulation Data},
  author={IntentSim Research Team},
  year={${new Date().getFullYear()}},
  publisher={IntentSim.org},
  url={https://intentsim.org},
  note={Data generated from universe simulation with intent field fluctuations}
}`;
        
        // Create a download link for the BibTeX file
        const blob = new Blob([citation], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `intentSim_citation_${timestamp}.bib`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        toast.success("BibTeX citation generated for ORCID");
      } else if (exportFormat === 'doi' || exportFormat === 'json') {
        // For DOI metadata or JSON format
        const metadata = {
          title: "IntentSim Universe Simulation Data",
          creators: [{ name: "IntentSim Research Team" }],
          publicationYear: new Date().getFullYear(),
          publisher: "IntentSim.org",
          resourceType: "Dataset",
          subjects: ["Simulation", "Universe", "Intent Field Fluctuations"],
          format: exportFormat === 'doi' ? "DOI Metadata" : "JSON Dataset",
          data: jsonData
        };
        
        // Create a download link for the metadata file
        const blob = new Blob([JSON.stringify(metadata, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `intentSim_${exportFormat}_${new Date().toISOString().substring(0, 10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        toast.success(`${exportFormat.toUpperCase()} metadata generated for ORCID`);
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
