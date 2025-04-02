
import { SimulationStats } from '@/types/simulation';
import { saveAs } from 'file-saver';

// Store simulation data points for export
let simulationData: SimulationStats[] = [];
let isCollectingData = true;

/**
 * Clear all stored simulation data
 */
export function clearSimulationData(): void {
  simulationData = [];
  console.log("Simulation data cleared");
}

/**
 * Add a data point to the simulation data collection
 */
export function addDataPoint(stats: SimulationStats): void {
  if (!isCollectingData) return;
  
  simulationData.push({
    ...stats,
    timestamp: Date.now()
  });
}

/**
 * Toggle data collection on/off
 */
export function toggleDataCollection(): boolean {
  isCollectingData = !isCollectingData;
  return isCollectingData;
}

/**
 * Get the current data collection status
 */
export function isDataCollectionActive(): boolean {
  return isCollectingData;
}

/**
 * Export simulation data as JSON file
 */
export function exportSimulationData(): void {
  if (simulationData.length === 0) {
    console.log("No data to export");
    return;
  }
  
  const dataToExport = {
    metadata: {
      exportTime: new Date().toISOString(),
      dataPoints: simulationData.length,
      simulationDuration: simulationData.length > 0 
        ? (simulationData[simulationData.length - 1].timestamp as number) - (simulationData[0].timestamp as number) 
        : 0
    },
    data: simulationData
  };
  
  const json = JSON.stringify(dataToExport, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  
  const timestamp = new Date().toISOString().replace(/:/g, '-').replace(/\..+/, '');
  saveAs(blob, `simulation_data_${timestamp}.json`);
  
  console.log(`Exported ${simulationData.length} data points`);
}

export default {
  clearSimulationData,
  addDataPoint,
  toggleDataCollection,
  isDataCollectionActive,
  exportSimulationData
};
