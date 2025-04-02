
import { SimulationStats } from '@/types/simulation';
import { exportDataAsJson, exportDataAsPdf } from './dataExportUtils';

// Example function to automatically export data at the end of the day
export async function scheduleEndOfDayExport(
  includeJson: boolean = true,
  includePdf: boolean = false,
  exportPath?: string
): Promise<boolean> {
  try {
    console.log("Scheduling end of day data export");
    
    // Implementation would schedule the export at the end of the day
    if (includeJson) {
      exportDataAsJson();
    }
    
    if (includePdf) {
      exportDataAsPdf();
    }
    
    return true;
  } catch (error) {
    console.error("Failed to schedule export:", error);
    return false;
  }
}

// Export data on demand with retry capability
export async function exportDataWithRetry(
  maxRetries: number = 3,
  format: 'json' | 'pdf' | 'both' = 'json'
): Promise<boolean> {
  let retries = 0;
  let success = false;
  
  while (!success && retries < maxRetries) {
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
