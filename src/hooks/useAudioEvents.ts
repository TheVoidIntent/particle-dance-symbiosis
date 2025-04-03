
import { useCallback, useEffect, useRef } from 'react';
import { playSimulationEvent } from '@/utils/audio/simulationAudioUtils';

export type AudioEventType = 
  'particle_creation' | 
  'particle_interaction' | 
  'cluster_formation' | 
  'robot_evolution' | 
  'intent_spike' |
  'inflation';

export interface AudioEventOptions {
  intensity?: number;
  count?: number;
  frequency?: number;
}

export function useAudioEvents(enabled: boolean = true) {
  const isEnabledRef = useRef(enabled);
  
  useEffect(() => {
    isEnabledRef.current = enabled;
  }, [enabled]);
  
  const triggerAudioEvent = useCallback((
    eventType: AudioEventType,
    options: AudioEventOptions = {}
  ) => {
    if (!isEnabledRef.current) return;
    
    playSimulationEvent(eventType, options);
  }, []);
  
  return {
    triggerAudioEvent,
    isEnabled: isEnabledRef.current,
    setEnabled: (value: boolean) => {
      isEnabledRef.current = value;
    }
  };
}
