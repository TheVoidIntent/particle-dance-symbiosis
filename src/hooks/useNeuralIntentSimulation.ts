import { useState, useEffect, useRef, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Define types
type Charge = 'positive' | 'negative' | 'neutral';
type ParticleType = 'regular' | 'high-energy' | 'quantum' | 'composite' | 'adaptive';

interface Particle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  vz: number;
  charge: Charge;
  radius: number;
  mass: number;
  color: string;
  type: ParticleType;
  intent: number;
  energy: number;
  knowledge: number;
  complexity: number;
  adaptability: number;
  lastInteraction: number;
  interactionCount: number;
  age: number;
  intentDecayRate: number;
  created: number;
  scale: number;
  isPostInflation: boolean;
  creationTime: number;
  interactions: number;
}

interface AnomalyEvent {
  type: string;
  description: string;
  particles: string[];
  timestamp: number;
  severity: number;
  affectedParticles: number;
}

interface SimulationStats {
  particleCount: number;
  positiveParticles: number;
  negativeParticles: number;
  neutralParticles: number;
  averageKnowledge: number;
  complexityIndex: number;
  systemEntropy: number;
  interactions: number;
  totalInteractions: number;
  frame: number;
  time: number;
  intentField: number[][];
  highEnergyParticles: number;
  quantumParticles: number;
  compositeParticles: number;
  adaptiveParticles: number;
}

interface InflationEvent {
  timestamp: number;
  particleCount: number;
  energyLevel: number;
  description: string;
}

interface UseNeuralIntentSimulationProps {
  width: number;
  height: number;
  intentFluctuationRate: number;
  maxParticles: number;
  learningRate: number;
  particleCreationRate: number;
  viewMode: '2d' | '3d';
  running: boolean;
  renderMode?: 'particles' | 'field' | 'density' | 'combined';
  useAdaptiveParticles?: boolean;
  energyConservation?: boolean;
  probabilisticIntent?: boolean;
  onAnomalyDetected?: (anomaly: any) => void;
  onInflationDetected: (event: InflationEvent) => void;
  onStatsUpdate: (stats: SimulationStats) => void;
}

