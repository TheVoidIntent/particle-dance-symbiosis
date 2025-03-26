
// Utility functions for exporting simulation data

import { parseJsonWithInfinity, stringifyWithInfinity } from './jsonUtils';

// Data storage for simulation
let simulationData: any[] = [];

// Persisted state for the simulation
export const persistedState: {
  hasPersistedState: boolean;
  particles: any[];
  intentField: number[][][];
  interactions: number;
  frameCount: number;
  simulationTime: number;
} = {
  hasPersistedState: false,
  particles: [],
  intentField: [],
  interactions: 0,
  frameCount: 0,
  simulationTime: 0
};

// Initialize persisted state from localStorage if available
if (typeof window !== 'undefined') {
  try {
    const savedState = localStorage.getItem('simulationState');
    if (savedState) {
      const parsed = parseJsonWithInfinity(savedState);
      persistedState.hasPersistedState = true;
      persistedState.particles = parsed.particles || [];
      persistedState.intentField = parsed.intentField || [];
      persistedState.interactions = parsed.interactions || 0;
      persistedState.frameCount = parsed.frameCount || 0;
      persistedState.simulationTime = parsed.simulationTime || 0;
    }
  } catch (error) {
    console.error('Error loading persisted state:', error);
  }
}

// Clear persisted state
export const clearPersistedState = () => {
  persistedState.hasPersistedState = false;
  persistedState.particles = [];
  persistedState.intentField = [];
  persistedState.interactions = 0;
  persistedState.frameCount = 0;
  persistedState.simulationTime = 0;
  
  if (typeof window !== 'undefined') {
    localStorage.removeItem('simulationState');
  }
};

// Get the current simulation data
export const getSimulationData = () => {
  try {
    // Load from local storage if simulationData is empty
    if (simulationData.length === 0 && typeof window !== 'undefined') {
      try {
        const storedData = localStorage.getItem('currentSimulationData');
        if (storedData) {
          simulationData = parseJsonWithInfinity(storedData);
        }
      } catch (error) {
        console.error('Error retrieving simulation data:', error);
      }
    }
    return simulationData;
  } catch (error) {
    console.error('Error retrieving simulation data:', error);
    return [];
  }
};

// Clear simulation data
export const clearSimulationData = () => {
  simulationData = [];
  if (typeof window !== 'undefined') {
    localStorage.removeItem('currentSimulationData');
  }
};

// Determine if data should be collected at the current frame
export const shouldCollectData = (frameCount: number) => {
  // Collect data less frequently as the simulation progresses
  if (frameCount < 100) return frameCount % 5 === 0;  // Every 5 frames for first 100 frames
  if (frameCount < 500) return frameCount % 10 === 0; // Every 10 frames for first 500 frames
  if (frameCount < 2000) return frameCount % 30 === 0; // Every 30 frames until 2000
  return frameCount % 60 === 0; // Every 60 frames after that
};

