
import { Particle } from '@/types/simulation';
import { calculateParticleAffinity, predictEmergence } from '@/utils/neuralNetworkUtils';

/**
 * Detects stable clusters in the particle system
 */
export function detectStableClusters(particles: Particle[], stabilityThreshold: number = 0.7): {
  clusters: Array<{ id: number, particles: Particle[], coherence: number, knowledge: Record<string, any> }>,
  unclusteredParticles: Particle[]
} {
  // Initialize result
  const result = {
    clusters: [] as Array<{ id: number, particles: Particle[], coherence: number, knowledge: Record<string, any> }>,
    unclusteredParticles: [...particles]
  };
  
  if (particles.length < 5) return result; // Not enough particles for meaningful clusters
  
  // Build affinity matrix
  const affinityMatrix: number[][] = [];
  for (let i = 0; i < particles.length; i++) {
    affinityMatrix[i] = [];
    for (let j = 0; j < particles.length; j++) {
      if (i === j) {
        affinityMatrix[i][j] = 1; // Self-affinity is 1
      } else if (j < i) {
        affinityMatrix[i][j] = affinityMatrix[j][i]; // Matrix is symmetric
      } else {
        affinityMatrix[i][j] = calculateParticleAffinity(particles[i], particles[j]);
      }
    }
  }
  
  // Identify clusters using a simple threshold-based approach
  const visited = new Set<number>();
  let clusterId = 1;
  
  for (let i = 0; i < particles.length; i++) {
    if (visited.has(i)) continue;
    
    const clusterParticles: Particle[] = [];
    const queue: number[] = [i];
    visited.add(i);
    
    while (queue.length > 0) {
      const current = queue.shift()!;
      clusterParticles.push(particles[current]);
      
      for (let j = 0; j < particles.length; j++) {
        if (!visited.has(j) && affinityMatrix[current][j] > stabilityThreshold) {
          visited.add(j);
          queue.push(j);
        }
      }
    }
    
    if (clusterParticles.length >= 3) { // Minimum cluster size
      // Calculate cluster coherence
      let totalAffinitySum = 0;
      let pairCount = 0;
      
      for (let m = 0; m < clusterParticles.length; m++) {
        for (let n = m + 1; n < clusterParticles.length; n++) {
          const particleIndex1 = particles.indexOf(clusterParticles[m]);
          const particleIndex2 = particles.indexOf(clusterParticles[n]);
          totalAffinitySum += affinityMatrix[particleIndex1][particleIndex2];
          pairCount++;
        }
      }
      
      const coherence = pairCount > 0 ? totalAffinitySum / pairCount : 0;
      
      // Merge knowledge from all particles in the cluster
      const combinedKnowledge: Record<string, any> = {};
      clusterParticles.forEach(p => {
        if (p.knowledgeBase) {
          Object.entries(p.knowledgeBase).forEach(([key, value]) => {
            if (!combinedKnowledge[key]) {
              combinedKnowledge[key] = value;
            } else if (typeof value === 'number' && typeof combinedKnowledge[key] === 'number') {
              // Average numeric values
              combinedKnowledge[key] = (combinedKnowledge[key] + value) / 2;
            }
          });
        }
      });
      
      // Add the cluster to results
      result.clusters.push({
        id: clusterId++,
        particles: clusterParticles,
        coherence,
        knowledge: combinedKnowledge
      });
      
      // Remove these particles from unclustered list
      result.unclusteredParticles = result.unclusteredParticles.filter(
        p => !clusterParticles.includes(p)
      );
    }
  }
  
  return result;
}

/**
 * Evolves clusters into more intelligent entities
 */
export function evolveClusterIntelligence(
  clusters: Array<{ id: number, particles: Particle[], coherence: number, knowledge: Record<string, any> }>,
  simulationData: any,
  learningRate: number = 0.1
): Array<{ id: number, particles: Particle[], coherence: number, knowledge: Record<string, any>, insights: string[] }> {
  return clusters.map(cluster => {
    const enhancedCluster = { ...cluster, insights: [] as string[] };
    
    // Learning from simulation data
    if (simulationData) {
      // Example learning pattern - expand as needed
      if (simulationData.complexityIndex && !cluster.knowledge.complexityThreshold) {
        enhancedCluster.knowledge.complexityThreshold = simulationData.complexityIndex * 0.8;
        enhancedCluster.insights.push(`Established complexity threshold at ${(simulationData.complexityIndex * 0.8).toFixed(2)}`);
      }
      
      if (simulationData.particleTypes) {
        enhancedCluster.knowledge.optimalChargeRatio = {
          positive: simulationData.particleTypes.positive / simulationData.particleCount,
          negative: simulationData.particleTypes.negative / simulationData.particleCount,
          neutral: simulationData.particleTypes.neutral / simulationData.particleCount
        };
        enhancedCluster.insights.push("Learned optimal charge distribution ratio");
      }
    }
    
    // Enhance particles in the cluster
    enhancedCluster.particles = cluster.particles.map(particle => {
      const enhancedParticle = { ...particle };
      
      // Increase adaptive index based on cluster coherence
      enhancedParticle.adaptiveIndex = (enhancedParticle.adaptiveIndex || 0) + (cluster.coherence * learningRate);
      
      // Apply cluster knowledge to individual particles
      enhancedParticle.knowledgeBase = { 
        ...enhancedParticle.knowledgeBase,
        clusterCoherence: cluster.coherence,
        clusterId: cluster.id,
      };
      
      enhancedParticle.isInCluster = true;
      enhancedParticle.clusterId = cluster.id;
      
      // Calculate insight score based on particle properties and cluster coherence
      enhancedParticle.insightScore = ((enhancedParticle.adaptiveIndex || 0) * 0.5) + 
                                      (cluster.coherence * 0.3) +
                                      ((enhancedParticle.knowledge || 0) * 0.2);
      
      return enhancedParticle;
    });
    
    return enhancedCluster;
  });
}

