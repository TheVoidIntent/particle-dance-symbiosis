
import React, { useRef, useEffect, useState } from 'react';
import { useSimulationReset } from '@/hooks/useSimulationReset';
import { Particle, SimulationStats } from '@/types/simulation';
import { initializeIntentField } from '@/utils/intentFieldUtils';

interface ParticleCanvasProps {
  width?: number;
  height?: number;
  onStatsUpdate?: (stats: SimulationStats) => void;
  particles?: Particle[];
  showIntentField?: boolean;
  className?: string;
  intentFluctuationRate?: number;
  maxParticles?: number;
  learningRate?: number;
  particleCreationRate?: number;
  viewMode?: '2d' | '3d';
  renderMode?: 'particles' | 'field' | 'both';
  useAdaptiveParticles?: boolean;
  energyConservation?: boolean;
  probabilisticIntent?: boolean;
  running?: boolean;
  onAnomalyDetected?: (anomaly: any) => void;
}

const ParticleCanvas: React.FC<ParticleCanvasProps> = ({
  width = 800,
  height = 600,
  onStatsUpdate = () => {},
  particles = [],
  showIntentField = false,
  className = '',
  intentFluctuationRate = 0.01,
  maxParticles = 100,
  learningRate = 0.1,
  particleCreationRate = 1,
  viewMode = '2d',
  renderMode = 'particles',
  useAdaptiveParticles = false,
  energyConservation = false,
  probabilisticIntent = false,
  running = true,
  onAnomalyDetected = () => {}
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>(particles || []);
  const intentFieldRef = useRef<number[][][]>([]);
  const interactionsRef = useRef<number>(0);
  const frameCountRef = useRef<number>(0);
  const simulationTimeRef = useRef<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(running);
  const [animationFrameId, setAnimationFrameId] = useState<number | null>(null);
  
  // Process simulation data for stats
  const processSimulationData = (
    particles: Particle[],
    intentField: number[][][],
    interactions: number,
    frameCount: number,
    simulationTime: number
  ): SimulationStats => {
    const positiveParticles = particles.filter(p => p.charge === 'positive').length;
    const negativeParticles = particles.filter(p => p.charge === 'negative').length;
    const neutralParticles = particles.filter(p => p.charge === 'neutral').length;
    
    return {
      particleCount: particles.length,
      positiveParticles,
      negativeParticles,
      neutralParticles,
      interactions: interactions,
      totalInteractions: interactions,
      frame: frameCount,
      time: simulationTime,
      // Additional stats could be calculated here
    };
  };
  
  // Initialize the canvas and simulation
  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = width;
      canvas.height = height;
      
      // Initialize intent field
      intentFieldRef.current = initializeIntentField(width, height);
      
      // Initial stats update
      const stats = processSimulationData(
        particlesRef.current,
        intentFieldRef.current,
        interactionsRef.current,
        frameCountRef.current,
        simulationTimeRef.current
      );
      onStatsUpdate(stats);
    }
  }, [width, height, onStatsUpdate]);

  // Update particles ref when external particles change
  useEffect(() => {
    particlesRef.current = particles;
  }, [particles]);
  
  // Simulation reset hook
  const { resetSimulation } = useSimulationReset({
    particlesRef,
    intentFieldRef,
    interactionsRef,
    frameCountRef,
    simulationTimeRef,
    canvasRef,
    processSimulationData,
    onStatsUpdate
  });
  
  // Handle reset button click - fixed to return Particle[] as required
  const handleResetSimulation = (): Particle[] => {
    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId);
      setAnimationFrameId(null);
      setIsRunning(false);
    }
    
    return resetSimulation();
  };
  
  // Render loop
  useEffect(() => {
    // Animation and rendering code would go here
    
    return () => {
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isRunning]);
  
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
        <button
          className={`px-3 py-1 rounded-md text-white ${isRunning ? 'bg-red-500' : 'bg-green-500'}`}
          onClick={() => setIsRunning(!isRunning)}
        >
          {isRunning ? 'Pause' : 'Start'}
        </button>
        <button
          className="px-3 py-1 rounded-md text-white bg-blue-500"
          onClick={handleResetSimulation}
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default ParticleCanvas;
export { ParticleCanvas };