// Record a data point
export const recordDataPoint = (
  timestamp: number,
  particles: any[],
  intentField: number[][][],
  totalInteractions: number,
  clusterAnalysis: any,
  systemEntropy: number,
  complexityIndex: number,
  additionalMetrics?: {
    shannonEntropy?: number;
    spatialEntropy?: number;
    fieldOrderParameter?: number;
    temporalEntropy?: number;
    informationDensity?: number;
    kolmogorovComplexity?: number;
  }
) => {
  // Basic particle counts
  const positiveCount = particles.filter(p => p.charge === 'positive').length;
  const negativeCount = particles.filter(p => p.charge === 'negative').length;
  const neutralCount = particles.filter(p => p.charge === 'neutral').length;
  const highEnergyCount = particles.filter(p => p.type === 'high-energy').length;
  const quantumCount = particles.filter(p => p.type === 'quantum').length;
  const compositeCount = particles.filter(p => p.type === 'composite').length;
  const adaptiveCount = particles.filter(p => p.type === 'adaptive').length;
  
  // Calculate average knowledge and complexity
  const totalKnowledge = particles.reduce((sum, p) => sum + p.knowledge, 0);
  const avgKnowledge = particles.length > 0 ? totalKnowledge / particles.length : 0;
  
  const totalComplexity = particles.reduce((sum, p) => sum + p.complexity, 0);
  const avgComplexity = particles.length > 0 ? totalComplexity / particles.length : 0;
  
  const maxComplexity = particles.length > 0 
    ? particles.reduce((max, p) => Math.max(max, p.complexity), 0) 
    : 0;
  
  // Create the data point
  const dataPoint = {
    timestamp,
    particle_counts: {
      positive: positiveCount,
      negative: negativeCount,
      neutral: neutralCount,
      high_energy: highEnergyCount,
      quantum: quantumCount,
      composite: compositeCount,
      adaptive: adaptiveCount
    },
    total_particles: particles.length,
    total_interactions: totalInteractions,
    avg_knowledge: avgKnowledge,
    avg_complexity: avgComplexity,
    max_complexity: maxComplexity,
    complexity_index: complexityIndex,
    system_entropy: systemEntropy,
    cluster_analysis: {
      cluster_count: clusterAnalysis.clusterCount,
      average_cluster_size: clusterAnalysis.averageClusterSize,
      largest_cluster_size: clusterAnalysis.largestClusterSize || 0,
      cluster_stability: clusterAnalysis.clusterStability || 0
    },
    // Add advanced metrics if provided
    ...(additionalMetrics && {
      advanced_metrics: additionalMetrics
    })
  };
  
  // Add to the simulation data array
  simulationData.push(dataPoint);
  
  // Persist to localStorage (limit to the last 1000 data points to prevent storage issues)
  if (simulationData.length > 1000) {
    simulationData = simulationData.slice(-1000);
  }
  
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('currentSimulationData', stringifyWithInfinity(simulationData));
    } catch (error) {
      console.error('Error saving simulation data to localStorage:', error);
      // If we hit storage limits, reduce data size
      if (simulationData.length > 100) {
        simulationData = simulationData.slice(-100);
        try {
          localStorage.setItem('currentSimulationData', stringifyWithInfinity(simulationData));
        } catch (innerError) {
          console.error('Failed to save reduced simulation data:', innerError);
        }
      }
    }
  }
  
  return dataPoint;
};

// Export data as CSV
export const exportAsCSV = (data: any[], filename: string) => {
  if (!data.length) return;
  
  // Get headers from the first object
  const headers = Object.keys(data[0]);
  
  // Convert each object to a CSV row
  const csvRows = [
    headers.join(','), // Header row
    ...data.map(row => 
      headers.map(header => {
        // Handle special values like Infinity
        if (row[header] === Infinity || row[header] === -Infinity) {
          return '"Infinity"';
        }
        // Handle nested objects
        if (typeof row[header] === 'object' && row[header] !== null) {
          return `"${JSON.stringify(row[header]).replace(/"/g, '""')}"`;
        }
        // Handle other values
        return `"${row[header]}"`
      }).join(',')
    )
  ];
  
  // Create CSV content
  const csvContent = csvRows.join('\n');
  
  // Create a blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Export data as JSON
export const exportAsJSON = (data: any, filename: string) => {
  // Convert Infinity values to strings before JSON stringification
  const processData = (obj: any): any => {
    if (obj === null || obj === undefined) return obj;
    
    if (typeof obj === 'number') {
      if (!isFinite(obj)) return obj.toString(); // Convert Infinity to string
      return obj;
    }
    
    if (Array.isArray(obj)) {
      return obj.map(item => processData(item));
    }
    
    if (typeof obj === 'object') {
      const processed: Record<string, any> = {};
      for (const key in obj) {
        processed[key] = processData(obj[key]);
      }
      return processed;
    }
    
    return obj;
  };
  
  const processedData = processData(data);
  const jsonString = JSON.stringify(processedData, null, 2);
  
  // Create a blob and download
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.json`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Export current simulation data to CSV
export const exportDataToCSV = () => {
  const data = getSimulationData();
  if (!data.length) {
    console.warn('No simulation data to export');
    return null;
  }
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '').slice(0, 15);
  const filename = `intentSim_export_${timestamp}`;
  
  exportAsCSV(data, filename);
  return filename;
};

// Export current simulation data to JSON
export const exportDataToJSON = () => {
  const data = getSimulationData();
  if (!data.length) {
    console.warn('No simulation data to export');
    return null;
  }
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '').slice(0, 15);
  const filename = `intentSim_export_${timestamp}`;
  
  // Create a metadata wrapper
  const exportData = {
    config: {
      timestamp: new Date().toISOString(),
      source: 'intentSim.org',
      version: '1.0.0'
    },
    data: data
  };
  
  exportAsJSON(exportData, filename);
  return filename;
};
