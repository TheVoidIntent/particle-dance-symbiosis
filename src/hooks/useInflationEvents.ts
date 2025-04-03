
import { useState, useCallback } from 'react';
import { InflationEvent } from '@/types/simulation';
import { jsPDF } from 'jspdf';

/**
 * Hook for tracking inflation events in the simulation
 */
export function useInflationEvents() {
  const [inflationEvents, setInflationEvents] = useState<InflationEvent[]>([]);
  const [latestInflationEvent, setLatestInflationEvent] = useState<InflationEvent>({
    timestamp: 0,
    particlesBeforeInflation: 0,
    particlesAfterInflation: 0
  });

  /**
   * Handle a new inflation event
   */
  const handleInflationEvent = useCallback((event: InflationEvent) => {
    setInflationEvents(prev => [...prev, event]);
    setLatestInflationEvent(event);
    
    console.log(`🌌 Inflation event recorded at ${new Date(event.timestamp).toLocaleString()}`);
    console.log(`Particles: ${event.particlesBeforeInflation} → ${event.particlesAfterInflation}`);
  }, []);

  /**
   * Download the current data as a PDF report
   */
  const downloadCurrentDataAsPDF = useCallback(() => {
    try {
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(18);
      doc.text("Universe Simulation Data", 105, 15, { align: 'center' });
      
      // Add timestamp
      doc.setFontSize(12);
      doc.text(`Generated: ${new Date().toLocaleString()}`, 105, 25, { align: 'center' });
      
      // Add inflation events section
      doc.setFontSize(14);
      doc.text("Inflation Events", 20, 40);
      
      if (inflationEvents.length === 0) {
        doc.setFontSize(12);
        doc.text("No inflation events have occurred yet.", 20, 50);
      } else {
        // Table header
        doc.setFontSize(12);
        doc.text("Timestamp", 20, 50);
        doc.text("Particles Before", 70, 50);
        doc.text("Particles After", 130, 50);
        doc.text("Expansion Factor", 180, 50);
        
        // Table rows
        let y = 60;
        inflationEvents.forEach((event, index) => {
          if (y > 280) {
            // Add a new page if we're close to the bottom
            doc.addPage();
            y = 20;
            
            // Repeat header on the new page
            doc.text("Timestamp", 20, y);
            doc.text("Particles Before", 70, y);
            doc.text("Particles After", 130, y);
            doc.text("Expansion Factor", 180, y);
            
            y += 10;
          }
          
          const date = new Date(event.timestamp).toLocaleString();
          doc.text(date, 20, y);
          doc.text(event.particlesBeforeInflation.toString(), 70, y);
          doc.text(event.particlesAfterInflation.toString(), 130, y);
          doc.text((event.expansionFactor || 1).toFixed(2), 180, y);
          
          y += 10;
        });
      }
      
      // Save the PDF
      doc.save(`inflation_events_${new Date().toISOString().slice(0, 10)}.pdf`);
      
      console.log(`PDF report generated with ${inflationEvents.length} inflation events`);
      return true;
    } catch (error) {
      console.error("Error generating PDF:", error);
      return false;
    }
  }, [inflationEvents]);

  /**
   * Export inflation events data for Notebook LM
   */
  const exportInflationEventsData = useCallback(() => {
    const data = {
      inflationEvents,
      exportTimestamp: Date.now(),
      totalEvents: inflationEvents.length,
      latestEvent: inflationEvents.length > 0 ? inflationEvents[inflationEvents.length - 1] : null
    };
    
    console.log("Exporting inflation events data:", data);
    return data;
  }, [inflationEvents]);

  return {
    inflationEvents,
    latestInflationEvent,
    handleInflationEvent,
    downloadCurrentDataAsPDF,
    exportInflationEventsData
  };
}

export default useInflationEvents;
