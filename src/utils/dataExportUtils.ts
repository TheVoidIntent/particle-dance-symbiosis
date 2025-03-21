
import { Particle } from './particleUtils';
import { saveAs } from 'file-saver';

// Data export interval in frames
const DATA_EXPORT_INTERVAL = 100;

// Structure for time series data
export interface SimulationTimePoint {
  timestamp: number;
  particleCounts: {
    positive: number;
    negative: number;
    neutral: number;
    highEnergy: number;
    quantum: number;
    standard: number;
    composite: number;
    adaptive: number;
  };
  totalParticles: number;
  totalInteractions: number;
  avgKnowledge: number;
  avgComplexity: number;
  maxComplexity: number;
  complexityIndex: number;
  clusterAnalysis: {
    clusterCount: number;
    averageClusterSize: number;
    largestClusterSize: number;
    clusterStability: number;
  };
  systemEntropy: number;
}

// Store collected data points
export const simulationData: SimulationTimePoint[] = [];

// Manage persisted simulation state between sessions
export const persistedState = {
  particles: [] as Particle[],
  intentField: [] as number[][][],
  interactions: 0,
  simulationTime: 0,
  hasPersistedState: false,
  frameCount: 0
};

// Add a data point to the time series
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
  },
  systemEntropy: number,
  complexityIndex: number
): void {
  try {
    // Calculate statistics
    const positiveParticles = particles.filter(p => p.charge === 'positive').length;
    const negativeParticles = particles.filter(p => p.charge === 'negative').length;
    const neutralParticles = particles.filter(p => p.charge === 'neutral').length;
    const highEnergyParticles = particles.filter(p => p.type === 'high-energy').length;
    const quantumParticles = particles.filter(p => p.type === 'quantum').length;
    const standardParticles = particles.filter(p => p.type === 'standard').length;
    const compositeParticles = particles.filter(p => p.type === 'composite').length;
    const adaptiveParticles = particles.filter(p => p.type === 'adaptive').length;
    
    // Calculate knowledge metrics
    const totalKnowledge = particles.reduce((sum, p) => sum + p.knowledge, 0);
    const averageKnowledge = particles.length > 0 ? totalKnowledge / particles.length : 0;
    
    // Calculate complexity metrics
    const totalComplexity = particles.reduce((sum, p) => sum + p.complexity, 0);
    const averageComplexity = particles.length > 0 ? totalComplexity / particles.length : 0;
    const maxComplexity = particles.length > 0 
      ? particles.reduce((max, p) => Math.max(max, p.complexity), 1) 
      : 1;
    
    // Create the data point
    const dataPoint: SimulationTimePoint = {
      timestamp,
      particleCounts: {
        positive: positiveParticles,
        negative: negativeParticles,
        neutral: neutralParticles,
        highEnergy: highEnergyParticles,
        quantum: quantumParticles,
        standard: standardParticles,
        composite: compositeParticles,
        adaptive: adaptiveParticles
      },
      totalParticles: particles.length,
      totalInteractions: interactions,
      avgKnowledge: averageKnowledge,
      avgComplexity: averageComplexity,
      maxComplexity,
      complexityIndex,
      clusterAnalysis,
      systemEntropy
    };
    
    // Add to stored data
    simulationData.push(dataPoint);
    
    // Log to console for debugging
    if (simulationData.length % 10 === 0) {
      console.log(`Data collection: ${simulationData.length} data points recorded`);
    }
    
    // Update persisted state
    persistedState.particles = [...particles];
    persistedState.intentField = JSON.parse(JSON.stringify(intentField)); // Deep copy
    persistedState.interactions = interactions;
    persistedState.simulationTime = timestamp;
    persistedState.hasPersistedState = true;
    persistedState.frameCount += 1;
  } catch (error) {
    console.error('Error recording data point:', error);
  }
}

// Export data to CSV for analysis
export function exportDataToCSV(): void {
  try {
    if (simulationData.length === 0) {
      console.warn('No simulation data to export');
      return;
    }
    
    // CSV header
    let csv = 'timestamp,totalParticles,positive,negative,neutral,highEnergy,quantum,standard,composite,adaptive,' +
              'totalInteractions,avgKnowledge,avgComplexity,maxComplexity,complexityIndex,' +
              'clusterCount,avgClusterSize,largestClusterSize,clusterStability,systemEntropy\n';
    
    // Add each data point
    simulationData.forEach(point => {
      csv += `${point.timestamp},${point.totalParticles},` +
             `${point.particleCounts.positive},${point.particleCounts.negative},${point.particleCounts.neutral},` +
             `${point.particleCounts.highEnergy},${point.particleCounts.quantum},${point.particleCounts.standard},` +
             `${point.particleCounts.composite},${point.particleCounts.adaptive},` +
             `${point.totalInteractions},${point.avgKnowledge.toFixed(4)},${point.avgComplexity.toFixed(4)},` +
             `${point.maxComplexity.toFixed(2)},${point.complexityIndex.toFixed(4)},` +
             `${point.clusterAnalysis.clusterCount},${point.clusterAnalysis.averageClusterSize.toFixed(2)},` +
             `${point.clusterAnalysis.largestClusterSize},${point.clusterAnalysis.clusterStability.toFixed(4)},` +
             `${point.systemEntropy.toFixed(4)}\n`;
    });
    
    // Create blob and download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const now = new Date();
    const filename = `simulation_data_${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}.csv`;
    saveAs(blob, filename);
    
    console.log(`Exported ${simulationData.length} data points to ${filename}`);
  } catch (error) {
    console.error('Error exporting CSV:', error);
  }
}

// Export data to JSON format
export function exportDataToJSON(): void {
  try {
    if (simulationData.length === 0) {
      console.warn('No simulation data to export');
      return;
    }
    
    // Create JSON structure with metadata
    const exportData = {
      exportDate: new Date().toISOString(),
      totalDataPoints: simulationData.length,
      simulationDuration: simulationData[simulationData.length - 1].timestamp - simulationData[0].timestamp,
      data: simulationData
    };
    
    // Create blob and download
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const now = new Date();
    const filename = `simulation_data_${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}.json`;
    saveAs(blob, filename);
    
    console.log(`Exported ${simulationData.length} data points to ${filename}`);
  } catch (error) {
    console.error('Error exporting JSON:', error);
  }
}

// Check if we should collect data this frame
export function shouldCollectData(frameCount: number): boolean {
  return frameCount % DATA_EXPORT_INTERVAL === 0;
}

// Clear all stored data points
export function clearSimulationData(): void {
  simulationData.length = 0;
  console.log('Simulation data cleared');
}

// Clear persisted state
export function clearPersistedState(): void {
  persistedState.particles = [];
  persistedState.intentField = [];
  persistedState.interactions = 0;
  persistedState.simulationTime = 0;
  persistedState.hasPersistedState = false;
  persistedState.frameCount = 0;
  console.log('Persisted simulation state cleared');
}
