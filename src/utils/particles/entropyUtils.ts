
import { Particle } from '@/types/simulation';

/**
 * Calculates the entropy of the system based on particle distribution
 */
export function calculateSystemEntropy(particles: Particle[]): number {
  if (particles.length === 0) return 0;
  
  const chargeCount = {
    positive: particles.filter(p => p.charge === 'positive').length,
    negative: particles.filter(p => p.charge === 'negative').length,
    neutral: particles.filter(p => p.charge === 'neutral').length
  };
  
  const total = particles.length;
  
  let entropy = 0;
  for (const charge in chargeCount) {
    const probability = chargeCount[charge as keyof typeof chargeCount] / total;
    if (probability > 0) {
      entropy -= probability * Math.log2(probability);
    }
  }
  
  return entropy / Math.log2(3);
}
