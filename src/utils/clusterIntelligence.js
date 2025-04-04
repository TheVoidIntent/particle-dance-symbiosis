// Advanced cluster intelligence and emergence functionality

/**
 * Detects stable clusters of particles based on proximity and properties
 */
export function detectStableClusters(particles, stabilityThreshold = 0.6) {
  if (!particles || particles.length < 5) {
    return { clusters: [], unclusteredParticles: [...particles] };
  }
  
  const clusters = [];
  const visited = new Set();
  
  // Group particles into clusters
  particles.forEach(particle => {
    if (visited.has(particle.id)) return;
    
    const cluster = [particle];
    visited.add(particle.id);
    
    // Find all related particles (similar charge and close proximity)
    let i = 0;
    while (i < cluster.length) {
      const current = cluster[i];
      
      particles.forEach(other => {
        if (visited.has(other.id)) return;
        
        // Calculate distance
        const dx = other.x - current.x;
        const dy = other.y - current.y;
        const distance = Math.sqrt(dx*dx + dy*dy);
        
        // Add to cluster if close enough and same charge
        if (distance < 50 && other.charge === current.charge) {
          cluster.push(other);
          visited.add(other.id);
        }
      });
      
      i++;
    }
    
    // Only consider as a cluster if it has enough particles
    if (cluster.length >= 3) {
      // Calculate cluster properties
      const avgX = cluster.reduce((sum, p) => sum + p.x, 0) / cluster.length;
      const avgY = cluster.reduce((sum, p) => sum + p.y, 0) / cluster.length;
      const charge = cluster[0].charge;
      
      // Calculate stability based on average distance from centroid
      let totalDistance = 0;
      cluster.forEach(p => {
        const dx = p.x - avgX;
        const dy = p.y - avgY;
        totalDistance += Math.sqrt(dx*dx + dy*dy);
      });
      const avgDistance = totalDistance / cluster.length;
      const stability = 1 - (avgDistance / 100); // Normalize to 0-1
      
      // Only keep stable clusters
      if (stability >= stabilityThreshold) {
        clusters.push({
          id: `cluster-${Date.now()}-${clusters.length}`,
          particles: [...cluster],
          centroidX: avgX,
          centroidY: avgY,
          charge: charge,
          size: cluster.length,
          complexity: cluster.reduce((sum, p) => sum + (p.complexity || 1), 0) / cluster.length,
          knowledge: cluster.reduce((sum, p) => sum + (p.knowledge || 0), 0) / cluster.length,
          energy: cluster.reduce((sum, p) => sum + (p.energy || 1), 0) / cluster.length,
          formationTime: Date.now(),
          stability
        });
      } else {
        // Release particles from unstable clusters
        cluster.forEach(p => visited.delete(p.id));
      }
    }
  });
  
  // Find unclustered particles
  const unclusteredParticles = particles.filter(p => !visited.has(p.id));
  
  return { clusters, unclusteredParticles };
}

/**
 * Evolves the complexity and intelligence of clusters
 */
export function evolveClusterIntelligence(clusters, simulationStats, learningRate = 0.1) {
  return clusters.map(cluster => {
    // Knowledge increases based on:
    // 1. Cluster size (more particles = more collective knowledge)
    // 2. Cluster stability (more stable = better knowledge retention)
    // 3. Simulation complexity (higher complexity = faster learning)
    
    const complexityFactor = Math.max(0.1, simulationStats.complexityIndex || 0.5);
    const knowledgeGain = cluster.size * learningRate * complexityFactor;
    
    let knowledgeGrowth = cluster.knowledge + knowledgeGain;
    
    // Cap knowledge at a reasonable level
    knowledgeGrowth = Math.min(10, knowledgeGrowth);
    
    // Calculate intelligence score based on knowledge and complexity
    const intelligenceScore = Math.pow(knowledgeGrowth, 0.7) * Math.pow(cluster.complexity, 0.3);
    
    return {
      ...cluster,
      knowledge: knowledgeGrowth,
      complexity: cluster.complexity * (1 + 0.01 * learningRate),
      intelligenceScore
    };
  });
}

/**
 * Generates narrative descriptions of cluster activities
 */
export function generateClusterNarratives(clusters, simulationStats) {
  const narratives = [];
  
  clusters.forEach(cluster => {
    // Only generate narratives for clusters that are becoming intelligent
    if (cluster.intelligenceScore > 1.5 && Math.random() < 0.3) {
      let narrative = '';
      
      // Different narratives based on charge type
      switch(cluster.charge) {
        case 'positive':
          narrative = `A collective of ${cluster.size} positive-intent particles has formed a cooperative structure with ${cluster.knowledge.toFixed(2)} knowledge units. They are actively seeking to exchange information with nearby structures.`;
          break;
        case 'negative':
          narrative = `${cluster.size} negative-intent particles has formed an isolationist cluster with ${cluster.knowledge.toFixed(2)} knowledge units. They appear resistant to external interactions.`;
          break;
        case 'neutral':
          narrative = `A balanced formation of ${cluster.size} neutral particles has emerged with ${cluster.knowledge.toFixed(2)} knowledge units. They show selective interaction patterns based on approaching entities.`;
          break;
      }
      
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
 * Identifies clusters that have evolved enough to be considered primitive intelligence entities
 */
export function identifyRobotClusters(clusters) {
  return clusters
    .filter(cluster => 
      // Requirements for emerging intelligence:
      // 1. High knowledge (learned a lot)
      // 2. Good complexity (internal structure)
      // 3. Sufficient size (enough particles to support complexity)
      cluster.knowledge > 3 &&
      cluster.complexity > 1.5 &&
      cluster.size >= 5 &&
      cluster.intelligenceScore > 2
    )
    .map(cluster => ({
      id: `robot-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      originCluster: cluster.id,
      knowledge: cluster.knowledge,
      complexity: cluster.complexity,
      intelligenceScore: cluster.intelligenceScore,
      size: cluster.size,
      charge: cluster.charge,
      emergenceTime: Date.now()
    }));
}
