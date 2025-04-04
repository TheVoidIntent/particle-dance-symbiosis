import React, { useRef, useEffect, useState } from 'react';
import { useSimulationState } from '@/hooks/simulation';
import { Particle, SimulationStats } from '@/types/simulation';
import { detectStableClusters, evolveClusterIntelligence, generateClusterNarratives, identifyRobotClusters } from '@/utils/clusterIntelligence';

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
  onParticleInteraction?: (particle1: Particle, particle2: Particle) => void;
  onFieldFluctuation?: (intensity: number, x: number, y: number) => void;
  onEmergenceEvent?: (complexity: number) => void;
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
  onRobotEvolution = () => {},
  onParticleInteraction = () => {},
  onFieldFluctuation = () => {},
  onEmergenceEvent = () {}
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [simulationStats, setSimulationStats] = useState<SimulationStats>({
    particleCount: 0,
    positiveParticles: 0,
    negativeParticles: 0,
    neutralParticles: 0,
    totalInteractions: 0,
    timestamp: Date.now()
  });
  const [narratives, setNarratives] = useState<Array<{ clusterId: number, narrative: string, timestamp: number }>>([]);
  const [robots, setRobots] = useState<Array<any>>([]);
  const [interactionEvents, setInteractionEvents] = useState<number>(0);
  const [fluctuationEvents, setFluctuationEvents] = useState<number>(0);
  
  const lastInteractionAudio = useRef<number>(0);
  const lastFluctuationAudio = useRef<number>(0);
  const lastEmergenceAudio = useRef<number>(0);
  
  const simulationState = useSimulationState({
    initialParticles: [],
    dimensions: { width, height }
  });
  
  const activeParticles = particles.length > 0 ? particles : simulationState.particles;
  const activeRunning = typeof isRunning !== 'undefined' ? isRunning : running;
  
  useEffect(() => {
    if (!activeRunning || !activeParticles || activeParticles.length < 5) return;
    
    const processInterval = setInterval(() => {
      if (!activeParticles || activeParticles.length === 0) return;
      
      const validParticles = activeParticles.filter(p => 
        p && p.id && p.x !== undefined && p.y !== undefined && p.charge
      ) as Particle[];
      
      if (validParticles.length < 5) return;
      
      try {
        const { clusters, unclusteredParticles } = detectStableClusters(validParticles, 0.6);
        
        if (clusters.length > 0) {
          const evolvedClusters = evolveClusterIntelligence(clusters, simulationStats, 0.1);
          
          const newNarratives = generateClusterNarratives(evolvedClusters, simulationStats);
          setNarratives(prev => [...prev, ...newNarratives]);
          
          newNarratives.forEach(narrative => {
            onClusterNarrative(narrative);
          });
          
          const newRobots = identifyRobotClusters(evolvedClusters);
          
          const existingRobotIds = robots.map(r => r.id);
          const trulyNewRobots = newRobots.filter(r => !existingRobotIds.includes(r.id));
          
          if (trulyNewRobots.length > 0) {
            setRobots(prev => [...prev, ...trulyNewRobots]);
            
            trulyNewRobots.forEach(robot => {
              onRobotEvolution(robot);
            });
            
            const complexity = Math.min(trulyNewRobots.length * 0.2, 0.9);
            if (Date.now() - lastEmergenceAudio.current > 10000) {
              onEmergenceEvent(complexity);
              lastEmergenceAudio.current = Date.now();
            }
          }
        }
        
        simulateInteractions(validParticles);
        
        simulateFieldFluctuations();
      } catch (error) {
        console.error("Error processing clusters:", error);
      }
    }, 1000);
    
    return () => clearInterval(processInterval);
  }, [activeParticles, activeRunning, simulationStats, onClusterNarrative, onRobotEvolution, robots, onEmergenceEvent]);
  
  const simulateInteractions = (particles: Particle[]) => {
    if (particles.length < 2) return;
    
    if (Date.now() - lastInteractionAudio.current < 300) return;
    
    const interactionProbability = 0.1;
    if (Math.random() > interactionProbability) return;
    
    const index1 = Math.floor(Math.random() * particles.length);
    let index2 = index1;
    while (index2 === index1) {
      index2 = Math.floor(Math.random() * particles.length);
    }
    
    const p1 = particles[index1];
    const p2 = particles[index2];
    
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance < 100) {
      setInteractionEvents(prev => prev + 1);
      onParticleInteraction(p1, p2);
      lastInteractionAudio.current = Date.now();
    }
  };
  
  const simulateFieldFluctuations = () => {
    if (Date.now() - lastFluctuationAudio.current < 2000) return;
    
    const fluctuationProbability = intentFluctuationRate * 10;
    if (Math.random() > fluctuationProbability) return;
    
    const x = Math.random();
    const y = Math.random();
    const intensity = 0.2 + Math.random() * 0.8;
    
    setFluctuationEvents(prev => prev + 1);
    onFieldFluctuation(intensity, x, y);
    lastFluctuationAudio.current = Date.now();
  };
  
  useEffect(() => {
    if (!activeParticles || activeParticles.length === 0) return;
    
    const stats: SimulationStats = {
      particleCount: activeParticles.length,
      positiveParticles: activeParticles.filter(p => p.charge === 'positive').length,
      negativeParticles: activeParticles.filter(p => p.charge === 'negative').length,
      neutralParticles: activeParticles.filter(p => p.charge === 'neutral').length,
      totalInteractions: activeParticles.reduce((sum, p) => sum + (p.interactions || 0), 0),
      robotCount: robots.length,
      clusterCount: narratives.length > 0 ? [...new Set(narratives.map(n => n.clusterId))].length : 0,
      timestamp: Date.now(),
      interactions: interactionEvents,
      fluctuationEvents: fluctuationEvents
    };
    
    setSimulationStats(stats);
    onStatsUpdate(stats);
  }, [activeParticles, robots, narratives, onStatsUpdate, interactionEvents, fluctuationEvents]);
  
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
