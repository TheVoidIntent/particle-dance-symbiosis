
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, RefreshCw } from 'lucide-react';
import { 
  startMotherSimulation, 
  stopMotherSimulation, 
  isMotherSimulationRunning, 
  getSimulationStats 
} from "@/utils/simulation/motherSimulation";

const MotherSimulationControl: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [stats, setStats] = useState<any>({});
  
  useEffect(() => {
    // Initialize state
    setIsRunning(isMotherSimulationRunning());
    
    // Update stats periodically
    const interval = setInterval(() => {
      const currentStats = getSimulationStats();
      setIsRunning(currentStats.isRunning);
      setStats(currentStats);
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  const handleToggle = () => {
    if (isRunning) {
      stopMotherSimulation();
      setIsRunning(false);
    } else {
      const simulation = startMotherSimulation();
      setIsRunning(true);
      
      // Add cleanup function
      window.addEventListener('beforeunload', () => {
        if (simulation) simulation.stop();
      });
    }
  };

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <Badge variant={isRunning ? "default" : "outline"} className={isRunning ? "bg-green-600" : ""}>
              {isRunning ? "Running" : "Stopped"}
            </Badge>
            <div className="text-sm">
              <span className="font-medium">Mother Simulation: </span>
              <span className="text-gray-400">
                {stats.particleCount || 0} particles, {stats.interactionsCount || 0} interactions
              </span>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant={isRunning ? "destructive" : "default"}
              size="sm"
              onClick={handleToggle}
              className="flex items-center gap-1"
            >
              {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {isRunning ? "Stop" : "Start"} Simulation
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                stopMotherSimulation();
                setTimeout(() => {
                  startMotherSimulation();
                  setIsRunning(true);
                }, 100);
              }}
              className="flex items-center gap-1"
            >
              <RefreshCw className="h-4 w-4" />
              Reset
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MotherSimulationControl;
