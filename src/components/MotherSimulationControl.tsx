
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { 
  startMotherSimulation, 
  stopMotherSimulation, 
  isMotherSimulationRunning, 
  getSimulationStats 
} from '@/utils/simulation/motherSimulation';

const MotherSimulationControl: React.FC = () => {
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [stats, setStats] = useState({
    particleCount: 0,
    interactionCount: 0,
    knowledgeLevel: 0
  });
  
  useEffect(() => {
    const checkSimulationStatus = () => {
      const running = isMotherSimulationRunning();
      setIsRunning(running);
      
      const currentStats = getSimulationStats();
      setStats({
        particleCount: currentStats.particleCount || 0,
        interactionCount: currentStats.interactionsCount || 0, // Changed from interactionCount to interactionsCount
        knowledgeLevel: currentStats.knowledgeAverage * 100
      });
    };
    
    checkSimulationStatus();
    
    if (!isMotherSimulationRunning()) {
      console.log("Auto-starting mother simulation from control component...");
      startMotherSimulation();
      toast.success("Universe simulation started");
      setIsRunning(true);
    }
    
    const statsInterval = setInterval(checkSimulationStatus, 1000);
    
    return () => clearInterval(statsInterval);
  }, []);
  
  const handleStartStop = () => {
    if (isRunning) {
      stopMotherSimulation();
      toast.info("Universe simulation paused");
      setIsRunning(false);
    } else {
      startMotherSimulation();
      toast.success("Universe simulation resumed");
      setIsRunning(true);
    }
  };
  
  const handleReset = () => {
    stopMotherSimulation();
    localStorage.removeItem('motherSimulationState');
    localStorage.removeItem('motherSimulationLastSaved');
    
    setTimeout(() => {
      startMotherSimulation();
      toast.success("Universe simulation reset and restarted");
      setIsRunning(true);
    }, 500);
  };
  
  const handleBoost = () => {
    for (let i = 0; i < 10; i++) {
      setTimeout(() => {
        if (typeof window !== 'undefined') {
          const event = new CustomEvent('boost-simulation', { detail: { count: 5 } });
          window.dispatchEvent(event);
        }
      }, i * 100);
    }
    
    toast.success("Energy boost applied to simulation");
  };
  
  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow mb-6">
      <div className="flex-1">
        <h3 className="text-lg font-semibold mb-1">Continuous Simulation Control</h3>
        <div className="flex items-center gap-2">
          <div className={`h-3 w-3 rounded-full ${isRunning ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
          <span className="text-sm text-gray-600 dark:text-gray-300">
            {isRunning ? 'Running' : 'Paused'}
          </span>
        </div>
      </div>
      
      <div className="flex gap-2 items-center">
        <Badge variant="outline" className="bg-gray-200 dark:bg-gray-700">
          {stats.particleCount} particles
        </Badge>
        <Badge variant="outline" className="bg-gray-200 dark:bg-gray-700">
          {stats.interactionCount.toLocaleString()} interactions
        </Badge>
      </div>
      
      <div className="flex gap-2">
        <Button 
          variant={isRunning ? "destructive" : "default"} 
          size="sm" 
          onClick={handleStartStop}
        >
          {isRunning ? <Pause className="h-4 w-4 mr-1" /> : <Play className="h-4 w-4 mr-1" />}
          {isRunning ? 'Pause' : 'Start'}
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleReset}
        >
          <RotateCcw className="h-4 w-4 mr-1" />
          Reset
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleBoost}
          className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 border-yellow-300 dark:bg-yellow-900 dark:hover:bg-yellow-800 dark:text-yellow-200 dark:border-yellow-700"
        >
          <Zap className="h-4 w-4 mr-1" />
          Boost
        </Button>
      </div>
    </div>
  );
};

export default MotherSimulationControl;
