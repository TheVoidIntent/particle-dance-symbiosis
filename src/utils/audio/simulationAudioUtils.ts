
import { Particle } from '@/types/simulation';
import { playAudio, playAudioWithErrorHandling } from './audioPlaybackUtils';

// Track if simulation audio is currently playing
let simulationAudioPlaying = false;
let simulationAudioVolume = 0.5;
let simulationAudioStreamId: number | null = null;

/**
 * Play a sound based on simulation events
 */
export const playSimulationAudio = (eventType: string): Promise<void> => {
  const audioMap: Record<string, string> = {
    'particle_creation': '/audio/intentsim/particle_birth.mp3',
    'particle_destruction': '/audio/intentsim/particle_death.mp3',
    'interaction': '/audio/intentsim/interaction.mp3',
    'high_energy_interaction': '/audio/intentsim/high_energy.mp3',
    'field_fluctuation': '/audio/intentsim/field_fluctuation.mp3',
    'inflation': '/audio/intentsim/inflation_event.mp3',
    'anomaly': '/audio/intentsim/anomaly_detected.mp3'
  };
  
  const audioPath = audioMap[eventType] || audioMap['interaction'];
  return playAudio(audioPath);
};

/**
 * Play a specific event with particle details
 */
export const playSimulationEvent = (
  eventType: string, 
  particles: Particle[] = [], 
  intensity: number = 0.5
): Promise<void> => {
  // Apply volume adjustment based on intensity
  const volume = Math.min(1, Math.max(0.1, intensity));
  
  // In a real implementation, this would modulate the audio based on particle properties
  // For now we'll just use the basic playSimulationAudio function
  return playSimulationAudio(eventType);
};

/**
 * Generate an audio soundscape based on the current simulation state
 */
export const generateParticleSoundscape = (
  particles: Particle[], 
  intentFieldValue: number
): void => {
  // This would generate ambient sounds based on the current state
  // Implementation would depend on a more sophisticated audio synthesis system
  console.log('Generated soundscape for', particles.length, 'particles');
};

/**
 * Start continuous audio based on simulation state
 */
export const startSimulationAudioStream = (
  getParticles: () => Particle[],
  getIntentField: () => number[][][]
): void => {
  if (simulationAudioStreamId !== null) {
    stopSimulationAudioStream();
  }
  
  simulationAudioPlaying = true;
  
  // Start a periodic callback to update the audio
  simulationAudioStreamId = window.setInterval(() => {
    if (!simulationAudioPlaying) return;
    
    const particles = getParticles();
    const intentField = getIntentField();
    
    // For now, just create occasional sounds based on particle count
    if (particles.length > 0 && Math.random() < 0.1) {
      const randomIndex = Math.floor(Math.random() * particles.length);
      const particle = particles[randomIndex];
      
      const eventType = particle.charge === 'positive' ? 'particle_creation' :
                        particle.charge === 'negative' ? 'particle_destruction' : 'interaction';
      
      playSimulationEvent(eventType, [particle], 0.2);
    }
  }, 2000);
};

/**
 * Stop the continuous audio stream
 */
export const stopSimulationAudioStream = (): void => {
  simulationAudioPlaying = false;
  
  if (simulationAudioStreamId !== null) {
    window.clearInterval(simulationAudioStreamId);
    simulationAudioStreamId = null;
  }
};

/**
 * Check if simulation audio is currently playing
 */
export const isSimulationAudioPlaying = (): boolean => {
  return simulationAudioPlaying;
};

/**
 * Set the volume for simulation audio
 */
export const setSimulationAudioVolume = (volume: number): void => {
  simulationAudioVolume = Math.max(0, Math.min(1, volume));
};
