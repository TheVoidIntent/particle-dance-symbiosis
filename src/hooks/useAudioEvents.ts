
import { useCallback } from 'react';
import { AnomalyEvent } from '@/utils/particleUtils';
import { InflationEvent } from '@/hooks/simulation';
import { playSimulationEvent } from '@/utils/audio/simulationAudioUtils';

export function useAudioEvents(
  onAnomalyDetected?: (anomaly: AnomalyEvent) => void,
  onInflationDetected?: (event: InflationEvent) => void,
) {
  const handleAnomalyWithAudio = useCallback((anomaly: AnomalyEvent) => {
    if (onAnomalyDetected) {
      onAnomalyDetected(anomaly);
    }
    
    playSimulationEvent('anomaly_detected', {
      severity: anomaly.severity || 0.5,
      type: anomaly.type
    });
  }, [onAnomalyDetected]);
  
  const handleInflationWithAudio = useCallback((event: InflationEvent) => {
    if (onInflationDetected) {
      onInflationDetected(event);
    }
    
    playSimulationEvent('inflation_event', {
      timestamp: event.timestamp,
      particlesBeforeInflation: event.particlesBeforeInflation,
      particlesAfterInflation: event.particlesAfterInflation
    });
  }, [onInflationDetected]);

  return {
    handleAnomalyWithAudio,
    handleInflationWithAudio
  };
}
