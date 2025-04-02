
import { Particle, SimulationStats } from '@/types/simulation';

export function detectStableClusters(
  particles: Particle[],
  stabilityThreshold: number = 0.6
): { clusters: Particle[][], unclusteredParticles: Particle[] } {
  const clusters: Particle[][] = [];
  const visited = new Set<string>();
  
  // Simple clustering based on proximity and charge
  for (const particle of particles) {
    const particleId = typeof particle.id === 'number' ? particle.id.toString() : particle.id;
    if (visited.has(particleId)) continue;
    
    const cluster: Particle[] = [particle];
    visited.add(particleId);
    
    let i = 0;
    while (i < cluster.length) {
      const current = cluster[i];
      
      for (const other of particles) {
        const otherId = typeof other.id === 'number' ? other.id.toString() : other.id;
        if (visited.has(otherId)) continue;
        
        // Check proximity
        const dx = other.x - current.x;
        const dy = other.y - current.y;
        const distanceSquared = dx * dx + dy * dy;
        
        // Consider particles close and of same charge to be in same cluster
        const maxDistance = (current.radius + other.radius) * 3;
        if (distanceSquared <= maxDistance * maxDistance && other.charge === current.charge) {
          cluster.push(other);
          visited.add(otherId);
        }
      }
      
      i++;
    }
    
    // Only consider it a cluster if it has multiple particles
    if (cluster.length > 1) {
      clusters.push(cluster);
    }
  }
  
  // Find remaining unclustered particles
  const unclusteredParticles = particles.filter(p => {
    const particleId = typeof p.id === 'number' ? p.id.toString() : p.id;
    return !visited.has(particleId);
  });
  
  return { clusters, unclusteredParticles };
}

export function evolveClusterIntelligence(
  clusters: Particle[][],
  stats: SimulationStats,
  evolutionRate: number = 0.1
): Particle[][] {
  // Simple cluster evolution - increase knowledge and complexity based on size
  return clusters.map(cluster => {
    // Larger clusters evolve faster
    const sizeMultiplier = Math.min(1, cluster.length / 10);
    
    return cluster.map(particle => {
      const knowledgeIncrease = evolutionRate * sizeMultiplier;
      const complexityIncrease = evolutionRate * sizeMultiplier * 0.5;
      
      return {
        ...particle,
        knowledge: (particle.knowledge || 0) + knowledgeIncrease,
        complexity: (particle.complexity || 1) + complexityIncrease
      };
    });
  });
}

export function generateClusterNarratives(
  clusters: Particle[][],
  stats: SimulationStats
): Array<{ clusterId: number, narrative: string, timestamp: number }> {
  const narratives: Array<{ clusterId: number, narrative: string, timestamp: number }> = [];
  
  clusters.forEach((cluster, index) => {
    // Only generate narratives for significant clusters
    if (cluster.length < 5) return;
    
    // Get average knowledge and complexity
    const avgKnowledge = cluster.reduce((sum, p) => sum + (p.knowledge || 0), 0) / cluster.length;
    const avgComplexity = cluster.reduce((sum, p) => sum + (p.complexity || 1), 0) / cluster.length;
    
    // Generate a narrative based on cluster properties
    let narrative = '';
    const chargeType = cluster[0].charge;
    
    if (avgKnowledge > 5 && avgComplexity > 3) {
      narrative = `Cluster ${index} has developed advanced information processing capabilities.`;
    } else if (avgKnowledge > 3) {
      narrative = `Cluster ${index} is sharing information efficiently between particles.`;
    } else {
      narrative = `Cluster ${index} of ${chargeType} particles has formed a stable structure.`;
    }
    
    narratives.push({
      clusterId: index,
      narrative,
      timestamp: Date.now()
    });
  });
  
  return narratives;
}

export function identifyRobotClusters(
  clusters: Particle[][]
): Array<any> {
  const robots: Array<any> = [];
  
  clusters.forEach((cluster, index) => {
    // Criteria for robot-level intelligence
    const avgKnowledge = cluster.reduce((sum, p) => sum + (p.knowledge || 0), 0) / cluster.length;
    const avgComplexity = cluster.reduce((sum, p) => sum + (p.complexity || 1), 0) / cluster.length;
    const totalEnergy = cluster.reduce((sum, p) => sum + (p.energy || 0), 0);
    
    // Only the most evolved clusters become "robots"
    if (cluster.length >= 10 && avgKnowledge > 8 && avgComplexity > 5) {
      const centerX = cluster.reduce((sum, p) => sum + p.x, 0) / cluster.length;
      const centerY = cluster.reduce((sum, p) => sum + p.y, 0) / cluster.length;
      
      robots.push({
        id: `robot-${index}`,
        x: centerX,
        y: centerY,
        particles: cluster.length,
        intelligence: avgKnowledge * avgComplexity,
        energy: totalEnergy,
        type: 'collective_intelligence',
        creationTime: Date.now(),
        charge: cluster[0].charge
      });
    }
  });
  
  return robots;
}
