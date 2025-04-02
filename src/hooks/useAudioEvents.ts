
import { useState, useEffect, useCallback } from 'react';

// Define the valid event types for audio
export type AudioEventType = 
  | 'particle_creation' 
  | 'cluster_formation' 
  | 'robot_evolution' 
  | 'inflation_event'
  | 'anomaly_detected'
  | 'interaction'
  | 'field_fluctuation';

interface AudioEventOptions {
  intensity?: number;
  count?: number;
}

export function useAudioEvents() {
  const [audioEnabled, setAudioEnabled] = useState<boolean>(true);
  
  const triggerAudioEvent = useCallback((eventType: AudioEventType, options: AudioEventOptions = {}) => {
    if (!audioEnabled) return;
    
    // Log the event for debugging
    console.log(`Audio event triggered: ${eventType}`, options);
    
    // Dispatch a custom event that the audio system can listen for
    const event = new CustomEvent('audio-event', {
      detail: {
        type: eventType,
        ...options
      }
    });
    
    window.dispatchEvent(event);
  }, [audioEnabled]);
  
  const toggleAudio = useCallback(() => {
    setAudioEnabled(prev => !prev);
  }, []);
  
  return {
    audioEnabled,
    setAudioEnabled,
    triggerAudioEvent,
    toggleAudio
  };
}

export default useAudioEvents;
