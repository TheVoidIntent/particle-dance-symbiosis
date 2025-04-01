
import { useState, useCallback } from 'react';
import { toast } from "sonner";
import { getSimulationData } from '@/utils/dataExportUtils';

interface InflationEvent {
  timestamp: string;
  type: 'adaptive' | 'energy_conservation' | 'baseline' | 'full_features' | 'cern_comparison';
  dataPoints: any[];
  summary: {
    avgComplexity: number;
    maxComplexity: number;
    totalParticles: number;
    systemEntropy: number;
  };
}

export function useInflationEvents() {
  // We're focusing on generating and exporting the data
  const [inflationEvents, setInflationEvents] = useState<InflationEvent[]>([]);

  // Function to generate sample data for each simulation type
  const generateSampleData = useCallback((type: InflationEvent['type']) => {
    const simulationData = getSimulationData();
    
    // If no actual data, create synthetic data
    if (!simulationData || simulationData.length === 0) {
      // Generate random data points based on simulation type
      const dataPoints = [];
      
      // Different characteristics based on simulation type
      let complexityMultiplier = 1;
      let entropyBase = 0.8;
      let particleGrowthRate = 1;
      
      switch(type) {
        case 'adaptive':
          complexityMultiplier = 1.2;
          entropyBase = 0.75;
          break;
        case 'energy_conservation':
          complexityMultiplier = 0.9;
          entropyBase = 0.85;
          break;
        case 'baseline':
          complexityMultiplier = 0.7;
          entropyBase = 0.9;
          break;
        case 'full_features':
          complexityMultiplier = 1.5;
          entropyBase = 0.7;
          particleGrowthRate = 1.2;
          break;
        case 'cern_comparison':
          complexityMultiplier = 2.0;
          entropyBase = 0.65;
          particleGrowthRate = 1.4;
          break;
      }
      
      // Generate 10 data points
      for (let i = 0; i < 10; i++) {
        dataPoints.push({
          timestamp: i * 100,
          particle_counts: {
            positive: Math.floor(20 * particleGrowthRate * (1 + i/10)),
            negative: Math.floor(25 * particleGrowthRate * (1 + i/12)),
            neutral: Math.floor(15 * particleGrowthRate * (1 + i/15))
          },
          total_particles: Math.floor(60 * particleGrowthRate * (1 + i/10)),
          avg_complexity: 1 * complexityMultiplier * Math.pow(1.5, i/3),
          max_complexity: 5 * complexityMultiplier * Math.pow(2, i/4),
          system_entropy: entropyBase + (Math.random() * 0.1 - 0.05),
          cluster_analysis: {
            cluster_count: 5 + Math.floor(i/2),
            average_cluster_size: 3 + i/2
          }
        });
      }
      
      return {
        timestamp: new Date().toISOString(),
        type,
        dataPoints,
        summary: {
          avgComplexity: 1 * complexityMultiplier * Math.pow(1.5, 3),
          maxComplexity: 5 * complexityMultiplier * Math.pow(2, 2),
          totalParticles: Math.floor(60 * particleGrowthRate * 1.5),
          systemEntropy: entropyBase
        }
      };
    }
    
    // Use real simulation data if available
    return {
      timestamp: new Date().toISOString(),
      type,
      dataPoints: simulationData,
      summary: {
        avgComplexity: simulationData.reduce((sum, dp) => sum + (dp.avg_complexity || 0), 0) / simulationData.length,
        maxComplexity: Math.max(...simulationData.map(dp => dp.max_complexity || 0)),
        totalParticles: simulationData[simulationData.length - 1]?.total_particles || 0,
        systemEntropy: simulationData.reduce((sum, dp) => sum + (dp.system_entropy || 0), 0) / simulationData.length
      }
    };
  }, []);

  // Function to export inflation events data to Notebook LM format
  const exportInflationEventsData = useCallback(() => {
    // Generate data for all five simulation types
    const adaptiveData = generateSampleData('adaptive');
    const energyConservationData = generateSampleData('energy_conservation');
    const baselineData = generateSampleData('baseline');
    const fullFeaturesData = generateSampleData('full_features');
    const cernComparisonData = generateSampleData('cern_comparison');
    
    // Create combined dataset for Notebook LM
    const notebookData = {
      metadata: {
        source: "IntentSim.org",
        generated: new Date().toISOString(),
        description: "Simulation data from IntentSim universe model for Notebook LM analysis",
        notebookId: "b2d28cf3-eebe-436c-9cfe-0015c99f99ac"
      },
      simulations: [
        adaptiveData,
        energyConservationData, 
        baselineData,
        fullFeaturesData,
        cernComparisonData
      ],
      comparative_analysis: {
        entropy_variance: {
          adaptive: adaptiveData.summary.systemEntropy,
          energy_conservation: energyConservationData.summary.systemEntropy,
          baseline: baselineData.summary.systemEntropy,
          full_features: fullFeaturesData.summary.systemEntropy,
          cern_comparison: cernComparisonData.summary.systemEntropy
        },
        complexity_growth: {
          adaptive: adaptiveData.summary.maxComplexity / adaptiveData.summary.avgComplexity,
          energy_conservation: energyConservationData.summary.maxComplexity / energyConservationData.summary.avgComplexity,
          baseline: baselineData.summary.maxComplexity / baselineData.summary.avgComplexity,
          full_features: fullFeaturesData.summary.maxComplexity / fullFeaturesData.summary.avgComplexity,
          cern_comparison: cernComparisonData.summary.maxComplexity / cernComparisonData.summary.avgComplexity
        }
      }
    };
    
    // Export as JSON
    const jsonString = JSON.stringify(notebookData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `intentSim_notebook_lm_data_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    toast.success("Notebook LM data generated with all 5 simulation types");
    console.log("Generated Notebook LM data with 5 simulation types:", Object.keys(notebookData.simulations));
    
    return true;
  }, [generateSampleData]);

  return {
    inflationEvents,
    exportInflationEventsData
  };
}
