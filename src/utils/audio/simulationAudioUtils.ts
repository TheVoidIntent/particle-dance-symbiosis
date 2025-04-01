import { toast } from "sonner";
import { Particle, SimulationStats } from '@/types/simulation';
import { playAudioWithErrorHandling } from './audioPlaybackUtils';
import { createFallbackAudioIfNeeded, generateSampleAudio } from './audioGenerationUtils';

/**
 * Utilities for converting simulation data to audio
 */

// Audio context for synthesis
let audioContext: AudioContext | null = null;
let oscillators: OscillatorNode[] = [];
let gainNodes: GainNode[] = [];
let isPlaying = false;

/**
 * Initialize the audio context (must be called after user interaction)
 */
export const initAudioContext = (): boolean => {
  try {
    if (!audioContext) {
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      console.log("Audio context initialized successfully");
      return true;
    }
    return !!audioContext;
  } catch (error) {
    console.error("Failed to initialize audio context:", error);
    toast.error("Could not initialize audio system. Your browser may not support the Web Audio API.");
    return false;
  }
};

/**
 * Play a sound based on a simulation event
 */
export const playSimulationEvent = async (eventType: string, data: any = {}): Promise<void> => {
  if (!audioContext) {
    if (!initAudioContext()) {
      return;
    }
  }
  
  try {
    switch (eventType) {
      case 'particle_creation':
        playParticleCreationSound(data.charge || 'neutral');
        break;
      case 'particle_interaction':
        playParticleInteractionSound(data.intensity || 0.5, data.charge1 || 'neutral', data.charge2 || 'neutral');
        break;
      case 'anomaly_detected':
        playAnomalySound(data.severity || 0.5);
        break;
      case 'inflation_event':
        playInflationSound();
        break;
      case 'field_fluctuation':
        playFieldFluctuationSound(data.intentStrength || 0);
        break;
      default:
        console.log(`No sound defined for event type: ${eventType}`);
    }
  } catch (error) {
    console.error(`Error playing simulation sound for ${eventType}:`, error);
    // Create fallback if sound generation fails
    createFallbackAudioIfNeeded();
  }
};

/**
 * Play a pre-recorded audio file related to the simulation
 */
export const playSimulationAudio = async (category: string, filename: string): Promise<void> => {
  try {
    const audioPath = `/audio/categories/${category}/${filename}`;
    const audioPlayer = await playAudioWithErrorHandling(audioPath);
    audioPlayer.play();
  } catch (error) {
    console.error("Error playing simulation audio:", error);
    createFallbackAudioIfNeeded();
  }
};

/**
 * Start continuous audio based on simulation stats
 */
