
import { useState, useCallback, useEffect } from 'react';

export type AudioEventType = 
  | 'particle_creation' 
  | 'particle_interaction' 
  | 'cluster_formation' 
  | 'intent_fluctuation' 
  | 'inflation_event'
  | 'anomaly_detected'
  | 'robot_evolution';

/**
 * Options for triggering audio events
 */
export interface AudioEventOptions {
  intensity?: number;
  count?: number;
  frequency?: number;
  duration?: number;
}

/**
 * Hook for handling audio events in the simulation
 */
export function useAudioEvents() {
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [volume, setVolumeState] = useState(0.7);
  
  /**
   * Toggle audio on/off
   */
  const toggleAudio = useCallback(() => {
    setIsAudioEnabled(prev => !prev);
    return !isAudioEnabled;
  }, [isAudioEnabled]);
  
  /**
   * Set the volume for all audio events
   */
  const setVolume = useCallback((newVolume: number) => {
    const clampedVolume = Math.min(Math.max(newVolume, 0), 1);
    setVolumeState(clampedVolume);
    return clampedVolume;
  }, []);

  /**
   * Play a sound for a specific event
   */
  const playEventSound = useCallback((eventType: string, intensity: number = 0.5) => {
    if (!isAudioEnabled) return;
    
    try {
      // Simple implementation - in a real app, this would use the Web Audio API
      const audioMap: Record<string, string> = {
        'particle_creation': '/audio/particle_creation.mp3',
        'particle_interaction': '/audio/particle_interaction.mp3',
        'cluster_formation': '/audio/cluster_formation.mp3',
        'intent_fluctuation': '/audio/intent_fluctuation.mp3',
        'inflation_event': '/audio/inflation_event.mp3',
        'anomaly_detected': '/audio/anomaly_detected.mp3',
        'robot_evolution': '/audio/robot_evolution.mp3'
      };
      
      if (audioMap[eventType]) {
        const audio = new Audio(audioMap[eventType]);
        audio.volume = volume * intensity;
        audio.play().catch(e => console.error("Error playing audio:", e));
      }
    } catch (error) {
      console.error("Error playing event sound:", error);
    }
  }, [isAudioEnabled, volume]);

  /**
   * Trigger an audio event with options
   */
  const triggerAudioEvent = useCallback((eventType: AudioEventType, options: AudioEventOptions = {}) => {
    if (!isAudioEnabled) return;
    
    const { intensity = 0.5, count = 1 } = options;
    
    playEventSound(eventType, intensity);
    
    // For multiple sounds (like particle bursts)
    if (count > 1) {
      for (let i = 1; i < count; i++) {
        setTimeout(() => {
          playEventSound(eventType, intensity * (1 - i/count)); // Fade out as we go
        }, i * 50);
      }
    }
  }, [isAudioEnabled, playEventSound]);

  return {
    isAudioEnabled,
    volume,
    playEventSound,
    triggerAudioEvent,
    toggleAudio,
    setVolume
  };
}

export default useAudioEvents;
