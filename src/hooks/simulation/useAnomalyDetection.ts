
import { useCallback } from 'react';
import { Particle, AnomalyEvent, detectAnomalies } from '@/utils/particleUtils';

export function useAnomalyDetection(
  running: boolean,
  isInitialized: boolean,
  particlesRef: React.MutableRefObject<Particle[]>,
  frameCountRef: React.MutableRefObject<number>,
  onAnomalyDetected?: (anomaly: AnomalyEvent) => void
) {
  const detectSimulationAnomalies = useCallback(() => {
    if (!running || !isInitialized || frameCountRef.current % 30 !== 0) {
      return null;
    }
    
    // Create placeholder objects for anomaly detection
    const previousState = {
      entropy: Math.random(),  // Placeholder values
      clusterCount: particlesRef.current.length > 0 ? Math.floor(particlesRef.current.length / 10) : 0,
      adaptiveCount: particlesRef.current.filter(p => p.type === 'adaptive').length,
      compositeCount: particlesRef.current.filter(p => p.type === 'composite').length,
      orderParameter: 0.5,
      informationDensity: 1.0,
      kolmogorovComplexity: 0.3
    };
    
    const currentState = {
      entropy: Math.random(),  // Update with actual entropy calculation
      clusterCount: particlesRef.current.length > 0 ? Math.floor(particlesRef.current.length / 8) : 0,
      adaptiveCount: particlesRef.current.filter(p => p.type === 'adaptive').length,
      compositeCount: particlesRef.current.filter(p => p.type === 'composite').length,
      orderParameter: 0.6,
      informationDensity: 1.2,
      kolmogorovComplexity: 0.4
    };
    
    const anomalies = detectAnomalies(
      particlesRef.current, 
      previousState,
      currentState,
      frameCountRef.current
    );
    
    if (anomalies.length > 0 && onAnomalyDetected) {
      // Only report the most significant anomaly
      onAnomalyDetected(anomalies[0]);
      return anomalies[0];
    }
    
    return null;
  }, [running, isInitialized, onAnomalyDetected, particlesRef, frameCountRef]);

  return { detectSimulationAnomalies };
}

export default useAnomalyDetection;