export function useNeuralIntentSimulation({
  width,
  height,
  intentFluctuationRate,
  maxParticles,
  learningRate,
  particleCreationRate,
  viewMode,
  running,
  renderMode = 'particles',
  useAdaptiveParticles = false,
  energyConservation = false,
  probabilisticIntent = false,
  onAnomalyDetected,
  onInflationDetected,
  onStatsUpdate
}: UseNeuralIntentSimulationProps) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [intentField, setIntentField] = useState<number[][]>([]);
  const [isRunning, setIsRunning] = useState(running);
  const [simulationTime, setSimulationTime] = useState(0);
  const [interactions, setInteractions] = useState(0);
  const [frameCount, setFrameCount] = useState(0);
  const [inflationEvents, setInflationEvents] = useState<InflationEvent[]>([]);

  const particlesRef = useRef(particles);
  const intentFieldRef = useRef(intentField);
  const interactionsRef = useRef(interactions);
  const frameCountRef = useRef(frameCount);
  const simulationTimeRef = useRef(simulationTime);
  const isAnimatingRef = useRef(false);
  const isInflatedRef = useRef(false);
  const inflationTimeRef = useRef(0);

  const dimensions = { width, height };

  const velocity = 0.5;
  const intentStrength = 0.8;
  const energyFactor = 0.5;

  useEffect(() => {
    particlesRef.current = particles;
    intentFieldRef.current = intentField;
    interactionsRef.current = interactions;
    frameCountRef.current = frameCount;
    simulationTimeRef.current = simulationTime;
  }, [particles, intentField, interactions, frameCount, simulationTime]);

  useEffect(() => {
    setIsRunning(running);
  }, [running]);

  const initializeIntentField = useCallback(() => {
    const gridSize = 20;
    const cols = Math.ceil(width / gridSize);
    const rows = Math.ceil(height / gridSize);
    const newField: number[][] = [];

    for (let y = 0; y < rows; y++) {
      const row: number[] = [];
      for (let x = 0; x < cols; x++) {
        row.push(Math.random() * 2 - 1);
      }
      newField.push(row);
    }

    setIntentField(newField);
  }, [width, height]);

  const getParticleColor = (type: ParticleType): string => {
    switch (type) {
      case 'regular':
        return '#FFFFFF';
      case 'high-energy':
        return '#FFE66D';
      case 'quantum':
        return '#A8E6CF';
      case 'composite':
        return '#DCEDC2';
      case 'adaptive':
        return '#FFD3B4';
      default:
        return '#FFFFFF';
    }
  };

  const createParticle = () => {
    const particleType: ParticleType =
      Math.random() < 0.1 ? 'high-energy' :
        Math.random() < 0.2 ? 'quantum' :
          Math.random() < 0.3 ? 'composite' :
            Math.random() < 0.4 ? 'adaptive' : 'regular';

    const charge: Charge = Math.random() < 0.33 ? 'positive' : Math.random() < 0.66 ? 'negative' : 'neutral';

    const newParticle = {
      id: `p-${Date.now()}-${Math.floor(Math.random() * 100000)}`,
      x: Math.random() * dimensions.width,
      y: Math.random() * dimensions.height,
      vx: (Math.random() - 0.5) * 2 * velocity,
      vy: (Math.random() - 0.5) * 2 * velocity,
      vz: 0,
      radius: 3 + Math.random() * 3,
      mass: 1 + Math.random() * 0.5,
      charge,
      color: getParticleColor(particleType),
      type: particleType,
      intent: (Math.random() * 2 - 1) * intentStrength,
      energy: 1 + Math.random() * energyFactor,
      knowledge: 0.1,
      complexity: 1,
      adaptability: Math.random(),
      lastInteraction: 0,
      interactionCount: 0,
      age: 0,
      intentDecayRate: 0.001,
      created: Date.now(),
      scale: 1,
      isPostInflation: false,
      creationTime: Date.now(),
      interactions: 0
    };

    return newParticle;
  };

  const addParticles = useCallback((count: number) => {
    setParticles(prevParticles => {
      const newParticles = [];
      for (let i = 0; i < count; i++) {
        newParticles.push(createParticle());
      }
      return [...prevParticles, ...newParticles];
    });
  }, [setParticles]);

  const updateIntentField = useCallback(() => {
    setIntentField(prevField => {
      return prevField.map(row =>
        row.map(value => {
          const fluctuation = (Math.random() - 0.5) * intentFluctuationRate * 2;
          return Math.max(-1, Math.min(1, value + fluctuation));
        })
      );
    });
  }, [intentFluctuationRate, setIntentField]);

  const updateParticles = useCallback(() => {
    setParticles(prevParticles => {
      return prevParticles.map(particle => {
        let vx = particle.vx;
        let vy = particle.vy;

        if (intentField.length > 0) {
          const gridSize = 20;
          const gridX = Math.floor(particle.x / gridSize);
          const gridY = Math.floor(particle.y / gridSize);

          if (gridX >= 0 && gridX < intentField[0]?.length &&
            gridY >= 0 && gridY < intentField.length) {
            const fieldValue = intentField[gridY][gridX];
            let fieldMultiplier = 0.02;

            if (particle.charge === 'positive') fieldMultiplier = 0.03;
            if (particle.charge === 'negative') fieldMultiplier = 0.01;

            vx += fieldValue * fieldMultiplier;
            vy += fieldValue * fieldMultiplier;
          }
        }

        let x = particle.x + vx;
        let y = particle.y + vy;

        if (x < 0 || x > width) {
          vx = -vx * 0.8;
          x = Math.max(0, Math.min(width, x));
        }

        if (y < 0 || y > height) {
          vy = -vy * 0.8;
          y = Math.max(0, Math.min(height, y));
        }

        vx *= 0.99;
        vy *= 0.99;

        vx += (Math.random() - 0.5) * 0.05;
        vy += (Math.random() - 0.5) * 0.05;

        return { ...particle, x, y, vx, vy };
      });
    });
  }, [width, height, intentField, setParticles]);

  const detectAnomalies = useCallback(() => {
    const anomalies: AnomalyEvent[] = [];
    // Implement anomaly detection logic here
    return anomalies;
  }, []);

  const handleInflation = useCallback(() => {
    const inflationEvent: InflationEvent = {
      timestamp: Date.now(),
      particleCount: particles.length,
      energyLevel: particles.reduce((sum, p) => sum + p.energy, 0) / particles.length,
      description: 'Inflation event detected'
    };
    setInflationEvents(prevEvents => [...prevEvents, inflationEvent]);
    onInflationDetected(inflationEvent);
  }, [particles, onInflationDetected]);

  const startSimulation = useCallback(() => {
    setIsRunning(true);
  }, []);

  const stopSimulation = useCallback(() => {
    setIsRunning(false);
  }, []);

  const resetSimulation = useCallback(() => {
    setParticles([]);
    setIntentField([]);
    setSimulationTime(0);
    setInteractions(0);
    setFrameCount(0);
    initializeIntentField();
  }, [initializeIntentField]);

  useEffect(() => {
    if (isRunning) {
      const animationLoop = () => {
        setFrameCount(prevFrameCount => prevFrameCount + 1);
        setSimulationTime(prevSimulationTime => prevSimulationTime + 1 / 60);

        if (Math.random() < intentFluctuationRate) {
          updateIntentField();
        }

        updateParticles();

        if (particles.length < maxParticles && Math.random() < particleCreationRate) {
          addParticles(1);
        }

        setInteractions(prevInteractions => prevInteractions + 1);

        const anomalies = detectAnomalies();
        if (anomalies.length > 0) {
          anomalies.forEach(anomaly => onAnomalyDetected?.(anomaly));
        }

        onStatsUpdate({
          particleCount: particles.length,
          positiveParticles: particles.filter(p => p.charge === 'positive').length,
          negativeParticles: particles.filter(p => p.charge === 'negative').length,
          neutralParticles: particles.filter(p => p.charge === 'neutral').length,
          averageKnowledge: particles.reduce((sum, p) => sum + p.knowledge, 0) / particles.length,
          complexityIndex: particles.reduce((sum, p) => sum + p.complexity, 0) / particles.length,
          systemEntropy: 0.5,
          interactions: interactions,
          totalInteractions: interactions,
          frame: frameCount,
          time: simulationTime,
          intentField: intentField,
          highEnergyParticles: particles.filter(p => p.type === 'high-energy').length,
          quantumParticles: particles.filter(p => p.type === 'quantum').length,
          compositeParticles: particles.filter(p => p.type === 'composite').length,
          adaptiveParticles: particles.filter(p => p.type === 'adaptive').length,
        });

        if (isAnimatingRef.current) {
          requestAnimationFrame(animationLoop);
        }
      };

      isAnimatingRef.current = true;
      requestAnimationFrame(animationLoop);
    }

    return () => {
      isAnimatingRef.current = false;
    };
  }, [
    isRunning,
    intentFluctuationRate,
    maxParticles,
    particleCreationRate,
    updateIntentField,
    updateParticles,
    detectAnomalies,
    onAnomalyDetected,
    onStatsUpdate,
    particles,
    intentField,
    interactions,
    frameCount,
    simulationTime,
    addParticles
  ]);

  useEffect(() => {
    initializeIntentField();
    addParticles(50);
  }, [initializeIntentField, addParticles]);

  return {
    particles,
    intentField,
    isRunning,
    simulationTime,
    interactions,
    frameCount,
    startSimulation,
    stopSimulation,
    resetSimulation,
    addParticles,
    updateIntentField,
    updateParticles,
    detectAnomalies,
    handleInflation,
    inflationEvents
  };
}
