import { SimulationStats } from '@/types/simulation';

// In-memory storage for simulation data points
const dataPoints: SimulationStats[] = [];

/**
 * Add a data point to the simulation data collection
 */
export function addDataPoint(stats: SimulationStats): void {
  // Ensure timestamp is set
  const dataWithTimestamp = {
    ...stats,
    timestamp: stats.timestamp || Date.now()
  };
  
  dataPoints.push(dataWithTimestamp);
  
  // Keep only the last 10000 points to avoid memory issues
  if (dataPoints.length > 10000) {
    dataPoints.shift();
  }
}

/**
 * Export simulation data as JSON
 */
export function exportSimulationData(): void {
  if (dataPoints.length === 0) {
    console.warn("No data to export");
    return;
  }
  
  try {
    // Convert data to JSON
    const jsonData = JSON.stringify({
      data: dataPoints,
      exportedAt: new Date().toISOString(),
      totalPoints: dataPoints.length
    }, null, 2);
    
    // Create a blob and download link
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.href = url;
    link.download = `simulation_data_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    URL.revokeObjectURL(url);
    document.body.removeChild(link);
    
    console.log(`Exported ${dataPoints.length} data points as JSON`);
  } catch (error) {
    console.error("Error exporting data:", error);
  }
}

/**
 * Export simulation data as CSV
 */
export function exportDataAsCsv(): void {
  if (dataPoints.length === 0) {
    console.warn("No data to export");
    return;
  }
  
  try {
    // Get headers from first data point
    const headers = Object.keys(dataPoints[0]);
    
    // Create CSV content
    let csvContent = headers.join(',') + '\n';
    
    // Add data rows
    dataPoints.forEach(point => {
      const row = headers.map(header => {
        // Format timestamp as ISO string if it exists
        if (header === 'timestamp' && point.timestamp) {
          return new Date(point.timestamp).toISOString();
        }
        return point[header as keyof SimulationStats] ?? '';
      }).join(',');
      
      csvContent += row + '\n';
    });
    
    // Create a blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.href = url;
    link.download = `simulation_data_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    URL.revokeObjectURL(url);
    document.body.removeChild(link);
    
    console.log(`Exported ${dataPoints.length} data points as CSV`);
  } catch (error) {
    console.error("Error exporting data:", error);
  }
}

/**
 * Clear all stored simulation data
 */
export function clearSimulationData(): void {
  dataPoints.length = 0;
  console.log("Simulation data cleared");
}

/**
 * Get all stored data points
 */
export function getDataPoints(): SimulationStats[] {
  return [...dataPoints];
}

/**
 * Get count of stored data points
 */
export function getDataPointCount(): number {
  return dataPoints.length;
}
