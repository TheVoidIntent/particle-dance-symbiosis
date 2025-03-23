import { Particle } from './particleUtils';

// Data collection and recording
interface SimulationDataPoint {
  timestamp: number;
  particle_counts: {
    positive: number;
    negative: number;
    neutral: number;
    high_energy: number;
    quantum: number;
    standard: number;
    composite: number;
    adaptive: number;
  };
  total_particles: number;
  total_interactions: number;
  avg_knowledge: number;
  avg_complexity: number;
  max_complexity: number;
  complexity_index: number;
  cluster_analysis: {
    cluster_count: number;
    average_cluster_size: number;
    largest_cluster_size: number;
    cluster_stability: number;
  };
  system_entropy: number;
  advanced_metrics?: {
    shannon_entropy?: number;
    spatial_entropy?: number;
    field_order_parameter?: number;
    temporal_entropy?: number;
    information_density?: number;
    kolmogorov_complexity?: number;
  };
}

interface PersistentState {
  particles: Particle[];
  intentField: number[][][];
  interactions: number;
  frameCount: number;
  simulationTime: number;
  hasPersistedState: boolean;
}

// Initialize state
const simulationData: SimulationDataPoint[] = [];
let persistedState: PersistentState = {
  particles: [],
  intentField: [],
  interactions: 0,
  frameCount: 0,
  simulationTime: 0,
  hasPersistedState: false
};

// Load persisted state if it exists
try {
  const savedState = localStorage.getItem('simulationState');
  if (savedState) {
    persistedState = JSON.parse(savedState);
    persistedState.hasPersistedState = true;
    
    // Restore simulation data if available
    const savedData = localStorage.getItem('simulationData');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      if (Array.isArray(parsedData)) {
        simulationData.push(...parsedData);
      }
    }
    
    console.log('Restored simulation state with', persistedState.particles.length, 'particles');
  }
} catch (error) {
  console.error('Failed to restore simulation state:', error);
  persistedState.hasPersistedState = false;
}

// Auto-save state every 5 seconds
setInterval(() => {
  if (persistedState.particles.length > 0) {
    try {
      localStorage.setItem('simulationState', JSON.stringify(persistedState));
      
      // Only save last 20 data points to avoid exceeding storage limits
      const dataToSave = simulationData.slice(-20);
      localStorage.setItem('simulationData', JSON.stringify(dataToSave));
      
      console.log('Simulation state auto-saved');
    } catch (error) {
      console.error('Failed to auto-save simulation state:', error);
    }
  }
}, 5000);

export function recordDataPoint(
  timestamp: number,
  particles: Particle[],
  intentField: number[][][],
  interactions: number,
  clusterAnalysis: any,
  systemEntropy: number,
  complexityIndex: number,
  advancedMetrics?: any
) {
  // Update persisted state
  persistedState.particles = [...particles];
  persistedState.intentField = intentField;
  persistedState.interactions = interactions;
  persistedState.frameCount++;
  persistedState.simulationTime = timestamp;
  
  // Basic particle counts
  const positiveParticles = particles.filter(p => p.charge === 'positive').length;
  const negativeParticles = particles.filter(p => p.charge === 'negative').length;
  const neutralParticles = particles.filter(p => p.charge === 'neutral').length;
  const highEnergyParticles = particles.filter(p => p.type === 'high-energy').length;
  const quantumParticles = particles.filter(p => p.type === 'quantum').length;
  const standardParticles = particles.filter(p => p.type === 'standard').length;
  const compositeParticles = particles.filter(p => p.type === 'composite').length;
  const adaptiveParticles = particles.filter(p => p.type === 'adaptive').length;
  
  // Knowledge and complexity metrics
  const totalKnowledge = particles.reduce((sum, p) => sum + p.knowledge, 0);
  const avgKnowledge = particles.length > 0 ? totalKnowledge / particles.length : 0;
  const avgComplexity = particles.length > 0 
    ? particles.reduce((sum, p) => sum + p.complexity, 0) / particles.length 
    : 0;
  const maxComplexity = particles.length > 0 
    ? particles.reduce((max, p) => Math.max(max, p.complexity), 1) 
    : 1;

  // Create data point
  const dataPoint: SimulationDataPoint = {
    timestamp,
    particle_counts: {
      positive: positiveParticles,
      negative: negativeParticles,
      neutral: neutralParticles,
      high_energy: highEnergyParticles,
      quantum: quantumParticles,
      standard: standardParticles,
      composite: compositeParticles,
      adaptive: adaptiveParticles
    },
    total_particles: particles.length,
    total_interactions: interactions,
    avg_knowledge: avgKnowledge,
    avg_complexity: avgComplexity,
    max_complexity: maxComplexity,
    complexity_index: complexityIndex,
    cluster_analysis: {
      cluster_count: clusterAnalysis.clusterCount,
      average_cluster_size: clusterAnalysis.averageClusterSize,
      largest_cluster_size: clusterAnalysis.largestClusterSize || 0,
      cluster_stability: clusterAnalysis.clusterStability || 0
    },
    system_entropy: systemEntropy
  };
  
  if (advancedMetrics) {
    dataPoint.advanced_metrics = {
      shannon_entropy: advancedMetrics.shannonEntropy,
      spatial_entropy: advancedMetrics.spatialEntropy,
      field_order_parameter: advancedMetrics.fieldOrderParameter,
      temporal_entropy: advancedMetrics.temporalEntropy,
      information_density: advancedMetrics.informationDensity,
      kolmogorov_complexity: advancedMetrics.kolmogorovComplexity
    };
  }
  
  simulationData.push(dataPoint);
  
  // If we have a lot of data points, keep only the last 500
  if (simulationData.length > 500) {
    simulationData.splice(0, simulationData.length - 500);
  }
  
  return dataPoint;
}

