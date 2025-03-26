
import { getSimulationData } from './dataExportUtils';

export type AnalysisMetric = {
  id: string;
  name: string;
  value: number | string;
  change: number;
  unit?: string;
};

export type TimeSeriesPoint = {
  timestamp: number;
  value: number;
};

export type AnalysisResult = {
  metrics: AnalysisMetric[];
  timeSeries: Record<string, TimeSeriesPoint[]>;
  correlations: Record<string, Record<string, number>>;
};

// Calculate basic statistics for a series of numbers
export function calculateStats(values: number[]) {
  if (values.length === 0) return { mean: 0, median: 0, stdDev: 0, min: 0, max: 0 };
  
  const sortedValues = [...values].sort((a, b) => a - b);
  const sum = values.reduce((total, val) => total + val, 0);
  const mean = sum / values.length;
  const median = sortedValues.length % 2 === 0 
    ? (sortedValues[sortedValues.length / 2 - 1] + sortedValues[sortedValues.length / 2]) / 2
    : sortedValues[Math.floor(sortedValues.length / 2)];
  
  const squareDiffs = values.map(value => {
    const diff = value - mean;
    return diff * diff;
  });
  const variance = squareDiffs.reduce((total, val) => total + val, 0) / values.length;
  const stdDev = Math.sqrt(variance);
  
  return {
    mean,
    median,
    stdDev,
    min: sortedValues[0],
    max: sortedValues[sortedValues.length - 1]
  };
}

// Calculate the correlation coefficient between two series
export function calculateCorrelation(series1: number[], series2: number[]) {
  if (series1.length !== series2.length || series1.length === 0) return 0;
  
  const stats1 = calculateStats(series1);
  const stats2 = calculateStats(series2);
  
  let numerator = 0;
  for (let i = 0; i < series1.length; i++) {
    numerator += (series1[i] - stats1.mean) * (series2[i] - stats2.mean);
  }
  
  const denominator = stats1.stdDev * stats2.stdDev * series1.length;
  return denominator === 0 ? 0 : numerator / denominator;
}

// Analyze simulation data and return metrics, timeseries, and correlations
export function analyzeSimulationData(): AnalysisResult {
  const data = getSimulationData();
  
  if (data.length === 0) {
    return {
      metrics: [],
      timeSeries: {},
      correlations: {}
    };
  }
  
  // Calculate key metrics
  const lastDataPoint = data[data.length - 1];
  const halfwayPoint = Math.floor(data.length / 2);
  const midDataPoint = data[halfwayPoint];
  
  // Extract time series data for analysis
  const positiveParticles = data.map(d => ({ 
    timestamp: d.timestamp, 
    value: d.particle_counts.positive 
  }));
  
  const negativeParticles = data.map(d => ({ 
    timestamp: d.timestamp, 
    value: d.particle_counts.negative 
  }));
  
  const neutralParticles = data.map(d => ({ 
    timestamp: d.timestamp, 
    value: d.particle_counts.neutral 
  }));
  
  const complexityIndex = data.map(d => ({ 
    timestamp: d.timestamp, 
    value: d.complexity_index 
  }));
  
  const avgKnowledge = data.map(d => ({ 
    timestamp: d.timestamp, 
    value: d.avg_knowledge 
  }));
  
  const systemEntropy = data.map(d => ({ 
    timestamp: d.timestamp, 
    value: d.system_entropy 
  }));
  
  // Calculate change rates
  const complexityChange = lastDataPoint.complexity_index - midDataPoint.complexity_index;
  const knowledgeChange = lastDataPoint.avg_knowledge - midDataPoint.avg_knowledge;
  const entropyChange = lastDataPoint.system_entropy - midDataPoint.system_entropy;
  
  // Calculate correlations
  const positiveValues = positiveParticles.map(p => p.value);
  const negativeValues = negativeParticles.map(p => p.value);
  const neutralValues = neutralParticles.map(p => p.value);
  const complexityValues = complexityIndex.map(p => p.value);
  const knowledgeValues = avgKnowledge.map(p => p.value);
  const entropyValues = systemEntropy.map(p => p.value);
  
  const metrics: AnalysisMetric[] = [
    {
      id: 'complexity_index',
      name: 'Complexity Index',
      value: lastDataPoint.complexity_index.toFixed(2),
      change: complexityChange
    },
    {
      id: 'avg_knowledge',
      name: 'Average Knowledge',
      value: lastDataPoint.avg_knowledge.toFixed(3),
      change: knowledgeChange
    },
    {
      id: 'system_entropy',
      name: 'System Entropy',
      value: lastDataPoint.system_entropy.toFixed(4),
      change: entropyChange
    },
    {
      id: 'total_particles',
      name: 'Total Particles',
      value: lastDataPoint.total_particles,
      change: lastDataPoint.total_particles - midDataPoint.total_particles
    },
    {
      id: 'total_interactions',
      name: 'Total Interactions',
      value: lastDataPoint.total_interactions,
      change: lastDataPoint.total_interactions - midDataPoint.total_interactions
    },
    {
      id: 'max_complexity',
      name: 'Maximum Complexity',
      value: lastDataPoint.max_complexity.toFixed(2),
      change: lastDataPoint.max_complexity - midDataPoint.max_complexity
    }
  ];
  
  // Calculate correlations between different metrics
  const correlations = {
    'complexity': {
      'knowledge': calculateCorrelation(complexityValues, knowledgeValues),
      'entropy': calculateCorrelation(complexityValues, entropyValues),
      'positive': calculateCorrelation(complexityValues, positiveValues),
      'negative': calculateCorrelation(complexityValues, negativeValues),
      'neutral': calculateCorrelation(complexityValues, neutralValues)
    },
    'knowledge': {
      'entropy': calculateCorrelation(knowledgeValues, entropyValues),
      'positive': calculateCorrelation(knowledgeValues, positiveValues),
      'negative': calculateCorrelation(knowledgeValues, negativeValues),
      'neutral': calculateCorrelation(knowledgeValues, neutralValues)
    },
    'entropy': {
      'positive': calculateCorrelation(entropyValues, positiveValues),
      'negative': calculateCorrelation(entropyValues, negativeValues),
      'neutral': calculateCorrelation(entropyValues, neutralValues)
    }
  };
  
  return {
    metrics,
    timeSeries: {
      positive: positiveParticles,
      negative: negativeParticles,
      neutral: neutralParticles,
      complexity: complexityIndex,
      knowledge: avgKnowledge,
      entropy: systemEntropy
    },
    correlations
  };
}
