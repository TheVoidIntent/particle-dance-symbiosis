
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
  
  const statsWithTimestamp = {
    ...stats,
    timestamp: Date.now()
  };
  
  simulationData.push(statsWithTimestamp as SimulationStats);
}

// Alias for addDataPoint to match other file references
export const recordDataPoint = addDataPoint;

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
        ? ((simulationData[simulationData.length - 1].timestamp as number) - (simulationData[0].timestamp as number))
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

// Add more export helpers that were referenced but missing
export function exportDataAsJson(): void {
  exportSimulationData();
}

export function exportDataAsCsv(): void {
  if (simulationData.length === 0) {
    console.log("No data to export as CSV");
    return;
  }
  
  // Get all unique keys from the data
  const allKeys = new Set<string>();
  simulationData.forEach(dataPoint => {
    Object.keys(dataPoint).forEach(key => allKeys.add(key));
  });
  
  // Convert Set to Array
  const headers = Array.from(allKeys);
  
  // Create CSV content
  let csvContent = headers.join(',') + '\n';
  
  simulationData.forEach(dataPoint => {
    const row = headers.map(header => {
      const value = dataPoint[header as keyof SimulationStats];
      return value !== undefined ? value : '';
    }).join(',');
    csvContent += row + '\n';
  });
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const timestamp = new Date().toISOString().replace(/:/g, '-').replace(/\..+/, '');
  saveAs(blob, `simulation_data_${timestamp}.csv`);
  
  console.log(`Exported ${simulationData.length} data points as CSV`);
}

export function getStoredDataPoints(): SimulationStats[] {
  return [...simulationData];
}

export function getDataPointCount(): number {
  return simulationData.length;
}

export function exportDataAsPdf(): void {
  console.log("PDF export is not implemented yet");
  // Placeholder for PDF export
}

export default {
  clearSimulationData,
  addDataPoint,
  toggleDataCollection,
  isDataCollectionActive,
  exportSimulationData,
  exportDataAsJson,
  exportDataAsCsv,
  getStoredDataPoints,
  recordDataPoint,
  getDataPointCount,
  exportDataAsPdf
};
