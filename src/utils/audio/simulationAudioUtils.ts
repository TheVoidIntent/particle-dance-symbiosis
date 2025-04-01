
import { toast } from "sonner";
import { Particle, SimulationStats } from "@/types/simulation";
import { generateSampleAudio } from './audioGenerationUtils';
import { playAudioWithErrorHandling } from './audioPlaybackUtils';
import { checkAudioFileExists } from './audioFileUtils';

let audioContext: AudioContext | null = null;
let audioStreamActive = false;
let masterGainNode: GainNode | null = null;
let soundSources: { [key: string]: AudioBuffer } = {};
let lastPlayed: { [key: string]: number } = {};
let sonificationInterval: number | null = null;

// Audio file paths for different particle events
const AUDIO_PATHS = {
  positive_creation: '/audio/intentsim_page/positive_particle_birth.mp3',
  negative_creation: '/audio/intentsim_page/negative_particle_birth.mp3',
  neutral_creation: '/audio/intentsim_page/neutral_particle_birth.mp3',
  interaction_low: '/audio/intentsim_page/interaction_low.mp3',
  interaction_medium: '/audio/intentsim_page/interaction_medium.mp3',
  interaction_high: '/audio/intentsim_page/interaction_high.mp3',
  anomaly: '/audio/intentsim_page/anomaly_detected.mp3',
  inflation: '/audio/intentsim_page/inflation_event.mp3',
  field_fluctuation: '/audio/intentsim_page/field_fluctuation.mp3',
  background_ambience: '/audio/intentsim_page/ambience_loop.mp3'
};

// Initialize the audio context
export const initAudioContext = (): boolean => {
  try {
    if (audioContext) return true;
    
    if (!window.AudioContext && !(window as any).webkitAudioContext) {
      console.error("Web Audio API not supported in this browser");
      toast.error("Audio not supported in your browser");
      return false;
    }
    
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    masterGainNode = audioContext.createGain();
    masterGainNode.gain.value = 0.5; // 50% volume
    masterGainNode.connect(audioContext.destination);
    
    // Preload commonly used sounds
    preloadAudioFiles();
    
    console.log("Audio context initialized");
    return true;
  } catch (error) {
    console.error("Failed to initialize audio context:", error);
    return false;
  }
};

// Preload audio files for faster playback
const preloadAudioFiles = async () => {
  try {
    // Check if our custom audio files exist
    for (const [key, path] of Object.entries(AUDIO_PATHS)) {
      const { exists } = await checkAudioFileExists(path);
      if (exists) {
        fetch(path)
          .then(response => response.arrayBuffer())
          .then(arrayBuffer => {
            if (!audioContext) return;
            return audioContext.decodeAudioData(arrayBuffer);
          })
          .then(audioBuffer => {
            if (audioBuffer) {
              soundSources[key] = audioBuffer;
              console.log(`Preloaded audio: ${key}`);
            }
          })
          .catch(err => {
            console.warn(`Could not preload audio ${key}: ${err}`);
          });
      } else {
        console.warn(`Audio file not found: ${path}`);
      }
    }
  } catch (error) {
    console.error("Error preloading audio files:", error);
  }
};

// Check if audio stream is currently playing
export const isSimulationAudioPlaying = (): boolean => {
  return audioStreamActive;
};

// Start audio stream based on simulation stats
export const startSimulationAudioStream = (stats: SimulationStats): void => {
  if (!audioContext) {
    const initialized = initAudioContext();
    if (!initialized) return;
  }
  
  if (audioStreamActive) {
    stopSimulationAudioStream();
  }
  
  audioStreamActive = true;
  console.log("Started audio stream with stats:", stats);
  
  // Play ambient background sound on loop
  playAmbientSound();
  
  // Start sonification interval to periodically generate sounds based on simulation state
  sonificationInterval = window.setInterval(() => {
    if (!audioStreamActive) return;
    
    // Play sounds based on particle counts and interactions
    if (stats.positiveParticles > 0 && Math.random() < 0.2) {
      const intensity = Math.min(stats.positiveParticles / 20, 1);
      playSimulationSound('positive_creation', intensity * 0.5);
    }
    
    if (stats.negativeParticles > 0 && Math.random() < 0.15) {
      const intensity = Math.min(stats.negativeParticles / 20, 1);
      playSimulationSound('negative_creation', intensity * 0.4);
    }
    
    if (stats.interactions && stats.interactions > 0 && Math.random() < 0.3) {
      const interactionLevel = stats.interactions / 100;
      if (interactionLevel > 0.7) {
        playSimulationSound('interaction_high', 0.4);
      } else if (interactionLevel > 0.3) {
        playSimulationSound('interaction_medium', 0.3);
      } else {
        playSimulationSound('interaction_low', 0.2);
      }
    }
    
    // Occasionally play field fluctuation sound based on complexity
    if (stats.complexityIndex && stats.complexityIndex > 1 && Math.random() < 0.1) {
      playSimulationSound('field_fluctuation', 0.3);
    }
  }, 2000); // Check every 2 seconds
  
  toast.success("Audio stream started - listen to your simulation");
};

