
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
  const animationFrameRef = useRef<number | null>(null);
  
  // Container ref to measure available space
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Animation control
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
  
  // Rendering functions
  const renderParticles = (ctx: CanvasRenderingContext2D, particles: Particle[], options: { showChargeColors: boolean }) => {
    particles.forEach(particle => {
      const radius = particle.radius || 3;
      
      // Determine color based on charge
      let color = particle.color || '#FFFFFF';
      if (options.showChargeColors) {
        if (particle.charge === 'positive') {
          color = '#FF5555'; // Red for positive
        } else if (particle.charge === 'negative') {
          color = '#5555FF'; // Blue for negative
        } else {
          color = '#55FF55'; // Green for neutral
        }
      }
      
      // Draw particle
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      
      // Draw information indicator if knowledge is high
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
    
    // Draw vertical lines
    for (let x = 0; x <= width; x += spacing) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    
    // Draw horizontal lines
    for (let y = 0; y <= height; y += spacing) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  };
  
  const renderIntentFields = (ctx: CanvasRenderingContext2D, width: number, height: number, opacity: number) => {
    // This is a placeholder - in a real implementation, you'd get the intent field data
    // and render it based on field strength
    const cellSize = 40;
    const rows = Math.ceil(height / cellSize);
    const cols = Math.ceil(width / cellSize);
    
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        // Generate a sample value based on position (for visualization)
        const value = Math.sin(x * 0.2) * Math.cos(y * 0.2);
        
        if (Math.abs(value) > 0.1) {
          const alpha = Math.min(0.3, Math.abs(value)) * opacity;
          ctx.fillStyle = value > 0 
            ? `rgba(100, 200, 255, ${alpha})` // Positive intent
            : `rgba(255, 100, 100, ${alpha})`; // Negative intent
          
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
  
  // Render frame function
  const renderFrame = () => {
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
      renderIntentFields(ctx, canvasWidth, canvasHeight, fieldOpacity);
    }
    
    // Draw particles
    renderParticles(ctx, particles, { showChargeColors });
    
    // Continue animation if running
    if (isRunning) {
      animationFrameRef.current = requestAnimationFrame(renderFrame);
    }
  };
  
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
  
  // Start/stop animation based on isRunning prop
  useEffect(() => {
    if (isRunning) {
      startAnimation();
    } else {
      stopAnimation();
    }
    // Cleanup on unmount
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
