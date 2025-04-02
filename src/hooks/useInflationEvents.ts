
import { useState, useCallback } from 'react';
import { InflationEvent } from '@/hooks/simulation';

export function useInflationEvents() {
  const [showInflationBanner, setShowInflationBanner] = useState(false);
  const [latestInflation, setLatestInflation] = useState<InflationEvent | null>(null);
  
  const handleInflationDetected = useCallback((event: InflationEvent) => {
    setLatestInflation(event);
    setShowInflationBanner(true);
    
    // Auto-hide the banner after 5 seconds
    setTimeout(() => {
      setShowInflationBanner(false);
    }, 5000);
  }, []);
  
  return {
    showInflationBanner,
    latestInflation,
    handleInflationDetected,
  };
}
