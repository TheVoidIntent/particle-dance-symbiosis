
import React, { useRef, useEffect, useState } from 'react';
import { Particle } from '@/types/simulation';
import { useAnimationLoop } from '@/hooks/useAnimationLoop';
import { useCanvasRenderer } from '@/hooks/useCanvasRenderer';
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
  className = ""
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvasWidth, setCanvasWidth] = useState(width);
  const [canvasHeight, setCanvasHeight] = useState(height);
  const [devicePixelRatio, setDevicePixelRatio] = useState(1);
  
  // Container ref to measure available space
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Setup animation loop
  const { startAnimation, stopAnimation, isAnimating } = useAnimationLoop();
  
  // Get rendering functions
  const { renderParticles, renderGrid, renderIntentFields } = useCanvasRenderer(canvasRef);
  
  // Adjust canvas size based on container and device pixel ratio
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
  
  // Set canvas dimensions with device pixel ratio for sharp rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Set display size
    canvas.style.width = `${canvasWidth}px`;
    canvas.style.height = `${canvasHeight}px`;
    
    // Set actual pixel size scaled by device pixel ratio
    canvas.width = Math.floor(canvasWidth * devicePixelRatio);
    canvas.height = Math.floor(canvasHeight * devicePixelRatio);
    
    // Adjust rendering context for DPR
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(devicePixelRatio, devicePixelRatio);
    }
  }, [canvasWidth, canvasHeight, devicePixelRatio]);
  
  // Handle rendering of particles and background
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    
    // Draw grid if enabled
    if (showGrid) {
      renderGrid(ctx, canvasWidth, canvasHeight, simulationOptions.gridSpacing);
    }
    
    // Draw intent fields if enabled
    if (showFields) {
      renderIntentFields(ctx, canvasWidth, canvasHeight, Number(fieldOpacity));
    }
    
    // Draw particles
    renderParticles(ctx, particles, { showChargeColors });
    
  }, [particles, showGrid, showFields, showChargeColors, fieldOpacity, canvasWidth, canvasHeight, renderGrid, renderIntentFields, renderParticles]);
  
  // Start/stop animation based on isRunning prop
  useEffect(() => {
    if (isRunning) {
      startAnimation();
    } else {
      stopAnimation();
    }
    // Cleanup on unmount
    return () => stopAnimation();
  }, [isRunning, startAnimation, stopAnimation]);
  
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
