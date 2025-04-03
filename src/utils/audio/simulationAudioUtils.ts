
import { initAudioContext } from './audioPlaybackUtils';

let audioContext: AudioContext | null = null;
let simulationAudioPlaying = false;
let simulationAudioVolume = 0.5;

/**
 * Initialize audio context for simulation
 */
export function initAudioContext(): AudioContext {
  if (!audioContext) {
    try {
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      console.log('Simulation audio context initialized successfully');
    } catch (error) {
      console.error('Failed to initialize simulation audio context:', error);
      throw new Error('Simulation audio context initialization failed');
    }
  }
  return audioContext;
}

/**
 * Generate audio for particle interactions
 * @param intensity Intensity of the interaction (0-1)
 */
export function generateInteractionAudio(intensity: number = 0.5): void {
  if (!audioContext) {
    try {
      audioContext = initAudioContext();
    } catch (error) {
      console.error('Cannot generate interaction audio, context initialization failed');
      return;
    }
  }
  
  try {
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    
    // Set up oscillator
    oscillator.type = 'sine';
    oscillator.frequency.value = 440 + (intensity * 220); // Base frequency + variation
    
    // Set up gain
    gain.gain.value = 0;
    
    // Connect nodes
    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    
    // Start oscillator
    oscillator.start();
    
    // Ramp up gain
    gain.gain.setValueAtTime(0, audioContext.currentTime);
    gain.gain.linearRampToValueAtTime(0.05 * simulationAudioVolume * intensity, audioContext.currentTime + 0.01);
    
    // Ramp down gain and stop
    gain.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.1);
    setTimeout(() => {
      oscillator.stop();
      oscillator.disconnect();
      gain.disconnect();
    }, 150);
  } catch (error) {
    console.error('Error generating interaction audio:', error);
  }
}

/**
 * Generate audio for field fluctuations
 * @param strength Strength of the fluctuation (0-1)
 */
export function generateFieldFluctuationAudio(strength: number = 0.3): void {
  if (!audioContext) {
    try {
      audioContext = initAudioContext();
    } catch (error) {
      console.error('Cannot generate field fluctuation audio, context initialization failed');
      return;
    }
  }
  
  try {
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    const filter = audioContext.createBiquadFilter();
    
    // Set up oscillator
    oscillator.type = 'sawtooth';
    oscillator.frequency.value = 110 + (strength * 440);
    
    // Set up filter
    filter.type = 'lowpass';
    filter.frequency.value = 1000 + (strength * 2000);
    filter.Q.value = 10 * strength;
    
    // Set up gain
    gain.gain.value = 0;
    
    // Connect nodes
    oscillator.connect(filter);
    filter.connect(gain);
    gain.connect(audioContext.destination);
    
    // Start oscillator
    oscillator.start();
    
    // Ramp up gain
    gain.gain.setValueAtTime(0, audioContext.currentTime);
    gain.gain.linearRampToValueAtTime(0.03 * simulationAudioVolume * strength, audioContext.currentTime + 0.05);
    
    // Ramp down gain and stop
    gain.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.3);
    setTimeout(() => {
      oscillator.stop();
      oscillator.disconnect();
      filter.disconnect();
      gain.disconnect();
    }, 350);
  } catch (error) {
    console.error('Error generating field fluctuation audio:', error);
  }
}

/**
 * Play a sound for a simulation event
 * @param eventType Type of simulation event
 * @param intensity Intensity of the event (0-1)
 */
export function playSimulationEventSound(eventType: string, intensity: number = 0.5): void {
  if (!simulationAudioPlaying) return;
  
  switch (eventType) {
    case 'particle_creation':
      generateInteractionAudio(intensity * 0.3);
      break;
    case 'interaction':
      generateInteractionAudio(intensity);
      break;
    case 'field_fluctuation':
      generateFieldFluctuationAudio(intensity);
      break;
    case 'cluster_formation':
      generateClusterFormationSound(intensity);
      break;
    case 'robot_evolution':
      generateRobotEvolutionSound(intensity);
      break;
    default:
      console.log(`No sound defined for event type: ${eventType}`);
  }
}

/**
 * Play a simulation event with audio
 * @param event The event object
 */
export function playSimulationEvent(event: any): void {
  // Calculate intensity based on event properties
  let intensity = 0.5;
  if ('severity' in event) {
    intensity = event.severity;
  } else if ('intensity' in event) {
    intensity = event.intensity;
  } else if ('energy' in event) {
    intensity = Math.min(1, event.energy / 100);
  }
  
  playSimulationEventSound(event.type, intensity);
}

/**
 * Generate cluster formation sound
 * @param intensity Sound intensity (0-1)
 */