export function shouldCollectData(frameCount: number) {
  // Collect data less frequently for long-running simulations
  if (frameCount < 500) {
    return frameCount % 30 === 0; // Every 30 frames initially
  } else if (frameCount < 2000) {
    return frameCount % 60 === 0; // Every 60 frames after 500 frames
  } else {
    return frameCount % 120 === 0; // Every 120 frames after 2000 frames
  }
}

export function clearSimulationData() {
  simulationData.length = 0;
}

export function clearPersistedState() {
  localStorage.removeItem('simulationState');
  localStorage.removeItem('simulationData');
  persistedState = {
    particles: [],
    intentField: [],
    interactions: 0,
    frameCount: 0,
    simulationTime: 0,
    hasPersistedState: false
  };
}

export function getSimulationData() {
  return [...simulationData];
}

export function exportDataToCSV() {
  if (simulationData.length === 0) {
    console.error('No data to export');
    return null;
  }
  
  const headers = [
    'timestamp', 'positive', 'negative', 'neutral',
    'high_energy', 'quantum', 'standard', 'composite', 'adaptive',
    'total_particles', 'total_interactions', 'avg_knowledge',
    'avg_complexity', 'max_complexity', 'complexity_index',
    'cluster_count', 'avg_cluster_size', 'system_entropy'
  ];
  
  const rows = simulationData.map(d => [
    d.timestamp,
    d.particle_counts.positive,
    d.particle_counts.negative,
    d.particle_counts.neutral,
    d.particle_counts.high_energy,
    d.particle_counts.quantum,
    d.particle_counts.standard,
    d.particle_counts.composite,
    d.particle_counts.adaptive,
    d.total_particles,
    d.total_interactions,
    d.avg_knowledge,
    d.avg_complexity,
    d.max_complexity,
    d.complexity_index,
    d.cluster_analysis.cluster_count,
    d.cluster_analysis.average_cluster_size,
    d.system_entropy
  ]);
  
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `simulation_data_${new Date().toISOString().slice(0,19).replace(/:/g,'-')}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  return url;
}

export function exportDataToJSON() {
  if (simulationData.length === 0) {
    console.error('No data to export');
    return null;
  }
  
  const jsonData = {
    timestamp: new Date().toISOString(),
    data: simulationData,
    metadata: {
      points: simulationData.length,
      timespan: simulationData[simulationData.length - 1].timestamp - simulationData[0].timestamp,
      final_complexity: simulationData[simulationData.length - 1].complexity_index
    }
  };
  
  const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `simulation_data_${new Date().toISOString().slice(0,19).replace(/:/g,'-')}.json`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  return url;
}

export { persistedState };
