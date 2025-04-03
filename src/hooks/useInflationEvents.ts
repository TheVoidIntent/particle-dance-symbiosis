
import { useState, useCallback } from 'react';
import { InflationEvent } from '@/types/simulation';
import { toast } from 'sonner';
import { exportDataAsPdf } from '@/utils/dataExportUtils';

export function useInflationEvents() {
  const [inflationEvents, setInflationEvents] = useState<InflationEvent[]>([]);
  const [latestEvent, setLatestEvent] = useState<InflationEvent | null>(null);
  
  const handleInflationEvent = useCallback((event: InflationEvent) => {
    console.log('🌌 Inflation event detected:', event);
    
    // Add to events list
    setInflationEvents(prev => [...prev, event]);
    
    // Update latest event
    setLatestEvent(event);
    
    // Notify user
    toast.success('Universe Inflation Event Detected', {
      description: `Particles expanded from ${event.particlesBeforeInflation} to ${event.particlesAfterInflation}`,
    });
  }, []);
  
  const downloadCurrentDataAsPDF = useCallback(() => {
    const success = exportDataAsPdf();
    
    if (success) {
      toast.success('Data PDF Export Complete', {
        description: 'The simulation data has been exported as PDF',
      });
    } else {
      toast.error('Data Export Failed', {
        description: 'Failed to export simulation data',
      });
    }
  }, []);
  
  return {
    inflationEvents,
    latestInflationEvent: latestEvent,
    handleInflationEvent,
    downloadCurrentDataAsPDF
  };
}