// Play ambient background sound
const playAmbientSound = () => {
  if (!audioContext || !masterGainNode) return;
  
  // Try to play custom ambient sound if available
  if (soundSources['background_ambience']) {
    const source = audioContext.createBufferSource();
    source.buffer = soundSources['background_ambience'];
    source.loop = true;
    
    const ambientGain = audioContext.createGain();
    ambientGain.gain.value = 0.15; // Lower volume for background
    
    source.connect(ambientGain);
    ambientGain.connect(masterGainNode);
    source.start();
    
    console.log("Playing ambient background sound");
  } else {
    // Fallback to generated ambient sound
    console.log("No ambient sound file found, generating synthetic ambient sound");
    const playLowDrone = () => {
      if (!audioStreamActive) return;
      generateSampleAudio(5, 'sine', 65, 0.1);
      setTimeout(playLowDrone, 4500);
    };
    
    playLowDrone();
  }
};

// Play a sound from our preloaded sounds with specified volume
const playSimulationSound = (soundKey: string, volume: number = 0.5) => {
  if (!audioContext || !masterGainNode || !audioStreamActive) return;
  
  // Rate limit to avoid too many sounds at once
  const now = Date.now();
  if (lastPlayed[soundKey] && now - lastPlayed[soundKey] < 1000) return;
  
  lastPlayed[soundKey] = now;
  
  try {
    // If we have the preloaded sound
    if (soundSources[soundKey]) {
      const source = audioContext.createBufferSource();
      source.buffer = soundSources[soundKey];
      
      const gainNode = audioContext.createGain();
      gainNode.gain.value = volume;
      
      source.connect(gainNode);
      gainNode.connect(masterGainNode);
      source.start();
    } else {
      // Fallback to synthesized sound
      const frequency = soundKey.includes('positive') ? 440 : 
                       soundKey.includes('negative') ? 220 : 
                       soundKey.includes('neutral') ? 330 : 
                       soundKey.includes('interaction') ? 165 : 
                       soundKey.includes('anomaly') ? 880 : 110;
                       
      const waveType = soundKey.includes('creation') ? 'sine' :
                      soundKey.includes('interaction') ? 'triangle' :
                      soundKey.includes('anomaly') ? 'sawtooth' : 'sine';
                      
      generateSampleAudio(0.5, waveType as OscillatorType, frequency, volume);
    }
  } catch (error) {
    console.error(`Error playing simulation sound ${soundKey}:`, error);
  }
};

// Stop audio stream
export const stopSimulationAudioStream = (): void => {
  audioStreamActive = false;
  
  if (sonificationInterval) {
    clearInterval(sonificationInterval);
    sonificationInterval = null;
  }
  
  console.log("Stopped audio stream");
  toast.info("Audio stream stopped");
};

// Play a specific audio file from the library
export const playSimulationAudio = (category: string, filename: string): void => {
  if (!audioContext) {
    const initialized = initAudioContext();
    if (!initialized) return;
  }
  
  try {
    const audioPath = `/audio/intentsim_page/${category}_${filename}.mp3`;
    console.log("Attempting to play audio:", audioPath);
    
    // Try to play the audio file
    playAudioWithErrorHandling(audioPath).catch(error => {
      console.error("Error playing audio:", error);
      // Try the categories folder as fallback
      const fallbackPath = `/audio/categories/${category}/${filename}.mp3`;
      playAudioWithErrorHandling(fallbackPath).catch(() => {
        // Fall back to generated audio if both paths fail
        generateSampleAudio(0.5, 'sine', 440);
      });
    });
  } catch (error) {
    console.error("Error in playSimulationAudio:", error);
    generateSampleAudio(0.5, 'sine', 440);
  }
};

