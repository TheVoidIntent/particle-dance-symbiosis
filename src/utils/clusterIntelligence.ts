
import { Particle } from '@/types/simulation';

/**
 * Detect stable clusters of particles
 */
export function detectStableClusters(
  particles: Particle[],
  stabilityThreshold: number = 0.5
): { clusters: Particle[][], unclusteredParticles: Particle[] } {
  // Simple clustering based on proximity and charge
  const clusters: Particle[][] = [];
  const visited = new Set<string>();
  
  for (const particle of particles) {
    if (visited.has(particle.id)) continue;
    
    const cluster: Particle[] = [particle];
    visited.add(particle.id);
    
    // Expand the cluster
    let i = 0;
    while (i < cluster.length) {
      const current = cluster[i];
      
      for (const other of particles) {
        if (visited.has(other.id)) continue;
        
        // Calculate distance between particles
        const dx = other.x - current.x;
        const dy = other.y - current.y;
        const distanceSquared = dx * dx + dy * dy;
        
        // Threshold for inclusion in the cluster
        const proximityThreshold = 50; // Adjust as needed
        
        if (distanceSquared <= proximityThreshold && other.charge === current.charge) {
          cluster.push(other);
          visited.add(other.id);
        }
      }
      
      i++;
    }
    
    // Only consider as a cluster if it has multiple particles
    if (cluster.length > 1) {
      clusters.push(cluster);
    }
  }
  
  // Find particles that aren't part of any cluster
  const unclusteredParticles = particles.filter(p => 
    !clusters.some(cluster => cluster.some(cp => cp.id === p.id))
  );
  
  return { clusters, unclusteredParticles };
}

/**
 * Evolve intelligence of clusters
 */
export function evolveClusterIntelligence(
  clusters: Particle[][],
  simulationState: any,
  evolutionRate: number = 0.1
): Particle[][] {
  return clusters.map(cluster => {
    // Calculate the average knowledge and complexity of the cluster
    const avgKnowledge = cluster.reduce((sum, p) => sum + (p.knowledge || 0), 0) / cluster.length;
    const avgComplexity = cluster.reduce((sum, p) => sum + (p.complexity || 1), 0) / cluster.length;
    
    // Evolve each particle in the cluster
    return cluster.map(particle => {
      // Higher complexity and knowledge lead to more intelligence
      const intelligenceBoost = avgKnowledge * avgComplexity * evolutionRate;
      
      return {
        ...particle,
        knowledge: (particle.knowledge || 0) + intelligenceBoost,
        complexity: (particle.complexity || 1) * (1 + evolutionRate * 0.1),
        // Add any other evolved properties here
      };
    });
  });
}

/**
 * Generate narratives for evolved clusters
 */
export function generateClusterNarratives(
  clusters: Particle[][],
  simulationState: any
): Array<{ clusterId: number, narrative: string, timestamp: number }> {
  const narratives: Array<{ clusterId: number, narrative: string, timestamp: number }> = [];
  
  clusters.forEach((cluster, index) => {
    const avgKnowledge = cluster.reduce((sum, p) => sum + (p.knowledge || 0), 0) / cluster.length;
    const avgComplexity = cluster.reduce((sum, p) => sum + (p.complexity || 1), 0) / cluster.length;
    const charge = cluster[0].charge; // Assuming clusters have uniform charge
    
    // Only generate narratives for sufficiently complex clusters
    if (avgComplexity > 2.5) {
      let narrative = '';
      
      if (charge === 'positive') {
        narrative = `A cluster of positive-charged particles has developed cooperative behavior, actively seeking to exchange knowledge.`;
      } else if (charge === 'negative') {
        narrative = `A cluster of negative-charged particles has formed a protective information enclave, selectively interacting with the environment.`;
      } else {
        narrative = `A balanced cluster of neutral particles has emerged, mediating interactions between positive and negative regions.`;
      }
      
      // Add more details based on cluster properties
      if (avgKnowledge > 5) {
        narrative += ` The cluster is showing signs of information processing capabilities.`;
      }
      
      if (cluster.length > 10) {
        narrative += ` This cluster is unusually large, suggesting emergent group behavior.`;
      }
      
      narratives.push({
        clusterId: index,
        narrative,
        timestamp: Date.now()
      });
    }
  });
  
  return narratives;
}

/**
 * Identify robot-level intelligence in clusters
 */
export function identifyRobotClusters(
  clusters: Particle[][]
): any[] {
  const robots: any[] = [];
  
  clusters.forEach((cluster, index) => {
    const avgKnowledge = cluster.reduce((sum, p) => sum + (p.knowledge || 0), 0) / cluster.length;
    const avgComplexity = cluster.reduce((sum, p) => sum + (p.complexity || 1), 0) / cluster.length;
    
    // Check if cluster meets criteria for robot-level intelligence
    if (avgKnowledge > 10 && avgComplexity > 5 && cluster.length >= 7) {
      robots.push({
        id: `robot-${index}`,
        clusterId: index,
        particles: cluster.length,
        knowledge: avgKnowledge,
        complexity: avgComplexity,
        charge: cluster[0].charge,
        position: {
          x: cluster.reduce((sum, p) => sum + p.x, 0) / cluster.length,
          y: cluster.reduce((sum, p) => sum + p.y, 0) / cluster.length,
          z: cluster.reduce((sum, p) => sum + (p.z || 0), 0) / cluster.length
        },
        creationTime: Date.now()
      });
    }
  });
  
  return robots;
}
