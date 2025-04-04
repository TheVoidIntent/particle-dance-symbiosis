
import React, { useRef, useEffect } from 'react';
import { Particle } from '@/types/simulation';

type ParticleDisplayProps = {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  particleCount: number;
  showInflationBanner: boolean;
  latestInflation: any | null;
  onCanvasReady: (canvas: HTMLCanvasElement) => void;
};

export const ParticleDisplay: React.FC<ParticleDisplayProps> = ({
  canvasRef,
  particleCount,
  showInflationBanner,
  latestInflation,
  onCanvasReady
}) => {
  // Initialize canvas and handle resize
  useEffect(() => {
    if (!canvasRef.current) return;
    
    onCanvasReady(canvasRef.current);
    
    const handleResize = () => {
      if (!canvasRef.current) return;
      const canvas = canvasRef.current;
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = width;
      canvas.height = height;
    };
    
    window.addEventListener('resize', handleResize);
    handleResize(); // Call once to initialize
    
    return () => window.removeEventListener('resize', handleResize);
  }, [canvasRef, onCanvasReady]);

  return (
    <div className="relative w-full h-full">
      <canvas 
        ref={canvasRef} 
        className="w-full h-full bg-black/90"
      />
      
      {/* Particle Count Display */}
      <div className="absolute top-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
        Particles: {particleCount}
      </div>
      
      {/* Inflation Banner */}
      {showInflationBanner && (
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold py-2 text-center animate-pulse z-10">
          🌌 Universe Inflation Event Detected! 🌌
        </div>
      )}
    </div>
  );
};
