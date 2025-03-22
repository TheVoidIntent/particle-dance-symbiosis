
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { 
  Particle, 
  calculateParticleInteraction,
  updateParticlePosition,
  createParticleFromField,
  analyzeParticleClusters,
  calculateSystemEntropy,
  detectAnomalies,
  AnomalyEvent
} from '@/utils/particleUtils';
import { 
  updateIntentField, 
  createFieldFromParticles,
  analyzeIntentField
} from '@/utils/fieldUtils';
import { 
  renderParticles, 
  renderIntentField,
  renderParticleDensity
} from '@/utils/renderUtils';
import {
  recordDataPoint,
  exportDataToCSV,
  exportDataToJSON,
  shouldCollectData,
  clearSimulationData,
  persistedState,
  clearPersistedState
} from '@/utils/dataExportUtils';
import { useToast } from "@/hooks/use-toast";

type ParticleCanvasProps = {
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
  onStatsUpdate: (stats: {
    positiveParticles: number;
    negativeParticles: number;
    neutralParticles: number;
    highEnergyParticles: number;
    quantumParticles: number;
    compositeParticles: number;
    adaptiveParticles: number;
    totalInteractions: number;
    complexityIndex: number;
    averageKnowledge: number;
    maxComplexity: number;
    clusterCount: number;
    averageClusterSize: number;
    systemEntropy: number;
    intentFieldComplexity: number;
    // New enhanced metrics
    shannonEntropy?: number;
    spatialEntropy?: number;
    fieldOrderParameter?: number;
    clusterLifetime?: number;
    clusterEntropyDelta?: number;
    informationDensity?: number;
    kolmogorovComplexity?: number;
  }) => void;
  onAnomalyDetected?: (anomaly: AnomalyEvent) => void;
};

