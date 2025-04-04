
import { useState, useEffect, useCallback } from 'react';
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

  // Play sounds
  const playSound = useCallback((type: 'creation' | 'interaction' | 'fluctuation' | 'emergence', data?: any) => {
    if (!isEnabled) return;

    switch (type) {
      case 'creation':
        playParticleCreationSound(data?.charge || 'neutral');
        break;
      case 'interaction':
        playInteractionSound(
          data?.particle1?.charge || 'neutral',
          data?.particle2?.charge || 'neutral'
        );
        break;
      case 'fluctuation':
        playFluctuationSound(data?.intensity || 0.5);
        break;
      case 'emergence':
        playEmergenceSound(data?.complexity || 0.5);
        break;
    }
  }, [isEnabled]);

  return {
    isEnabled,
    volume,
    toggleAudio,
    updateVolume,
    playSound
  };
}