export const startSimulationAudioStream = (stats: SimulationStats): void => {
  if (!audioContext) {
    if (!initAudioContext()) {
      return;
    }
  }
  
  if (isPlaying) {
    stopSimulationAudioStream();
  }
  
  isPlaying = true;
  
  try {
    // Create base oscillator for positive charge particles
    if (stats.positiveParticles > 0) {
      const posOsc = audioContext!.createOscillator();
      posOsc.type = 'sine';
      posOsc.frequency.value = 440 + (stats.positiveParticles * 5); // A4 + scaling
      
      const posGain = audioContext!.createGain();
      posGain.gain.value = Math.min(0.1, 0.02 + (stats.positiveParticles / stats.particleCount) * 0.08);
      
      posOsc.connect(posGain);
      posGain.connect(audioContext!.destination);
      posOsc.start();
      
      oscillators.push(posOsc);
      gainNodes.push(posGain);
    }
    
    // Create oscillator for negative charge particles
    if (stats.negativeParticles > 0) {
      const negOsc = audioContext!.createOscillator();
      negOsc.type = 'triangle';
      negOsc.frequency.value = 293.66 + (stats.negativeParticles * 4); // D4 + scaling
      
      const negGain = audioContext!.createGain();
      negGain.gain.value = Math.min(0.1, 0.02 + (stats.negativeParticles / stats.particleCount) * 0.08);
      
      negOsc.connect(negGain);
      negGain.connect(audioContext!.destination);
      negOsc.start();
      
      oscillators.push(negOsc);
      gainNodes.push(negGain);
    }
    
    // Create oscillator for neutral particles
    if (stats.neutralParticles > 0) {
      const neutralOsc = audioContext!.createOscillator();
      neutralOsc.type = 'square';
      neutralOsc.frequency.value = 349.23 + (stats.neutralParticles * 3); // F4 + scaling
      
      const neutralGain = audioContext!.createGain();
      neutralGain.gain.value = Math.min(0.1, 0.02 + (stats.neutralParticles / stats.particleCount) * 0.08);
      
      neutralOsc.connect(neutralGain);
      neutralGain.connect(audioContext!.destination);
      neutralOsc.start();
      
      oscillators.push(neutralOsc);
      gainNodes.push(neutralGain);
    }
    
    // Create oscillator for system entropy
    if (stats.systemEntropy !== undefined) {
      const entropyOsc = audioContext!.createOscillator();
      entropyOsc.type = 'sawtooth';
      entropyOsc.frequency.value = 220 + (stats.systemEntropy * 200); // A3 + scaling
      
      const entropyGain = audioContext!.createGain();
      entropyGain.gain.value = 0.05;
      
      entropyOsc.connect(entropyGain);
      entropyGain.connect(audioContext!.destination);
      entropyOsc.start();
      
      oscillators.push(entropyOsc);
      gainNodes.push(entropyGain);
    }
    
    toast.success("Simulation audio stream started", {
      description: "You can now hear the simulation data as audio"
    });
    
  } catch (error) {
    console.error("Error starting simulation audio stream:", error);
    toast.error("Failed to start simulation audio stream");
    stopSimulationAudioStream();
  }
};

/**
 * Stop the continuous audio stream
 */
export const stopSimulationAudioStream = (): void => {
  if (!isPlaying) return;
  
  try {
    oscillators.forEach(osc => {
      try {
        osc.stop();
        osc.disconnect();
      } catch (e) {
        // Already stopped
      }
    });
    
    gainNodes.forEach(gain => {
      try {
        gain.disconnect();
      } catch (e) {
        // Already disconnected
      }
    });
    
    oscillators = [];
    gainNodes = [];
    isPlaying = false;
    
    toast.info("Simulation audio stream stopped");
  } catch (error) {
    console.error("Error stopping simulation audio stream:", error);
  }
};

/**
 * Check if the simulation audio stream is currently playing
 */
export const isSimulationAudioPlaying = (): boolean => {
  return isPlaying;
};

// Private helper functions for sound synthesis

