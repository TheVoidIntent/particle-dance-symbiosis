
import { SimulationStats } from '@/types/simulation';
import { getStoredDataPoints } from './dataExportUtils';

/**
 * Analyze simulation data for trends and patterns
 */
export function analyzeSimulationData(timeRange: number = 24 * 60 * 60 * 1000): any {
  const dataPoints = getStoredDataPoints();
  
  if (dataPoints.length === 0) {
    return {
      error: "No data available for analysis",
      status: "error"
    };
  }
  
  // Filter data points by time range
  const now = Date.now();
  const filteredData = dataPoints.filter(point => 
    (now - (point.timestamp || 0)) <= timeRange
  );
  
  if (filteredData.length === 0) {
    return {
      error: "No data in the selected time range",
      status: "error"
    };
  }
  
  // Calculate basic statistics
  const statistics = calculateBasicStatistics(filteredData);
  
  // Identify trends
  const trends = identifyTrends(filteredData);
  
  // Detect anomalies
  const anomalies = detectAnomalies(filteredData);
  
  return {
    status: "success",
    dataPoints: filteredData.length,
    timeRange,
    statistics,
    trends,
    anomalies
  };
}

/**
 * Calculate basic statistics from data points
 */
function calculateBasicStatistics(dataPoints: (SimulationStats & { timestamp: number })[]) {
  // Sort by timestamp
  const sortedData = [...dataPoints].sort((a, b) => 
    (a.timestamp || 0) - (b.timestamp || 0)
  );
  
  // Get last data point
  const latest = sortedData[sortedData.length - 1];
  
  // Calculate averages
  const avgParticleCount = average(sortedData.map(d => d.particleCount));
  const avgPositiveParticles = average(sortedData.map(d => d.positiveParticles));
  const avgNegativeParticles = average(sortedData.map(d => d.negativeParticles));
  const avgNeutralParticles = average(sortedData.map(d => d.neutralParticles));
  const avgComplexityIndex = average(sortedData.map(d => d.complexityIndex || 0));
  
  // Calculate growth rates
  const first = sortedData[0];
  const particleGrowthRate = calculateGrowthRate(
    first.particleCount,
    latest.particleCount,
    sortedData.length
  );
  
  // Calculate entropy over time
  const entropyTrend = sortedData
    .filter(d => d.systemEntropy !== undefined)
    .map(d => d.systemEntropy || 0);
  
  return {
    latest,
    averages: {
      particleCount: avgParticleCount,
      positiveParticles: avgPositiveParticles,
      negativeParticles: avgNegativeParticles,
      neutralParticles: avgNeutralParticles,
      complexityIndex: avgComplexityIndex
    },
    growth: {
      particleGrowthRate
    },
    entropy: {
      trend: entropyTrend,
      average: average(entropyTrend)
    }
  };
}

/**
 * Identify trends in the data
 */
function identifyTrends(dataPoints: (SimulationStats & { timestamp: number })[]) {
  // Sort by timestamp
  const sortedData = [...dataPoints].sort((a, b) => 
    (a.timestamp || 0) - (b.timestamp || 0)
  );
  
  // Calculate linear regression for particle count
  const particleCountTrend = calculateLinearRegression(
    sortedData.map((_, i) => i),
    sortedData.map(d => d.particleCount)
  );
  
  // Calculate linear regression for complexity
  const complexityTrend = calculateLinearRegression(
    sortedData.filter(d => d.complexityIndex !== undefined).map((_, i) => i),
    sortedData.filter(d => d.complexityIndex !== undefined).map(d => d.complexityIndex || 0)
  );
  
  return {
    particleCountTrend,
    complexityTrend
  };
}

/**
 * Detect anomalies in the simulation data
 */
function detectAnomalies(dataPoints: (SimulationStats & { timestamp: number })[]) {
  const anomalies = [];
  
  // Sort by timestamp
  const sortedData = [...dataPoints].sort((a, b) => 
    (a.timestamp || 0) - (b.timestamp || 0)
  );
  
  // Check for sudden changes in particle count
  for (let i = 1; i < sortedData.length; i++) {
    const prev = sortedData[i - 1];
    const current = sortedData[i];
    
    const particleChange = Math.abs(current.particleCount - prev.particleCount);
    const percentChange = particleChange / prev.particleCount;
    
    if (percentChange > 0.5) {
      anomalies.push({
        type: 'particle_count_spike',
        timestamp: current.timestamp,
        from: prev.particleCount,
        to: current.particleCount,
        percentChange: percentChange * 100
      });
    }
  }
  
  return anomalies;
}

/**
 * Helper function to calculate average
 */
function average(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, val) => sum + val, 0) / values.length;
}

/**
 * Helper function to calculate growth rate
 */
function calculateGrowthRate(initial: number, final: number, periods: number): number {
  if (initial === 0 || periods === 0) return 0;
  return ((final / initial) ** (1 / periods)) - 1;
}

/**
 * Helper function to calculate linear regression
 */
function calculateLinearRegression(x: number[], y: number[]) {
  if (x.length !== y.length || x.length === 0) {
    return { slope: 0, intercept: 0, r2: 0 };
  }
  
  const n = x.length;
  const sumX = x.reduce((sum, val) => sum + val, 0);
  const sumY = y.reduce((sum, val) => sum + val, 0);
  const sumXY = x.reduce((sum, val, i) => sum + val * y[i], 0);
  const sumXX = x.reduce((sum, val) => sum + val * val, 0);
  const sumYY = y.reduce((sum, val) => sum + val * val, 0);
  
  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  
  // Calculate R-squared
  const yMean = sumY / n;
  const ssTotal = y.reduce((sum, val) => sum + (val - yMean) ** 2, 0);
  const ssResidual = y.reduce((sum, val, i) => {
    const prediction = slope * x[i] + intercept;
    return sum + (val - prediction) ** 2;
  }, 0);
  const r2 = 1 - (ssResidual / ssTotal);
  
  return { slope, intercept, r2 };
}
