
import { useCallback } from 'react';
import { playSimulationEvent } from '@/utils/audio/simulationAudioUtils';

export type AudioEventType = 
  'particle_creation' | 
  'particle_interaction' | 
  'cluster_formation' | 
  'robot_evolution' | 
  'intent_spike' | 
  'inflation';

interface AudioEventOptions {
  intensity?: number;
  count?: number;
  frequency?: number;
}

export function useAudioEvents(enabled: boolean = true) {
  const triggerAudioEvent = useCallback((
    eventType: AudioEventType, 
    options: AudioEventOptions = {}
  ) => {
    if (!enabled) return;
    
    playSimulationEvent(eventType, options);
  }, [enabled]);
  
  return {
    triggerAudioEvent
  };
}

export default useAudioEvents;
