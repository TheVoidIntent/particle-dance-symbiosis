// Import required libraries
import FileSaver from 'file-saver';
import { Particle } from './particleUtils';

interface DataPoint {
  timestamp: number;
  particleCount: number;
  positiveParticles: number;
  negativeParticles: number;
  neutralParticles: number;
  highEnergyParticles: number;
  quantumParticles: number;
  compositeParticles: number;
  adaptiveParticles: number;
  totalInteractions: number;
  avgKnowledge: number;
  complexityIndex: number;
  clusterCount: number;
  avgClusterSize: number;
  systemEntropy: number;
  // Enhanced metrics
  shannonEntropy?: number;
  spatialEntropy?: number;
  fieldOrderParameter?: number;
  temporalEntropy?: number;
  clusterLifetime?: number;
  clusterEntropyDelta?: number;
  informationDensity?: number;
  kolmogorovComplexity?: number;
}

// Data collection
const simulationData: DataPoint[] = [];

// Data collection interval calculator
export function shouldCollectData(frameCount: number): boolean {
  // Collect at fixed intervals, less frequently as simulation progresses
  if (frameCount < 1000) {
    return frameCount % 30 === 0; // Every 30 frames initially
  } else if (frameCount < 10000) {
    return frameCount % 150 === 0; // Less frequently later
  }
  return frameCount % 300 === 0; // Even less frequently for long runs
}

// Record a data point
export function recordDataPoint(
  timestamp: number,
  particles: Particle[],
  intentField: number[][][],
  interactions: number,
  clusterAnalysis: {
    clusterCount: number;
    averageClusterSize: number;
    largestClusterSize: number;
    clusterStability: number;
    clusterLifetime?: number;
    clusterEntropyDelta?: number;
    informationDensity?: number;
    kolmogorovComplexity?: number;
  },
  systemEntropy: number,
  complexityIndex: number,
  enhancedMetrics?: {
    shannonEntropy?: number;
    spatialEntropy?: number;
    fieldOrderParameter?: number;
    temporalEntropy?: number;
    informationDensity?: number;
    kolmogorovComplexity?: number;
  }
): void {
  // Calculate particle type counts
  const positiveParticles = particles.filter(p => p.charge === 'positive').length;
  const negativeParticles = particles.filter(p => p.charge === 'negative').length;
  const neutralParticles = particles.filter(p => p.charge === 'neutral').length;
  const highEnergyParticles = particles.filter(p => p.type === 'high-energy').length;
  const quantumParticles = particles.filter(p => p.type === 'quantum').length;
  const compositeParticles = particles.filter(p => p.type === 'composite').length;
  const adaptiveParticles = particles.filter(p => p.type === 'adaptive').length;
  
  // Average knowledge
  const totalKnowledge = particles.reduce((sum, p) => sum + p.knowledge, 0);
  const avgKnowledge = particles.length > 0 ? totalKnowledge / particles.length : 0;
  
  // Create data point with enhanced metrics
  const dataPoint: DataPoint = {
    timestamp,
    particleCount: particles.length,
    positiveParticles,
    negativeParticles,
    neutralParticles,
    highEnergyParticles,
    quantumParticles,
    compositeParticles,
    adaptiveParticles,
    totalInteractions: interactions,
    avgKnowledge,
    complexityIndex,
    clusterCount: clusterAnalysis.clusterCount,
    avgClusterSize: clusterAnalysis.averageClusterSize,
    systemEntropy,
    // Include enhanced metrics if available
    ...(enhancedMetrics ? {
      shannonEntropy: enhancedMetrics.shannonEntropy,
      spatialEntropy: enhancedMetrics.spatialEntropy,
      fieldOrderParameter: enhancedMetrics.fieldOrderParameter,
      temporalEntropy: enhancedMetrics.temporalEntropy,
    } : {}),
    ...(clusterAnalysis.clusterLifetime !== undefined ? {
      clusterLifetime: clusterAnalysis.clusterLifetime,
    } : {}),
    ...(clusterAnalysis.clusterEntropyDelta !== undefined ? {
      clusterEntropyDelta: clusterAnalysis.clusterEntropyDelta,
    } : {}),
    ...(clusterAnalysis.informationDensity !== undefined ? {
      informationDensity: clusterAnalysis.informationDensity,
    } : {}),
    ...(clusterAnalysis.kolmogorovComplexity !== undefined ? {
      kolmogorovComplexity: clusterAnalysis.kolmogorovComplexity,
    } : {})
  };
  
  simulationData.push(dataPoint);
  
  // Limit data array to prevent memory issues
  if (simulationData.length > 2000) {
    simulationData.splice(0, 500); // Remove oldest 500 entries when we exceed 2000
  }
}

