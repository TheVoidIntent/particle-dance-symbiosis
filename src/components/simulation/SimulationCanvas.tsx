
import React, { useRef, useEffect, useState } from 'react';
import { useSimulationState } from '@/hooks/simulation';
import { Particle, SimulationStats } from '@/types/simulation';
import { detectStableClusters, evolveClusterIntelligence, generateClusterNarratives, identifyRobotClusters } from '@/utils/clusterIntelligence';
import { playSimulationEvent } from '@/utils/audio/simulationAudioUtils';

export interface SimulationCanvasProps {
  width?: number;
  height?: number;
  onStatsUpdate?: (stats: SimulationStats) => void;
  particles?: Particle[];
  isRunning?: boolean;
  showIntentField?: boolean;
  className?: string;
  intentFluctuationRate?: number;
  maxParticles?: number;
  particleCreationRate?: number;
  positiveChargeBehavior?: number;
  negativeChargeBehavior?: number;
  neutralChargeBehavior?: number;
  probabilisticIntent?: boolean;
  visualizationMode?: 'particles' | 'field' | 'both';
  running?: boolean;
  onAnomalyDetected?: (anomaly: any) => void;
  onClusterNarrative?: (narrative: { clusterId: number, narrative: string, timestamp: number }) => void;
  onRobotEvolution?: (robot: any) => void;
}

const SimulationCanvas: React.FC<SimulationCanvasProps> = ({
  width = 800,
  height = 600,
  onStatsUpdate = () => {},
  particles = [],
  isRunning = true,
  showIntentField = false,
  className = '',
  intentFluctuationRate = 0.01,
  maxParticles = 100,
  particleCreationRate = 1,
  positiveChargeBehavior = 0.8,
  negativeChargeBehavior = 0.3,
  neutralChargeBehavior = 0.5,
  probabilisticIntent = false,
  visualizationMode = 'particles',
  running = true,
  onAnomalyDetected = () => {},
  onClusterNarrative = () => {},
  onRobotEvolution = () => {}
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [simulationStats, setSimulationStats] = useState<SimulationStats>({
    particleCount: 0,
    positiveParticles: 0,
    negativeParticles: 0,
    neutralParticles: 0,
    totalInteractions: 0
  });
  const [narratives, setNarratives] = useState<Array<{ clusterId: number, narrative: string, timestamp: number }>>([]);
  const [robots, setRobots] = useState<Array<any>>([]);
  
  // Get simulation state or use provided particles
  const simulationState = useSimulationState({
    initialParticles: particles,
    dimensions: { width, height }
  });
  
  const activeParticles = particles.length > 0 ? particles : simulationState.particles;
  const activeRunning = typeof isRunning !== 'undefined' ? isRunning : running;
  
  // Process simulation data for insights
  useEffect(() => {
    if (!activeRunning || activeParticles.length < 5) return;
    
    const processInterval = setInterval(() => {
      // Detect stable clusters
      const { clusters, unclusteredParticles } = detectStableClusters(activeParticles, 0.6);
      
      if (clusters.length > 0) {
        // Play audio event for cluster formation
        playSimulationEvent('cluster_formation', { intensity: clusters.length / 5 });
        
        // Evolve cluster intelligence
        const evolvedClusters = evolveClusterIntelligence(clusters, simulationStats, 0.1);
        
        // Generate narratives for evolved clusters
        const newNarratives = generateClusterNarratives(evolvedClusters, simulationStats);
        setNarratives(prev => [...prev, ...newNarratives]);
        
        // Notify about new narratives
        newNarratives.forEach(narrative => {
          onClusterNarrative(narrative);
        });
        
        // Check for robot-level intelligence
        const newRobots = identifyRobotClusters(evolvedClusters);
        
        // Check if we have any new robots that weren't previously identified
        const existingRobotIds = robots.map(r => r.id);
        const trulyNewRobots = newRobots.filter(r => !existingRobotIds.includes(r.id));
        
        if (trulyNewRobots.length > 0) {
          setRobots(prev => [...prev, ...trulyNewRobots]);
          
          // Play special audio event for robot evolution
          playSimulationEvent('robot_evolution', { count: trulyNewRobots.length });
          
          // Notify about robot evolution
          trulyNewRobots.forEach(robot => {
            onRobotEvolution(robot);
          });
        }
      }
    }, 5000); // Process every 5 seconds to avoid performance issues
    
    return () => clearInterval(processInterval);
  }, [activeParticles, activeRunning, simulationStats, onClusterNarrative, onRobotEvolution, robots]);
  
  // Update simulation stats
  useEffect(() => {
    if (activeParticles.length === 0) return;
    
    const stats: SimulationStats = {
      particleCount: activeParticles.length,
      positiveParticles: activeParticles.filter(p => p.charge === 'positive').length,
      negativeParticles: activeParticles.filter(p => p.charge === 'negative').length,
      neutralParticles: activeParticles.filter(p => p.charge === 'neutral').length,
      totalInteractions: activeParticles.reduce((sum, p) => sum + (p.interactions || 0), 0),
      robotCount: robots.length,
      clusterCount: narratives.length > 0 ? [...new Set(narratives.map(n => n.clusterId))].length : 0
    };
    
    setSimulationStats(stats);
    onStatsUpdate(stats);
  }, [activeParticles, robots, narratives, onStatsUpdate]);
  
  // Rendering logic for canvas would go here...
  
  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        className={`border border-gray-300 bg-black rounded-lg shadow-lg ${className}`}
        width={width}
        height={height}
        style={{ width: '100%', height: 'auto' }}
      />
      <div className="absolute top-2 right-2 flex space-x-2">
        {/* Controls would go here */}
      </div>
      {robots.length > 0 && (
        <div className="absolute bottom-2 left-2 bg-black/50 p-2 rounded text-xs text-green-400">
          {robots.length} evolved intelligence entities detected
        </div>
      )}
    </div>
  );
};

export default SimulationCanvas;
