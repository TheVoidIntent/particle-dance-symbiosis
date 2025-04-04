
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { SimulationStatsData } from '@/hooks/useSimulationData';

interface StatsCardsProps {
  stats: SimulationStatsData;
}

const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Particles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats.particleCount}</div>
          <p className="text-gray-500 text-sm">Active in simulation</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Interactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats.interactionCount.toLocaleString()}</div>
          <p className="text-gray-500 text-sm">Total processed</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Knowledge Level</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <div className="text-3xl font-bold">{(stats.knowledgeAverage * 100).toFixed(1)}%</div>
          </div>
          <Progress value={stats.knowledgeAverage * 100} className="h-2 mt-2" />
          <p className="text-gray-500 text-sm">Average across particles</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsCards;
