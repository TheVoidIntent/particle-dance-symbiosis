
import { useState, useCallback, useEffect } from 'react';
import { SimulationStats } from '@/types/simulation';
import { 
  recordDataPoint, 
  exportDataAsCsv, 
  exportDataAsJson, 
  toggleDataCollection, 
  isDataCollectionActive,
  getDataPointCount
} from '@/utils/dataExportUtils';

export function useSimulationData(particles: any[] = []) {
  const [stats, setStats] = useState<SimulationStats>({
    particleCount: 0,
    positiveParticles: 0,
    negativeParticles: 0,
    neutralParticles: 0,
    highEnergyParticles: 0,
    quantumParticles: 0,
    compositeParticles: 0,
    adaptiveParticles: 0,
    totalInteractions: 0,
    complexityIndex: 0,
    averageKnowledge: 0,
    maxComplexity: 0,
    clusterCount: 0,
    averageClusterSize: 0,
    systemEntropy: 0,
    intentFieldComplexity: 0
  });
  
  const [dataCollectionActive, setDataCollectionActive] = useState(false);
  
  // Update stats based on particle data
  useEffect(() => {
    if (particles.length === 0) return;
    
    const positiveParticles = particles.filter(p => p.charge === 'positive').length;
    const negativeParticles = particles.filter(p => p.charge === 'negative').length;
    const neutralParticles = particles.filter(p => p.charge === 'neutral').length;
    
    const highEnergyParticles = particles.filter(p => p.type === 'high-energy').length;
    const quantumParticles = particles.filter(p => p.type === 'quantum').length;
    const compositeParticles = particles.filter(p => p.type === 'composite').length;
    const adaptiveParticles = particles.filter(p => p.type === 'adaptive').length;
    
    const totalInteractions = particles.reduce((sum, p) => sum + (p.interactions || 0), 0);
    
    const knowledgeValues = particles.map(p => p.knowledge || 0);
    const averageKnowledge = knowledgeValues.length 
      ? knowledgeValues.reduce((sum, val) => sum + val, 0) / knowledgeValues.length 
      : 0;
    
    const complexityValues = particles.map(p => p.complexity || 0);
    const maxComplexity = complexityValues.length 
      ? Math.max(...complexityValues)
      : 0;
    
    // Calculate a simple complexity index
    const complexityIndex = (
      (positiveParticles * 1.2) + 
      (negativeParticles * 0.8) + 
      (neutralParticles * 1.0) + 
      (totalInteractions * 0.5) + 
      (averageKnowledge * 2.0)
    ) / (particles.length || 1);
    
    // Update the stats
    const newStats: SimulationStats = {
      particleCount: particles.length,
      positiveParticles,
      negativeParticles,
      neutralParticles,
      highEnergyParticles,
      quantumParticles,
      compositeParticles,
      adaptiveParticles,
      totalInteractions,
      complexityIndex,
      averageKnowledge,
      maxComplexity,
      // These values would need more complex calculations
      clusterCount: Math.ceil(particles.length / 10),  // Placeholder
      averageClusterSize: Math.ceil(particles.length / (Math.ceil(particles.length / 10) || 1)),  // Placeholder
      systemEntropy: Math.random() * 5,  // Placeholder
      intentFieldComplexity: complexityIndex * (1 + Math.random() * 0.2)  // Placeholder
    };
    
    setStats(newStats);
    
    // Record data point if collection is active
    if (isDataCollectionActive()) {
      recordDataPoint(newStats, particles);
    }
  }, [particles]);
  
  // Toggle data collection
  const handleToggleDataCollection = useCallback(() => {
    const isActive = toggleDataCollection();
    setDataCollectionActive(isActive);
    return isActive;
  }, []);
  
  // Export collected data
  const handleExportData = useCallback(() => {
    if (getDataPointCount() === 0) {
      console.warn('No data to export');
      return false;
    }
    
    exportDataAsCsv('intent_simulation');
    exportDataAsJson('intent_simulation');
    
    return true;
  }, []);
  
  return {
    stats,
    dataCollectionActive,
    toggleDataCollection: handleToggleDataCollection,
    exportData: handleExportData
  };
}

export type { SimulationStats };
