
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SimulationStats as StatsType } from '@/types/simulation';

interface SimulationStatsProps {
  stats: StatsType;
}

const SimulationStats: React.FC<SimulationStatsProps> = ({ stats }) => {
  return (
    <Card className="col-span-3">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Particle Statistics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-1 text-sm">
        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
          <div className="text-sm text-gray-400">Positive Particles:</div>
          <div className="text-sm text-right">{stats.positiveParticles || 0}</div>
          
          <div className="text-sm text-gray-400">Negative Particles:</div>
          <div className="text-sm text-right">{stats.negativeParticles || 0}</div>
          
          <div className="text-sm text-gray-400">Neutral Particles:</div>
          <div className="text-sm text-right">{stats.neutralParticles || 0}</div>
          
          <div className="text-sm text-gray-400">High-Energy Particles:</div>
          <div className="text-sm text-right">{stats.highEnergyParticles || 0}</div>
          
          <div className="text-sm text-gray-400">Quantum Particles:</div>
          <div className="text-sm text-right">{stats.quantumParticles || 0}</div>
          
          <div className="text-sm text-gray-400">Composite Particles:</div>
          <div className="text-sm text-right">{stats.compositeParticles || 0}</div>
          
          <div className="text-sm text-gray-400">Adaptive Particles:</div>
          <div className="text-sm text-right">{stats.adaptiveParticles || 0}</div>
          
          <div className="border-t border-gray-200 dark:border-gray-800 col-span-2 my-1"></div>
          
          <div className="text-sm text-gray-400">Total Interactions:</div>
          <div className="text-sm text-right">{stats.totalInteractions || 0}</div>
          
          <div className="text-sm text-gray-400">Average Knowledge:</div>
          <div className="text-sm text-right">{stats.averageKnowledge ? stats.averageKnowledge.toFixed(2) : '0.00'}</div>
          
          <div className="text-sm text-gray-400">Complexity Index:</div>
          <div className="text-sm text-right">{stats.complexityIndex.toFixed(2)}</div>
          
          <div className="text-sm text-gray-400">Cluster Count:</div>
          <div className="text-sm text-right">{stats.clusterCount}</div>
          
          <div className="text-sm text-gray-400">System Entropy:</div>
          <div className="text-sm text-right">{stats.systemEntropy.toFixed(3)}</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SimulationStats;