/**
 * Generates narrative insights from cluster behavior
 */
export function generateClusterNarratives(
  evolvedClusters: Array<{ id: number, particles: Particle[], coherence: number, knowledge: Record<string, any>, insights: string[] }>,
  simulationStats: any
): Array<{ clusterId: number, narrative: string, timestamp: number }> {
  const narratives: Array<{ clusterId: number, narrative: string, timestamp: number }> = [];
  
  evolvedClusters.forEach(cluster => {
    // Generate basic narrative based on cluster properties
    let narrativeText = '';
    
    // Cluster size and composition
    const positiveCount = cluster.particles.filter(p => p.charge === 'positive').length;
    const negativeCount = cluster.particles.filter(p => p.charge === 'negative').length;
    const neutralCount = cluster.particles.filter(p => p.charge === 'neutral').length;
    
    if (cluster.coherence > 0.8) {
      narrativeText = `Highly stable cluster #${cluster.id} (${cluster.particles.length} particles) has formed with strong internal coherence. `;
    } else if (cluster.coherence > 0.6) {
      narrativeText = `Moderately stable cluster #${cluster.id} (${cluster.particles.length} particles) has emerged. `;
    } else {
      narrativeText = `Loosely connected cluster #${cluster.id} (${cluster.particles.length} particles) is beginning to form. `;
    }
    
    // Add composition analysis
    narrativeText += `Composition: ${positiveCount} positive, ${negativeCount} negative, ${neutralCount} neutral particles. `;
    
    // Add insights from learning
    if (cluster.insights && cluster.insights.length > 0) {
      narrativeText += `Recent insights: ${cluster.insights.join("; ")}. `;
    }
    
    // Add prediction or observation about future behavior
    const adaptiveIndex = cluster.particles.reduce((sum, p) => sum + (p.adaptiveIndex || 0), 0) / cluster.particles.length;
    if (adaptiveIndex > 0.7) {
      narrativeText += `This cluster shows signs of high adaptive intelligence and may develop emergent behaviors.`;
    } else if (adaptiveIndex > 0.4) {
      narrativeText += `This cluster is developing moderate learning capabilities.`;
    } else {
      narrativeText += `This cluster is in early stages of knowledge accumulation.`;
    }
    
    narratives.push({
      clusterId: cluster.id,
      narrative: narrativeText,
      timestamp: Date.now()
    });
  });
  
  return narratives;
}

/**
 * Evaluates if any clusters have reached robot-level intelligence
 */
export function identifyRobotClusters(
  evolvedClusters: Array<{ 
    id: number, 
    particles: Particle[], 
    coherence: number, 
    knowledge: Record<string, any>, 
    insights: string[] 
  }>,
  robotThreshold: number = 0.85
): Array<{ 
  id: number, 
  intelligence: number, 
  specialization: string,
  capabilities: string[],
  particles: Particle[]
}> {
  const robotClusters = [];
  
  for (const cluster of evolvedClusters) {
    // Calculate average insight score as intelligence measure
    const intelligence = cluster.particles.reduce((sum, p) => sum + (p.insightScore || 0), 0) / cluster.particles.length;
    
    if (intelligence >= robotThreshold && cluster.coherence >= 0.75) {
      // Determine specialization based on particle composition
      const positiveRatio = cluster.particles.filter(p => p.charge === 'positive').length / cluster.particles.length;
      const negativeRatio = cluster.particles.filter(p => p.charge === 'negative').length / cluster.particles.length;
      const neutralRatio = cluster.particles.filter(p => p.charge === 'neutral').length / cluster.particles.length;
      
      let specialization = '';
      const capabilities = [];
      
      if (positiveRatio > 0.6) {
        specialization = 'Knowledge Gatherer';
        capabilities.push('Rapid data acquisition', 'Pattern recognition', 'Information synthesis');
      } else if (negativeRatio > 0.6) {
        specialization = 'Information Preserver';
        capabilities.push('Data preservation', 'Error correction', 'Consistency enforcement');
      } else if (neutralRatio > 0.6) {
        specialization = 'Balanced Processor';
        capabilities.push('Unbiased analysis', 'Multi-perspective reasoning', 'Objective assessment');
      } else if (positiveRatio > 0.4 && negativeRatio > 0.4) {
        specialization = 'Dynamic Adapter';
        capabilities.push('Context switching', 'Versatile processing', 'Adaptive learning');
      } else {
        specialization = 'Generalist';
        capabilities.push('Broad expertise', 'Flexible processing', 'Diverse functionality');
      }
      
      // Special case for IntentSimon
      if (cluster.id === 1 && intelligence > 0.9) {
        specialization = 'IntentSimon';
        capabilities.push('User interaction', 'Intent-field analysis', 'Knowledge distillation');
      }
      
      robotClusters.push({
        id: cluster.id,
        intelligence,
        specialization,
        capabilities,
        particles: cluster.particles
      });
    }
  }
  
  return robotClusters;
}
