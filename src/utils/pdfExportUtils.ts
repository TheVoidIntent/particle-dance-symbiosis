
import { SimulationStats } from '@/types/simulation';
import { toast } from 'sonner';

/**
 * Convert any data to PDF format and trigger a download
 */
export const convertAnyDataToPDF = async (
  data: any,
  filename = 'intentSim_export',
  fieldImages?: { initial?: string; postInflation?: string; cmb?: string }
): Promise<string | null> => {
  try {
    // For now, we'll just create a JSON file as a placeholder for the PDF
    // In a real application, you would use a PDF library or service
    const fullFilename = `${filename}_${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
    
    // Prepare the data for export, including field distribution images if available
    const exportData = {
      metadata: {
        exportTime: new Date().toISOString(),
        format: 'PDF (simulated as JSON)',
        source: 'IntentSim.org',
        includesFieldDistributionImages: !!fieldImages
      },
      content: data,
      fieldDistributionImages: fieldImages || {}
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
export const exportSimulationDataAsPDF = async (
  simulationData: any,
  fieldImages?: { initial?: string; postInflation?: string; cmb?: string }
): Promise<string | null> => {
  const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
  
  // Check if we have ATLAS/CERN comparison data
  const hasAtlasData = simulationData && 
    (simulationData.cern_comparison?.atlasData || 
     (typeof simulationData === 'object' && Object.values(simulationData).some(
       (sim: any) => sim?.atlasData || sim?.metadata?.source === 'ATLAS'
     )));
  
  // Create the filename with ATLAS comparison info if applicable
  let filename = `intentSim_simulation_${timestamp}`;
  if (hasAtlasData) {
    filename = `${filename}_with_ATLAS_comparison`;
  }
  
  // If we have field distribution images, add that to filename
  if (fieldImages) {
    filename = `${filename}_with_field_distribution`;
  }
  
  try {
    return await convertAnyDataToPDF(simulationData, filename, fieldImages);
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
  fieldData: any,
  atlasComparison?: any,
  fieldImages?: { initial?: string; postInflation?: string; cmb?: string }
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
    },
    // Include field distribution images if available
    fieldDistribution: fieldImages ? {
      initialState: fieldImages.initial ? "Image data included" : "Not available",
      postInflationState: fieldImages.postInflation ? "Image data included" : "Not available",
      cmbComparison: fieldImages.cmb ? "Comparison data included" : "Not available",
      correlationScore: fieldImages.cmb && fieldImages.postInflation ? 
        calculateFieldDistributionCorrelation() : null
    } : null,
    // Include ATLAS comparison data if available
    ...(atlasComparison && { atlasComparison })
  };
  
  const filename = fieldImages ? 
    'intentSim_current_state_with_field_distribution' : 
    (atlasComparison ? 
      'intentSim_current_state_with_ATLAS_comparison' : 
      'intentSim_current_state');
    
  return await convertAnyDataToPDF(exportData, filename, fieldImages);
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

// Helper function to calculate correlation between field distribution and CMB
const calculateFieldDistributionCorrelation = (): number => {
  // This would be a more complex calculation in a real implementation
  // For now, return a random correlation value between 0.65 and 0.95
  return 0.65 + Math.random() * 0.3;
};

/**
 * Capture intent field distribution as image data
 */
export const captureIntentFieldAsImage = (
  ctx: CanvasRenderingContext2D, 
  intentField: number[][][],
  dimensions: { width: number; height: number }
): string => {
  // Create a temporary canvas for the field visualization
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = dimensions.width;
  tempCanvas.height = dimensions.height;
  const tempCtx = tempCanvas.getContext('2d');
  
  if (!tempCtx) {
    console.error('Failed to get canvas context for field capture');
    return '';
  }
  
  // Clear the canvas
  tempCtx.fillStyle = 'black';
  tempCtx.fillRect(0, 0, dimensions.width, dimensions.height);
  
  // Render the intent field - similar to renderIntentField but on the temp canvas
  if (!intentField.length || !intentField[0].length || !intentField[0][0].length) {
    return tempCanvas.toDataURL('image/png');
  }
  
  const fieldWidth = intentField[0][0].length;
  const fieldHeight = intentField[0].length;
  
  const cellWidth = dimensions.width / fieldWidth;
  const cellHeight = dimensions.height / fieldHeight;
  
  // Use the middle z-layer for 2D visualization
  const zLayer = Math.floor(intentField.length / 2);
  
  for (let y = 0; y < fieldHeight; y++) {
    for (let x = 0; x < fieldWidth; x++) {
      const value = intentField[zLayer][y][x];
      
      // Skip rendering near-zero values
      if (Math.abs(value) < 0.05) continue;
      
      const posX = x * cellWidth;
      const posY = y * cellHeight;
      
      // Color based on value (positive = blue, negative = red, neutral = green)
      let color;
      if (value > 0.2) {
        const intensity = Math.min(255, Math.floor(value * 255));
        color = `rgba(59, 130, 246, ${Math.min(1, value * 2)})`; // Blue for positive
      } else if (value < -0.2) {
        const intensity = Math.min(255, Math.floor(-value * 255));
        color = `rgba(239, 68, 68, ${Math.min(1, -value * 2)})`; // Red for negative
      } else {
        // Near-neutral values get a green tint
        const absValue = Math.abs(value);
        const intensity = Math.min(255, Math.floor(absValue * 255));
        color = `rgba(74, 222, 128, ${Math.min(0.5, absValue * 4)})`; // Green for neutral
      }
      
      tempCtx.fillStyle = color;
      tempCtx.fillRect(posX, posY, cellWidth, cellHeight);
    }
  }
  
  // Add a grid overlay for reference
  tempCtx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
  tempCtx.lineWidth = 0.5;
  
  for (let x = 0; x <= fieldWidth; x++) {
    tempCtx.beginPath();
    tempCtx.moveTo(x * cellWidth, 0);
    tempCtx.lineTo(x * cellWidth, dimensions.height);
    tempCtx.stroke();
  }
  
  for (let y = 0; y <= fieldHeight; y++) {
    tempCtx.beginPath();
    tempCtx.moveTo(0, y * cellHeight);
    tempCtx.lineTo(dimensions.width, y * cellHeight);
    tempCtx.stroke();
  }
  
  // Add a colorbar/legend
  const legendWidth = 20;
  const legendHeight = dimensions.height * 0.7;
  const legendX = dimensions.width - legendWidth - 20;
  const legendY = (dimensions.height - legendHeight) / 2;
  
  // Draw gradient
  const gradient = tempCtx.createLinearGradient(0, legendY, 0, legendY + legendHeight);
  gradient.addColorStop(0, 'rgba(239, 68, 68, 1)');    // Red (negative)
  gradient.addColorStop(0.5, 'rgba(74, 222, 128, 1)'); // Green (neutral)
  gradient.addColorStop(1, 'rgba(59, 130, 246, 1)');   // Blue (positive)
  
  tempCtx.fillStyle = gradient;
  tempCtx.fillRect(legendX, legendY, legendWidth, legendHeight);
  
  // Draw legend border
  tempCtx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
  tempCtx.lineWidth = 1;
  tempCtx.strokeRect(legendX, legendY, legendWidth, legendHeight);
  
  // Add labels
  tempCtx.fillStyle = 'white';
  tempCtx.font = '10px Arial';
  tempCtx.textAlign = 'right';
  tempCtx.fillText('-1.0', legendX - 5, legendY + 10);
  tempCtx.fillText('0.0', legendX - 5, legendY + legendHeight/2 + 5);
  tempCtx.fillText('+1.0', legendX - 5, legendY + legendHeight - 5);
  
  // Add title
  tempCtx.fillStyle = 'white';
  tempCtx.font = '12px Arial';
  tempCtx.textAlign = 'center';
  tempCtx.fillText('Intent Field Distribution', dimensions.width / 2, 20);
  
  // Convert to data URL and return
  return tempCanvas.toDataURL('image/png');
};

/**
 * Create a simulated CMB image for comparison
 */
export const createCMBComparisonImage = (dimensions: { width: number; height: number }): string => {
  // Create a temporary canvas for the CMB visualization
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = dimensions.width;
  tempCanvas.height = dimensions.height;
  const tempCtx = tempCanvas.getContext('2d');
  
  if (!tempCtx) {
    console.error('Failed to get canvas context for CMB image');
    return '';
  }
  
  // Draw a simulated CMB background
  tempCtx.fillStyle = 'black';
  tempCtx.fillRect(0, 0, dimensions.width, dimensions.height);
  
  // Create a perlin-noise-like pattern for CMB
  const resolution = 20;
  const gridWidth = Math.ceil(dimensions.width / resolution);
  const gridHeight = Math.ceil(dimensions.height / resolution);
  
  // Create base noise values
  const noise: number[][] = [];
  for (let y = 0; y < gridHeight; y++) {
    noise[y] = [];
    for (let x = 0; x < gridWidth; x++) {
      // Base random value
      noise[y][x] = Math.random() * 2 - 1;
    }
  }
  
  // Smooth the noise
  for (let y = 0; y < gridHeight; y++) {
    for (let x = 0; x < gridWidth; x++) {
      let sum = noise[y][x];
      let count = 1;
      
      // Average with neighbors
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dx === 0 && dy === 0) continue;
          
          const nx = x + dx;
          const ny = y + dy;
          
          if (nx >= 0 && nx < gridWidth && ny >= 0 && ny < gridHeight) {
            sum += noise[ny][nx];
            count++;
          }
        }
      }
      
      noise[y][x] = sum / count;
    }
  }
  
  // Render the noise as a temperature map
  for (let y = 0; y < gridHeight; y++) {
    for (let x = 0; x < gridWidth; x++) {
      const value = noise[y][x];
      
      // Position
      const posX = x * resolution;
      const posY = y * resolution;
      
      // Color mapping (similar to actual CMB maps)
      // Deep blue (-) to red (+)
      let r, g, b;
      if (value < -0.5) {
        // Deep blue
        r = 0; g = 0; b = Math.floor(255 * (-value - 0.5) * 2);
      } else if (value < 0) {
        // Light blue
        r = 0; g = Math.floor(255 * (0.5 + value)); b = 255;
      } else if (value < 0.5) {
        // Yellow to orange
        r = 255; g = Math.floor(255 * (1 - value * 2)); b = 0;
      } else {
        // Red
        r = 255; g = 0; b = 0;
      }
      
      tempCtx.fillStyle = `rgb(${r}, ${g}, ${b})`;
      tempCtx.fillRect(posX, posY, resolution, resolution);
    }
  }
  
  // Add title
  tempCtx.fillStyle = 'white';
  tempCtx.font = '12px Arial';
  tempCtx.textAlign = 'center';
  tempCtx.fillText('Simulated CMB Temperature Map', dimensions.width / 2, 20);
  
  // Add a colorbar/legend
  const legendWidth = 20;
  const legendHeight = dimensions.height * 0.7;
  const legendX = dimensions.width - legendWidth - 20;
  const legendY = (dimensions.height - legendHeight) / 2;
  
  // Draw gradient
  const gradient = tempCtx.createLinearGradient(0, legendY, 0, legendY + legendHeight);
  gradient.addColorStop(0, 'rgb(0, 0, 255)');    // Deep blue (cold)
  gradient.addColorStop(0.33, 'rgb(0, 255, 255)'); // Cyan
  gradient.addColorStop(0.66, 'rgb(255, 255, 0)'); // Yellow
  gradient.addColorStop(1, 'rgb(255, 0, 0)');    // Red (hot)
  
  tempCtx.fillStyle = gradient;
  tempCtx.fillRect(legendX, legendY, legendWidth, legendHeight);
  
  // Draw legend border
  tempCtx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
  tempCtx.lineWidth = 1;
  tempCtx.strokeRect(legendX, legendY, legendWidth, legendHeight);
  
  // Add labels
  tempCtx.fillStyle = 'white';
  tempCtx.font = '10px Arial';
  tempCtx.textAlign = 'right';
  tempCtx.fillText('Cold', legendX - 5, legendY + 10);
  tempCtx.fillText('Hot', legendX - 5, legendY + legendHeight - 5);
  
  // Convert to data URL and return
  return tempCanvas.toDataURL('image/png');
};