const playParticleCreationSound = (charge: string): void => {
  if (!audioContext) return;
  
  const osc = audioContext.createOscillator();
  const gain = audioContext.createGain();
  
  // Set different tones based on particle charge
  if (charge === 'positive') {
    osc.type = 'sine';
    osc.frequency.value = 440; // A4
  } else if (charge === 'negative') {
    osc.type = 'triangle';
    osc.frequency.value = 293.66; // D4
  } else {
    osc.type = 'square';
    osc.frequency.value = 349.23; // F4
  }
  
  // Set envelope
  gain.gain.setValueAtTime(0, audioContext.currentTime);
  gain.gain.linearRampToValueAtTime(0.2, audioContext.currentTime + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
  
  osc.connect(gain);
  gain.connect(audioContext.destination);
  
  osc.start();
  osc.stop(audioContext.currentTime + 0.4);
};

const playParticleInteractionSound = (intensity: number, charge1: string, charge2: string): void => {
  if (!audioContext) return;
  
  const osc = audioContext.createOscillator();
  const gain = audioContext.createGain();
  
  // Different sound based on interacting charges
  if (charge1 === charge2) {
    // Same charge interaction
    osc.type = 'sine';
    osc.frequency.value = 880; // A5
  } else if ((charge1 === 'positive' && charge2 === 'negative') || 
             (charge1 === 'negative' && charge2 === 'positive')) {
    // Opposite charge interaction
    osc.type = 'sine';
    osc.frequency.value = 523.25; // C5
  } else {
    // One is neutral
    osc.type = 'triangle';
    osc.frequency.value = 659.25; // E5
  }
  
  // Scale volume by intensity
  const volume = 0.1 + (intensity * 0.2);
  
  gain.gain.setValueAtTime(0, audioContext.currentTime);
  gain.gain.linearRampToValueAtTime(volume, audioContext.currentTime + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
  
  osc.connect(gain);
  gain.connect(audioContext.destination);
  
  osc.start();
  osc.stop(audioContext.currentTime + 0.25);
};

const playAnomalySound = (severity: number): void => {
  if (!audioContext) return;
  
  // Create dissonant chord for anomaly
  const frequencies = [277.18, 415.3, 554.37, 622.25]; // Dissonant notes
  const oscillators: OscillatorNode[] = [];
  const gains: GainNode[] = [];
  
  for (let i = 0; i < frequencies.length; i++) {
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    
    osc.type = i % 2 === 0 ? 'sawtooth' : 'square';
    osc.frequency.value = frequencies[i];
    
    // Stagger the entries slightly
    const startDelay = i * 0.05;
    const volume = 0.1 * severity;
    
    gain.gain.setValueAtTime(0, audioContext.currentTime + startDelay);
    gain.gain.linearRampToValueAtTime(volume, audioContext.currentTime + startDelay + 0.1);
    gain.gain.linearRampToValueAtTime(0, audioContext.currentTime + startDelay + 0.8);
    
    osc.connect(gain);
    gain.connect(audioContext.destination);
    
    osc.start(audioContext.currentTime + startDelay);
    osc.stop(audioContext.currentTime + startDelay + 0.9);
    
    oscillators.push(osc);
    gains.push(gain);
  }
};

const playInflationSound = (): void => {
  if (!audioContext) return;
  
  // Create rich expanding sound for inflation events
  const osc1 = audioContext.createOscillator();
  const osc2 = audioContext.createOscillator();
  const gain1 = audioContext.createGain();
  const gain2 = audioContext.createGain();
  
  osc1.type = 'sine';
  osc1.frequency.value = 110; // A2
  osc1.frequency.exponentialRampToValueAtTime(440, audioContext.currentTime + 1); // Ramp up to A4
  
  osc2.type = 'triangle';
  osc2.frequency.value = 165; // E3
  osc2.frequency.exponentialRampToValueAtTime(660, audioContext.currentTime + 1.2); // Ramp up to E5
  
  gain1.gain.setValueAtTime(0, audioContext.currentTime);
  gain1.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.3);
  gain1.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1.5);
  
  gain2.gain.setValueAtTime(0, audioContext.currentTime + 0.2);
  gain2.gain.linearRampToValueAtTime(0.2, audioContext.currentTime + 0.5);
  gain2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1.7);
  
  osc1.connect(gain1);
  osc2.connect(gain2);
  gain1.connect(audioContext.destination);
  gain2.connect(audioContext.destination);
  
  osc1.start();
  osc2.start(audioContext.currentTime + 0.2);
  osc1.stop(audioContext.currentTime + 1.6);
  osc2.stop(audioContext.currentTime + 1.8);
};

const playFieldFluctuationSound = (intentStrength: number): void => {
  if (!audioContext) return;
  
  const osc = audioContext.createOscillator();
  const gain = audioContext.createGain();
  const filter = audioContext.createBiquadFilter();
  
  osc.type = 'sine';
  
  // Map intent strength to frequency
  const baseFreq = 220; // A3
  const freqFactor = intentStrength > 0 ? 1 + intentStrength : 1 / (1 + Math.abs(intentStrength));
  osc.frequency.value = baseFreq * freqFactor;
  
  // Set filter based on strength
  filter.type = 'lowpass';
  filter.frequency.value = 800 + (Math.abs(intentStrength) * 800);
  filter.Q.value = 5;
  
  // Volume based on absolute strength
  const volume = 0.05 + (Math.abs(intentStrength) * 0.1);
  
  gain.gain.setValueAtTime(0, audioContext.currentTime);
  gain.gain.linearRampToValueAtTime(volume, audioContext.currentTime + 0.05);
  gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
  
  osc.connect(filter);
  filter.connect(gain);
  gain.connect(audioContext.destination);
  
  osc.start();
  osc.stop(audioContext.currentTime + 0.35);
};

