
import React, { useEffect, useState } from 'react';
import { useSimulationState } from '@/hooks/simulation';
import { knowledgeBase } from '@/utils/knowledge/intentKnowledgeBase';

interface SimulationDataHarvesterProps {
  harvesterEnabled?: boolean;
  onHarvestComplete?: (stats: { concepts: number, insights: number }) => void;
}

/**
 * Component that silently harvests data from the simulation and feeds it to the knowledge base
 */
const SimulationDataHarvester: React.FC<SimulationDataHarvesterProps> = ({
  harvesterEnabled = true,
  onHarvestComplete
}) => {
  const [harvestCount, setHarvestCount] = useState(0);
  const [lastHarvestTime, setLastHarvestTime] = useState(0);
  const simulationState = useSimulationState({});
  
  // Harvest data from the simulation periodically
  useEffect(() => {
    if (!harvesterEnabled) return;
    
    const harvestInterval = setInterval(() => {
      // Only harvest if simulation is initialized and has particles
      if (simulationState.particles && simulationState.particles.length > 0) {
        harvestSimulationData();
      }
    }, 10000); // Harvest every 10 seconds
    
    return () => clearInterval(harvestInterval);
  }, [harvesterEnabled, simulationState.particles]);
  
  // Harvest data from the current simulation state
  const harvestSimulationData = () => {
    const now = Date.now();
    
    // Skip if we harvested too recently (throttle)
    if (now - lastHarvestTime < 5000) return;
    
    try {
      // Extract insights about particles
      const particles = simulationState.particles || [];
      const particleTypes = particles.reduce((types: Record<string, number>, particle) => {
        const type = particle.type || 'unknown';
        types[type] = (types[type] || 0) + 1;
        return types;
      }, {});
      
      // Extract insights about charges
      const charges = particles.reduce((charges: Record<string, number>, particle) => {
        const charge = particle.charge || 'unknown';
        charges[charge] = (charges[charge] || 0) + 1;
        return charges;
      }, {});
      
      // Calculate average interactions
      const avgInteractions = particles.reduce((sum, p) => sum + (p.interactions || 0), 0) / Math.max(1, particles.length);
      
      // Add insights to knowledge base
      if (Object.keys(particleTypes).length > 0) {
        knowledgeBase.addSimulationInsight({
          type: 'particle_distribution',
          description: `Current simulation has ${particles.length} particles with distribution: ${Object.entries(particleTypes).map(([k, v]) => `${k}: ${v}`).join(', ')}`,
          importance: 0.7
        });
      }
      
      if (Object.keys(charges).length > 0) {
        knowledgeBase.addSimulationInsight({
          type: 'charge_distribution',
          description: `Charge distribution in current simulation: ${Object.entries(charges).map(([k, v]) => `${k}: ${v}`).join(', ')}`,
          importance: 0.6
        });
      }
      
      knowledgeBase.addSimulationInsight({
        type: 'interaction_metrics',
        description: `Average interactions per particle: ${avgInteractions.toFixed(2)}`,
        importance: 0.5
      });
      
      // Add more insights based on simulation state
      if (simulationState.interactionsCount) {
        knowledgeBase.addSimulationInsight({
          type: 'total_interactions',
          description: `Total interactions in simulation: ${simulationState.interactionsCount}`,
          importance: 0.6
        });
      }
      
      // Update harvest stats
      setHarvestCount(prev => prev + 1);
      setLastHarvestTime(now);
      
      // Get knowledge base stats
      const stats = knowledgeBase.getStats();
      
      // Notify about harvest completion
      if (onHarvestComplete) {
        onHarvestComplete({
          concepts: stats.totalConcepts,
          insights: stats.simulationInsightsCount
        });
      }
      
      console.log(`Harvested simulation data: ${particles.length} particles, ${simulationState.interactionsCount || 0} interactions`);
    } catch (error) {
      console.error("Error harvesting simulation data:", error);
    }
  };
  
  // This component doesn't render anything visible
  return null;
};

export default SimulationDataHarvester;
