
import { useState, useCallback } from 'react';
import { SimulationStats } from '@/types/simulation';
import { exportDataAsPDF, exportDataAsCsv, getDataPoints } from '@/utils/dataExportUtils';

/**
 * Hook for managing simulation data
 */
export function useSimulationData() {
  const [simulationData, setSimulationData] = useState<any[]>([]);
  const [isExporting, setIsExporting] = useState(false);

  /**
   * Add a new data point
   */
  const addDataPoint = useCallback((dataPoint: any) => {
    setSimulationData(prev => [...prev, { ...dataPoint, timestamp: Date.now() }]);
  }, []);

  /**
   * Export the current simulation data
   */
  const exportSimulationData = useCallback((format: 'pdf' | 'csv' = 'pdf') => {
    setIsExporting(true);
    
    try {
      if (format === 'pdf') {
        exportDataAsPDF(simulationData, `simulation-data-${Date.now()}.pdf`);
      } else {
        exportDataAsCsv(simulationData, `simulation-data-${Date.now()}.csv`);
      }
      
      return true;
    } catch (error) {
      console.error('Error exporting simulation data:', error);
      return false;
    } finally {
      setIsExporting(false);
    }
  }, [simulationData]);

  /**
   * Clear all simulation data
   */
  const clearSimulationData = useCallback(() => {
    setSimulationData([]);
  }, []);

  /**
   * Get data points for visualization
   */
  const getStoredDataPoints = useCallback(() => {
    if (simulationData.length === 0) {
      return getDataPoints();
    }
    return simulationData;
  }, [simulationData]);

  return {
    simulationData,
    isExporting,
    addDataPoint,
    exportSimulationData,
    clearSimulationData,
    getStoredDataPoints
  };
}
