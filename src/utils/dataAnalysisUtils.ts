
import { SimulationStats, Particle } from '@/types/simulation';

/**
 * Analyze simulation data to extract insights
 */
export function analyzeSimulationData(
  dataPoints: SimulationStats[], 
  options: { 
    timeRange?: [number, number],
    smoothing?: number
  } = {}
): {
  timeSeriesData: any[];
  trends: any;
  anomalies: any[];
  correlations: any[];
} {
  // Default result structure
  const result = {
    timeSeriesData: [],
    trends: {},
    anomalies: [],
    correlations: []
  };
  
  if (!dataPoints || dataPoints.length === 0) {
    return result;
  }
  
  // Add timestamps if missing
  const timestampedData = dataPoints.map((point, index) => ({
    ...point,
    timestamp: point.timestamp || Date.now() - (dataPoints.length - index) * 1000
  }));
  
  // Apply time range filter if provided
  let filteredData = timestampedData;
  if (options.timeRange) {
    const [start, end] = options.timeRange;
    filteredData = timestampedData.filter(point => 
      point.timestamp >= start && point.timestamp <= end
    );
  }
  
  // Convert to time series format
  result.timeSeriesData = filteredData.map(point => ({
    timestamp: point.timestamp,
    particleCount: point.particleCount,
    positiveParticles: point.positiveParticles,
    negativeParticles: point.negativeParticles,
    neutralParticles: point.neutralParticles,
    totalInteractions: point.totalInteractions,
    complexityIndex: point.complexityIndex || 0,
    systemEntropy: point.systemEntropy || 0
  }));
  
  // Calculate basic trends
  if (filteredData.length > 1) {
    const first = filteredData[0];
    const last = filteredData[filteredData.length - 1];
    
    result.trends = {
      particleGrowthRate: calculateGrowthRate(first.particleCount, last.particleCount),
      interactionGrowthRate: calculateGrowthRate(first.totalInteractions || 0, last.totalInteractions || 0),
      complexityTrend: calculateGrowthRate(first.complexityIndex || 0, last.complexityIndex || 0),
      entropyChange: (last.systemEntropy || 0) - (first.systemEntropy || 0)
    };
  }
  
  // Detect anomalies in the data
  result.anomalies = detectDataAnomalies(filteredData);
  
  // Calculate correlations between metrics
  result.correlations = calculateCorrelations(filteredData);
  
  return result;
}

/**
 * Calculate growth rate between two values
 */
function calculateGrowthRate(start: number, end: number): number {
  if (start === 0) return end > 0 ? 1 : 0;
  return (end - start) / start;
}

/**
 * Detect anomalies in time series data
 */
function detectDataAnomalies(dataPoints: SimulationStats[]): any[] {
  if (dataPoints.length < 3) return [];
  
  const anomalies = [];
  
  // Detect spikes in metrics
  for (let i = 1; i < dataPoints.length - 1; i++) {
    const prev = dataPoints[i-1];
    const curr = dataPoints[i];
    const next = dataPoints[i+1];
    
    // Check for complexity spikes
    if (curr.complexityIndex && prev.complexityIndex && next.complexityIndex) {
      const avgComplexity = (prev.complexityIndex + next.complexityIndex) / 2;
      if (curr.complexityIndex > avgComplexity * 1.5) {
        anomalies.push({
          type: 'complexity_spike',
          timestamp: curr.timestamp,
          value: curr.complexityIndex,
          expected: avgComplexity
        });
      }
    }
    
    // Check for entropy changes
    if (curr.systemEntropy !== undefined && prev.systemEntropy !== undefined) {
      const entropyChange = Math.abs(curr.systemEntropy - prev.systemEntropy);
      if (entropyChange > 0.2) {
        anomalies.push({
          type: 'entropy_shift',
          timestamp: curr.timestamp,
          value: curr.systemEntropy,
          previous: prev.systemEntropy,
          change: entropyChange
        });
      }
    }
  }
  
  return anomalies;
}

/**
 * Calculate correlations between different metrics
 */
function calculateCorrelations(dataPoints: SimulationStats[]): any[] {
  if (dataPoints.length < 5) return [];
  
  const correlations = [];
  
  // Calculate correlation between particle count and interactions
  const particleCountValues = dataPoints.map(p => p.particleCount);
  const interactionValues = dataPoints.map(p => p.totalInteractions || 0);
  
  const particleInteractionCorrelation = calculatePearsonCorrelation(
    particleCountValues, 
    interactionValues
  );
  
  correlations.push({
    metric1: 'particleCount',
    metric2: 'totalInteractions',
    correlation: particleInteractionCorrelation
  });
  
  // Calculate more correlations as needed
  
  return correlations;
}

/**
 * Calculate Pearson correlation coefficient between two arrays
 */
function calculatePearsonCorrelation(x: number[], y: number[]): number {
  if (x.length !== y.length || x.length === 0) return 0;
  
  // Calculate means
  const xMean = x.reduce((acc, val) => acc + val, 0) / x.length;
  const yMean = y.reduce((acc, val) => acc + val, 0) / y.length;
  
  // Calculate the numerator and denominator
  let numerator = 0;
  let xDenominator = 0;
  let yDenominator = 0;
  
  for (let i = 0; i < x.length; i++) {
    const xDiff = x[i] - xMean;
    const yDiff = y[i] - yMean;
    
    numerator += xDiff * yDiff;
    xDenominator += xDiff * xDiff;
    yDenominator += yDiff * yDiff;
  }
  
  if (xDenominator === 0 || yDenominator === 0) return 0;
  
  return numerator / Math.sqrt(xDenominator * yDenominator);
}

/**
 * Analyze particles to detect clusters and patterns
 */
export function analyzeParticleDistribution(particles: Particle[]): {
  clusters: { center: { x: number, y: number }, count: number, radius: number, charge: string }[];
  densityMap: number[][];
  chargeDistribution: { positive: number, negative: number, neutral: number };
  entropy: number;
} {
  // This is a placeholder implementation
  return {
    clusters: [],
    densityMap: [],
    chargeDistribution: {
      positive: particles.filter(p => p.charge === 'positive').length,
      negative: particles.filter(p => p.charge === 'negative').length,
      neutral: particles.filter(p => p.charge === 'neutral').length
    },
    entropy: 0
  };
}
