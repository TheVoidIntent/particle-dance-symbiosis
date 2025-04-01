
import { toast } from "sonner";
import { Particle, SimulationStats } from "@/types/simulation";
import { generateSampleAudio } from './audioGenerationUtils';
import { createFallbackAudioIfNeeded } from './audioPlaybackUtils';

let audioContext: AudioContext | null = null;
let audioStreamActive = false;
let masterGainNode: GainNode | null = null;
let soundSources: { [key: string]: AudioBuffer } = {};
let lastPlayed: { [key: string]: number } = {};

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
    
    console.log("Audio context initialized");
    return true;
  } catch (error) {
    console.error("Failed to initialize audio context:", error);
    return false;
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
  
  audioStreamActive = true;
  console.log("Started audio stream with stats:", stats);
  
  // This is a simple placeholder that plays a test sound once when the stream starts
  generateSampleAudio(2, 'sine', 440);
  
  toast.success("Audio stream started");
};

// Stop audio stream
export const stopSimulationAudioStream = (): void => {
  audioStreamActive = false;
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
    const audioPath = `/audio/categories/${category}/${filename}.mp3`;
    console.log("Attempting to play audio:", audioPath);
    
    // Try to fetch and play the audio file
    fetch(audioPath)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Audio file not found: ${audioPath}`);
        }
        return response.arrayBuffer();
      })
      .then(arrayBuffer => {
        if (!audioContext) return;
        return audioContext.decodeAudioData(arrayBuffer);
      })
      .then(audioBuffer => {
        if (!audioContext || !masterGainNode) return;
        
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(masterGainNode);
        source.start();
        
        console.log(`Playing audio: ${category}/${filename}`);
      })
      .catch(error => {
        console.error("Error playing audio:", error);
        // Fall back to generated audio
        createFallbackAudioIfNeeded();
      });
  } catch (error) {
    console.error("Error in playSimulationAudio:", error);
    createFallbackAudioIfNeeded();
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
        generateSampleAudio(0.5, 'sine', 660);
      } else if (charge === 'negative') {
        generateSampleAudio(0.5, 'sine', 440);
      } else {
        generateSampleAudio(0.5, 'sine', 550);
      }
      break;
      
    case 'particle_interaction':
      // Sound based on interaction intensity
      const intensity = eventData.intensity || 0.5;
      const baseFreq = 300 + (intensity * 300);
      generateSampleAudio(0.3, 'triangle', baseFreq);
      break;
      
    case 'anomaly_detected':
      // Dramatic sound for anomalies
      const severity = eventData.severity || 0.5;
      const anomalyFreq = 200 + (severity * 400);
      generateSampleAudio(1.0, 'sawtooth', anomalyFreq);
      break;
      
    case 'field_fluctuation':
      // Subtle sound for field changes
      const intentStrength = eventData.intentStrength || 0.5;
      const fluctFreq = 200 + (intentStrength * 200);
      generateSampleAudio(0.4, 'sine', fluctFreq);
      break;
      
    case 'inflation_event':
      // Big dramatic sound for inflation events
      generateSampleAudio(2.0, 'sawtooth', 150);
      setTimeout(() => generateSampleAudio(1.5, 'sine', 300), 200);
      setTimeout(() => generateSampleAudio(1.0, 'sine', 450), 400);
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
  
  // Generate base tones for each type
  const delayBetweenSounds = 200; // ms
  
  // Play positive particles tone
  if (positiveCount > 0) {
    const freq = 440 + (positiveCount * 2);
    const duration = 0.5 + (positiveCount / particles.length);
    setTimeout(() => generateSampleAudio(duration, 'sine', freq), 0);
  }
  
  // Play negative particles tone
  if (negativeCount > 0) {
    const freq = 330 + (negativeCount * 2);
    const duration = 0.5 + (negativeCount / particles.length);
    setTimeout(() => generateSampleAudio(duration, 'triangle', freq), delayBetweenSounds);
  }
  
  // Play neutral particles tone
  if (neutralCount > 0) {
    const freq = 220 + (neutralCount * 2);
    const duration = 0.5 + (neutralCount / particles.length);
    setTimeout(() => generateSampleAudio(duration, 'sine', freq), delayBetweenSounds * 2);
  }
  
  // Final chord that represents overall system state
  const totalParticles = particles.length;
  const avgComplexity = particles.reduce((sum, p) => sum + p.complexity, 0) / totalParticles;
  
  setTimeout(() => {
    const finalFreq = 200 + (totalParticles * 0.5);
    const finalDuration = 1.0 + (avgComplexity / 2);
    generateSampleAudio(finalDuration, 'sine', finalFreq);
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
  
  console.log("Audio resources cleaned up");
};
