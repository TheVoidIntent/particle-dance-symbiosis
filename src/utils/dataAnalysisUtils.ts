
import { SimulationStats } from '@/types/simulation';

/**
 * Analyze simulation data for insights
 */
export function analyzeSimulationData(stats: SimulationStats[]): any {
  if (!stats || stats.length === 0) {
    return { error: "No data to analyze" };
  }
  
  // Calculate trends and patterns
  const particleCounts = stats.map(s => s.particleCount);
  const interactionCounts = stats.map(s => s.totalInteractions);
  const complexityIndices = stats.map(s => s.complexityIndex || 0);
  const knowledgeValues = stats.map(s => s.averageKnowledge || 0);
  
  // Calculate basic statistics
  const averageParticles = particleCounts.reduce((a, b) => a + b, 0) / particleCounts.length;
  const maxParticles = Math.max(...particleCounts);
  const minParticles = Math.min(...particleCounts);
  
  const averageInteractions = interactionCounts.reduce((a, b) => a + b, 0) / interactionCounts.length;
  const interactionGrowthRate = interactionCounts.length > 1 ? 
    (interactionCounts[interactionCounts.length - 1] - interactionCounts[0]) / interactionCounts.length : 0;
  
  const complexityGrowth = complexityIndices.length > 1 ?
    (complexityIndices[complexityIndices.length - 1] - complexityIndices[0]) / complexityIndices.length : 0;
  
  const knowledgeGrowth = knowledgeValues.length > 1 ?
    (knowledgeValues[knowledgeValues.length - 1] - knowledgeValues[0]) / knowledgeValues.length : 0;
  
  return {
    summaryStats: {
      dataPoints: stats.length,
      timespan: stats.length > 0 ? 
        `${stats[0].timestamp || 0} to ${stats[stats.length - 1].timestamp || 0}` : "N/A",
      averageParticles,
      maxParticles,
      minParticles,
      averageInteractions,
    },
    trends: {
      particleGrowthRate: particleCounts.length > 1 ? 
        (particleCounts[particleCounts.length - 1] - particleCounts[0]) / particleCounts.length : 0,
      interactionGrowthRate,
      complexityGrowth,
      knowledgeGrowth,
    },
    predictions: {
      estimatedComplexityThreshold: complexityGrowth > 0 ? 
        (10 - (complexityIndices[complexityIndices.length - 1] || 0)) / complexityGrowth : "N/A",
      timeToDoubleKnowledge: knowledgeGrowth > 0 ?
        (knowledgeValues[knowledgeValues.length - 1] || 0) / knowledgeGrowth : "N/A",
    }
  };
}

/**
 * Detect patterns in simulation data
 */
export function detectPatterns(stats: SimulationStats[]): any[] {
  if (!stats || stats.length < 10) {
    return [];
  }
  
  const patterns = [];
  
  // Look for rapid complexity growth
  const complexityValues = stats.map(s => s.complexityIndex || 0);
  for (let i = 1; i < complexityValues.length; i++) {
    if (complexityValues[i] > complexityValues[i-1] * 1.5) {
      patterns.push({
        type: "complexity_spike",
        index: i,
        value: complexityValues[i],
        previousValue: complexityValues[i-1],
        timestamp: stats[i].timestamp
      });
    }
  }
  
  // Look for anomalous particle count changes
  const particleCounts = stats.map(s => s.particleCount);
  for (let i = 1; i < particleCounts.length; i++) {
    if (Math.abs(particleCounts[i] - particleCounts[i-1]) > particleCounts[i-1] * 0.3) {
      patterns.push({
        type: "particle_anomaly",
        index: i,
        value: particleCounts[i],
        previousValue: particleCounts[i-1],
        timestamp: stats[i].timestamp
      });
    }
  }
  
  return patterns;
}
