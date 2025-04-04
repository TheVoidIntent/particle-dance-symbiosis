
import { Particle } from '@/types/simulation';
import { createAudioContext, generateTone, generateToneSequence } from './audioGenerationUtils';

// Store audio context and nodes
let audioContext: AudioContext | null = null;
let masterGainNode: GainNode | null = null;
let particleOscillators: Map<string, { oscillator: OscillatorNode, gain: GainNode }> = new Map();
let isPlaying = false;
let globalVolume = 0.2;

/**
 * Initialize the audio system for the simulation
 */
export function initSimulationAudio(): void {
  try {
    if (!audioContext) {
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      masterGainNode = audioContext.createGain();
      masterGainNode.gain.value = globalVolume;
      masterGainNode.connect(audioContext.destination);
      console.log("Simulation audio system initialized");
    }
  } catch (error) {
    console.error("Error initializing simulation audio:", error);
  }
}

/**
 * Set the master volume for all simulation sounds
 * @param volume Value between 0 and 1
 */
export function setSimulationVolume(volume: number): void {
  try {
    globalVolume = Math.min(Math.max(volume, 0), 1);
    if (masterGainNode && audioContext) {
      masterGainNode.gain.setValueAtTime(globalVolume, audioContext.currentTime);
    }
  } catch (error) {
    console.error("Error setting simulation volume:", error);
  }
}

/**
 * Stop the simulation audio system
 */
export function stopSimulationAudio(): void {
  try {
    // Stop all particle oscillators
    particleOscillators.forEach((nodes) => {
      try {
        nodes.oscillator.stop();
        nodes.oscillator.disconnect();
        nodes.gain.disconnect();
      } catch (e) {
        // Ignore errors when stopping
      }
    });
    particleOscillators.clear();
    isPlaying = false;
  } catch (error) {
    console.error("Error stopping simulation audio:", error);
  }
}

/**
 * Check if the simulation audio is playing
 */
export function isSimulationAudioPlaying(): boolean {
  return isPlaying;
}

/**
 * Convert particle charge to frequency
 * @param charge Particle charge
 */
function chargeToFrequency(charge: string): number {
  switch (charge) {
    case 'positive': return 440; // A4
    case 'negative': return 261.63; // C4
    case 'neutral': return 329.63; // E4
    default: return 349.23; // F4
  }
}

/**
 * Convert particle energy level to waveform type
 * @param energy Energy level (0-1)
 */
function energyToWaveform(energy: number = 0.5): OscillatorType {
  if (energy > 0.8) return 'sawtooth';
  if (energy > 0.5) return 'square';
  if (energy > 0.3) return 'triangle';
  return 'sine';
}

/**
 * Convert particle interactions to detune value
 * @param interactions Number of interactions
 */
function interactionsToDetune(interactions: number): number {
  // More interactions = more detune (more "complex" sound)
  return Math.min(interactions * 2, 50);
}

/**
 * Play a sound for a particle interaction
 * @param p1 First particle
 * @param p2 Second particle
 */
export function playInteractionSound(p1: Particle, p2: Particle): void {
  if (!audioContext || !masterGainNode || !isPlaying) return;

  try {
    // Create the interaction tone
    const baseFreq = (chargeToFrequency(p1.charge) + chargeToFrequency(p2.charge)) / 2;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    // Configure based on particles
    oscillator.type = 'sine';
    oscillator.frequency.value = baseFreq;
    
    // Louder for high knowledge particles
    const p1Knowledge = p1.knowledge || 0;
    const p2Knowledge = p2.knowledge || 0;
    const knowledgeLevel = Math.min((p1Knowledge + p2Knowledge) / 200, 1);
    
    // Brief interaction sound
    gainNode.gain.value = 0;
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.1 * globalVolume, audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.3);
    
    // Connect and play
    oscillator.connect(gainNode);
    gainNode.connect(masterGainNode);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.4);
    
    // Clean up
    setTimeout(() => {
      try {
        oscillator.disconnect();
        gainNode.disconnect();
      } catch (e) {
        // Ignore disconnection errors
      }
    }, 500);
  } catch (error) {
    console.error("Error playing interaction sound:", error);
  }
}

/**
 * Play a sound for intent field fluctuation
 * @param intensity Intensity of the fluctuation (0-1)
 * @param posX X position in the field (0-1)
 * @param posY Y position in the field (0-1)
 */
export function playIntentFluctuationSound(intensity: number, posX: number, posY: number): void {
  if (!audioContext || !masterGainNode || !isPlaying) return;

  try {
    // Create components
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    // Base frequency modulated by position
    const baseFreq = 100 + (posX * 400); // 100-500Hz based on X position
    oscillator.frequency.value = baseFreq;
    
    // Waveform based on intensity
    oscillator.type = intensity > 0.6 ? 'triangle' : 'sine';
    
    // Pan based on position
    const panner = audioContext.createStereoPanner();
    panner.pan.value = (posX * 2) - 1; // -1 to 1 pan
    
    // Volume based on intensity and Y position
    const volume = intensity * 0.15 * (1 - posY * 0.5) * globalVolume;
    gainNode.gain.value = 0;
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(volume, audioContext.currentTime + 0.1);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.8);
    
    // Connect and play
    oscillator.connect(gainNode);
    gainNode.connect(panner);
    panner.connect(masterGainNode);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 1);
    
    // Clean up
    setTimeout(() => {
      try {
        oscillator.disconnect();
        gainNode.disconnect();
        panner.disconnect();
      } catch (e) {
        // Ignore disconnection errors
      }
    }, 1200);
  } catch (error) {
    console.error("Error playing field fluctuation sound:", error);
  }
}