/**
 * Generate a soundscape based on the current state of the particles
 */
export const generateParticleSoundscape = (particles: Particle[]): void => {
  if (!audioContext) {
    if (!initAudioContext()) {
      return;
    }
  }
  
  stopSimulationAudioStream(); // Stop any existing soundscape
  isPlaying = true;
  
  try {
    // Count particles by charge
    const positiveCount = particles.filter(p => p.charge === 'positive').length;
    const negativeCount = particles.filter(p => p.charge === 'negative').length;
    const neutralCount = particles.filter(p => p.charge === 'neutral').length;
    
    // Calculate average knowledge and complexity
    const avgKnowledge = particles.length > 0 
      ? particles.reduce((sum, p) => sum + (p.knowledge || 0), 0) / particles.length 
      : 0;
    
    // Create the base drone for positive particles
    if (positiveCount > 0) {
      const posOsc = audioContext.createOscillator();
      posOsc.type = 'sine';
      posOsc.frequency.value = 220 + (positiveCount * 2); // A3 + scaling
      
      const posGain = audioContext.createGain();
      posGain.gain.value = Math.min(0.15, 0.05 + (positiveCount / particles.length) * 0.1);
      
      posOsc.connect(posGain);
      posGain.connect(audioContext.destination);
      posOsc.start();
      
      oscillators.push(posOsc);
      gainNodes.push(posGain);
    }
    
    // Create mid tone for negative particles
    if (negativeCount > 0) {
      const negOsc = audioContext.createOscillator();
      negOsc.type = 'triangle';
      negOsc.frequency.value = 329.63 + (negativeCount * 2); // E4 + scaling
      
      const negGain = audioContext.createGain();
      negGain.gain.value = Math.min(0.15, 0.05 + (negativeCount / particles.length) * 0.1);
      
      negOsc.connect(negGain);
      negGain.connect(audioContext.destination);
      negOsc.start();
      
      oscillators.push(negOsc);
      gainNodes.push(negGain);
    }
    
    // Create high tone for neutral particles
    if (neutralCount > 0) {
      const neutralOsc = audioContext.createOscillator();
      neutralOsc.type = 'square';
      neutralOsc.frequency.value = 440 + (neutralCount * 2); // A4 + scaling
      
      const neutralGain = audioContext.createGain();
      neutralGain.gain.value = Math.min(0.1, 0.03 + (neutralCount / particles.length) * 0.07);
      
      neutralOsc.connect(neutralGain);
      neutralGain.connect(audioContext.destination);
      neutralOsc.start();
      
      oscillators.push(neutralOsc);
      gainNodes.push(neutralGain);
    }
    
    // Add knowledge-based sound layer
    if (avgKnowledge > 0.1) {
      const knowledgeOsc = audioContext.createOscillator();
      knowledgeOsc.type = 'sine';
      knowledgeOsc.frequency.value = 587.33 + (avgKnowledge * 300); // D5 + scaling
      
      const knowledgeGain = audioContext.createGain();
      knowledgeGain.gain.value = Math.min(0.08, avgKnowledge * 0.2);
      
      const knowledgeFilter = audioContext.createBiquadFilter();
      knowledgeFilter.type = 'highpass';
      knowledgeFilter.frequency.value = 800;
      
      knowledgeOsc.connect(knowledgeFilter);
      knowledgeFilter.connect(knowledgeGain);
      knowledgeGain.connect(audioContext.destination);
      knowledgeOsc.start();
      
      oscillators.push(knowledgeOsc);
      gainNodes.push(knowledgeGain);
    }
    
    toast.success("Particle soundscape generated", {
      description: `Sonifying ${particles.length} particles`
    });
    
  } catch (error) {
    console.error("Error generating particle soundscape:", error);
    toast.error("Failed to generate audio from particles");
    stopSimulationAudioStream();
  }
};
