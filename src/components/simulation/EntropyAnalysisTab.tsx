
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SimulationStats } from '@/types/simulation';

interface EntropyAnalysisTabProps {
  stats: SimulationStats;
}

const EntropyAnalysisTab: React.FC<EntropyAnalysisTabProps> = ({ stats }) => {
  // Create some placeholder scale functions
  const getScaleClass = (value: number, min = 0, max = 1) => {
    const normalized = Math.min(Math.max((value - min) / (max - min), 0), 1);
    if (normalized < 0.25) return "bg-blue-600";
    if (normalized < 0.5) return "bg-green-600";
    if (normalized < 0.75) return "bg-yellow-600";
    return "bg-red-600";
  };

  const getScaleWidth = (value: number, min = 0, max = 1) => {
    const normalized = Math.min(Math.max((value - min) / (max - min), 0), 1);
    return `${normalized * 100}%`;
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Entropy Metrics</CardTitle>
          <CardDescription>
            Analysis of system order and information content
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Shannon Entropy</span>
                <span className="text-sm font-medium">{stats.shannonEntropy?.toFixed(3) || "0.000"}</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div 
                  className={`h-2.5 rounded-full ${getScaleClass(stats.shannonEntropy || 0, 0, 5)}`} 
                  style={{ width: getScaleWidth(stats.shannonEntropy || 0, 0, 5) }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Measures the unpredictability in the distribution of particle properties
              </p>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Spatial Entropy</span>
                <span className="text-sm font-medium">{stats.spatialEntropy?.toFixed(3) || "0.000"}</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div 
                  className={`h-2.5 rounded-full ${getScaleClass(stats.spatialEntropy || 0, 0, 4)}`} 
                  style={{ width: getScaleWidth(stats.spatialEntropy || 0, 0, 4) }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Quantifies the distribution and organization of particles in space
              </p>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Field Order Parameter</span>
                <span className="text-sm font-medium">{stats.fieldOrderParameter?.toFixed(3) || "0.000"}</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div 
                  className={`h-2.5 rounded-full ${getScaleClass(stats.fieldOrderParameter || 0, 0, 1)}`} 
                  style={{ width: getScaleWidth(stats.fieldOrderParameter || 0, 0, 1) }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Indicates the degree of alignment within the intent field
              </p>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Kolmogorov Complexity</span>
                <span className="text-sm font-medium">{stats.kolmogorovComplexity?.toFixed(3) || "0.000"}</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div 
                  className={`h-2.5 rounded-full ${getScaleClass(stats.kolmogorovComplexity || 0, 0, 3)}`} 
                  style={{ width: getScaleWidth(stats.kolmogorovComplexity || 0, 0, 3) }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Approximates the computational complexity of the system state
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>System Dynamics</CardTitle>
          <CardDescription>
            Emergent patterns and cluster formation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Cluster Count</span>
                <span className="text-sm font-medium">{stats.clusterCount}</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div 
                  className={`h-2.5 rounded-full ${getScaleClass(stats.clusterCount, 0, 10)}`} 
                  style={{ width: getScaleWidth(stats.clusterCount, 0, 10) }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Number of detected particle clusters in the system
              </p>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Average Cluster Size</span>
                <span className="text-sm font-medium">{stats.averageClusterSize.toFixed(1)}</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div 
                  className={`h-2.5 rounded-full ${getScaleClass(stats.averageClusterSize, 1, 20)}`} 
                  style={{ width: getScaleWidth(stats.averageClusterSize, 1, 20) }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Average number of particles per detected cluster
              </p>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Information Density</span>
                <span className="text-sm font-medium">{stats.informationDensity?.toFixed(3) || "0.000"}</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div 
                  className={`h-2.5 rounded-full ${getScaleClass(stats.informationDensity || 0, 0, 2)}`} 
                  style={{ width: getScaleWidth(stats.informationDensity || 0, 0, 2) }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Quantity of information content per unit space in the simulation
              </p>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Cluster Lifetime</span>
                <span className="text-sm font-medium">{stats.clusterLifetime?.toFixed(0) || "0"}</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div 
                  className={`h-2.5 rounded-full ${getScaleClass(stats.clusterLifetime || 0, 0, 1000)}`} 
                  style={{ width: getScaleWidth(stats.clusterLifetime || 0, 0, 1000) }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Average persistence time of particle clusters
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EntropyAnalysisTab;
