
import { Particle } from '@/types/simulation';

/**
 * Analyzes particles to find clusters
 */
export function analyzeParticleClusters(particles: Particle[], threshold: number = 0.7): {
  clusters: Particle[][],
  unclusteredParticles: Particle[]
} {
  const clusters: Particle[][] = [];
  const visited = new Set<string>();
  
  for (const particle of particles) {
    if (visited.has(particle.id)) continue;
    
    const cluster: Particle[] = [particle];
    visited.add(particle.id);
    
    let i = 0;
    while (i < cluster.length) {
      const current = cluster[i];
      
      for (const other of particles) {
        if (visited.has(other.id)) continue;
        
        const dx = other.x - current.x;
        const dy = other.y - current.y;
        const distanceSquared = dx * dx + dy * dy;
        
        if (distanceSquared <= (current.radius + other.radius) * 3 * (threshold || 1) && 
            other.charge === current.charge) {
          cluster.push(other);
          visited.add(other.id);
        }
      }
      
      i++;
    }
    
    if (cluster.length > 1) {
      clusters.push(cluster);
    }
  }
  
  const unclusteredParticles = particles.filter(p => 
    !clusters.some(cluster => cluster.some(cp => cp.id === p.id))
  );
  
  return { clusters, unclusteredParticles };
}
