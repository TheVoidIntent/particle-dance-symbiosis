
import { useState, useEffect } from 'react';
import { isMotherSimulationRunning, getSimulationStats } from '@/utils/simulation/motherSimulation';

export interface SimulationStatsData {
  particleCount: number;
  interactionCount: number;
  knowledgeAverage: number;
  isRunning: boolean;
  frameCount: number;
}

export function useSimulationData() {
  const [stats, setStats] = useState<SimulationStatsData>({
    particleCount: 0,
    interactionCount: 0,
    knowledgeAverage: 0,
    isRunning: false,
    frameCount: 0
  });

  useEffect(() => {
    const updateInterval = setInterval(() => {
      if (isMotherSimulationRunning()) {
        const currentStats = getSimulationStats();
        
        setStats({
          particleCount: currentStats.particleCount,
          interactionCount: currentStats.interactionsCount || 0, // Map interactionsCount to interactionCount
          knowledgeAverage: currentStats.knowledgeAverage || 0,
          isRunning: isMotherSimulationRunning(),
          frameCount: currentStats.frameCount || 0
        });
      }
    }, 1000);
    
    return () => clearInterval(updateInterval);
  }, []);

  const updateSimulationStats = () => {
    const stats = getSimulationStats();
    setStats({
      particleCount: stats.particleCount,
      interactionCount: stats.interactionsCount || 0, // Map interactionsCount to interactionCount
      knowledgeAverage: stats.knowledgeAverage || 0,
      isRunning: isMotherSimulationRunning(),
      frameCount: stats.frameCount || 0
    });
  };

  return { stats, updateSimulationStats };
}
