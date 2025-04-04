
import { useCallback } from 'react';
import { Particle } from '@/types/simulation';
import { renderParticles, renderIntentField, renderParticleDensity, renderCombined } from '@/utils/renderUtils';

type RenderMode = 'particles' | 'field' | 'density' | 'combined';

export function useCanvasRenderer() {
  const renderSimulation = useCallback((
    ctx: CanvasRenderingContext2D | null,
    particles: Particle[],
    intentField: number[][][],
    dimensions: { width: number; height: number },
    renderMode: RenderMode,
    viewMode: '2d' | '3d'
  ) => {
    if (!ctx) return;
    
    // Clear and prepare canvas
    ctx.clearRect(0, 0, dimensions.width, dimensions.height);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
    ctx.fillRect(0, 0, dimensions.width, dimensions.height);
    
    // Render based on mode
    if (renderMode === 'combined') {
      // Use the combined rendering function for the best visual effect
      renderCombined(ctx, particles, intentField, dimensions, viewMode);
      return;
    }
    
    if (renderMode === 'particles') {
      renderParticles(ctx, particles, dimensions, viewMode, true);
    }
    
    if (renderMode === 'field') {
      renderIntentField(ctx, intentField, dimensions, 5, 0.3);
    }
    
    if (renderMode === 'density') {
      renderParticleDensity(ctx, particles, dimensions, 15, 0.4);
    }
  }, []);

  return { renderSimulation };
}
