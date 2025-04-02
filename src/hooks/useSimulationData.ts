
import { useState, useEffect, useCallback } from 'react';
import { SimulationStats } from '@/types/simulation';
import dataExportUtils from '@/utils/dataExportUtils';

const { 
  addDataPoint: recordDataPoint,
  exportSimulationData: exportDataAsJson,
  exportDataAsCsv,
  clearSimulationData,
  getStoredDataPoints,
  getDataPointCount,
  isDataCollectionActive,
  toggleDataCollection
} = dataExportUtils;

interface UseSimulationDataProps {
  autoCollect?: boolean;
  collectionInterval?: number;
}

export function useSimulationData({
  autoCollect = true,
  collectionInterval = 5000
}: UseSimulationDataProps = {}) {
  const [isCollecting, setIsCollecting] = useState<boolean>(isDataCollectionActive());
  const [dataPoints, setDataPoints] = useState<number>(getDataPointCount());
  
  // Record new data point
  const recordData = useCallback((stats: SimulationStats) => {
    if (isCollecting) {
      recordDataPoint(stats);
      setDataPoints(getDataPointCount());
    }
  }, [isCollecting]);
  
  // Toggle data collection
  const toggleCollection = useCallback(() => {
    const newState = toggleDataCollection();
    setIsCollecting(newState);
    return newState;
  }, []);
  
  // Clear all collected data
  const clearData = useCallback(() => {
    clearSimulationData();
    setDataPoints(0);
  }, []);
  
  // Export data
  const exportData = useCallback((format: 'json' | 'csv' = 'json') => {
    if (format === 'json') {
      exportDataAsJson();
    } else {
      exportDataAsCsv();
    }
  }, []);
  
  // Get collected data
  const getData = useCallback(() => {
    return getStoredDataPoints();
  }, []);
  
  // Automatic data collection if enabled
  useEffect(() => {
    if (!autoCollect || !isCollecting) return;
    
    const interval = setInterval(() => {
      setDataPoints(getDataPointCount());
    }, collectionInterval);
    
    return () => clearInterval(interval);
  }, [autoCollect, isCollecting, collectionInterval]);
  
  return {
    recordData,
    toggleCollection,
    clearData,
    exportData,
    getData,
    isCollecting,
    dataPoints
  };
}

export default useSimulationData;
