
import { useState, useCallback, useRef } from 'react';
import { InflationEvent } from '@/hooks/simulation';
import { exportSimulationDataAsPDF } from '@/utils/pdfExportUtils';
import { toast } from 'sonner';

export function useInflationEvents() {
  const [showInflationBanner, setShowInflationBanner] = useState(false);
  const [latestInflation, setLatestInflation] = useState<InflationEvent | null>(null);
  const inflationEventsRef = useRef<InflationEvent[]>([]);
  
  const handleInflationDetected = useCallback((event: InflationEvent) => {
    setLatestInflation(event);
    setShowInflationBanner(true);
    
    // Store the inflation event in our records
    inflationEventsRef.current.push(event);
    
    // Auto-hide the banner after 5 seconds
    setTimeout(() => {
      setShowInflationBanner(false);
    }, 5000);
  }, []);
  
  // Add a method to get all inflation events
  const getInflationEvents = useCallback((): InflationEvent[] => {
    return inflationEventsRef.current;
  }, []);
  
  // Export inflation events data
  const exportInflationEventsData = useCallback(() => {
    const data = {
      timestamp: new Date().toISOString(),
      eventCount: inflationEventsRef.current.length,
      events: inflationEventsRef.current,
      simulations: [
        { type: 'adaptive', summary: { /* Placeholder for simulation stats */ } },
        { type: 'energy_conservation', summary: { /* Placeholder for simulation stats */ } },
        { type: 'baseline', summary: { /* Placeholder for simulation stats */ } },
        { type: 'full_features', summary: { /* Placeholder for simulation stats */ } },
        { type: 'cern_comparison', summary: { /* Placeholder for simulation stats */ } }
      ]
    };
    
    toast.success("Inflation events data exported");
    return data;
  }, []);
  
  // Download current data as PDF
  const downloadCurrentDataAsPDF = useCallback(async () => {
    try {
      const data = exportInflationEventsData();
      const filename = await exportSimulationDataAsPDF(data);
      
      if (filename) {
        toast.success(`Data exported as ${filename}`);
      } else {
        toast.error("Failed to export data");
      }
      
      return filename;
    } catch (error) {
      console.error("Error downloading data as PDF:", error);
      toast.error("Failed to download data as PDF");
      return null;
    }
  }, [exportInflationEventsData]);
  
  return {
    showInflationBanner,
    latestInflation,
    handleInflationDetected,
    inflationEvents: inflationEventsRef.current,
    exportInflationEventsData,
    downloadCurrentDataAsPDF
  };
}
