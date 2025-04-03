
import { Particle, SimulationStats } from '@/types/simulation';

/**
 * Type definition for a cluster
 */
interface ParticleCluster {
  id: number;
  particles: Particle[];
  centerX: number;
  centerY: number;
  radius: number;
  charge: 'positive' | 'negative' | 'neutral';
  avgEnergy: number;
  avgKnowledge: number;
  stability: number;
  age: number;
  lastUpdated: number;
}

/**
 * Detect stable clusters from particles
 * @param particles The particles to analyze
 * @param stabilityThreshold The threshold for cluster stability
 */
export function detectStableClusters(
  particles: Particle[],
  stabilityThreshold: number = 0.5
): { clusters: ParticleCluster[], unclusteredParticles: Particle[] } {
  // Simple clustering algorithm based on proximity and charge
  const clusters: ParticleCluster[] = [];
  const visited = new Set<string>();
  let clusterId = 0;
  
  // Find clusters
  for (const particle of particles) {
    if (visited.has(particle.id)) continue;
    
    const cluster: Particle[] = [particle];
    visited.add(particle.id);
    
    // Find nearby particles with same charge
    for (const otherParticle of particles) {
      if (visited.has(otherParticle.id)) continue;
      if (otherParticle.charge !== particle.charge) continue;
      
      const dx = otherParticle.x - particle.x;
      const dy = otherParticle.y - particle.y;
      const distance = Math.sqrt(dx*dx + dy*dy);
      
      if (distance < 50) { // Proximity threshold
        cluster.push(otherParticle);
        visited.add(otherParticle.id);
      }
    }
    
    // Only consider as cluster if it has multiple particles
    if (cluster.length >= 3) {
      // Calculate cluster properties
      const centerX = cluster.reduce((sum, p) => sum + p.x, 0) / cluster.length;
      const centerY = cluster.reduce((sum, p) => sum + p.y, 0) / cluster.length;
      
      // Calculate max distance from center as radius
      const radius = Math.max(...cluster.map(p => 
        Math.sqrt(Math.pow(p.x - centerX, 2) + Math.pow(p.y - centerY, 2))
      ));
      
      const avgEnergy = cluster.reduce((sum, p) => sum + (p.energy || 0), 0) / cluster.length;
      const avgKnowledge = cluster.reduce((sum, p) => sum + (p.knowledge || 0), 0) / cluster.length;
      
      // Calculate stability based on velocity variance
      const velocities = cluster.map(p => Math.sqrt(p.vx*p.vx + p.vy*p.vy));
      const avgVelocity = velocities.reduce((sum, v) => sum + v, 0) / velocities.length;
      const velocityVariance = velocities.reduce((sum, v) => sum + Math.pow(v - avgVelocity, 2), 0) / velocities.length;
      const stability = Math.max(0, 1 - velocityVariance / 5); // Normalize
      
      if (stability >= stabilityThreshold) {
        clusters.push({
          id: clusterId++,
          particles: cluster,
          centerX,
          centerY,
          radius,
          charge: particle.charge as 'positive' | 'negative' | 'neutral',
          avgEnergy,
          avgKnowledge,
          stability,
          age: cluster.reduce((min, p) => Math.min(min, p.age || 0), Infinity),
          lastUpdated: Date.now()
        });
      }
    }
  }
  
  // Find unclustered particles
  const unclusteredParticles = particles.filter(p => 
    !clusters.some(c => c.particles.some(cp => cp.id === p.id))
  );
  
  return { clusters, unclusteredParticles };
}

/**
 * Evolve cluster intelligence
 * @param clusters The clusters to evolve
 * @param stats The current simulation stats
 * @param learningRate The rate at which clusters evolve
 */
export function evolveClusterIntelligence(
  clusters: ParticleCluster[],
  stats: SimulationStats,
  learningRate: number = 0.1
): ParticleCluster[] {
  return clusters.map(cluster => {
    // Calculate new knowledge based on interactions and energy
    const newAvgKnowledge = cluster.avgKnowledge + 
      (stats.totalInteractions ? learningRate * cluster.stability / stats.totalInteractions : 0);
    
    return {
      ...cluster,
      avgKnowledge: newAvgKnowledge,
      lastUpdated: Date.now()
    };
  });
}

/**
 * Generate narratives for clusters
 * @param clusters The clusters to generate narratives for
 * @param stats The current simulation stats
 */
export function generateClusterNarratives(
  clusters: ParticleCluster[],
  stats: SimulationStats
): Array<{ clusterId: number, narrative: string, timestamp: number }> {
  return clusters
    .filter(c => c.avgKnowledge > 0.5) // Only generate narratives for clusters with sufficient knowledge
    .map(cluster => {
      let narrative = '';
      
      if (cluster.charge === 'positive') {
        narrative = `Positive cluster #${cluster.id} with ${cluster.particles.length} particles has formed a cooperative structure.`;
      } else if (cluster.charge === 'negative') {
        narrative = `Negative cluster #${cluster.id} with ${cluster.particles.length} particles has formed an isolationist structure.`;
      } else {
        narrative = `Neutral cluster #${cluster.id} with ${cluster.particles.length} particles has formed a balanced structure.`;
      }
      
      if (cluster.avgKnowledge > 1.0) {
        narrative += ` This cluster has acquired significant knowledge (${cluster.avgKnowledge.toFixed(2)}) and shows signs of emergent behavior.`;
      }
      
      if (cluster.stability > 0.8) {
        narrative += ` The cluster appears highly stable and may persist for an extended period.`;
      }
      
      return {
        clusterId: cluster.id,
        narrative,
        timestamp: Date.now()
      };
    });
}

/**
 * Identify robot-level clusters (highly evolved)
 * @param clusters The clusters to analyze
 */
export function identifyRobotClusters(clusters: ParticleCluster[]): any[] {
  return clusters
    .filter(c => 
      c.avgKnowledge > 2.0 && 
      c.stability > 0.9 && 
      c.particles.length > 10
    )
    .map(cluster => ({
      id: `robot-${cluster.id}`,
      type: cluster.charge === 'positive' ? 'collaborative' : cluster.charge === 'negative' ? 'isolationist' : 'balanced',
      intelligence: cluster.avgKnowledge,
      particleCount: cluster.particles.length,
      creationTime: Date.now(),
      baseClusterId: cluster.id
    }));
}
