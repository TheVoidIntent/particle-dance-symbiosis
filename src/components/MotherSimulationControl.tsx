
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  startMotherSimulation,
  stopMotherSimulation,
  getMotherSimulationStats,
  isMotherSimulationRunning,
  initializeMotherSimulation
} from '@/utils/motherSimulation';

export const MotherSimulationControl = () => {
  const { toast } = useToast();
  const [stats, setStats] = useState<any>({
    isRunning: false,
    particleCount: 0,
    interactionsCount: 0,
    frameCount: 0,
    simulationTime: 0,
    lastSaved: 'Never',
    particleTypes: {
      positive: 0,
      negative: 0,
      neutral: 0,
      highEnergy: 0,
      quantum: 0,
      composite: 0,
      adaptive: 0
    }
  });
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      initializeMotherSimulation();
      setIsInitialized(true);
      
      // Check if it should auto-start
      const shouldAutoStart = localStorage.getItem('motherSimAutoStart') === 'true';
      if (shouldAutoStart && !isMotherSimulationRunning()) {
        handleStart();
      }
    }
  }, []);

  // Update stats periodically
  useEffect(() => {
    if (!isInitialized) return;
    
    const updateStats = () => {
      const currentStats = getMotherSimulationStats();
      setStats(currentStats);
    };
    
    // Initial stats update
    updateStats();
    
    // Set up interval for live updates
    const interval = setInterval(updateStats, 2000);
    
    return () => clearInterval(interval);
  }, [isInitialized]);

  const handleStart = () => {
    startMotherSimulation();
    localStorage.setItem('motherSimAutoStart', 'true');
    toast({
      title: "Mother Simulation Started",
      description: "The persistent simulation is now running in the background",
      variant: "default",
    });
  };

  const handleStop = () => {
    stopMotherSimulation();
    localStorage.setItem('motherSimAutoStart', 'false');
    toast({
      title: "Mother Simulation Stopped",
      description: "The persistent simulation has been paused",
      variant: "default",
    });
  };

  // Format large numbers with K, M, B, T suffixes
  const formatNumber = (num: number) => {
    if (num === Infinity) return '∞';
    if (num > 1e12) return (num / 1e12).toFixed(1) + 'T';
    if (num > 1e9) return (num / 1e9).toFixed(1) + 'B';
    if (num > 1e6) return (num / 1e6).toFixed(1) + 'M';
    if (num > 1e3) return (num / 1e3).toFixed(1) + 'K';
    return num.toString();
  };

  const formattedTime = (time: number) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  };

  const calculateComplexityLevel = () => {
    const { particleTypes, interactionsCount } = stats;
    if (!particleTypes) return 0;
    
    // A very simplified complexity calculation
    const compositeFactor = particleTypes.composite * 3;
    const adaptiveFactor = particleTypes.adaptive * 2;
    const interactionFactor = Math.min(100, interactionsCount / 10000);
    
    const baseComplexity = Math.min(100, (compositeFactor + adaptiveFactor + interactionFactor) / 2);
    return Math.max(1, baseComplexity);
  };

  return (
    <Card className="w-full shadow-lg border-2 border-indigo-100 dark:border-indigo-900">
      <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl text-indigo-700 dark:text-indigo-300">
              Mother Simulation
            </CardTitle>
            <CardDescription>
              Long-term persistent universe simulation
            </CardDescription>
          </div>
          <Badge variant={stats.isRunning ? "default" : "outline"} className={stats.isRunning ? "bg-green-500" : ""}>
            {stats.isRunning ? "Running" : "Stopped"}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Simulation Time:</span>
            <span className="font-mono">{formattedTime(stats.simulationTime)}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Particles:</span>
            <span className="font-mono">{stats.particleCount}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Interactions:</span>
            <span className="font-mono">{formatNumber(stats.interactionsCount)}</span>
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Complexity Level</span>
              <span>{Math.floor(calculateComplexityLevel())}%</span>
            </div>
            <Progress value={calculateComplexityLevel()} className="h-2" />
          </div>
          
          {stats.particleTypes && (
            <div className="pt-2">
              <div className="text-sm font-medium mb-2">Particle Composition:</div>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-xs">Positive: {stats.particleTypes.positive}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="text-xs">Negative: {stats.particleTypes.negative}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                  <span className="text-xs">Neutral: {stats.particleTypes.neutral}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <span className="text-xs">High-Energy: {stats.particleTypes.highEnergy}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                  <span className="text-xs">Composite: {stats.particleTypes.composite}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-pink-500"></div>
                  <span className="text-xs">Adaptive: {stats.particleTypes.adaptive}</span>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex gap-2 pt-2">
            {!stats.isRunning ? (
              <Button 
                onClick={handleStart}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              >
                Start Background Simulation
              </Button>
            ) : (
              <Button 
                onClick={handleStop}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              >
                Pause Simulation
              </Button>
            )}
          </div>
          
          <div className="text-xs text-gray-500 mt-2">
            Last saved: {stats.lastSaved}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MotherSimulationControl;
