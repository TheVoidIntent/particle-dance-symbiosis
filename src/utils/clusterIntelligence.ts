
import { v4 as uuidv4 } from 'uuid';
import { Particle } from '@/utils/particleUtils';
import { SimulationStats } from '@/types/simulation';

interface Cluster {
  id: number;
  particles: Particle[];
  centroid: { x: number, y: number };
  stability: number;
  intelligence?: number;
  complexity?: number;
  narratives?: string[];
}

/**
 * Detect stable clusters of particles
 */
export function detectStableClusters(
  particles: Particle[], 
  stabilityThreshold: number = 0.5
): { 
  clusters: Cluster[], 
  unclusteredParticles: Particle[] 
} {
  // Use a simple distance-based clustering algorithm
  const clusters: Cluster[] = [];
  const visitedParticles = new Set<string>();
  
  // For each particle
  for (const particle of particles) {
    // Skip if already in a cluster
    if (visitedParticles.has(particle.id)) continue;
    
    // Start a new cluster with this particle
    const cluster: Particle[] = [particle];
    visitedParticles.add(particle.id);
    
    // Find neighbors
    const neighbors = findNeighbors(particle, particles, 40);
    
    // Add each neighbor to cluster
    for (const neighbor of neighbors) {
      if (!visitedParticles.has(neighbor.id)) {
        cluster.push(neighbor);
        visitedParticles.add(neighbor.id);
      }
    }
    
    // Only consider as a cluster if it has multiple particles
    if (cluster.length > 2) {
      // Calculate centroid
      const centroid = calculateCentroid(cluster);
      
      // Calculate stability (ratio of particles with similar charges)
      const stability = calculateClusterStability(cluster);
      
      if (stability >= stabilityThreshold) {
        clusters.push({
          id: clusters.length + 1,
          particles: cluster,
          centroid,
          stability
        });
      }
    }
  }
  
  // Find unclustered particles
  const unclusteredParticles = particles.filter(p => 
    !visitedParticles.has(p.id)
  );
  
  return { clusters, unclusteredParticles };
}

/**
 * Find neighboring particles within a radius
 */
function findNeighbors(
  particle: Particle, 
  allParticles: Particle[], 
  radius: number
): Particle[] {
  return allParticles.filter(p => {
    if (p.id === particle.id) return false;
    
    const dx = p.x - particle.x;
    const dy = p.y - particle.y;
    const distanceSquared = dx * dx + dy * dy;
    
    return distanceSquared <= radius * radius;
  });
}

/**
 * Calculate the center position of a cluster
 */
function calculateCentroid(particles: Particle[]): { x: number, y: number } {
  const sum = particles.reduce((acc, p) => ({
    x: acc.x + p.x,
    y: acc.y + p.y
  }), { x: 0, y: 0 });
  
  return {
    x: sum.x / particles.length,
    y: sum.y / particles.length
  };
}

/**
 * Calculate cluster stability based on charge similarity
 */
function calculateClusterStability(particles: Particle[]): number {
  const charges = {
    positive: 0,
    negative: 0,
    neutral: 0
  };
  
  // Count charges
  particles.forEach(p => {
    charges[p.charge]++;
  });
  
  // Find dominant charge
  const total = particles.length;
  const dominant = Math.max(charges.positive, charges.negative, charges.neutral);
  
  // Stability is the ratio of dominant charge to total
  return dominant / total;
}

/**
 * Evolve cluster intelligence based on simulation stats
 */
export function evolveClusterIntelligence(
  clusters: Cluster[], 
  stats: SimulationStats, 
  learningRate: number = 0.1
): Cluster[] {
  return clusters.map(cluster => {
    // Calculate intelligence based on particles and simulation stats
    const baseIntelligence = (cluster.particles.length / 10) * 
      (stats.complexityIndex || 1) * 
      cluster.stability;
    
    // Previous intelligence or 0
    const previousIntelligence = cluster.intelligence || 0;
    
    // Apply learning
    const newIntelligence = previousIntelligence + 
      (baseIntelligence - previousIntelligence) * learningRate;
    
    // Calculate complexity
    const complexity = Math.log(1 + cluster.particles.length) * 
      (1 + newIntelligence) * 
      (1 + (stats.systemEntropy || 0));
    
    return {
      ...cluster,
      intelligence: newIntelligence,
      complexity
    };
  });
}

/**
 * Generate narratives for intelligent clusters
 */
export function generateClusterNarratives(
  clusters: Cluster[],
  stats: SimulationStats
): Array<{ clusterId: number, narrative: string, timestamp: number }> {
  const narratives: Array<{ clusterId: number, narrative: string, timestamp: number }> = [];
  
  clusters.forEach(cluster => {
    if ((cluster.intelligence || 0) > 1.0) {
      // Simple narrative generation based on cluster properties
      const size = cluster.particles.length;
      const intelligence = (cluster.intelligence || 0).toFixed(2);
      const stability = (cluster.stability).toFixed(2);
      
      const narrativeTypes = [
        `Cluster ${cluster.id} has reached an intelligence level of ${intelligence}.`,
        `A stable pattern with ${size} particles has formed at (${Math.floor(cluster.centroid.x)}, ${Math.floor(cluster.centroid.y)}).`,
        `Information processing detected in cluster ${cluster.id}. Stability: ${stability}.`,
        `Emergence threshold crossed in region near (${Math.floor(cluster.centroid.x)}, ${Math.floor(cluster.centroid.y)}).`
      ];
      
      // Select a narrative randomly
      const narrative = narrativeTypes[Math.floor(Math.random() * narrativeTypes.length)];
      
      narratives.push({
        clusterId: cluster.id,
        narrative,
        timestamp: Date.now()
      });
    }
  });
  
  return narratives;
}

/**
 * Identify clusters that have evolved to robot-level intelligence
 */
export function identifyRobotClusters(clusters: Cluster[]): any[] {
  const robots: any[] = [];
  
  clusters.forEach(cluster => {
    // Check if cluster has sufficient intelligence and complexity
    if ((cluster.intelligence || 0) > 5.0 && (cluster.complexity || 0) > 10.0) {
      // Create a robot entity
      const robot = {
        id: uuidv4(),
        clusterId: cluster.id,
        position: cluster.centroid,
        particleCount: cluster.particles.length,
        intelligence: cluster.intelligence,
        complexity: cluster.complexity,
        timeCreated: Date.now(),
        type: determineRobotType(cluster)
      };
      
      robots.push(robot);
    }
  });
  
  return robots;
}

/**
 * Determine robot type based on cluster properties
 */
function determineRobotType(cluster: Cluster): string {
  // Count charges
  const charges = {
    positive: 0,
    negative: 0,
    neutral: 0
  };
  
  cluster.particles.forEach(p => {
    charges[p.charge]++;
  });
  
  // Determine dominant charge
  if (charges.positive > charges.negative && charges.positive > charges.neutral) {
    return 'explorer';
  } else if (charges.negative > charges.positive && charges.negative > charges.neutral) {
    return 'observer';
  } else {
    return 'balancer';
  }
}
