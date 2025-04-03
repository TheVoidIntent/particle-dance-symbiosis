
import { useState, useCallback } from 'react';

/**
 * Type for inflation events
 */
export interface InflationEvent {
  id: string;
  timestamp: number;
  particlesBefore: number;
  particlesAfter: number;
  inflationFactor: number;
  energyIncrease: number;
  complexityIncrease: number;
  narrative: string;
}

/**
 * Hook for working with inflation events
 */
export function useInflationEvents() {
  const [inflationEvents, setInflationEvents] = useState<InflationEvent[]>([]);
  const [latestInflationEvent, setLatestInflationEvent] = useState<InflationEvent | null>(null);

  /**
   * Handle a new inflation event
   */
  const handleInflationEvent = useCallback((event: InflationEvent) => {
    setInflationEvents(prev => [...prev, event]);
    setLatestInflationEvent(event);
    console.log("Inflation event detected:", event);
  }, []);

  /**
   * Download current simulation data as PDF
   */
  const downloadCurrentDataAsPDF = useCallback(() => {
    console.log("Preparing PDF export of current simulation data...");
    // In a real implementation, this would generate and download a PDF
    
    setTimeout(() => {
      console.log("PDF export completed");
      alert("PDF export completed. In a real implementation, this would download a file.");
    }, 500);
    
    return true;
  }, []);

  /**
   * Export inflation events data
   */
  const exportInflationEventsData = useCallback(() => {
    console.log("Exporting inflation events data");
    // Implementation of exporting the data would go here
    return true;
  }, [inflationEvents]);

  return {
    inflationEvents,
    latestInflationEvent,
    handleInflationEvent,
    downloadCurrentDataAsPDF,
    exportInflationEventsData
  };
}
