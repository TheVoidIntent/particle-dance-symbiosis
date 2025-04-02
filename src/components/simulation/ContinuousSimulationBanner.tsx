
import React, { useState, useEffect } from 'react';
import { AlertCircle, Clock } from 'lucide-react';
import { isMotherSimulationRunning, getSimulationStats } from '@/utils/simulation/motherSimulation';

const ContinuousSimulationBanner: React.FC = () => {
  const [status, setStatus] = useState({
    isRunning: false,
    uptime: 0,
    particleCount: 0,
    lastChecked: new Date()
  });
  
  useEffect(() => {
    // Initial check
    checkStatus();
    
    // Check status every 5 seconds
    const interval = setInterval(checkStatus, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  const checkStatus = () => {
    const isRunning = isMotherSimulationRunning();
    const stats = getSimulationStats();
    
    setStatus(prev => ({
      isRunning,
      uptime: prev.uptime + 5, // Increment uptime by 5 seconds
      particleCount: stats.particleCount || 0,
      lastChecked: new Date()
    }));
  };
  
  // Format uptime as hours, minutes, seconds
  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className={`fixed bottom-4 left-4 z-50 px-4 py-2 rounded-lg shadow-lg 
      ${status.isRunning ? 'bg-green-900/80' : 'bg-red-900/80'} 
      backdrop-blur-md border ${status.isRunning ? 'border-green-700' : 'border-red-700'}`}>
      <div className="flex items-center gap-2">
        <div className={`animate-pulse w-2 h-2 rounded-full ${status.isRunning ? 'bg-green-400' : 'bg-red-400'}`}></div>
        <div className="text-sm font-medium text-white">
          {status.isRunning ? 'Continuous Simulation Active' : 'Simulation Paused'}
        </div>
      </div>
      
      <div className="mt-1 grid grid-cols-2 gap-4 text-xs text-gray-300">
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          <span>Uptime: {formatUptime(status.uptime)}</span>
        </div>
        <div className="flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          <span>{status.particleCount} particles</span>
        </div>
      </div>
    </div>
  );
};

export default ContinuousSimulationBanner;
