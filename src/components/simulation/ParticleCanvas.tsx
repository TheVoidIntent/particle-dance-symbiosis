
import React, { useEffect, useRef } from 'react';
import { Particle } from '@/types/simulation';

export interface ParticleCanvasProps {
  particles: Particle[];
  intentField?: number[][][];
  showIntentField?: boolean;
  className?: string;
  width?: number;
  height?: number;
  backgroundColor?: string;
}

const ParticleCanvas: React.FC<ParticleCanvasProps> = ({
  particles,
  intentField,
  showIntentField = false,
  className = '',
  width = 500,
  height = 300,
  backgroundColor = 'transparent'
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw background if specified
    if (backgroundColor !== 'transparent') {
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    
    // Draw intent field if enabled
    if (showIntentField && intentField && intentField.length > 0) {
      const fieldLayer = intentField[0]; // Use first layer of 3D field
      const cellWidth = canvas.width / fieldLayer[0].length;
      const cellHeight = canvas.height / fieldLayer.length;
      
      for (let y = 0; y < fieldLayer.length; y++) {
        for (let x = 0; x < fieldLayer[y].length; x++) {
          const intensity = fieldLayer[y][x];
          // Only draw cells with significant intent values
          if (Math.abs(intensity) > 0.05) {
            const alpha = Math.min(0.3, Math.abs(intensity) * 0.5);
            ctx.fillStyle = intensity > 0 
              ? `rgba(77, 206, 196, ${alpha})` // Positive intent (teal)
              : `rgba(255, 107, 107, ${alpha})`; // Negative intent (red)
            
            ctx.fillRect(
              x * cellWidth, 
              y * cellHeight, 
              cellWidth, 
              cellHeight
            );
          }
        }
      }
    }
    
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
    
  }, [particles, intentField, showIntentField, backgroundColor]);
  
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
