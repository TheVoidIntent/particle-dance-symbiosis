
import { initAudioContext, playSimulationEvent } from './audio/simulationAudioUtils';
import { checkAudioFileExists, getAudioFileMetadata } from './audio/audioFileUtils';

// Global settings
const AUDIO_ENABLED = true;
const VOLUME = 0.5;

// Initialize audio context once
let audioContextInitialized = false;
const initializeAudio = () => {
  if (!audioContextInitialized && AUDIO_ENABLED) {
    try {
      initAudioContext();
      audioContextInitialized = true;
      console.log("🔊 Audio context initialized");
    } catch (e) {
      console.error("Failed to initialize audio:", e);
    }
  }
};

// Initialize on page load
if (typeof window !== 'undefined') {
  window.addEventListener('load', initializeAudio);
  
  // Also try to initialize on first user interaction
  const initOnInteraction = () => {
    initializeAudio();
    document.removeEventListener('click', initOnInteraction);
    document.removeEventListener('keydown', initOnInteraction);
  };
  
  document.addEventListener('click', initOnInteraction);
  document.addEventListener('keydown', initOnInteraction);
}

// Play a tone for a particle
export const playParticleTone = (
  charge: 'positive' | 'negative' | 'neutral', 
  energy: number = 1
) => {
  if (!AUDIO_ENABLED) return;
  
  // Define the frequency based on charge
  let frequency = 440; // A note (neutral)
  
  if (charge === 'positive') {
    frequency = 523.25; // C note 
  } else if (charge === 'negative') {
    frequency = 349.23; // F note
  }
  
  // Scale by energy
  frequency *= 0.8 + (energy * 0.4);
  
  // Play the tone
  playSimulationEvent('particle_creation', { 
    frequency,
    intensity: energy
  });
};

// Play sound for particle interaction
export const playInteractionSound = (
  intensity: number = 0.5,
  type: 'positive' | 'negative' | 'neutral' = 'positive'
) => {
  if (!AUDIO_ENABLED) return;
  
  playSimulationEvent('particle_interaction', {
    intensity
  });
};

// Play audio for a simulation event
export const playEvent = (eventName: string, options: any = {}) => {
  if (!AUDIO_ENABLED) return;
  
  const validEvents = [
    'particle_creation',
    'particle_interaction',
    'cluster_formation',
    'robot_evolution',
    'intent_spike',
    'inflation'
  ];
  
  if (validEvents.includes(eventName)) {
    playSimulationEvent(eventName as any, options);
  } else {
    console.warn(`Unknown event name: ${eventName}`);
  }
};

// Enable or disable audio
export const setAudioEnabled = (enabled: boolean) => {
  // This is just a mock implementation
  console.log(`🔊 Setting audio enabled: ${enabled}`);
};

// Export functions from audioFileUtils
export { checkAudioFileExists, getAudioFileMetadata };

export default {
  initializeAudio,
  playParticleTone,
  playInteractionSound,
  playEvent,
  setAudioEnabled,
  checkAudioFileExists,
  getAudioFileMetadata
};
