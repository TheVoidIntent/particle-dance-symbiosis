
import { Particle, SimulationStats } from '@/types/simulation';

/**
 * Detect stable clusters of particles based on proximity and properties
 */
export function detectStableClusters(
  particles: Particle[], 
  stabilityThreshold: number = 0.5
): { 
  clusters: Particle[][], 
  unclusteredParticles: Particle[] 
} {
  const clusters: Particle[][] = [];
  const visited = new Set<string>();
  
  // Find clusters using a simple proximity algorithm
  for (const particle of particles) {
    if (visited.has(particle.id)) continue;
    
    const cluster: Particle[] = [particle];
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
        if (distanceSquared <= maxDistance * maxDistance && 
            other.charge === current.charge) {
          cluster.push(other);
          visited.add(other.id);
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
    !visited.has(p.id)
  );
  
  return { clusters, unclusteredParticles };
}

/**
 * Evolve cluster intelligence based on interactions and complexity
 */
export function evolveClusterIntelligence(
  clusters: Particle[][], 
  simulationStats: SimulationStats,
  learningRate: number = 0.1
): Particle[][] {
  return clusters.map(cluster => {
    // Calculate collective intelligence
    const avgKnowledge = cluster.reduce((sum, p) => sum + (p.knowledge || 0), 0) / cluster.length;
    const avgComplexity = cluster.reduce((sum, p) => sum + (p.complexity || 0), 0) / cluster.length;
    const totalInteractions = cluster.reduce((sum, p) => sum + (p.interactions || 0), 0);
    
    // Evolve each particle in the cluster
    return cluster.map(particle => {
      // Knowledge increases based on cluster's total knowledge
      const knowledgeGain = avgKnowledge * learningRate * (1 + Math.random() * 0.5);
      
      // Complexity increases based on interactions
      const complexityGain = (totalInteractions / 100) * learningRate * (1 + Math.random() * 0.3);
      
      // Return evolved particle
      return {
        ...particle,
        knowledge: (particle.knowledge || 0) + knowledgeGain,
        complexity: (particle.complexity || 1) + complexityGain,
        adaptiveScore: (particle.adaptiveScore || 0) + (Math.random() * learningRate),
        isInCluster: true,
        clusterId: Math.abs(cluster[0].id.hashCode?.() || 0) % 100000, // Simple cluster ID
        clusterAffinity: 0.5 + Math.random() * 0.5
      };
    });
  });
}

/**
 * Generate narratives for evolved clusters
 */
export function generateClusterNarratives(
  clusters: Particle[][], 
  simulationStats: SimulationStats
): Array<{ clusterId: number, narrative: string, timestamp: number }> {
  const narratives: Array<{ clusterId: number, narrative: string, timestamp: number }> = [];
  
  clusters.forEach(cluster => {
    if (cluster.length < 3) return; // Only generate narratives for significant clusters
    
    const avgKnowledge = cluster.reduce((sum, p) => sum + (p.knowledge || 0), 0) / cluster.length;
    const totalInteractions = cluster.reduce((sum, p) => sum + (p.interactions || 0), 0);
    const charge = cluster[0].charge;
    const clusterId = Math.abs(cluster[0].id.hashCode?.() || 0) % 100000;
    
    // Generate a simple narrative based on cluster properties
    let narrative = `Cluster ${clusterId} has formed with ${cluster.length} ${charge} particles. `;
    
    if (avgKnowledge > 5) {
      narrative += `The cluster shows signs of emerging collective intelligence. `;
    }
    
    if (totalInteractions > 100) {
      narrative += `With ${totalInteractions} total interactions, it's developing a complex internal structure. `;
    }
    
    if (cluster.length > 10) {
      narrative += `This large cluster is stable and may evolve further complexity. `;
    }
    
    // Add the narrative
    narratives.push({
      clusterId,
      narrative,
      timestamp: Date.now()
    });
  });
  
  return narratives;
}

/**
 * Identify clusters that have evolved to robot-level intelligence
 */
export function identifyRobotClusters(clusters: Particle[][]): any[] {
  const robots: any[] = [];
  
  clusters.forEach(cluster => {
    // Check if cluster meets robot criteria
    const avgKnowledge = cluster.reduce((sum, p) => sum + (p.knowledge || 0), 0) / cluster.length;
    const avgComplexity = cluster.reduce((sum, p) => sum + (p.complexity || 0), 0) / cluster.length;
    const totalInteractions = cluster.reduce((sum, p) => sum + (p.interactions || 0), 0);
    
    // Simple criteria for robot emergence
    if (cluster.length >= 7 && avgKnowledge > 10 && avgComplexity > 5 && totalInteractions > 200) {
      const clusterId = Math.abs(cluster[0].id.hashCode?.() || 0) % 100000;
      
      robots.push({
        id: `robot-${clusterId}`,
        name: `Emergent Intelligence ${clusterId.toString(16).toUpperCase()}`,
        intelligence: avgKnowledge * avgComplexity / 10,
        complexity: avgComplexity,
        knowledge: avgKnowledge,
        particles: cluster.length,
        color: cluster[0].color,
        birthTime: Date.now(),
        type: cluster[0].charge === 'positive' ? 'explorative' : 
             cluster[0].charge === 'negative' ? 'conservative' : 'balanced'
      });
    }
  });
  
  return robots;
}

// Helper extension for string ID hashing 
declare global {
  interface String {
    hashCode?: () => number;
  }
}

if (!String.prototype.hashCode) {
  String.prototype.hashCode = function(): number {
    let hash = 0;
    for (let i = 0; i < this.length; i++) {
      const char = this.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
  };
}
