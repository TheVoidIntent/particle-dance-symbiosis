
import React, { useEffect, useRef } from 'react';
import { Particle } from '@/types/simulation';

export interface ParticleCanvasProps {
  particles: Particle[];
  showIntentField?: boolean;
  className?: string;
  width?: number;
  height?: number;
}

const ParticleCanvas: React.FC<ParticleCanvasProps> = ({
  particles,
  showIntentField = false,
  className = '',
  width = 500,
  height = 300
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw particles
    particles.forEach(particle => {
      ctx.beginPath();
      ctx.arc(
        particle.x, 
        particle.y, 
        particle.radius || 3, 
        0, 
        Math.PI * 2
      );
      ctx.fillStyle = particle.color || '#FFFFFF';
      ctx.fill();
    });
    
  }, [particles, showIntentField]);
  
  return (
    <canvas 
      ref={canvasRef}
      width={width}
      height={height}
      className={className}
    />
  );
};

export default ParticleCanvas;
