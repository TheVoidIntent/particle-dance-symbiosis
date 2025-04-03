
import { SimulationStats } from '@/types/simulation';

/**
 * Export simulation data as JSON
 */
export function exportDataAsJson(data?: SimulationStats): string {
  // Add timestamp if not present
  const timestampedData = data ? {
    ...data,
    timestamp: data.timestamp || Date.now()
  } : { timestamp: Date.now() };
  
  try {
    const json = JSON.stringify(timestampedData, null, 2);
    console.log("📊 Exporting data as JSON", timestampedData);
    
    // In a real application, this would save to file or send to server
    // For now, just return the JSON string
    return json;
  } catch (error) {
    console.error("Failed to export data as JSON:", error);
    return "{}";
  }
}

/**
 * Export simulation data as PDF
 */
export function exportDataAsPdf(data?: SimulationStats): boolean {
  // Add timestamp if not present
  const timestampedData = data ? {
    ...data,
    timestamp: data.timestamp || Date.now()
  } : { timestamp: Date.now() };
  
  try {
    console.log("📊 Exporting data as PDF", timestampedData);
    
    // In a real application, this would generate a PDF
    // For now, just log success
    return true;
  } catch (error) {
    console.error("Failed to export data as PDF:", error);
    return false;
  }
}

/**
 * Export simulation data chart as image
 */
export function exportChartAsImage(chartId: string, filename: string = 'chart.png'): boolean {
  try {
    console.log(`📊 Exporting chart ${chartId} as image: ${filename}`);
    // In a real app, this would capture canvas as image and download it
    return true;
  } catch (error) {
    console.error("Failed to export chart as image:", error);
    return false;
  }
}

/**
 * Format simulation stats for CSV export
 */
export function formatStatsForCsv(stats: SimulationStats[]): string {
  if (!stats.length) return '';
  
  // Get headers from first stats object
  const headers = Object.keys(stats[0]).join(',');
  
  // Format each stats row
  const rows = stats.map(stat => {
    // Ensure timestamp exists
    const statWithTimestamp = {
      ...stat,
      timestamp: stat.timestamp || Date.now()
    };
    return Object.values(statWithTimestamp).join(',');
  });
  
  // Combine headers and rows
  return [headers, ...rows].join('\n');
}

/**
 * Clear all simulation data
 */
export function clearSimulationData(): void {
  console.log("🗑️ Clearing all simulation data");
  // In a real application, this would clear stored data
}

/**
 * Export data as CSV
 */
export function exportDataAsCsv(data?: SimulationStats[]): string {
  const dataToExport = data || [];
  return formatStatsForCsv(dataToExport);
}

// Add functions for compatibility with existing code
export const exportSimulationData = exportDataAsJson;
export function getStoredDataPoints(): SimulationStats[] {
  return [];
}
