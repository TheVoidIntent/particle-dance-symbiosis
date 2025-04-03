
import { Particle, SimulationStats } from '@/types/simulation';
import { getDataPoints } from './dataExportUtils';

/**
 * Calculate the complexity of the simulation
 * @param particles The particles to analyze
 * @param stats The current simulation stats
 */
export function calculateSimulationComplexity(
  particles: Particle[],
  stats: SimulationStats
): number {
  if (particles.length === 0) return 0;
  
  // Count different charge types
  const chargeTypes = {
    positive: particles.filter(p => p.charge === 'positive').length,
    negative: particles.filter(p => p.charge === 'negative').length,
    neutral: particles.filter(p => p.charge === 'neutral').length
  };
  
  // Calculate Shannon entropy
  let entropy = 0;
  for (const type in chargeTypes) {
    const probability = chargeTypes[type as keyof typeof chargeTypes] / particles.length;
    if (probability > 0) {
      entropy -= probability * Math.log2(probability);
    }
  }
  
  // Normalize entropy
  const normalizedEntropy = entropy / Math.log2(3); // 3 is the number of charge types
  
  // Calculate avg knowledge and energy
  const avgKnowledge = particles.reduce((sum, p) => sum + (p.knowledge || 0), 0) / particles.length;
  const avgEnergy = particles.reduce((sum, p) => sum + (p.energy || 0), 0) / particles.length;
  
  // Combine factors for complexity
  return (normalizedEntropy * 0.3) + (avgKnowledge * 0.4) + (avgEnergy / 100 * 0.3);
}

/**
 * Get stored data points for analysis
 */
export function getStoredDataPoints() {
  return getDataPoints();
}

/**
 * Analyze particle clusters
 * @param particles The particles to analyze
 */
export function analyzeParticleClusters(particles: Particle[]) {
  // Calculate distances between particles
  const distanceMatrix: number[][] = [];
  
  particles.forEach((p1, i) => {
    distanceMatrix[i] = [];
    particles.forEach((p2, j) => {
      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      distanceMatrix[i][j] = distance;
    });
  });
  
  // Find clusters based on proximity
  const clusters: Particle[][] = [];
  const visited = new Set<string>();
  
  // Simple DBSCAN-like algorithm
  const eps = 50; // Max distance for neighborhood
  
  particles.forEach((p1, i) => {
    if (visited.has(p1.id)) return;
    
    visited.add(p1.id);
    const cluster: Particle[] = [p1];
    
    particles.forEach((p2, j) => {
      if (i !== j && !visited.has(p2.id) && distanceMatrix[i][j] < eps) {
        cluster.push(p2);
        visited.add(p2.id);
      }
    });
    
    if (cluster.length > 1) {
      clusters.push(cluster);
    }
  });
  
  return {
    clusters,
    clusterCount: clusters.length,
    averageClusterSize: clusters.length > 0 
      ? clusters.reduce((sum, c) => sum + c.length, 0) / clusters.length 
      : 0
  };
}
