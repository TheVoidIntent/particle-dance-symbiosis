
import { SimulationStats } from "@/types/simulation";

/**
 * Calculate the growth rate between two simulation states
 */
export function calculateGrowthRate(
  current: SimulationStats,
  previous: SimulationStats
): {
  particleGrowth: number;
  complexityGrowth: number;
  knowledgeGrowth: number;
} {
  // Default if no previous state
  if (!previous) {
    return {
      particleGrowth: 0,
      complexityGrowth: 0,
      knowledgeGrowth: 0
    };
  }

  // Calculate time difference (in seconds)
  const currentTime = current.timestamp || Date.now();
  const previousTime = previous.timestamp || currentTime;
  const timeDiffSeconds = Math.max(1, (currentTime - previousTime) / 1000);

  // Calculate growth rates
  const particleGrowth =
    ((current.particleCount - previous.particleCount) / previous.particleCount) /
    timeDiffSeconds;

  const complexityGrowth =
    current.complexityIndex && previous.complexityIndex
      ? ((current.complexityIndex - previous.complexityIndex) /
          Math.max(0.001, previous.complexityIndex)) /
        timeDiffSeconds
      : 0;

  const knowledgeGrowth =
    current.averageKnowledge && previous.averageKnowledge
      ? ((current.averageKnowledge - previous.averageKnowledge) /
          Math.max(0.001, previous.averageKnowledge)) /
        timeDiffSeconds
      : 0;

  return {
    particleGrowth,
    complexityGrowth,
    knowledgeGrowth
  };
}

/**
 * Check for significant anomalies in the simulation data
 */
export function detectAnomalies(
  current: SimulationStats,
  previous: SimulationStats,
  thresholds: {
    particleGrowthThreshold: number;
    complexityThreshold: number;
    entropyThreshold: number;
  } = {
    particleGrowthThreshold: 0.5,
    complexityThreshold: 0.3,
    entropyThreshold: 0.2
  }
): Array<{
  type: string;
  severity: number;
  description: string;
  timestamp: number;
}> {
  const anomalies = [];
  const currentTime = current.timestamp || Date.now();

  // Check for sudden particle count changes
  if (
    previous &&
    Math.abs(current.particleCount - previous.particleCount) >
      previous.particleCount * thresholds.particleGrowthThreshold
  ) {
    anomalies.push({
      type: "particle_anomaly",
      severity: 0.7,
      description: `Sudden change in particle count: ${previous.particleCount} → ${current.particleCount}`,
      timestamp: currentTime
    });
  }

  // Check for complexity spikes
  if (
    previous &&
    current.complexityIndex &&
    previous.complexityIndex &&
    current.complexityIndex >
      previous.complexityIndex * (1 + thresholds.complexityThreshold)
  ) {
    anomalies.push({
      type: "complexity_anomaly",
      severity: 0.8,
      description: `Significant complexity increase: ${previous.complexityIndex.toFixed(
        2
      )} → ${current.complexityIndex.toFixed(2)}`,
      timestamp: currentTime
    });
  }

  // Check for entropy changes
  if (
    previous &&
    current.systemEntropy &&
    previous.systemEntropy &&
    Math.abs(current.systemEntropy - previous.systemEntropy) >
      thresholds.entropyThreshold
  ) {
    anomalies.push({
      type: "entropy_anomaly",
      severity: 0.9,
      description: `Significant entropy change: ${previous.systemEntropy.toFixed(
        2
      )} → ${current.systemEntropy.toFixed(2)}`,
      timestamp: currentTime
    });
  }

  return anomalies;
}

/**
 * Calculate the complexity index based on particle distribution and interactions
 */
export function calculateComplexityIndex(stats: SimulationStats): number {
  // Basic complexity calculation
  let complexity = 0;
  
  // Complexity from particle diversity
  const totalParticles = stats.particleCount || 0;
  if (totalParticles > 0) {
    const positive = stats.positiveParticles || 0;
    const negative = stats.negativeParticles || 0;
    const neutral = stats.neutralParticles || 0;
    
    // Calculate normalized entropy
    const pPositive = positive / totalParticles;
    const pNegative = negative / totalParticles;
    const pNeutral = neutral / totalParticles;
    
    let entropy = 0;
    if (pPositive > 0) entropy -= pPositive * Math.log2(pPositive);
    if (pNegative > 0) entropy -= pNegative * Math.log2(pNegative);
    if (pNeutral > 0) entropy -= pNeutral * Math.log2(pNeutral);
    
    // Normalize entropy to [0,1]
    const normalizedEntropy = entropy / Math.log2(3);
    
    // Add interaction complexity
    const interactionDensity = totalParticles > 0 
      ? (stats.totalInteractions || 0) / totalParticles 
      : 0;
    
    // Combine factors
    complexity = (normalizedEntropy * 0.4) + (interactionDensity * 0.6);
  }
  
  return complexity;
}
