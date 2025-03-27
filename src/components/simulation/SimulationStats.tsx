
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SimulationStats as StatsType } from '@/types/simulation';

interface SimulationStatsProps {
  stats: StatsType;
}

const SimulationStats: React.FC<SimulationStatsProps> = ({ stats }) => {
  return (
    <Card className="p-4">
      <CardHeader className="p-0 pb-2">
        <CardTitle className="text-xl">Particle Statistics</CardTitle>
      </CardHeader>
      <CardContent className="p-0 space-y-1 text-sm">
        <div className="flex justify-between">
          <span>Positive Particles:</span>
          <span>{stats.positiveParticles}</span>
        </div>
        <div className="flex justify-between">
          <span>Negative Particles:</span>
          <span>{stats.negativeParticles}</span>
        </div>
        <div className="flex justify-between">
          <span>Neutral Particles:</span>
          <span>{stats.neutralParticles}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-yellow-500">High-Energy Particles:</span>
          <span>{stats.highEnergyParticles}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-purple-500">Quantum Particles:</span>
          <span>{stats.quantumParticles}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-blue-400">Composite Particles:</span>
          <span>{stats.compositeParticles || 0}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-pink-400">Adaptive Particles:</span>
          <span>{stats.adaptiveParticles || 0}</span>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-800 my-1"></div>
        <div className="flex justify-between">
          <span>Total Interactions:</span>
          <span>{stats.totalInteractions}</span>
        </div>
        <div className="flex justify-between">
          <span>Complexity Index:</span>
          <span>{stats.complexityIndex.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Avg. Knowledge:</span>
          <span>{stats.averageKnowledge ? stats.averageKnowledge.toFixed(2) : '0.00'}</span>
        </div>
        <div className="flex justify-between">
          <span>Max Complexity:</span>
          <span>{stats.maxComplexity ? stats.maxComplexity.toFixed(1) : '1.0'}</span>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-800 my-1"></div>
        <div className="flex justify-between">
          <span>Cluster Count:</span>
          <span>{stats.clusterCount}</span>
        </div>
        <div className="flex justify-between">
          <span>Avg. Cluster Size:</span>
          <span>{stats.averageClusterSize.toFixed(1)}</span>
        </div>
        <div className="flex justify-between">
          <span>System Entropy:</span>
          <span>{stats.systemEntropy.toFixed(3)}</span>
        </div>
        <div className="flex justify-between">
          <span>Field Complexity:</span>
          <span>{stats.intentFieldComplexity.toFixed(3)}</span>
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-800 my-1"></div>
        <div className="flex justify-between text-emerald-500">
          <span>Shannon Entropy:</span>
          <span>{stats.shannonEntropy?.toFixed(3) || "0.000"}</span>
        </div>
        <div className="flex justify-between text-emerald-500">
          <span>Spatial Entropy:</span>
          <span>{stats.spatialEntropy?.toFixed(3) || "0.000"}</span>
        </div>
        <div className="flex justify-between text-emerald-500">
          <span>Field Order:</span>
          <span>{stats.fieldOrderParameter?.toFixed(3) || "0.000"}</span>
        </div>
        <div className="flex justify-between text-emerald-500">
          <span>Cluster Lifetime:</span>
          <span>{stats.clusterLifetime?.toFixed(0) || "0"}</span>
        </div>
        <div className="flex justify-between text-emerald-500">
          <span>Info Density:</span>
          <span>{stats.informationDensity?.toFixed(3) || "0.000"}</span>
        </div>
        <div className="flex justify-between text-emerald-500">
          <span>Kolmogorov:</span>
          <span>{stats.kolmogorovComplexity?.toFixed(3) || "0.000"}</span>
        </div>
        <div className="flex justify-between text-emerald-500">
          <span>Entropy Delta:</span>
          <span>{stats.clusterEntropyDelta?.toFixed(3) || "0.000"}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default SimulationStats;