export const ParticleCanvas: React.FC<ParticleCanvasProps> = ({
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
  onStatsUpdate,
  onAnomalyDetected
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>(persistedState.hasPersistedState ? [...persistedState.particles] : []);
  const intentFieldRef = useRef<number[][][]>(persistedState.hasPersistedState ? [...persistedState.intentField] : []);
  const dimensionsRef = useRef({ width: 0, height: 0 });
  const animationRef = useRef<number>(0);
  const interactionsRef = useRef<number>(persistedState.hasPersistedState ? persistedState.interactions : 0);
  const frameCountRef = useRef<number>(persistedState.hasPersistedState ? persistedState.frameCount : 0);
  const simulationTimeRef = useRef<number>(persistedState.hasPersistedState ? persistedState.simulationTime : 0);
  const previousStateRef = useRef({
    entropy: 0,
    clusterCount: 0,
    adaptiveCount: 0,
    compositeCount: 0,
  });
  const [isInitialized, setIsInitialized] = useState(persistedState.hasPersistedState);
  const { toast } = useToast();
  const dataCollectionActiveRef = useRef<boolean>(true);
  const [dataExportOptions, setDataExportOptions] = useState({
    autoExport: false,
    exportInterval: 5000,
    format: 'csv' as 'csv' | 'json'
  });
  const isAnimatingRef = useRef(false);

  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const { width, height } = canvas.getBoundingClientRect();
    
    canvas.width = width;
    canvas.height = height;
    dimensionsRef.current = { width, height };
    
    if (!persistedState.hasPersistedState) {
      const fieldResolution = 10;
      const fieldWidth = Math.ceil(width / fieldResolution);
      const fieldHeight = Math.ceil(height / fieldResolution);
      const fieldDepth = 10;
      
      const newField: number[][][] = [];
      
      for (let z = 0; z < fieldDepth; z++) {
        const plane: number[][] = [];
        for (let y = 0; y < fieldHeight; y++) {
          const row: number[] = [];
          for (let x = 0; x < fieldWidth; x++) {
            row.push(Math.random() * 2 - 1);
          }
          plane.push(row);
        }
        newField.push(plane);
      }
      
      intentFieldRef.current = newField;
    }
    
    setIsInitialized(true);
    
    if (persistedState.hasPersistedState) {
      const ratioX = width / dimensionsRef.current.width;
      const ratioY = height / dimensionsRef.current.height;
      
      if (ratioX !== 1 || ratioY !== 1) {
        particlesRef.current = particlesRef.current.map(p => ({
          ...p,
          x: p.x * ratioX,
          y: p.y * ratioY
        }));
      }
      
      toast({
        title: "Simulation Continued",
        description: `Continuing from previous state with ${particlesRef.current.length} particles`,
        variant: "default",
      });
    }
    
    const handleResize = () => {
      if (!canvasRef.current) return;
      const canvas = canvasRef.current;
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = width;
      canvas.height = height;
      dimensionsRef.current = { width, height };
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [toast]);

  useEffect(() => {
    if (!running || !isInitialized || intentFieldRef.current.length === 0) return;
    
    const createParticlesInterval = setInterval(() => {
      if (particlesRef.current.length >= maxParticles) return;
      
      const numToCreate = Math.floor(Math.random() * particleCreationRate) + 1;
      const newParticles = [...particlesRef.current];
      
      for (let i = 0; i < numToCreate; i++) {
        if (newParticles.length >= maxParticles) break;
        
        const x = Math.random() * dimensionsRef.current.width;
        const y = Math.random() * dimensionsRef.current.height;
        const z = Math.random() * 10;
        
        const fieldX = Math.floor(x / (dimensionsRef.current.width / intentFieldRef.current[0][0].length));
        const fieldY = Math.floor(y / (dimensionsRef.current.height / intentFieldRef.current[0].length));
        const fieldZ = Math.floor(z / (10 / intentFieldRef.current.length));
        
        const fieldValue = intentFieldRef.current[
          Math.min(fieldZ, intentFieldRef.current.length - 1)
        ][
          Math.min(fieldY, intentFieldRef.current[0].length - 1)
        ][
          Math.min(fieldX, intentFieldRef.current[0][0].length - 1)
        ];
        
        const newParticle = createParticleFromField(
          fieldValue, 
          x, y, z, 
          Date.now() + i
        );
        
        if (useAdaptiveParticles && Math.random() < 0.1) {
          newParticle.type = 'adaptive';
          newParticle.color = 'rgba(236, 72, 153, 0.85)';
          newParticle.adaptiveScore = 1;
        }
        
        if (energyConservation) {
          newParticle.energyCapacity = 1 + Math.random() * 0.5;
          newParticle.intentDecayRate = 0.0002 + (Math.random() * 0.0002);
        } else {
          newParticle.energyCapacity = 100;
          newParticle.intentDecayRate = 0.00001;
        }
        
        newParticles.push(newParticle);
      }
      
      particlesRef.current = newParticles;
    }, 1000 / particleCreationRate);
    
    return () => clearInterval(createParticlesInterval);
  }, [running, isInitialized, maxParticles, particleCreationRate, useAdaptiveParticles, energyConservation]);

  useEffect(() => {
    if (!running || !isInitialized || intentFieldRef.current.length === 0) return;
    
    const updateIntentInterval = setInterval(() => {
      intentFieldRef.current = updateIntentField(
        intentFieldRef.current, 
        intentFluctuationRate, 
        probabilisticIntent
      );
      
      if (frameCountRef.current % 100 === 0) {
        const particleField = createFieldFromParticles(
          particlesRef.current, 
          { 
            width: dimensionsRef.current.width, 
            height: dimensionsRef.current.height, 
            depth: 10 
          },
          dimensionsRef.current.width / intentFieldRef.current[0][0].length
        );
        
        const blendedField = intentFieldRef.current.map((plane, z) => 
          plane.map((row, y) => 
            row.map((value, x) => 
              value * 0.7 + particleField[z][y][x] * 0.3
            )
          )
        );
        
        intentFieldRef.current = blendedField;
      }
    }, 1000);
    
    return () => clearInterval(updateIntentInterval);
  }, [running, isInitialized, intentFluctuationRate, probabilisticIntent]);

  const updateParticles = useCallback(() => {
    const particles = particlesRef.current;
    const dimensions = dimensionsRef.current;
    const intentField = intentFieldRef.current;
    
    if (particles.length === 0 || intentField.length === 0) return particles;
    
    const newParticles = [...particles];
    
    for (let i = 0; i < newParticles.length; i++) {
      newParticles[i] = updateParticlePosition(
        newParticles[i], 
        dimensions, 
        intentField, 
        viewMode,
        newParticles
      );
      
      for (let j = i + 1; j < newParticles.length; j++) {
        const [updatedParticle1, updatedParticle2, interactionOccurred] = calculateParticleInteraction(
          newParticles[i],
          newParticles[j],
          learningRate,
          viewMode
        );
        
        newParticles[i] = updatedParticle1;
        newParticles[j] = updatedParticle2;
        
        if (interactionOccurred) {
          interactionsRef.current += 1;
        }
      }
    }
    
    if (energyConservation) {
      return newParticles.filter(p => p.energy > 0.1);
    }
    
    return newParticles;
  }, [viewMode, learningRate, energyConservation]);

  const startAnimation = useCallback(() => {
    if (isAnimatingRef.current) return;
    
    isAnimatingRef.current = true;
    
    const animate = () => {
      if (!running) {
        isAnimatingRef.current = false;
        return;
      }
      
      frameCountRef.current += 1;
      simulationTimeRef.current += 1;
      
      particlesRef.current = updateParticles();
      
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, dimensionsRef.current.width, dimensionsRef.current.height);
          ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
          ctx.fillRect(0, 0, dimensionsRef.current.width, dimensionsRef.current.height);
          
          if (renderMode === 'particles' || renderMode === 'combined') {
            renderParticles(ctx, particlesRef.current, dimensionsRef.current, viewMode, true);
          }
          
          if (renderMode === 'field') {
            renderIntentField(ctx, intentFieldRef.current, dimensionsRef.current, 5, 0.3);
          }
          
          if (renderMode === 'density') {
            renderParticleDensity(ctx, particlesRef.current, dimensionsRef.current, 15, 0.4);
          }
          
          if (renderMode === 'combined') {
            renderIntentField(ctx, intentFieldRef.current, dimensionsRef.current, 5, 0.1);
          }
        }
      }
      
      if (frameCountRef.current % 30 === 0) {
        const particles = particlesRef.current;
        
        // Basic particle counts
        const positiveParticles = particles.filter(p => p.charge === 'positive').length;
        const negativeParticles = particles.filter(p => p.charge === 'negative').length;
        const neutralParticles = particles.filter(p => p.charge === 'neutral').length;
        const highEnergyParticles = particles.filter(p => p.type === 'high-energy').length;
        const quantumParticles = particles.filter(p => p.type === 'quantum').length;
        const compositeParticles = particles.filter(p => p.type === 'composite').length;
        const adaptiveParticles = particles.filter(p => p.type === 'adaptive').length;
        
        // Knowledge and complexity
        const totalKnowledge = particles.reduce((sum, p) => sum + p.knowledge, 0);
        const averageKnowledge = particles.length > 0 ? totalKnowledge / particles.length : 0;
        
        const maxComplexity = particles.length > 0 
          ? particles.reduce((max, p) => Math.max(max, p.complexity), 1) 
          : 1;
        
        // Variety factor calculation
        const varietyFactor = (positiveParticles * negativeParticles * neutralParticles * 
                             (highEnergyParticles + 1) * (quantumParticles + 1) *
                             (compositeParticles + 1) * (adaptiveParticles + 1)) / 
                             Math.max(1, particles.length ** 2);
        
        // Complexity index calculation
        const complexityIndex = (totalKnowledge * varietyFactor) + 
                               (interactionsRef.current / 1000) + 
                               (compositeParticles * maxComplexity) +
                               (adaptiveParticles * 2);
        
        // Enhanced cluster analysis with new metrics
        const clusterAnalysis = analyzeParticleClusters(particles);
        
        // Enhanced entropy calculation with new metrics
        const entropyAnalysis = calculateSystemEntropy(particles, intentFieldRef.current);
        
        // Field analysis
        const fieldAnalysis = analyzeIntentField(intentFieldRef.current);
        
        // Current state for anomaly detection (enhanced)
        const currentState = {
          entropy: entropyAnalysis.systemEntropy,
          clusterCount: clusterAnalysis.clusterCount,
          adaptiveCount: adaptiveParticles,
          compositeCount: compositeParticles,
          orderParameter: entropyAnalysis.fieldOrderParameter,
          informationDensity: clusterAnalysis.informationDensity,
          kolmogorovComplexity: clusterAnalysis.kolmogorovComplexity
        };
        
        if (simulationTimeRef.current > 100) {
          // Detect anomalies with enhanced criteria
          const anomalies = detectAnomalies(
            particles,
            previousStateRef.current,
            currentState,
            simulationTimeRef.current
          );
          
          anomalies.forEach(anomaly => {
            if (anomaly.severity > 0.6 && onAnomalyDetected) {
              onAnomalyDetected(anomaly);
              
              toast({
                title: `Anomaly Detected: ${anomaly.type.replace('_', ' ')}`,
                description: anomaly.description,
                variant: "default",
              });
            }
          });
        }
        
        // Update previous state with enhanced metrics
        previousStateRef.current = currentState;
        
        // Update stats with enhanced metrics
        onStatsUpdate({
          positiveParticles,
          negativeParticles,
          neutralParticles,
          highEnergyParticles,
          quantumParticles,
          compositeParticles,
          adaptiveParticles,
          totalInteractions: interactionsRef.current,
          complexityIndex,
          averageKnowledge,
          maxComplexity,
          clusterCount: clusterAnalysis.clusterCount,
          averageClusterSize: clusterAnalysis.averageClusterSize,
          systemEntropy: entropyAnalysis.systemEntropy,
          intentFieldComplexity: fieldAnalysis.patternComplexity,
          // New enhanced metrics
          shannonEntropy: entropyAnalysis.shannonEntropy,
          spatialEntropy: entropyAnalysis.spatialEntropy,
          fieldOrderParameter: entropyAnalysis.fieldOrderParameter,
          clusterLifetime: clusterAnalysis.clusterLifetime,
          clusterEntropyDelta: clusterAnalysis.clusterEntropyDelta,
          informationDensity: clusterAnalysis.informationDensity,
          kolmogorovComplexity: clusterAnalysis.kolmogorovComplexity
        });
        
        if (dataCollectionActiveRef.current && shouldCollectData(frameCountRef.current)) {
          // Record enhanced data points
          recordDataPoint(
            simulationTimeRef.current,
            particles,
            intentFieldRef.current,
            interactionsRef.current,
            clusterAnalysis,
            entropyAnalysis.systemEntropy,
            complexityIndex,
            {
              shannonEntropy: entropyAnalysis.shannonEntropy,
              spatialEntropy: entropyAnalysis.spatialEntropy,
              fieldOrderParameter: entropyAnalysis.fieldOrderParameter,
              temporalEntropy: entropyAnalysis.temporalEntropy,
              informationDensity: clusterAnalysis.informationDensity,
              kolmogorovComplexity: clusterAnalysis.kolmogorovComplexity
            }
          );
        }
      }
      
      if (dataExportOptions.autoExport && frameCountRef.current % 3000 === 0) {
        if (dataExportOptions.format === 'csv') {
          exportDataToCSV();
        } else {
          exportDataToJSON();
        }
      }
      
      animationRef.current = window.requestAnimationFrame(animate);
    };
    
    animationRef.current = window.requestAnimationFrame(animate);
  }, [running, updateParticles, renderMode, onStatsUpdate, onAnomalyDetected, viewMode, toast, dataExportOptions]);

  useEffect(() => {
    if (running && isInitialized) {
      if (!isAnimatingRef.current) {
        startAnimation();
      }
      
      const animationCheckInterval = setInterval(() => {
        if (running && !isAnimatingRef.current) {
          startAnimation();
        }
      }, 1000);
      
      return () => {
        clearInterval(animationCheckInterval);
        cancelAnimationFrame(animationRef.current);
        isAnimatingRef.current = false;
      };
    } else if (!running) {
      cancelAnimationFrame(animationRef.current);
      isAnimatingRef.current = false;
    }
  }, [running, isInitialized, startAnimation]);

  const handleExportData = useCallback(() => {
    if (dataExportOptions.format === 'csv') {
      exportDataToCSV();
    } else {
      exportDataToJSON();
    }
    
    toast({
      title: "Data Exported",
      description: `Simulation data exported in ${dataExportOptions.format.toUpperCase()} format.`,
      variant: "default",
    });
  }, [dataExportOptions.format, toast]);

  const toggleDataCollection = useCallback(() => {
    dataCollectionActiveRef.current = !dataCollectionActiveRef.current;
    
    toast({
      title: dataCollectionActiveRef.current ? "Data Collection Enabled" : "Data Collection Paused",
      description: dataCollectionActiveRef.current 
        ? "Simulation data points are now being recorded." 
        : "Data collection has been paused.",
      variant: "default",
    });
  }, [toast]);

  const clearData = useCallback(() => {
    clearSimulationData();
    
    toast({
      title: "Data Cleared",
      description: "All collected simulation data has been cleared.",
      variant: "default",
    });
  }, [toast]);

  const resetSimulation = useCallback(() => {
    clearPersistedState();
    clearSimulationData();
    particlesRef.current = [];
    interactionsRef.current = 0;
    frameCountRef.current = 0;
    simulationTimeRef.current = 0;
    
    if (canvasRef.current) {
      const { width, height } = canvasRef.current.getBoundingClientRect();
      const fieldResolution = 10;
      const fieldWidth = Math.ceil(width / fieldResolution);
      const fieldHeight = Math.ceil(height / fieldResolution);
      const fieldDepth = 10;
      
      const newField: number[][][] = [];
      
      for (let z = 0; z < fieldDepth; z++) {
        const plane: number[][] = [];
        for (let y = 0; y < fieldHeight; y++) {
          const row: number[] = [];
          for (let x = 0; x < fieldWidth; x++) {
            row.push(Math.random() * 2 - 1);
          }
          plane.push(row);
        }
        newField.push(plane);
      }
      
      intentFieldRef.current = newField;
    }
    
    toast({
      title: "Simulation Reset",
      description: "The simulation has been completely reset.",
      variant: "default",
    });
  }, [toast]);

  return (
    <div className="relative w-full h-full">
      <canvas 
        ref={canvasRef} 
        className="w-full h-full bg-black/90"
      />
      
      <div className="absolute bottom-4 right-4 flex flex-col gap-2 opacity-70 hover:opacity-100 transition-opacity">
        <button 
          onClick={handleExportData}
          className="bg-indigo-600 text-white px-3 py-1 rounded text-xs"
          title="Export collected data"
        >
          Export Data
        </button>
        <button 
          onClick={toggleDataCollection}
          className={`${dataCollectionActiveRef.current ? 'bg-green-600' : 'bg-red-600'} text-white px-3 py-1 rounded text-xs`}
          title={dataCollectionActiveRef.current ? "Pause data collection" : "Resume data collection"}
        >
          {dataCollectionActiveRef.current ? "Collecting" : "Paused"}
        </button>
        <button 
          onClick={clearData}
          className="bg-gray-600 text-white px-3 py-1 rounded text-xs"
          title="Clear all collected data"
        >
          Clear Data
        </button>
        <button 
          onClick={resetSimulation}
          className="bg-red-600 text-white px-3 py-1 rounded text-xs"
          title="Reset the entire simulation"
        >
          Reset
        </button>
      </div>
    </div>
  );
};
