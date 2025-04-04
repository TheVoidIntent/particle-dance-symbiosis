import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { isMotherSimulationRunning, getSimulationStats } from '@/utils/motherSimulation';

interface SimulationStatusProps {
  className?: string;
}

interface Stats {
  particleCount: number;
  interactionCount: number;
  knowledgeLevel: number;
}

const SimulationStatus: React.FC<SimulationStatusProps> = ({ className }) => {
  const [stats, setStats] = useState<Stats>({
    particleCount: 0,
    interactionCount: 0,
    knowledgeLevel: 0
  });
  
  useEffect(() => {
    const updateInterval = setInterval(() => {
      if (isMotherSimulationRunning()) {
        const stats = getSimulationStats();
        setStats({
          particleCount: stats.particleCount,
          interactionCount: stats.interactionsCount, // Changed from interactionCount to interactionsCount
          knowledgeLevel: stats.knowledgeAverage * 100
        });
      }
    }, 1000);
    
    return () => clearInterval(updateInterval);
  }, []);
  
  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <CardTitle>Simulation Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Particles:</span>
            <span>{stats.particleCount}</span>
          </div>
          <div className="flex justify-between">
            <span>Interactions:</span>
            <span>{stats.interactionCount}</span>
          </div>
          <div>
            <span>Knowledge Level:</span>
            <div className="flex items-center space-x-2">
              <Progress value={stats.knowledgeLevel} className="flex-grow" />
              <Badge variant="secondary">{stats.knowledgeLevel.toFixed(0)}%</Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SimulationStatus;
