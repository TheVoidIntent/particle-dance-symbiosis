
import { Particle, SimulationStats } from '@/types/simulation';

// Detect stable clusters of particles
export function detectStableClusters(
  particles: Particle[], 
  stabilityThreshold: number = 0.5
): { clusters: Particle[][], unclusteredParticles: Particle[] } {
  const clusters: Particle[][] = [];
  const visited = new Set<string>();
  
  // Find clusters using a simple proximity algorithm
  for (const particle of particles) {
    if (visited.has(particle.id.toString())) continue;
    
    const cluster: Particle[] = [particle];
    visited.add(particle.id.toString());
    
    // Expand cluster
    let i = 0;
    while (i < cluster.length) {
      const current = cluster[i];
      
      for (const other of particles) {
        if (visited.has(other.id.toString())) continue;
        
        // Calculate distance
        const dx = other.x - current.x;
        const dy = other.y - current.y;
        const distanceSquared = dx * dx + dy * dy;
        
        // Add to cluster if close enough and similar charge
        const maxDistance = (current.radius + other.radius) * 3;
        if (distanceSquared <= maxDistance * maxDistance && 
            other.charge === current.charge) {
          cluster.push(other);
          visited.add(other.id.toString());
        }
      }
      
      i++;
    }
    
    // Only consider it a cluster if it has multiple particles
    if (cluster.length > 1) {
      clusters.push(cluster);
    }
  }
  
  // Find unclustered particles
  const unclusteredParticles = particles.filter(p => 
    !clusters.some(cluster => cluster.some(cp => cp.id.toString() === p.id.toString()))
  );
  
  return { clusters, unclusteredParticles };
}

// Evolve intelligence and complexity in clusters
export function evolveClusterIntelligence(
  clusters: Particle[][],
  stats: SimulationStats,
  evolutionRate: number = 0.1
): Particle[][] {
  // Implementation with fixed type issues
  return clusters.map(cluster => {
    return cluster.map(particle => {
      // Simple evolution logic - increase complexity based on interactions
      return {
        ...particle,
        complexity: (particle.complexity || 1) * (1 + evolutionRate),
        knowledge: (particle.knowledge || 0) + evolutionRate * (particle.interactions || 0) / 100
      };
    });
  });
}

// Generate narratives from evolved clusters
export function generateClusterNarratives(
  clusters: Particle[][],
  stats: SimulationStats
): Array<{ clusterId: number, narrative: string, timestamp: number }> {
  const narratives: Array<{ clusterId: number, narrative: string, timestamp: number }> = [];
  
  clusters.forEach((cluster, index) => {
    if (cluster.length < 3) return; // Only generate narratives for significant clusters
    
    const avgComplexity = cluster.reduce((sum, p) => sum + (p.complexity || 1), 0) / cluster.length;
    const avgKnowledge = cluster.reduce((sum, p) => sum + (p.knowledge || 0), 0) / cluster.length;
    
    if (avgComplexity > 1.5 && avgKnowledge > 0.5) {
      const now = Date.now();
      narratives.push({
        clusterId: index,
        narrative: `Cluster ${index} has developed a collective intelligence with complexity ${avgComplexity.toFixed(2)} and knowledge ${avgKnowledge.toFixed(2)}`,
        timestamp: now
      });
    }
  });
  
  return narratives;
}

// Identify robot-level intelligent clusters
export function identifyRobotClusters(clusters: Particle[][]): any[] {
  return clusters
    .filter(cluster => {
      const avgComplexity = cluster.reduce((sum, p) => sum + (p.complexity || 1), 0) / cluster.length;
      const avgKnowledge = cluster.reduce((sum, p) => sum + (p.knowledge || 0), 0) / cluster.length;
      return avgComplexity > 2.5 && avgKnowledge > 1.5 && cluster.length > 5;
    })
    .map((cluster, index) => {
      return {
        id: `robot-${index}-${Date.now()}`,
        particles: cluster.map(p => p.id.toString()),
        intelligence: cluster.reduce((sum, p) => sum + (p.complexity || 1) * (p.knowledge || 0), 0) / cluster.length,
        creation: Date.now(),
        type: 'emergent'
      };
    });
}
