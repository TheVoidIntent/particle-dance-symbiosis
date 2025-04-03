
import { useCallback, useEffect, useRef } from 'react';
import { 
  playSimulationEventSound, 
  isSimulationAudioPlaying, 
  startSimulationAudioStream,
  stopSimulationAudioStream, 
  setSimulationAudioVolume
} from '@/utils/audio/simulationAudioUtils';

interface UseAudioEventsProps {
  enabled?: boolean;
  initialVolume?: number;
  onError?: (error: any) => void;
}

export function useAudioEvents({
  enabled = true,
  initialVolume = 0.5,
  onError = () => {}
}: UseAudioEventsProps = {}) {
  const audioEnabledRef = useRef(enabled);
  const volumeRef = useRef(initialVolume);
  
  // Initialize audio on component mount
  useEffect(() => {
    if (enabled) {
      try {
        startSimulationAudioStream();
        setSimulationAudioVolume(initialVolume);
      } catch (error) {
        console.error('Failed to initialize audio:', error);
        onError(error);
      }
    }
    
    // Cleanup on component unmount
    return () => {
      if (audioEnabledRef.current) {
        stopSimulationAudioStream();
      }
    };
  }, [enabled, initialVolume, onError]);
  
  // Function to play sound for simulation events
  const playEventSound = useCallback((eventType: string, intensity: number = 0.5) => {
    if (!audioEnabledRef.current) return;
    
    try {
      playSimulationEventSound(eventType, intensity);
    } catch (error) {
      console.error('Error playing event sound:', error);
      onError(error);
    }
  }, [onError]);
  
  // Function to toggle audio on/off
  const toggleAudio = useCallback(() => {
    try {
      if (isSimulationAudioPlaying()) {
        stopSimulationAudioStream();
        audioEnabledRef.current = false;
      } else {
        startSimulationAudioStream();
        setSimulationAudioVolume(volumeRef.current);
        audioEnabledRef.current = true;
      }
    } catch (error) {
      console.error('Error toggling audio:', error);
      onError(error);
    }
    
    return audioEnabledRef.current;
  }, [onError]);
  
  // Function to set audio volume
  const setVolume = useCallback((volume: number) => {
    try {
      const normalizedVolume = Math.max(0, Math.min(1, volume));
      setSimulationAudioVolume(normalizedVolume);
      volumeRef.current = normalizedVolume;
    } catch (error) {
      console.error('Error setting audio volume:', error);
      onError(error);
    }
    
    return volumeRef.current;
  }, [onError]);
  
  return {
    isAudioEnabled: audioEnabledRef.current,
    volume: volumeRef.current,
    playEventSound,
    toggleAudio,
    setVolume
  };
}
