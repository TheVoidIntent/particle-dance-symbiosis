
import { initAudioContext } from "./simulationAudioUtils";

/**
 * Generate a sample audio buffer for testing
 */
export function generateSampleAudio(
  frequency: number = 440, 
  duration: number = 1, 
  volume: number = 0.5
): AudioBuffer {
  const context = initAudioContext();
  const sampleRate = context.sampleRate;
  const buffer = context.createBuffer(1, sampleRate * duration, sampleRate);
  
  // Get the data
  const channelData = buffer.getChannelData(0);
  
  // Fill the buffer with a sine wave
  for (let i = 0; i < channelData.length; i++) {
    // Simple sine wave with decreasing volume
    const t = i / sampleRate;
    const fadeFactor = 1 - t / duration; // Linear fade-out
    channelData[i] = Math.sin(2 * Math.PI * frequency * t) * volume * fadeFactor;
  }
  
  return buffer;
}

/**
 * Generate a tone based on particle properties
 */
export function generateParticleTone(
  charge: 'positive' | 'negative' | 'neutral',
  energy: number = 1,
  complexity: number = 1
): AudioBuffer {
  // Generate different base frequencies based on particle charge
  let baseFrequency = 440; // A4 note
  
  if (charge === 'positive') {
    baseFrequency = 523.25; // C5 note
  } else if (charge === 'negative') {
    baseFrequency = 329.63; // E4 note
  } else {
    baseFrequency = 392.00; // G4 note
  }
  
  // Adjust frequency based on energy
  const frequency = baseFrequency * (0.8 + energy * 0.4);
  
  // Duration based on complexity
  const duration = 0.2 + complexity * 0.3;
  
  // Generate the audio
  return generateSampleAudio(frequency, duration, 0.4);
}

/**
 * Create a fallback audio if Web Audio API is not available
 */
export function createFallbackAudioIfNeeded(): boolean {
  const context = initAudioContext();
  
  try {
    // Create a short silent buffer
    const buffer = context.createBuffer(1, context.sampleRate * 0.1, context.sampleRate);
    const source = context.createBufferSource();
    
    // Connect and play
    source.buffer = buffer;
    source.connect(context.destination);
    source.start(context.currentTime);
    
    return true;
  } catch (error) {
    console.error("Error creating fallback audio:", error);
    return false;
  }
}
