
import { Particle } from '@/types/simulation';

/**
 * Detect stable clusters of particles
 */
export function detectStableClusters(
  particles: Particle[], 
  stabilityThreshold: number = 0.5
): { 
  clusters: Particle[][]; 
  unclusteredParticles: Particle[]; 
} {
  const clusters: Particle[][] = [];
  const visited = new Set<string>();
  
  // Find clusters using a simple proximity algorithm
  for (const particle of particles) {
    if (visited.has(particle.id)) continue;
    
    const cluster = [particle];
    visited.add(particle.id);
    
    // Expand cluster
    let i = 0;
    while (i < cluster.length) {
      const current = cluster[i];
      
      for (const other of particles) {
        if (visited.has(other.id)) continue;
        
        // Calculate distance
        const dx = other.x - current.x;
        const dy = other.y - current.y;
        const distanceSquared = dx * dx + dy * dy;
        
        // Add to cluster if close enough and similar charge
        const maxDistance = (current.radius + other.radius) * 3;
        if (distanceSquared <= maxDistance * maxDistance && other.charge === current.charge) {
          cluster.push(other);
          visited.add(other.id);
        }
      }
      
      i++;
    }
    
    // Only consider it a cluster if it has multiple particles and meets stability criteria
    if (cluster.length > 1 && cluster.length > particles.length * stabilityThreshold) {
      clusters.push(cluster);
    }
  }
  
  // Find unclustered particles
  const unclusteredParticles = particles.filter(p => 
    !clusters.some(cluster => cluster.some(cp => cp.id === p.id))
  );
  
  return {
    clusters,
    unclusteredParticles
  };
}

/**
 * Evolve cluster intelligence
 */
export function evolveClusterIntelligence(
  clusters: Particle[][], 
  stats: any, 
  learningRate: number = 0.1
): Particle[][] {
  return clusters.map(cluster => {
    // Calculate cluster properties
    const averageKnowledge = cluster.reduce((sum, p) => sum + (p.knowledge || 0), 0) / cluster.length;
    const averageComplexity = cluster.reduce((sum, p) => sum + (p.complexity || 1), 0) / cluster.length;
    
    // Evolve each particle in the cluster
    return cluster.map(particle => {
      const evolutionFactor = Math.min(1, (particle.interactions || 0) / 100);
      
      return {
        ...particle,
        knowledge: (particle.knowledge || 0) + learningRate * evolutionFactor,
        complexity: (particle.complexity || 1) + (learningRate * 0.5 * evolutionFactor)
      };
    });
  });
}

/**
 * Generate narratives for evolved clusters
 */
export function generateClusterNarratives(
  clusters: Particle[][], 
  stats: any
): Array<{ clusterId: number; narrative: string; timestamp: number }> {
  return clusters.map((cluster, index) => {
    const averageKnowledge = cluster.reduce((sum, p) => sum + (p.knowledge || 0), 0) / cluster.length;
    const averageComplexity = cluster.reduce((sum, p) => sum + (p.complexity || 1), 0) / cluster.length;
    
    let narrative = "";
    
    if (averageComplexity > 5) {
      narrative = "Cluster developing complex knowledge structures and beginning proto-consciousness";
    } else if (averageComplexity > 3) {
      narrative = "Cluster showing emergent information processing capabilities";
    } else if (averageComplexity > 2) {
      narrative = "Cluster beginning to form coherent information patterns";
    } else {
      narrative = "Cluster exhibiting basic intentional alignment";
    }
    
    return {
      clusterId: index,
      narrative,
      timestamp: Date.now()
    };
  });
}

/**
 * Identify robot-level intelligence in evolved clusters
 */
export function identifyRobotClusters(
  clusters: Particle[][]
): Array<any> {
  return clusters
    .filter(cluster => {
      // Calculate cluster intelligence metrics
      const averageKnowledge = cluster.reduce((sum, p) => sum + (p.knowledge || 0), 0) / cluster.length;
      const averageComplexity = cluster.reduce((sum, p) => sum + (p.complexity || 1), 0) / cluster.length;
      const interactionDensity = cluster.reduce((sum, p) => sum + (p.interactions || 0), 0) / cluster.length;
      
      // Check if cluster reaches robot-level intelligence threshold
      return averageKnowledge > 5 && averageComplexity > 8 && interactionDensity > 100;
    })
    .map((cluster, index) => {
      // Create robot entity from cluster
      return {
        id: `robot-${Date.now()}-${index}`,
        particles: cluster.map(p => p.id),
        knowledgeBase: cluster.reduce((sum, p) => sum + (p.knowledge || 0), 0),
        complexity: cluster.reduce((sum, p) => sum + (p.complexity || 1), 0) / cluster.length,
        creationTime: Date.now(),
        charge: cluster[0].charge,
        intentFactor: cluster.reduce((sum, p) => sum + (p.intent || 0), 0) / cluster.length
      };
    });
}