function generateClusterFormationSound(intensity: number): void {
  if (!audioContext) {
    try {
      audioContext = initAudioContext();
    } catch (error) {
      return;
    }
  }
  
  try {
    const oscillator1 = audioContext.createOscillator();
    const oscillator2 = audioContext.createOscillator();
    const gain = audioContext.createGain();
    
    // Set up oscillators
    oscillator1.type = 'triangle';
    oscillator1.frequency.value = 220 + (intensity * 110);
    
    oscillator2.type = 'sine';
    oscillator2.frequency.value = 330 + (intensity * 110);
    
    // Set up gain
    gain.gain.value = 0;
    
    // Connect nodes
    oscillator1.connect(gain);
    oscillator2.connect(gain);
    gain.connect(audioContext.destination);
    
    // Start oscillators
    oscillator1.start();
    oscillator2.start();
    
    // Ramp up gain
    gain.gain.setValueAtTime(0, audioContext.currentTime);
    gain.gain.linearRampToValueAtTime(0.1 * simulationAudioVolume * intensity, audioContext.currentTime + 0.1);
    
    // Ramp down gain and stop
    gain.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.5);
    setTimeout(() => {
      oscillator1.stop();
      oscillator2.stop();
      oscillator1.disconnect();
      oscillator2.disconnect();
      gain.disconnect();
    }, 600);
  } catch (error) {
    console.error('Error generating cluster formation sound:', error);
  }
}

/**
 * Generate robot evolution sound
 * @param intensity Sound intensity (0-1)
 */
function generateRobotEvolutionSound(intensity: number): void {
  if (!audioContext) {
    try {
      audioContext = initAudioContext();
    } catch (error) {
      return;
    }
  }
  
  try {
    const oscillator1 = audioContext.createOscillator();
    const oscillator2 = audioContext.createOscillator();
    const filter = audioContext.createBiquadFilter();
    const gain = audioContext.createGain();
    
    // Set up oscillators
    oscillator1.type = 'square';
    oscillator1.frequency.value = 330 + (intensity * 220);
    
    oscillator2.type = 'sawtooth';
    oscillator2.frequency.value = 440 + (intensity * 220);
    
    // Set up filter
    filter.type = 'bandpass';
    filter.frequency.value = 1000;
    filter.Q.value = 5;
    
    // Set up gain
    gain.gain.value = 0;
    
    // Connect nodes
    oscillator1.connect(filter);
    oscillator2.connect(filter);
    filter.connect(gain);
    gain.connect(audioContext.destination);
    
    // Start oscillators
    oscillator1.start();
    oscillator2.start();
    
    // Frequency sweep
    oscillator1.frequency.linearRampToValueAtTime(220, audioContext.currentTime + 0.8);
    oscillator2.frequency.linearRampToValueAtTime(880, audioContext.currentTime + 0.8);
    
    // Ramp up gain
    gain.gain.setValueAtTime(0, audioContext.currentTime);
    gain.gain.linearRampToValueAtTime(0.15 * simulationAudioVolume * intensity, audioContext.currentTime + 0.1);
    
    // Ramp down gain and stop
    gain.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.8);
    setTimeout(() => {
      oscillator1.stop();
      oscillator2.stop();
      oscillator1.disconnect();
      oscillator2.disconnect();
      filter.disconnect();
      gain.disconnect();
    }, 900);
  } catch (error) {
    console.error('Error generating robot evolution sound:', error);
  }
}

/**
 * Generate a full soundscape based on particles
 * @param particles The particles to sonify
 */
export function generateParticleSoundscape(particles: any[]): void {
  if (!simulationAudioPlaying || !particles.length) return;
  
  // Generate ambient sound based on particle count and types
  const positiveCount = particles.filter(p => p.charge === 'positive').length;
  const negativeCount = particles.filter(p => p.charge === 'negative').length;
  const neutralCount = particles.filter(p => p.charge === 'neutral').length;
  
  const positiveRatio = positiveCount / particles.length;
  const negativeRatio = negativeCount / particles.length;
  const neutralRatio = neutralCount / particles.length;
  
  generateFieldFluctuationAudio(Math.max(positiveRatio, negativeRatio, neutralRatio) * 0.3);
}

/**
 * Start the simulation audio stream
 */
export function startSimulationAudioStream(): void {
  simulationAudioPlaying = true;
  console.log('Simulation audio started');
}

/**
 * Stop the simulation audio stream
 */
export function stopSimulationAudioStream(): void {
  simulationAudioPlaying = false;
  console.log('Simulation audio stopped');
}

/**
 * Check if simulation audio is playing
 */
export function isSimulationAudioPlaying(): boolean {
  return simulationAudioPlaying;
}

/**
 * Set simulation audio volume
 * @param volume Volume level (0-1)
 */
export function setSimulationAudioVolume(volume: number): void {
  simulationAudioVolume = Math.max(0, Math.min(1, volume));
  console.log(`Simulation audio volume set to ${simulationAudioVolume}`);
}
