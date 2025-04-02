
import { getStoredDataPoints } from './dataExportUtils';
import { SimulationStats } from '@/types/simulation';

// Calculate moving average of a specific metric
export function calculateMovingAverage(
  metric: keyof SimulationStats,
  windowSize: number = 10
): number[] {
  const dataPoints = getStoredDataPoints();
  if (dataPoints.length < windowSize) {
    return dataPoints.map(dp => Number(dp[metric]) || 0);
  }
  
  const result: number[] = [];
  
  for (let i = 0; i < dataPoints.length - windowSize + 1; i++) {
    const window = dataPoints.slice(i, i + windowSize);
    const average = window.reduce((sum, dp) => sum + (Number(dp[metric]) || 0), 0) / windowSize;
    result.push(average);
  }
  
  return result;
}

// Find patterns in data using simple analysis
export function findPatterns(
  metric: keyof SimulationStats,
  deviationThreshold: number = 0.15
): { patternType: string; startIndex: number; endIndex: number; confidence: number }[] {
  const dataPoints = getStoredDataPoints();
  if (dataPoints.length < 10) return [];
  
  const values = dataPoints.map(dp => Number(dp[metric]) || 0);
  const patterns = [];
  
  // Look for significant increases/decreases
  for (let i = 5; i < values.length; i++) {
    const prev5Avg = values.slice(i-5, i).reduce((sum, v) => sum + v, 0) / 5;
    const current = values[i];
    const deviation = Math.abs(current - prev5Avg) / prev5Avg;
    
    if (deviation > deviationThreshold) {
      const patternType = current > prev5Avg ? 'rapid_increase' : 'rapid_decrease';
      patterns.push({
        patternType,
        startIndex: i-5,
        endIndex: i,
        confidence: Math.min(deviation * 2, 0.99)
      });
    }
  }
  
  // Look for oscillations
  // Simplified implementation
  const oscillations = detectOscillations(values, 0.1);
  patterns.push(...oscillations);
  
  return patterns;
}

// Helper function to detect oscillating patterns
function detectOscillations(
  values: number[],
  threshold: number
): { patternType: string; startIndex: number; endIndex: number; confidence: number }[] {
  const result = [];
  
  if (values.length < 10) return result;
  
  // Simple detection of local maxima and minima
  for (let i = 2; i < values.length - 2; i++) {
    // Local maximum
    if (values[i] > values[i-1] && values[i] > values[i-2] &&
        values[i] > values[i+1] && values[i] > values[i+2]) {
      result.push({
        patternType: 'oscillation_peak',
        startIndex: i-2,
        endIndex: i+2,
        confidence: 0.7
      });
    }
    
    // Local minimum
    if (values[i] < values[i-1] && values[i] < values[i-2] &&
        values[i] < values[i+1] && values[i] < values[i+2]) {
      result.push({
        patternType: 'oscillation_trough',
        startIndex: i-2,
        endIndex: i+2,
        confidence: 0.7
      });
    }
  }
  
  return result;
}
