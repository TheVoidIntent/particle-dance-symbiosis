
import { Particle } from '@/types/simulation';

export interface AnomalyEvent {
  type: string;
  description: string;
  particles: string[];
  timestamp: number;
  severity: number;
  affectedParticles: number;
}

/**
 * Detects anomalies in the particle system by comparing current and previous states
 */
export function detectAnomalies(
  particles: Particle[],
  previousState: any,
  currentState: any,
  frameCount: number
): AnomalyEvent[] {
  const anomalies: AnomalyEvent[] = [];
  
  if (previousState && currentState) {
    if (Math.abs(currentState.entropy - previousState.entropy) > 0.2) {
      anomalies.push({
        type: 'entropy_spike',
        description: `Significant change in system entropy detected at frame ${frameCount}`,
        particles: particles.slice(0, 5).map(p => p.id),
        timestamp: frameCount,
        severity: 0.7,
        affectedParticles: Math.floor(particles.length * 0.3)
      });
    }
    
    if (currentState.clusterCount > previousState.clusterCount * 1.5) {
      anomalies.push({
        type: 'cluster_formation',
        description: `Rapid formation of particle clusters detected at frame ${frameCount}`,
        particles: particles.slice(0, 5).map(p => p.id),
        timestamp: frameCount,
        severity: 0.6,
        affectedParticles: Math.floor(particles.length * 0.2)
      });
    }
  }
  
  return anomalies;
}
