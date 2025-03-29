
import { exportDataToJSON } from './dataExportUtils';

interface ExportCallbacks {
  onExportStart?: () => void;
  onExportComplete?: (filename: string) => void;
  onExportError?: (error: Error) => void;
}

/**
 * Schedule for daily exports - configurable via parameters
 */
export const exportSchedule = {
  // Default to midnight (0), 8:00 (8), and 16:00 (16)
  hours: [0, 8, 16], 
  // Minutes past the hour for export
  minute: 0
};

/**
 * Get the nearest future export time
 */
export const getNearestExportTime = (): Date => {
  const now = new Date();
  const today = new Date(now);
  
  // Find the next export time
  let nextExport: Date | null = null;
  
  // Check today's remaining times
  for (const hour of exportSchedule.hours) {
    const exportTime = new Date(today);
    exportTime.setHours(hour, exportSchedule.minute, 0, 0);
    
    if (exportTime > now) {
      nextExport = exportTime;
      break;
    }
  }
  
  // If no times left today, check tomorrow
  if (!nextExport) {
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(exportSchedule.hours[0], exportSchedule.minute, 0, 0);
    nextExport = tomorrow;
  }
  
  return nextExport;
};

/**
 * Sets up the daily data export scheduler
 */
export const setupDailyDataExport = (callbacks: ExportCallbacks = {}) => {
  // Immediately perform an export when started
  setTimeout(() => performExport(callbacks), 5000);
  
  // Schedule future exports
  const checkSchedule = () => {
    const now = new Date();
    const nextExportTime = getNearestExportTime();
    
    // Time difference in milliseconds
    const timeDiff = nextExportTime.getTime() - now.getTime();
    
    // Schedule the next export
    const timeoutId = setTimeout(() => {
      performExport(callbacks);
      // Set up the next export after this one completes
      checkSchedule();
    }, timeDiff);
    
    // Return cleanup function
    return () => clearTimeout(timeoutId);
  };
  
  // Start the scheduler
  const cleanup = checkSchedule();
  
  return { 
    cleanup,
    getNextExportTime: getNearestExportTime
  };
};

/**
 * Performs the data export process
 */
const performExport = async (callbacks: ExportCallbacks = {}) => {
  try {
    if (callbacks.onExportStart) {
      callbacks.onExportStart();
    }
    
    // Construct a date-based filename
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10); // YYYY-MM-DD
    const timeStr = date.toTimeString().slice(0, 8).replace(/:/g, '-'); // HH-MM-SS
    
    const filename = `intentsim_daily_${dateStr}_${timeStr}`;
    
    // Export the data
    await exportDataToJSON(true);
    
    if (callbacks.onExportComplete) {
      callbacks.onExportComplete(filename);
    }
    
    console.log(`✅ Daily data export completed: ${filename}`);
    
    // After exporting data, we could clean up older data points to prevent memory issues
    // This would need to be implemented based on your specific requirements
    
    return filename;
  } catch (error) {
    console.error("❌ Error during daily data export:", error);
    
    if (callbacks.onExportError && error instanceof Error) {
      callbacks.onExportError(error);
    }
    
    return null;
  }
};

/**
 * Get the export history - could be extended to read from localStorage
 */
export const getExportHistory = () => {
  // Implement to track history of exports
  // For now, return an empty array
  return [];
};
