
import { SimulationStats } from '@/types/simulation';
import { exportDataAsJson, exportDataAsPdf } from './dataExportUtils';

// Schedule end of day data export
export function setupDailyDataExport({
  onExportStart = () => {},
  onExportComplete = () => {}
}: {
  onExportStart?: () => void;
  onExportComplete?: (filename: string) => void;
} = {}): { cleanup?: () => void } {
  try {
    console.log("Setting up daily data export");
    
    // Schedule next export at midnight
    const now = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(now.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const timeUntilExport = tomorrow.getTime() - now.getTime();
    
    // Schedule the export
    const exportTimeout = setTimeout(() => {
      onExportStart();
      const filename = `simulation_export_${new Date().toISOString().slice(0, 10)}.pdf`;
      exportDataAsPdf();
      onExportComplete(filename);
      
      // Schedule next export
      setupDailyDataExport({ onExportStart, onExportComplete });
    }, timeUntilExport);
    
    // Return cleanup function
    return {
      cleanup: () => clearTimeout(exportTimeout)
    };
  } catch (error) {
    console.error("Failed to schedule export:", error);
    return {};
  }
}

// Get next export time
export function getNearestExportTime(): Date {
  const now = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(now.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  return tomorrow;
}

// Export data on demand with retry capability
export async function exportDataWithRetry(
  maxRetries: number = 3,
  format: 'json' | 'pdf' | 'both' = 'json'
): Promise<boolean> {
  let retries = 0;
  let success = false;
  
  while (!retries < maxRetries && !success) {
    try {
      if (format === 'json' || format === 'both') {
        exportDataAsJson();
      }
      
      if (format === 'pdf' || format === 'both') {
        exportDataAsPdf();
      }
      
      success = true;
    } catch (error) {
      retries++;
      console.error(`Export failed (attempt ${retries}/${maxRetries}):`, error);
      // Wait a second before retry
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  return success;
}
