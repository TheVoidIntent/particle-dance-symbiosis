
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

  return {
    showInflationBanner,
    latestInflation,
    handleInflationDetected
  };
}