// Play event-specific sounds based on simulation events
export const playSimulationEvent = (eventType: string, eventData: any = {}): void => {
  if (!audioContext) {
    const initialized = initAudioContext();
    if (!initialized) return;
  }
  
  // Rate limit sounds to avoid too many sounds playing at once
  const now = Date.now();
  if (lastPlayed[eventType] && now - lastPlayed[eventType] < 500) {
    return; // Don't play sounds of the same type more than once every 500ms
  }
  lastPlayed[eventType] = now;
  
  switch(eventType) {
    case 'particle_creation':
      // Different sound based on charge
      const charge = eventData.charge || 'neutral';
      
      if (charge === 'positive') {
        playSimulationSound('positive_creation');
      } else if (charge === 'negative') {
        playSimulationSound('negative_creation');
      } else {
        playSimulationSound('neutral_creation');
      }
      break;
      
    case 'particle_interaction':
      // Sound based on interaction intensity
      const intensity = eventData.intensity || 0.5;
      if (intensity > 0.7) {
        playSimulationSound('interaction_high');
      } else if (intensity > 0.3) {
        playSimulationSound('interaction_medium');
      } else {
        playSimulationSound('interaction_low');
      }
      break;
      
    case 'anomaly_detected':
      // Dramatic sound for anomalies
      playSimulationSound('anomaly', 0.7);
      break;
      
    case 'field_fluctuation':
      // Subtle sound for field changes
      playSimulationSound('field_fluctuation', 0.4);
      break;
      
    case 'inflation_event':
      // Big dramatic sound for inflation events
      playSimulationSound('inflation', 0.8);
      break;
      
    default:
      // Default sound
      generateSampleAudio(0.3, 'sine', 440);
  }
};

// Generate a soundscape based on current particle distribution
export const generateParticleSoundscape = (particles: Particle[]): void => {
  if (!audioContext) {
    const initialized = initAudioContext();
    if (!initialized) return;
  }
  
  if (!particles || particles.length === 0) {
    toast.error("No particles to generate audio from");
    return;
  }
  
  console.log("Generating soundscape from", particles.length, "particles");
  toast.success("Generating particle soundscape");
  
  // Count particle types
  const positiveCount = particles.filter(p => p.charge === 'positive').length;
  const negativeCount = particles.filter(p => p.charge === 'negative').length;
  const neutralCount = particles.filter(p => p.charge === 'neutral').length;
  
  // Generate layered sounds for each particle type
  const delayBetweenSounds = 200; // ms
  
  // Layer 1: Positive particles tone
  if (positiveCount > 0) {
    setTimeout(() => {
      const intensity = Math.min(positiveCount / particles.length, 1);
      playSimulationSound('positive_creation', intensity * 0.6);
    }, 0);
  }
  
  // Layer 2: Negative particles tone
  if (negativeCount > 0) {
    setTimeout(() => {
      const intensity = Math.min(negativeCount / particles.length, 1);
      playSimulationSound('negative_creation', intensity * 0.5);
    }, delayBetweenSounds);
  }
  
  // Layer 3: Neutral particles tone
  if (neutralCount > 0) {
    setTimeout(() => {
      const intensity = Math.min(neutralCount / particles.length, 1);
      playSimulationSound('neutral_creation', intensity * 0.4);
    }, delayBetweenSounds * 2);
  }
  
  // Layer 4: Interactions and complexity representation
  setTimeout(() => {
    const avgComplexity = particles.reduce((sum, p) => sum + (p.complexity || 1), 0) / particles.length;
    const avgIntent = particles.reduce((sum, p) => sum + (p.intent || 0), 0) / particles.length;
    
    // Determine which interaction sound to play based on complexity
    if (avgComplexity > 2) {
      playSimulationSound('interaction_high', 0.5);
    } else if (avgComplexity > 1.5) {
      playSimulationSound('interaction_medium', 0.4);
    } else {
      playSimulationSound('interaction_low', 0.3);
    }
    
    // Add intent field fluctuation sound if available
    if (Math.abs(avgIntent) > 0.3) {
      setTimeout(() => {
        playSimulationSound('field_fluctuation', 0.3);
      }, 300);
    }
  }, delayBetweenSounds * 3);
};

// Set master volume for all audio
export const setSimulationAudioVolume = (volume: number): void => {
  if (!masterGainNode) return;
  
  // Normalize volume to 0-1 range
  const normalizedVolume = Math.max(0, Math.min(1, volume / 100));
  masterGainNode.gain.value = normalizedVolume;
  
  console.log("Audio volume set to:", normalizedVolume);
};

// Clean up audio resources
export const cleanupAudioResources = (): void => {
  if (audioContext) {
    audioContext.close();
    audioContext = null;
  }
  
  masterGainNode = null;
  soundSources = {};
  audioStreamActive = false;
  
  if (sonificationInterval) {
    clearInterval(sonificationInterval);
    sonificationInterval = null;
  }
  
  console.log("Audio resources cleaned up");
};
