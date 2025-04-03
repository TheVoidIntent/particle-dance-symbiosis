
import { useState, useEffect } from 'react';
import { SimulationStats } from '@/types/simulation';
import { addDataPoint, exportSimulationData, exportDataAsCsv, clearSimulationData } from '@/utils/dataExportUtils';

export function useSimulationData() {
  const [dataPoints, setDataPoints] = useState<number>(0);
  const [lastExported, setLastExported] = useState<Date | null>(null);

  const handleSimulationData = (stats: SimulationStats) => {
    const dataWithTimestamp = {
      ...stats,
      timestamp: Date.now()
    };
    addDataPoint(dataWithTimestamp);
    setDataPoints(prev => prev + 1);
  };

  const exportData = (format: 'json' | 'csv' = 'json') => {
    if (format === 'csv') {
      exportDataAsCsv();
    } else {
      exportSimulationData();
    }
    setLastExported(new Date());
  };

  const clearData = () => {
    clearSimulationData();
    setDataPoints(0);
  };

  return {
    dataPoints,
    lastExported,
    addDataPoint: handleSimulationData,
    exportData,
    clearData
  };
}

export default useSimulationData;
