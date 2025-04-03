import { Particle, SimulationStats } from '@/types/simulation';

/**
 * Detect stable clusters of particles
 */
export function detectStableClusters(
  particles: Particle[], 
  stabilityThreshold: number = 0.5
): { 
  clusters: Particle[][]; 
  unclusteredParticles: Particle[] 
} {
  // Track particles that have been assigned to clusters
  const visitedIds = new Set<string>();
  const clusters: Particle[][] = [];
  
  // Find clusters using a proximity-based algorithm
  for (const particle of particles) {
    // Skip if already in a cluster
    if (visitedIds.has(particle.id)) continue;
    
    // Start a new cluster with this particle
    const cluster: Particle[] = [particle];
    visitedIds.add(particle.id);
    
    // Keep expanding the cluster
    let index = 0;
    while (index < cluster.length) {
      const current = cluster[index];
      
      // Look for nearby particles
      for (const other of particles) {
        if (visitedIds.has(other.id)) continue;
        
        // Calculate distance
        const dx = other.x - current.x;
        const dy = other.y - current.y;
        const distance = Math.sqrt(dx*dx + dy*dy);
        
        // Add to cluster if close enough
        const interactionRadius = (current.radius || 5) + (other.radius || 5);
        if (distance < interactionRadius * 3) {
          cluster.push(other);
          visitedIds.add(other.id);
        }
      }
      
      index++;
    }
    
    // Only keep clusters with multiple particles that appear stable
    if (cluster.length > 1) {
      // Calculate stability based on relative velocities
      let totalRelativeVelocity = 0;
      for (let i = 0; i < cluster.length; i++) {
        for (let j = i + 1; j < cluster.length; j++) {
          const p1 = cluster[i];
          const p2 = cluster[j];
          const relVelX = p1.vx - p2.vx;
          const relVelY = p1.vy - p2.vy;
          totalRelativeVelocity += Math.sqrt(relVelX*relVelX + relVelY*relVelY);
        }
      }
      
      const avgRelativeVelocity = totalRelativeVelocity / (cluster.length * (cluster.length - 1) / 2);
      
      // If average relative velocity is below threshold, consider it stable
      if (avgRelativeVelocity < stabilityThreshold) {
        clusters.push(cluster);
      } else {
        // Remove these particles from visited set if cluster isn't stable
        cluster.forEach(p => visitedIds.delete(p.id));
      }
    } else {
      // Remove single particle from visited
      visitedIds.delete(particle.id);
    }
  }
  
  // Find unclustered particles
  const unclusteredParticles = particles.filter(p => !visitedIds.has(p.id));
  
  return { clusters, unclusteredParticles };
}

/**
 * Evolve intelligence in stable clusters based on simulation stats
 */
export function evolveClusterIntelligence(
  clusters: Particle[][], 
  stats: SimulationStats,
  learningRate: number = 0.1
): Particle[][] {
  return clusters.map(cluster => {
    // Calculate cluster properties
    const clusterSize = cluster.length;
    const avgKnowledge = cluster.reduce((sum, p) => sum + (p.knowledge || 0), 0) / clusterSize;
    const avgComplexity = cluster.reduce((sum, p) => sum + (p.complexity || 1), 0) / clusterSize;
    
    // Calculate knowledge growth based on system stats
    const knowledgeGrowth = (stats.systemEntropy || 0) * learningRate * avgComplexity;
    
    // Evolve each particle in the cluster
    return cluster.map(particle => {
      const knowledge = (particle.knowledge || 0) + knowledgeGrowth;
      const complexity = (particle.complexity || 1) * (1 + 0.01 * learningRate);
      
      return {
        ...particle,
        knowledge,
        complexity,
        clusterAffinity: (particle.clusterAffinity || 0) + 0.1,
        isInCluster: true
      };
    });
  });
}

/**
 * Generate narratives for evolved clusters
 */
export function generateClusterNarratives(
  clusters: Particle[][],
  stats: SimulationStats
): Array<{ clusterId: number, narrative: string, timestamp: number }> {
  const narratives: Array<{ clusterId: number, narrative: string, timestamp: number }> = [];
  
  clusters.forEach((cluster, index) => {
    // Only generate narratives for sufficiently complex clusters
    const avgComplexity = cluster.reduce((sum, p) => sum + (p.complexity || 1), 0) / cluster.length;
    const avgKnowledge = cluster.reduce((sum, p) => sum + (p.knowledge || 0), 0) / cluster.length;
    
    if (avgComplexity > 2 && avgKnowledge > 3) {
      // Generate a simple narrative based on cluster properties
      const dominantCharge = getDominantCharge(cluster);
      const narrative = generateNarrativeText(cluster, dominantCharge, avgComplexity, avgKnowledge);
      
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
 * Get the dominant charge in a cluster
 */
function getDominantCharge(cluster: Particle[]): string {
  const charges = {
    positive: 0,
    negative: 0,
    neutral: 0
  };
  
  cluster.forEach(p => {
    charges[p.charge]++;
  });
  
  if (charges.positive > charges.negative && charges.positive > charges.neutral) {
    return 'positive';
  } else if (charges.negative > charges.positive && charges.negative > charges.neutral) {
    return 'negative';
  } else {
    return 'neutral';
  }
}

/**
 * Generate narrative text based on cluster properties
 */
function generateNarrativeText(
  cluster: Particle[],
  dominantCharge: string,
  complexity: number,
  knowledge: number
): string {
  // Generate a slightly different narrative based on charge type
  if (dominantCharge === 'positive') {
    return `A cluster of ${cluster.length} positive-dominant particles has achieved knowledge level ${knowledge.toFixed(2)} through active information seeking. Their complexity rating is ${complexity.toFixed(2)}.`;
  } else if (dominantCharge === 'negative') {
    return `${cluster.length} negative-charged particles have formed a resistant cluster with complexity ${complexity.toFixed(2)}. Their knowledge level is ${knowledge.toFixed(2)} despite reluctance to share information.`;
  } else {
    return `A balanced cluster of ${cluster.length} particles has emerged with a complexity of ${complexity.toFixed(2)}. Their neutral tendency has led to a knowledge rating of ${knowledge.toFixed(2)}.`;
  }
}

/**
 * Identify clusters that have evolved to robot-level intelligence
 */
export function identifyRobotClusters(clusters: Particle[][]): any[] {
  const robots: any[] = [];
  
  clusters.forEach((cluster, index) => {
    // Calculate cluster intelligence metrics
    const avgComplexity = cluster.reduce((sum, p) => sum + (p.complexity || 1), 0) / cluster.length;
    const avgKnowledge = cluster.reduce((sum, p) => sum + (p.knowledge || 0), 0) / cluster.length;
    const size = cluster.length;
    
    // Calculate intelligence index
    const intelligenceIndex = avgKnowledge * avgComplexity * Math.log10(size);
    
    // Threshold for robot-level intelligence
    if (intelligenceIndex > 15) {
      robots.push({
        id: `robot-${index}`,
        clusterId: index,
        size,
        intelligenceIndex,
        avgComplexity,
        avgKnowledge,
        particles: cluster.map(p => p.id),
        created: Date.now()
      });
    }
  });
  
  return robots;
}
