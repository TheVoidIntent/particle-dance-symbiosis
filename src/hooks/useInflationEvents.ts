
import { useState, useCallback } from 'react';
import { InflationEvent } from '@/types/simulation';
import { jsPDF } from 'jspdf';

export function useInflationEvents() {
  const [inflationEvents, setInflationEvents] = useState<InflationEvent[]>([]);
  const [latestInflationEvent, setLatestInflationEvent] = useState<InflationEvent | null>(null);

  const handleInflationEvent = useCallback((event: InflationEvent) => {
    setInflationEvents(prev => [...prev, event]);
    setLatestInflationEvent(event);
    console.log('Inflation event detected:', event);
  }, []);

  const downloadCurrentDataAsPDF = useCallback(() => {
    try {
      const doc = new jsPDF();
      
      doc.setFontSize(18);
      doc.text('Inflation Events Report', 20, 20);
      
      doc.setFontSize(12);
      doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 30);
      doc.text(`Total Events: ${inflationEvents.length}`, 20, 40);
      
      inflationEvents.forEach((event, index) => {
        const y = 60 + (index * 40);
        
        if (y > 250) {
          doc.addPage();
          doc.setFontSize(12);
          doc.text(`Page ${Math.floor(index / 6) + 1}`, 20, 20);
          const newY = 40 + ((index % 6) * 40);
          
          doc.text(`Event #${index + 1}:`, 20, newY);
          doc.text(`Timestamp: ${new Date(event.timestamp).toLocaleString()}`, 30, newY + 10);
          doc.text(`Particles: ${event.particlesBeforeInflation} → ${event.particlesAfterInflation}`, 30, newY + 20);
          doc.text(`Expansion Factor: ${event.expansionFactor}`, 30, newY + 30);
        } else {
          doc.text(`Event #${index + 1}:`, 20, y);
          doc.text(`Timestamp: ${new Date(event.timestamp).toLocaleString()}`, 30, y + 10);
          doc.text(`Particles: ${event.particlesBeforeInflation} → ${event.particlesAfterInflation}`, 30, y + 20);
          doc.text(`Expansion Factor: ${event.expansionFactor}`, 30, y + 30);
        }
      });
      
      doc.save('inflation-events-report.pdf');
      console.log('PDF downloaded successfully');
      return true;
    } catch (error) {
      console.error('Error generating PDF:', error);
      return false;
    }
  }, [inflationEvents]);

  const exportInflationEventsData = useCallback(() => {
    if (inflationEvents.length === 0) {
      console.warn("No inflation events to export");
      return;
    }
    
    const dataToExport = {
      exportDate: new Date().toISOString(),
      events: inflationEvents
    };
    
    const dataStr = JSON.stringify(dataToExport, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const link = document.createElement('a');
    link.href = dataUri;
    link.download = `inflation-events-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log("Inflation events data exported");
  }, [inflationEvents]);

  return {
    inflationEvents,
    latestInflationEvent: latestInflationEvent || {
      timestamp: 0,
      particlesBeforeInflation: 0,
      particlesAfterInflation: 0,
      expansionFactor: 0
    },
    handleInflationEvent,
    downloadCurrentDataAsPDF,
    exportInflationEventsData
  };
}

export default useInflationEvents;