/**
 * Create continuous sounds for a collection of particles
 * @param particles Active particles in the simulation
 */
export function startParticleSoundscape(particles: Particle[]): void {
  if (!audioContext || !masterGainNode) {
    initSimulationAudio();
  }
  
  if (!audioContext || !masterGainNode) return;
  
  try {
    isPlaying = true;
    
    // Stop any existing soundscape
    stopSimulationAudio();
    
    // Only use a subset of particles for sound to avoid overloading
    const maxAudioParticles = Math.min(particles.length, 10);
    const selectedParticles = particles.slice(0, maxAudioParticles);
    
    // Create oscillators for selected particles
    selectedParticles.forEach((particle) => {
      if (!audioContext || !masterGainNode) return;
      
      // Skip if the particle has no ID
      if (!particle.id) return;
      
      try {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        // Base frequency on charge
        const baseFreq = chargeToFrequency(particle.charge);
        oscillator.frequency.value = baseFreq;
        
        // Waveform based on particle energy
        oscillator.type = energyToWaveform(particle.energy);
        
        // Detune based on interactions
        oscillator.detune.value = interactionsToDetune(particle.interactions || 0);
        
        // Very quiet for background ambience
        gainNode.gain.value = 0.02 * globalVolume;
        
        // Connect and start
        oscillator.connect(gainNode);
        gainNode.connect(masterGainNode);
        oscillator.start();
        
        // Store references for updating/stopping
        particleOscillators.set(particle.id, { oscillator, gain: gainNode });
      } catch (e) {
        console.error("Error creating particle oscillator:", e);
      }
    });
    
    console.log(`Started soundscape with ${particleOscillators.size} particles`);
  } catch (error) {
    console.error("Error starting particle soundscape:", error);
  }
}

/**
 * Play a sound for particle creation
 * @param charge Charge of the created particle
 * @param x X position (0-1)
 * @param y Y position (0-1)
 */
export function playParticleCreationSound(charge: string, x: number = 0.5, y: number = 0.5): void {
  if (!audioContext || !masterGainNode || !isPlaying) return;

  try {
    // Create components
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    // Configure based on charge
    oscillator.type = 'sine';
    oscillator.frequency.value = chargeToFrequency(charge);
    
    // Pan based on position
    const panner = audioContext.createStereoPanner();
    panner.pan.value = (x * 2) - 1; // -1 to 1 pan
    
    // Brief creation sound
    gainNode.gain.value = 0;
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.15 * globalVolume, audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.5);
    
    // Connect and play
    oscillator.connect(gainNode);
    gainNode.connect(panner);
    panner.connect(masterGainNode);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.6);
    
    // Clean up
    setTimeout(() => {
      try {
        oscillator.disconnect();
        gainNode.disconnect();
        panner.disconnect();
      } catch (e) {
        // Ignore disconnection errors
      }
    }, 700);
  } catch (error) {
    console.error("Error playing particle creation sound:", error);
  }
}

/**
 * Play a dramatic sound effect for an emergence event
 * @param complexity Complexity level of the emergence (0-1)
 */
export function playEmergenceSound(complexity: number): void {
  if (!audioContext || !masterGainNode || !isPlaying) return;

  try {
    // Create rich, multilayered sound for emergence
    
    // Base layer - low drone
    const baseOsc = audioContext.createOscillator();
    const baseGain = audioContext.createGain();
    baseOsc.type = 'sine';
    baseOsc.frequency.value = 100 + (complexity * 50);
    baseGain.gain.value = 0;
    baseGain.gain.setValueAtTime(0, audioContext.currentTime);
    baseGain.gain.linearRampToValueAtTime(0.2 * globalVolume, audioContext.currentTime + 0.5);
    baseGain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 3.5);
    
    // Mid layer - harmonic
    const midOsc = audioContext.createOscillator();
    const midGain = audioContext.createGain();
    midOsc.type = 'triangle';
    midOsc.frequency.value = 200 + (complexity * 200);
    midGain.gain.value = 0;
    midGain.gain.setValueAtTime(0, audioContext.currentTime);
    midGain.gain.linearRampToValueAtTime(0.15 * globalVolume, audioContext.currentTime + 0.2);
    midGain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 2.5);
    
    // High layer - shimmer
    const highOsc = audioContext.createOscillator();
    const highGain = audioContext.createGain();
    highOsc.type = 'sine';
    highOsc.frequency.value = 800 + (complexity * 400);
    highGain.gain.value = 0;
    highGain.gain.setValueAtTime(0, audioContext.currentTime);
    highGain.gain.linearRampToValueAtTime(0.1 * globalVolume, audioContext.currentTime + 0.1);
    highGain.gain.linearRampToValueAtTime(0.05 * globalVolume, audioContext.currentTime + 1.0);
    highGain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 1.5);
    
    // Connect and play all layers
    baseOsc.connect(baseGain);
    baseGain.connect(masterGainNode);
    baseOsc.start();
    baseOsc.stop(audioContext.currentTime + 4);
    
    midOsc.connect(midGain);
    midGain.connect(masterGainNode);
    midOsc.start();
    midOsc.stop(audioContext.currentTime + 3);
    
    highOsc.connect(highGain);
    highGain.connect(masterGainNode);
    highOsc.start();
    highOsc.stop(audioContext.currentTime + 2);
    
    // Clean up
    setTimeout(() => {
      try {
        baseOsc.disconnect();
        baseGain.disconnect();
        midOsc.disconnect();
        midGain.disconnect();
        highOsc.disconnect();
        highGain.disconnect();
      } catch (e) {
        // Ignore disconnection errors
      }
    }, 4500);
  } catch (error) {
    console.error("Error playing emergence sound:", error);
  }
}
