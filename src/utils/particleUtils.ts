
// This file is now just re-exporting functions from the new modular structure
export * from './particles';

// Legacy direct exports for backward compatibility
import { Particle } from '@/types/simulation';
import { createParticleFromField as createParticleFromFieldImpl } from './particles/createParticleFromField';
import { updateParticlePosition as updateParticlePositionImpl } from './particles/particleMovement';
import { calculateParticleInteraction as calculateParticleInteractionImpl } from './particles/particleInteraction';

// Re-export with explicit naming for backward compatibility
export const createParticleFromField = createParticleFromFieldImpl;
export const updateParticlePosition = updateParticlePositionImpl;
export const calculateParticleInteraction = calculateParticleInteractionImpl;
