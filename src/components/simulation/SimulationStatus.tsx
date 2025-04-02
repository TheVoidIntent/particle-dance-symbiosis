
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Clock } from 'lucide-react';
import { 
  isMotherSimulationRunning, 
  getSimulationStats 
} from "@/utils/simulation/motherSimulation";

export const SimulationStatus: React.FC = () => {
  const [status, setStatus] = useState({
    isRunning: false,
    lastUpdateTime: new Date(),
    particleCount: 0,
    interactionsCount: 0
  });
  
  useEffect(() => {
    // Initial check
    updateStatus();
    
    // Update status every 2 seconds
    const interval = setInterval(updateStatus, 2000);
    
    return () => clearInterval(interval);
  }, []);
  
  const updateStatus = () => {
    const running = isMotherSimulationRunning();
    const stats = getSimulationStats();
    
    setStatus({
      isRunning: running,
      lastUpdateTime: new Date(),
      particleCount: stats.particleCount || 0,
      interactionsCount: stats.interactionsCount || 0
    });
  };
  
  // Format the time as HH:MM:SS
  const formattedTime = status.lastUpdateTime.toLocaleTimeString();
  
  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge 
              variant="outline" 
              className={`${status.isRunning ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'} px-2 py-0.5`}
            >
              {status.isRunning ? 'RUNNING' : 'STOPPED'}
            </Badge>
            <div className="text-sm flex items-center gap-1">
              <Activity className="h-3 w-3 text-blue-400" />
              <span className="text-gray-300">Active Simulations</span>
            </div>
          </div>
          
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <Clock className="h-3 w-3" />
            <span>Last update: {formattedTime}</span>
          </div>
        </div>
        
        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="bg-gray-900/40 rounded p-2">
            <div className="text-xs text-gray-400">Particles</div>
            <div className="text-xl font-bold text-white">{status.particleCount}</div>
          </div>
          <div className="bg-gray-900/40 rounded p-2">
            <div className="text-xs text-gray-400">Interactions</div>
            <div className="text-xl font-bold text-white">{status.interactionsCount}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
