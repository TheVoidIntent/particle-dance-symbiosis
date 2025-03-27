
import { useState, useCallback } from 'react';
import { InflationEvent } from '@/hooks/simulation';
import { useToast } from "@/hooks/use-toast";

export function useInflationEvents() {
  const [showInflationBanner, setShowInflationBanner] = useState(false);
  const [latestInflation, setLatestInflation] = useState<InflationEvent | null>(null);
  const { toast } = useToast();

  const handleInflationDetected = useCallback((event: InflationEvent) => {
    setLatestInflation(event);
    setShowInflationBanner(true);
    
    // Show toast notification
    toast({
      title: "Universe Inflation Detected!",
      description: `The simulation space has expanded with ${event.particlesAfterInflation - event.particlesBeforeInflation} new particles`,
      variant: "default",
    });
    
    // Hide banner after 5 seconds
    setTimeout(() => {
      setShowInflationBanner(false);
    }, 5000);
  }, [toast]);

  // Add new function to get all inflation events
  const getAllInflationEvents = useCallback(() => {
    try {
      const existingEvents = JSON.parse(localStorage.getItem('inflationEvents') || '[]');
      return existingEvents;
    } catch (e) {
      console.error('Error retrieving inflation events:', e);
      return [];
    }
  }, []);

  // Add new function to export inflation events data
  const exportInflationEventsData = useCallback(() => {
    const events = getAllInflationEvents();
    
    if (events.length === 0) {
      toast({
        title: "No Inflation Events",
        description: "There are no inflation events to export.",
        variant: "destructive",
      });
      return null;
    }
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '').slice(0, 15);
    const filename = `inflation_events_${timestamp}.json`;
    
    const exportData = {
      metadata: {
        timestamp: new Date().toISOString(),
        source: 'intentSim.org',
        type: 'inflation_events',
        format: 'notebook_lm_compatible'
      },
      inflationEvents: events,
      summary: {
        totalEvents: events.length,
        firstEvent: events[0]?.timestamp ? new Date(events[0].timestamp).toISOString() : null,
        lastEvent: events[events.length - 1]?.timestamp ? new Date(events[events.length - 1].timestamp).toISOString() : null
      }
    };
    
    // Create download file
    const jsonString = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Inflation Events Exported",
      description: `${events.length} inflation events exported for Notebook LM.`,
      variant: "default",
    });
    
    return exportData;
  }, [getAllInflationEvents, toast]);

  return {
    showInflationBanner,
    latestInflation,
    handleInflationDetected,
    getAllInflationEvents,
    exportInflationEventsData
  };
}
