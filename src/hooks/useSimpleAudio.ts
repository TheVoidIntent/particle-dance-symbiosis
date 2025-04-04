
import { useState, useEffect, useCallback, useRef } from 'react';
import {
  initAudio,
  setVolume,
  setAudioEnabled,
  playParticleCreationSound,
  playInteractionSound,
  playFluctuationSound,
  playEmergenceSound,
  cleanupAudio
} from '@/utils/audio/simpleSoundGenerator';

export function useSimpleAudio(initialEnabled = true, initialVolume = 0.5) {
  const [isEnabled, setIsEnabled] = useState(initialEnabled);
  const [volume, setVolumeState] = useState(initialVolume);
  const lastSoundTimestamps = useRef({
    creation: 0,
    interaction: 0,
    fluctuation: 0,
    emergence: 0
  });
  
  // Cooldown times in milliseconds for different sound types
  const soundCooldowns = {
    creation: 300,
    interaction: 400, 
    fluctuation: 2000,
    emergence: 8000
  };

  // Initialize audio on mount
  useEffect(() => {
    initAudio();
    setAudioEnabled(isEnabled);
    setVolume(volume);
    
    return () => {
      cleanupAudio();
    };
  }, []);

  // Toggle audio
  const toggleAudio = useCallback(() => {
    const newState = !isEnabled;
    setIsEnabled(newState);
    setAudioEnabled(newState);
    return newState;
  }, [isEnabled]);

  // Update volume
  const updateVolume = useCallback((newVolume: number) => {
    const clampedVolume = Math.min(Math.max(newVolume, 0), 1);
    setVolumeState(clampedVolume);
    setVolume(clampedVolume);
    return clampedVolume;
  }, []);

  // Play sounds with cooldown protection
  const playSound = useCallback((type: 'creation' | 'interaction' | 'fluctuation' | 'emergence', data?: any) => {
    if (!isEnabled) return false;
    
    const now = Date.now();
    const lastPlayed = lastSoundTimestamps.current[type];
    const cooldown = soundCooldowns[type];
    
    // Check cooldown to prevent sound spamming
    if (now - lastPlayed < cooldown) return false;
    
    lastSoundTimestamps.current[type] = now;
    
    switch (type) {
      case 'creation': {
        const chargeType = data?.charge || 'neutral';
        playParticleCreationSound(chargeType);
        break;
      }
      case 'interaction': {
        const particle1Charge = data?.particle1?.charge || 'neutral';
        const particle2Charge = data?.particle2?.charge || 'neutral';
        playInteractionSound(particle1Charge, particle2Charge);
        break;
      }
      case 'fluctuation': {
        const intensity = data?.intensity || 0.5;
        playFluctuationSound(intensity);
        break;
      }
      case 'emergence': {
        const complexity = data?.complexity || 0.5;
        playEmergenceSound(complexity);
        break;
      }
    }
    
    return true;
  }, [isEnabled]);

  // For complex cosmic events, play a sequence of sounds
  const playCelestialEvent = useCallback((
    type: 'cluster_formation' | 'inflation' | 'knowledge_threshold', 
    data?: any
  ) => {
    if (!isEnabled) return;
    
    switch (type) {
      case 'cluster_formation': {
        // Play a sequence of emergence and creation sounds
        const complexity = data?.complexity || 0.7;
        setTimeout(() => playSound('emergence', { complexity }), 0);
        
        // Add particle creation sounds with delays
        for (let i = 0; i < 3; i++) {
          setTimeout(() => {
            playSound('creation', { charge: i === 0 ? 'positive' : i === 1 ? 'negative' : 'neutral' });
          }, 400 + (i * 300));
        }
        break;
      }
      case 'inflation': {
        // For inflation events, play fluctuation followed by multiple emergence sounds
        const intensity = data?.intensity || 0.9;
        setTimeout(() => playSound('fluctuation', { intensity }), 0);
        setTimeout(() => playSound('emergence', { complexity: 0.9 }), 500);
        setTimeout(() => playSound('emergence', { complexity: 0.7 }), 1200);
        break;
      }
      case 'knowledge_threshold': {
        // When knowledge reaches threshold, play special sequence
        const level = data?.level || 0.8;
        
        // Play increasing complexity emergence sounds
        for (let i = 0; i < 3; i++) {
          setTimeout(() => {
            playSound('emergence', { complexity: 0.5 + (i * 0.2) });
          }, i * 600);
        }
        break;
      }
    }
  }, [isEnabled, playSound]);

  return {
    isEnabled,
    volume,
    toggleAudio,
    updateVolume,
    playSound,
    playCelestialEvent
  };
}
