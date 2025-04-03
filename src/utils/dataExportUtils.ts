
import { SimulationStats } from '@/types/simulation';

// In-memory storage for simulation data points
let simulationDataPoints: (SimulationStats & { timestamp: number })[] = [];

/**
 * Add a data point to the collection
 */
export function addDataPoint(stats: SimulationStats): void {
  // Add timestamp if not present
  const dataPoint = {
    ...stats,
    timestamp: stats.timestamp || Date.now()
  };
  
  simulationDataPoints.push(dataPoint);
  
  // Keep last 1000 data points to prevent memory issues
  if (simulationDataPoints.length > 1000) {
    simulationDataPoints = simulationDataPoints.slice(-1000);
  }
}

/**
 * Export simulation data as JSON file
 */
export function exportSimulationData(): void {
  if (simulationDataPoints.length === 0) {
    console.warn("No simulation data to export");
    return;
  }
  
  const dataToExport = {
    exportDate: new Date().toISOString(),
    dataPoints: simulationDataPoints.map(point => ({
      ...point,
      timestamp: point.timestamp || Date.now()
    }))
  };
  
  const dataStr = JSON.stringify(dataToExport, null, 2);
  const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
  
  downloadFile(dataUri, `simulation-data-${new Date().toISOString().slice(0, 10)}.json`);
}

/**
 * Export simulation data as CSV file
 */
export function exportDataAsCsv(): void {
  if (simulationDataPoints.length === 0) {
    console.warn("No simulation data to export");
    return;
  }
  
  // Get all unique keys from all data points
  const allKeys = new Set<string>();
  simulationDataPoints.forEach(point => {
    Object.keys(point).forEach(key => allKeys.add(key));
  });
  
  // Create CSV header
  const headers = Array.from(allKeys);
  let csv = headers.join(',') + '\n';
  
  // Add data rows
  simulationDataPoints.forEach(point => {
    const row = headers.map(header => {
      const value = point[header as keyof typeof point];
      return value !== undefined ? String(value).replace(/,/g, '') : '';
    });
    csv += row.join(',') + '\n';
  });
  
  // Download CSV
  const dataUri = `data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`;
  downloadFile(dataUri, `simulation-data-${new Date().toISOString().slice(0, 10)}.csv`);
}

/**
 * Export data as PDF
 */
export function exportDataAsPdf(): boolean {
  console.log("PDF export functionality would go here");
  // This would typically use a library like jsPDF
  // For now, we'll just return a success flag
  return true;
}

/**
 * Clear all stored simulation data
 */
export function clearSimulationData(): void {
  simulationDataPoints = [];
  console.log("Simulation data cleared");
}

/**
 * Get all stored data points
 */
export function getStoredDataPoints(): (SimulationStats & { timestamp: number })[] {
  return simulationDataPoints;
}

/**
 * Helper function to download a file
 */
function downloadFile(dataUri: string, filename: string): void {
  const link = document.createElement('a');
  link.href = dataUri;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Export the function as named export since the module has no default export
export { exportSimulationData as exportDataAsJson };
