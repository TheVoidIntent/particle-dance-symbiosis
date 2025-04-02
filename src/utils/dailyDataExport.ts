
import { toast } from 'sonner';
import { exportDataAsJson, exportDataAsPdf } from './dataExportUtils';

// Schedule daily exports
let dailyExportTimeout: NodeJS.Timeout | null = null;
let nextExportTime: Date | null = null;
let lastExportTime: Date | null = null;

// Functions for export callbacks
type ExportCallbacks = {
  onExportStart?: () => void;
  onExportComplete?: (filename: string) => void;
  onExportError?: (error: Error) => void;
};

// Start daily export schedule
export function setupDailyDataExport(callbacks: ExportCallbacks = {}) {
  // Clear any existing schedule
  if (dailyExportTimeout) {
    clearTimeout(dailyExportTimeout);
  }
  
  // Calculate time until next export (midnight)
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  
  const msUntilMidnight = tomorrow.getTime() - now.getTime();
  nextExportTime = tomorrow;
  
  // Schedule export
  dailyExportTimeout = setTimeout(() => {
    if (callbacks.onExportStart) {
      callbacks.onExportStart();
    }
    
    try {
      const success = performDailyExport();
      if (success && callbacks.onExportComplete) {
        const filename = `daily_export_${new Date().toISOString().split('T')[0]}`;
        callbacks.onExportComplete(filename);
      }
    } catch (error) {
      console.error('Error during daily export:', error);
      if (callbacks.onExportError && error instanceof Error) {
        callbacks.onExportError(error);
      }
    }
    
    // Reschedule for next day
    setupDailyDataExport(callbacks);
  }, msUntilMidnight);
  
  console.log(`Daily export scheduled for ${tomorrow.toLocaleString()}`);
  
  return {
    nextExportTime: tomorrow,
    cleanup: () => {
      if (dailyExportTimeout) {
        clearTimeout(dailyExportTimeout);
        dailyExportTimeout = null;
      }
    }
  };
}

// Get the nearest export time
export function getNearestExportTime(): Date {
  if (!nextExportTime) {
    // Calculate next export time if not set
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    nextExportTime = tomorrow;
  }
  
  return nextExportTime;
}

// Get the last export time
export function getLastExportTime(): Date | null {
  return lastExportTime;
}

// Cancel scheduled export
export function cancelDailyExport() {
  if (dailyExportTimeout) {
    clearTimeout(dailyExportTimeout);
    dailyExportTimeout = null;
    console.log('Daily export canceled');
    return true;
  }
  return false;
}

// Perform export now
export function performDailyExport() {
  try {
    const date = new Date();
    const dateStr = date.toISOString().split('T')[0];
    const filename = `daily_export_${dateStr}`;
    
    exportDataAsJson(filename);
    exportDataAsPdf(filename);
    
    lastExportTime = date;
    console.log(`Daily export performed on ${date.toLocaleString()}`);
    toast.success('Daily data export completed');
    return true;
  } catch (error) {
    console.error('Error during daily export:', error);
    toast.error('Daily data export failed');
    return false;
  }
}

// Export functions
export function startDailyExport(callbacks: ExportCallbacks = {}) {
  return setupDailyDataExport(callbacks);
}
