import { useState, useEffect, useCallback } from 'react';
import {
  initSimulationAudio,
  setSimulationVolume,
  stopSimulationAudio,
  isSimulationAudioPlaying,
  playInteractionSound,
  playIntentFluctuationSound,
  startParticleSoundscape,
  playParticleCreationSound,
  playEmergenceSound
} from '@/utils/audio/simulationAudioEvents';
import { Particle } from '@/types/simulation';

export type SimulationSoundEvent = 
  | 'particle_creation' 
  | 'particle_interaction' 
  | 'intent_fluctuation'
  | 'cluster_formation'
  | 'emergence'
  | 'inflation';

export interface SimulationAudioOptions {
  enabled?: boolean;
  initialVolume?: number;
  autoInitialize?: boolean;
}

/**
 * Hook for managing audio representation of the simulation
 */
export function useSimulationAudio(options: SimulationAudioOptions = {}) {
  const {
    enabled = true,
    initialVolume = 0.5,
    autoInitialize = true
  } = options;
  
  const [isEnabled, setIsEnabled] = useState<boolean>(enabled);
  const [volume, setVolume] = useState<number>(initialVolume);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  
  // Initialize audio system
  const initialize = useCallback(() => {
    if (!isInitialized) {
      initSimulationAudio();
      setSimulationVolume(volume);
      setIsInitialized(true);
    }
  }, [isInitialized, volume]);
  
  // Auto-initialize if requested
  useEffect(() => {
    if (autoInitialize && !isInitialized) {
      initialize();
    }
    
    // Cleanup on unmount
    return () => {
      if (isInitialized) {
        stopSimulationAudio();
      }
    };
  }, [autoInitialize, initialize, isInitialized]);
  
  // Toggle audio on/off
  const toggleAudio = useCallback(() => {
    const newState = !isEnabled;
    setIsEnabled(newState);
    
    if (!newState) {
      stopSimulationAudio();
    }
    
    return newState;
  }, [isEnabled]);
  
  // Update volume
  const updateVolume = useCallback((newVolume: number) => {
    const clampedVolume = Math.min(Math.max(newVolume, 0), 1);
    setVolume(clampedVolume);
    setSimulationVolume(clampedVolume);
    return clampedVolume;
  }, []);
  
  // Play a sound for a particle interaction
  const playSound = useCallback((event: SimulationSoundEvent, data?: any) => {
    if (!isEnabled || !isInitialized) return;
    
    try {
      switch (event) {
        case 'particle_interaction':
          if (data && data.particle1 && data.particle2) {
            playInteractionSound(data.particle1, data.particle2);
          }
          break;
        case 'particle_creation':
          playParticleCreationSound(
            data?.charge || 'neutral',
            data?.x || 0.5,
            data?.y || 0.5
          );
          break;
        case 'intent_fluctuation':
          playIntentFluctuationSound(
            data?.intensity || 0.5,
            data?.x || 0.5,
            data?.y || 0.5
          );
          break;
        case 'emergence':
          playEmergenceSound(data?.complexity || 0.5);
          break;
        default:
          // Other event types can be added here
          break;
      }
    } catch (error) {
      console.error("Error playing simulation sound:", error);
    }
  }, [isEnabled, isInitialized]);
  
  // Start the ambient soundscape for a collection of particles
  const startSoundscape = useCallback((particles: Particle[]) => {
    if (!isEnabled || !isInitialized) return;
    
    try {
      startParticleSoundscape(particles);
    } catch (error) {
      console.error("Error starting soundscape:", error);
    }
  }, [isEnabled, isInitialized]);
  
  // Stop all simulation audio
  const stopAudio = useCallback(() => {
    if (isInitialized) {
      stopSimulationAudio();
    }
  }, [isInitialized]);
  
  return {
    isEnabled,
    volume,
    isInitialized,
    initialize,
    toggleAudio,
    updateVolume,
    playSound,
    startSoundscape,
    stopAudio,
    isPlaying: isSimulationAudioPlaying()
  };
}

export default useSimulationAudio;