// Export data as CSV
export function exportDataToCSV(): void {
  if (simulationData.length === 0) return;
  
  // CSV header
  let csv = 'Timestamp,ParticleCount,PositiveParticles,NegativeParticles,NeutralParticles,';
  csv += 'HighEnergyParticles,QuantumParticles,CompositeParticles,AdaptiveParticles,';
  csv += 'TotalInteractions,AvgKnowledge,ComplexityIndex,ClusterCount,AvgClusterSize,SystemEntropy,';
  
  // Add enhanced metrics to header
  if (simulationData[0].shannonEntropy !== undefined) {
    csv += 'ShannonEntropy,';
  }
  if (simulationData[0].spatialEntropy !== undefined) {
    csv += 'SpatialEntropy,';
  }
  if (simulationData[0].fieldOrderParameter !== undefined) {
    csv += 'FieldOrderParameter,';
  }
  if (simulationData[0].temporalEntropy !== undefined) {
    csv += 'TemporalEntropy,';
  }
  if (simulationData[0].clusterLifetime !== undefined) {
    csv += 'ClusterLifetime,';
  }
  if (simulationData[0].clusterEntropyDelta !== undefined) {
    csv += 'ClusterEntropyDelta,';
  }
  if (simulationData[0].informationDensity !== undefined) {
    csv += 'InformationDensity,';
  }
  if (simulationData[0].kolmogorovComplexity !== undefined) {
    csv += 'KolmogorovComplexity,';
  }
  
  csv = csv.slice(0, -1) + '\n'; // Remove last comma and add newline
  
  // Add data rows
  simulationData.forEach(point => {
    csv += `${point.timestamp},${point.particleCount},${point.positiveParticles},${point.negativeParticles},${point.neutralParticles},`;
    csv += `${point.highEnergyParticles},${point.quantumParticles},${point.compositeParticles},${point.adaptiveParticles},`;
    csv += `${point.totalInteractions},${point.avgKnowledge},${point.complexityIndex},${point.clusterCount},${point.avgClusterSize},${point.systemEntropy},`;
    
    // Add enhanced metrics to data rows
    if (simulationData[0].shannonEntropy !== undefined) {
      csv += `${point.shannonEntropy !== undefined ? point.shannonEntropy : ''},`;
    }
    if (simulationData[0].spatialEntropy !== undefined) {
      csv += `${point.spatialEntropy !== undefined ? point.spatialEntropy : ''},`;
    }
    if (simulationData[0].fieldOrderParameter !== undefined) {
      csv += `${point.fieldOrderParameter !== undefined ? point.fieldOrderParameter : ''},`;
    }
    if (simulationData[0].temporalEntropy !== undefined) {
      csv += `${point.temporalEntropy !== undefined ? point.temporalEntropy : ''},`;
    }
    if (simulationData[0].clusterLifetime !== undefined) {
      csv += `${point.clusterLifetime !== undefined ? point.clusterLifetime : ''},`;
    }
    if (simulationData[0].clusterEntropyDelta !== undefined) {
      csv += `${point.clusterEntropyDelta !== undefined ? point.clusterEntropyDelta : ''},`;
    }
    if (simulationData[0].informationDensity !== undefined) {
      csv += `${point.informationDensity !== undefined ? point.informationDensity : ''},`;
    }
    if (simulationData[0].kolmogorovComplexity !== undefined) {
      csv += `${point.kolmogorovComplexity !== undefined ? point.kolmogorovComplexity : ''},`;
    }
    
    csv = csv.slice(0, -1) + '\n'; // Remove last comma and add newline
  });
  
  // Create and download file
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  FileSaver.saveAs(blob, `universe-simulation-data-${timestamp}.csv`);
}

// Export data as JSON
export function exportDataToJSON(): void {
  if (simulationData.length === 0) return;
  
  // Create JSON object
  const exportData = {
    timestamp: new Date().toISOString(),
    totalDataPoints: simulationData.length,
    data: simulationData
  };
  
  // Create and download file
  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  FileSaver.saveAs(blob, `universe-simulation-data-${timestamp}.json`);
}

// Clear all simulation data
export function clearSimulationData(): void {
  simulationData.length = 0;
}

// Persistence logic to preserve state on page refresh
type PersistedStateType = {
  hasPersistedState: boolean;
  particles: Particle[];
  intentField: number[][][];
  interactions: number;
  frameCount: number;
  simulationTime: number;
};

export const persistedState: PersistedStateType = {
  hasPersistedState: false,
  particles: [],
  intentField: [],
  interactions: 0,
  frameCount: 0,
  simulationTime: 0
};

// Save state to localStorage
export function persistState(
  particles: Particle[],
  intentField: number[][][],
  interactions: number,
  frameCount: number,
  simulationTime: number
): void {
  try {
    persistedState.hasPersistedState = true;
    persistedState.particles = [...particles];
    persistedState.intentField = [...intentField];
    persistedState.interactions = interactions;
    persistedState.frameCount = frameCount;
    persistedState.simulationTime = simulationTime;
    
    // Note: We don't actually save to localStorage due to size limitations
    // But we keep the cached state in memory for use within the current session
  } catch (error) {
    console.error('Failed to persist state:', error);
  }
}

// Clear persisted state
export function clearPersistedState(): void {
  persistedState.hasPersistedState = false;
  persistedState.particles = [];
  persistedState.intentField = [];
  persistedState.interactions = 0;
  persistedState.frameCount = 0;
  persistedState.simulationTime = 0;
}
