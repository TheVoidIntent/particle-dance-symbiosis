
import { toast } from 'sonner';
import { exportDataAsJson } from './dataExportUtils';

// Schedule daily exports
let dailyExportTimeout: NodeJS.Timeout | null = null;

// Start daily export schedule
export function startDailyExport() {
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
  
  // Schedule export
  dailyExportTimeout = setTimeout(() => {
    performDailyExport();
    // Reschedule for next day
    startDailyExport();
  }, msUntilMidnight);
  
  console.log(`Daily export scheduled for ${tomorrow.toLocaleString()}`);
  return tomorrow;
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
    exportDataAsJson(`daily_export_${dateStr}`);
    console.log(`Daily export performed on ${date.toLocaleString()}`);
    toast.success('Daily data export completed');
    return true;
  } catch (error) {
    console.error('Error during daily export:', error);
    toast.error('Daily data export failed');
    return false;
  }
}

