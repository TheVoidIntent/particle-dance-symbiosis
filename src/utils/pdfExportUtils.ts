
import { SimulationStats } from '@/types/simulation';
import { toast } from 'sonner';

/**
 * Convert any data to PDF format and trigger a download
 */
export const convertAnyDataToPDF = async (
  data: any,
  filename = 'intentSim_export'
): Promise<string | null> => {
  try {
    // For now, we'll just create a JSON file as a placeholder for the PDF
    // In a real application, you would use a PDF library or service
    const fullFilename = `${filename}_${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
    
    // Prepare the data for export
    const exportData = {
      metadata: {
        exportTime: new Date().toISOString(),
        format: 'PDF (simulated as JSON)',
        source: 'IntentSim.org'
      },
      content: data
    };
    
    // Convert to blob and download
    const jsonStr = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    // Create download link
    const a = document.createElement('a');
    a.href = url;
    a.download = fullFilename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    console.log(`Exported data as ${fullFilename}`);
    return fullFilename;
  } catch (error) {
    console.error('Error exporting as PDF:', error);
    toast.error('Failed to export data as PDF');
    return null;
  }
};

/**
 * Export simulation data as PDF
 */
export const exportSimulationDataAsPDF = async (simulationData: any): Promise<string | null> => {
  const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
  const filename = `intentSim_simulation_${timestamp}`;
  
  try {
    return await convertAnyDataToPDF(simulationData, filename);
  } catch (error) {
    console.error('Error exporting simulation data:', error);
    toast.error('Failed to export simulation data');
    return null;
  }
};

/**
 * Export current simulation state as PDF with rich formatting
 */
export const exportCurrentSimulationStateAsPDF = async (
  stats: SimulationStats,
  particles: any[],
  fieldData: any
): Promise<string | null> => {
  const exportData = {
    timestamp: new Date().toISOString(),
    stats,
    particleCount: particles.length,
    particleSample: particles.slice(0, 10), // Only include a sample of particles to keep file size reasonable
    fieldSummary: {
      dimensions: [
        fieldData?.[0]?.length || 0,
        fieldData?.[0]?.[0]?.length || 0,
        fieldData?.length || 0
      ],
      averageIntensity: calculateAverageFieldIntensity(fieldData)
    }
  };
  
  return await convertAnyDataToPDF(exportData, 'intentSim_current_state');
};

// Helper function to calculate average field intensity
const calculateAverageFieldIntensity = (field: number[][][]): number => {
  if (!field || !field.length || !field[0].length || !field[0][0].length) {
    return 0;
  }
  
  let sum = 0;
  let count = 0;
  
  for (let z = 0; z < field.length; z++) {
    for (let y = 0; y < field[z].length; y++) {
      for (let x = 0; x < field[z][y].length; x++) {
        sum += field[z][y][x];
        count++;
      }
    }
  }
  
  return count > 0 ? sum / count : 0;
};
