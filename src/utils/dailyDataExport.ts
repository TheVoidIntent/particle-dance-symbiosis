
import { SimulationStats } from '@/types/simulation';
import { addDataPoint } from './dataExportUtils';
import { exportDataAsCsv } from './dataExportUtils'; // Changed from exportDataAsJson

// Store for data points
const dailyDataPoints: SimulationStats[] = [];
let lastExportTimestamp: number = 0;
const EXPORT_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

/**
 * Add a data point to the daily collection
 */
export function addDailyDataPoint(stats: SimulationStats): void {
  const dataPoint = {
    ...stats,
    timestamp: Date.now()
  };
  
  dailyDataPoints.push(dataPoint);
  
  // Also add to the main data collection
  addDataPoint(dataPoint);
  
  // Check if we should export data (once per day)
  checkForDailyExport();
}

/**
 * Check if it's time for the daily export
 */
function checkForDailyExport(): void {
  const now = Date.now();
  
  // If we've never exported or it's been more than EXPORT_INTERVAL
  if (lastExportTimestamp === 0 || (now - lastExportTimestamp) > EXPORT_INTERVAL) {
    exportDailyData();
    lastExportTimestamp = now;
  }
}

/**
 * Export the daily data
 */
export function exportDailyData(): void {
  if (dailyDataPoints.length === 0) {
    console.log("No daily data to export");
    return;
  }
  
  try {
    // Export CSV
    exportDataAsCsv();
    
    // Clear daily data points to start fresh for next day
    // but keep the last hour to ensure continuity
    const oneHourAgo = Date.now() - (60 * 60 * 1000);
    const recentPoints = dailyDataPoints.filter(point => 
      point.timestamp && point.timestamp > oneHourAgo
    );
    
    dailyDataPoints.length = 0;
    dailyDataPoints.push(...recentPoints);
    
    console.log(`Daily data export completed: ${dailyDataPoints.length} points exported, ${recentPoints.length} recent points retained`);
  } catch (error) {
    console.error("Error exporting daily data:", error);
  }
}

/**
 * Set up daily data export
 */
export function setupDailyDataExport(options?: {
  onExportStart?: () => void;
  onExportComplete?: (filename: string) => void;
}): { cleanup: () => void } {
  // Schedule first export for midnight tonight
  const midnight = new Date();
  midnight.setHours(24, 0, 0, 0);
  const timeUntilMidnight = midnight.getTime() - Date.now();
  
  const exportTimer = setTimeout(() => {
    if (options?.onExportStart) {
      options.onExportStart();
    }
    
    exportDailyData();
    
    if (options?.onExportComplete) {
      const filename = `simulation_data_${new Date().toISOString().slice(0, 10)}.pdf`;
      options.onExportComplete(filename);
    }
    
    // Schedule next export for tomorrow at midnight
    setupDailyDataExport(options);
  }, timeUntilMidnight);
  
  // Return cleanup function
  return {
    cleanup: () => clearTimeout(exportTimer)
  };
}

/**
 * Get the nearest scheduled export time
 */
export function getNearestExportTime(): Date {
  const midnight = new Date();
  midnight.setHours(24, 0, 0, 0);
  return midnight;
}

/**
 * Get counts of particle types over time
 */
export function getParticleCountsOverTime(): { 
  timestamps: number[]; 
  positive: number[]; 
  negative: number[]; 
  neutral: number[]; 
} {
  if (dailyDataPoints.length === 0) {
    return { timestamps: [], positive: [], negative: [], neutral: [] };
  }
  
  return {
    timestamps: dailyDataPoints.map(point => point.timestamp || 0),
    positive: dailyDataPoints.map(point => point.positiveParticles),
    negative: dailyDataPoints.map(point => point.negativeParticles),
    neutral: dailyDataPoints.map(point => point.neutralParticles)
  };
}
