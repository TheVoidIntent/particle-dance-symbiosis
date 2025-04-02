import React, { useRef, useEffect, useState } from 'react';
import { Particle } from '@/types/simulation';
import { simulationOptions } from '@/utils/simulation/config';

interface SimulationCanvasProps {
  particles: Particle[];
  width?: number;
  height?: number;
  isRunning: boolean;
  showGrid?: boolean;
  showFields?: boolean;
  showChargeColors?: boolean;
  fieldOpacity?: number;
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
}

const SimulationCanvas: React.FC<SimulationCanvasProps> = ({ 
  particles, 
  width = 800, 
  height = 600, 
  isRunning,
  showGrid = true,
  showFields = false,
  showChargeColors = true,
  fieldOpacity = 0.2,
  className = "",
  intentFluctuationRate,
  maxParticles,
  particleCreationRate,
  positiveChargeBehavior,
  negativeChargeBehavior,
  neutralChargeBehavior,
  probabilisticIntent,
  visualizationMode,
  running
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvasWidth, setCanvasWidth] = useState(width);
  const [canvasHeight, setCanvasHeight] = useState(height);
  const [devicePixelRatio, setDevicePixelRatio] = useState(1);
  const animationFrameRef = useRef<number | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);
  
  const startAnimation = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    animationFrameRef.current = requestAnimationFrame(renderFrame);
  };
  
  const stopAnimation = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  };
  
  const renderParticles = (ctx: CanvasRenderingContext2D, particles: Particle[], options: { showChargeColors: boolean }) => {
    particles.forEach(particle => {
      const radius = particle.radius || 3;
      
      let color = particle.color || '#FFFFFF';
      if (options.showChargeColors) {
        if (particle.charge === 'positive') {
          color = '#FF5555';
        } else if (particle.charge === 'negative') {
          color = '#5555FF';
        } else {
          color = '#55FF55';
        }
      }
      
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      
      if (particle.knowledge && particle.knowledge > 0.5) {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, radius * 1.5, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    });
  };
  
  const renderGrid = (ctx: CanvasRenderingContext2D, width: number, height: number, spacing: number) => {
    ctx.strokeStyle = 'rgba(100, 100, 100, 0.1)';
    ctx.lineWidth = 1;
    
    for (let x = 0; x <= width; x += spacing) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    
    for (let y = 0; y <= height; y += spacing) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  };
  
  const renderIntentFields = (ctx: CanvasRenderingContext2D, width: number, height: number, opacity: number) => {
    const cellSize = 40;
    const rows = Math.ceil(height / cellSize);
    const cols = Math.ceil(width / cellSize);
    
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const value = Math.sin(x * 0.2) * Math.cos(y * 0.2);
        
        if (Math.abs(value) > 0.1) {
          const alpha = Math.min(0.3, Math.abs(value)) * opacity;
          ctx.fillStyle = value > 0 
            ? `rgba(100, 200, 255, ${alpha})`
            : `rgba(255, 100, 100, ${alpha})`;
          
          ctx.fillRect(
            x * cellSize, 
            y * cellSize, 
            cellSize, 
            cellSize
          );
        }
      }
    }
  };
  
  const renderFrame = () => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    
    if (showGrid) {
      renderGrid(ctx, canvasWidth, canvasHeight, simulationOptions.gridSpacing);
    }
    
    if (showFields) {
      renderIntentFields(ctx, canvasWidth, canvasHeight, fieldOpacity);
    }
    
    renderParticles(ctx, particles, { showChargeColors });
    
    if (isRunning) {
      animationFrameRef.current = requestAnimationFrame(renderFrame);
    }
  };
  
  useEffect(() => {
    const updateCanvasSize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        const containerHeight = containerRef.current.clientHeight;
        setCanvasWidth(containerWidth);
        setCanvasHeight(containerHeight);
      }
      
      const dpr = window.devicePixelRatio || 1;
      setDevicePixelRatio(dpr);
    };
    
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, []);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    canvas.style.width = `${canvasWidth}px`;
    canvas.style.height = `${canvasHeight}px`;
    
    canvas.width = Math.floor(canvasWidth * devicePixelRatio);
    canvas.height = Math.floor(canvasHeight * devicePixelRatio);
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(devicePixelRatio, devicePixelRatio);
    }
  }, [canvasWidth, canvasHeight, devicePixelRatio]);
  
  useEffect(() => {
    if (isRunning) {
      startAnimation();
    } else {
      stopAnimation();
    }
    
    return () => stopAnimation();
  }, [isRunning, particles, showGrid, showFields, showChargeColors, fieldOpacity]);
  
  return (
    <div ref={containerRef} className={`w-full h-full relative overflow-hidden ${className}`}>
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0"
      />
    </div>
  );
};

export default SimulationCanvas;
