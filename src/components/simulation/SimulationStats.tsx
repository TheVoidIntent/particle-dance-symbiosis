
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SimulationStats as StatsType } from '@/types/simulation';

interface SimulationStatsProps {
  stats: StatsType;
}

const SimulationStats: React.FC<SimulationStatsProps> = ({ stats }) => {
  if (!stats) {
    return (
      <Card className="col-span-3">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Particle Statistics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 text-sm">
          <div className="text-center text-gray-400">No simulation data available</div>
        </CardContent>
      </Card>
    );
  }
  
  // Format numbers for display
  const formatNumber = (value: number | undefined, decimals = 0) => {
    if (value === undefined || value === null) return '0';
    return typeof value === 'number' 
      ? decimals > 0 ? value.toFixed(decimals) : value.toString()
      : '0';
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Particle Counts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 text-sm">
          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
            <div className="text-sm text-gray-400">Positive Particles:</div>
            <div className="text-sm text-right font-medium">{formatNumber(stats.positiveParticles || 0)}</div>
            
            <div className="text-sm text-gray-400">Negative Particles:</div>
            <div className="text-sm text-right font-medium">{formatNumber(stats.negativeParticles || 0)}</div>
            
            <div className="text-sm text-gray-400">Neutral Particles:</div>
            <div className="text-sm text-right font-medium">{formatNumber(stats.neutralParticles || 0)}</div>
            
            <div className="text-sm text-gray-400">High-Energy Particles:</div>
            <div className="text-sm text-right font-medium">{formatNumber(stats.highEnergyParticles || 0)}</div>
            
            <div className="text-sm text-gray-400">Quantum Particles:</div>
            <div className="text-sm text-right font-medium">{formatNumber(stats.quantumParticles || 0)}</div>
            
            <div className="text-sm text-gray-400">Composite Particles:</div>
            <div className="text-sm text-right font-medium">{formatNumber(stats.compositeParticles || 0)}</div>
            
            <div className="text-sm text-gray-400">Adaptive Particles:</div>
            <div className="text-sm text-right font-medium">{formatNumber(stats.adaptiveParticles || 0)}</div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">System Metrics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 text-sm">
          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
            <div className="text-sm text-gray-400">Total Interactions:</div>
            <div className="text-sm text-right font-medium">{formatNumber(stats.totalInteractions || 0)}</div>
            
            <div className="text-sm text-gray-400">Average Knowledge:</div>
            <div className="text-sm text-right font-medium">{formatNumber(stats.averageKnowledge || 0, 2)}</div>
            
            <div className="text-sm text-gray-400">Complexity Index:</div>
            <div className="text-sm text-right font-medium">{formatNumber(stats.complexityIndex || 0, 2)}</div>
            
            <div className="text-sm text-gray-400">Cluster Count:</div>
            <div className="text-sm text-right font-medium">{formatNumber(stats.clusterCount || 0)}</div>
            
            <div className="text-sm text-gray-400">System Entropy:</div>
            <div className="text-sm text-right font-medium">{formatNumber(stats.systemEntropy || 0, 3)}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SimulationStats;
