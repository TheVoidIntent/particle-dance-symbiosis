
import { initAudioContext } from './simulationAudioUtils';

/**
 * Generate a sample audio tone
 */
export const generateSampleAudio = (frequency: number = 440, duration: number = 1, type: OscillatorType = 'sine'): AudioBuffer | null => {
  const audioContext = initAudioContext();
  
  try {
    // Create an empty buffer
    const sampleRate = audioContext.sampleRate;
    const buffer = audioContext.createBuffer(1, sampleRate * duration, sampleRate);
    const channelData = buffer.getChannelData(0);
    
    // Fill the buffer with a waveform
    for (let i = 0; i < buffer.length; i++) {
      const t = i / sampleRate;
      
      switch (type) {
        case 'sine':
          channelData[i] = Math.sin(2 * Math.PI * frequency * t);
          break;
        case 'square':
          channelData[i] = Math.sin(2 * Math.PI * frequency * t) > 0 ? 0.7 : -0.7;
          break;
        case 'sawtooth':
          channelData[i] = 2 * ((t * frequency) % 1) - 1;
          break;
        case 'triangle':
          channelData[i] = 2 * Math.abs(2 * ((t * frequency) % 1) - 1) - 1;
          break;
        default:
          channelData[i] = Math.sin(2 * Math.PI * frequency * t);
      }
      
      // Apply fade in/out to avoid clicks
      const fadeTime = 0.05;
      if (t < fadeTime) {
        channelData[i] *= t / fadeTime;
      } else if (t > duration - fadeTime) {
        channelData[i] *= (duration - t) / fadeTime;
      }
    }
    
    return buffer;
  } catch (error) {
    console.error('Error generating audio sample:', error);
    return null;
  }
};

/**
 * Generate a tone specifically for particles
 */
export const generateParticleTone = (
  charge: 'positive' | 'negative' | 'neutral',
  energy: number = 1,
  complexity: number = 0
): AudioBuffer | null => {
  let baseFrequency: number;
  let waveType: OscillatorType;
  
  // Determine base frequency and wave type based on particle properties
  switch (charge) {
    case 'positive':
      baseFrequency = 440; // A4
      waveType = 'sine';
      break;
    case 'negative':
      baseFrequency = 329.63; // E4
      waveType = 'triangle';
      break;
    case 'neutral':
      baseFrequency = 392; // G4
      waveType = 'sine';
      break;
    default:
      baseFrequency = 440;
      waveType = 'sine';
  }
  
  // Adjust frequency based on energy and complexity
  const adjustedFrequency = baseFrequency * (0.8 + energy * 0.4) * (1 + complexity * 0.1);
  const duration = 0.5 + complexity * 0.2; // Longer duration for more complex particles
  
  return generateSampleAudio(adjustedFrequency, duration, waveType);
};
