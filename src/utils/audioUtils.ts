
// Re-export audio utilities from the audio subdirectories
// But avoid duplicate exports by being more selective

// Import from audioPlaybackUtils
import { 
  playAudio as playAudioBuffer, 
  playAudioWithErrorHandling,
  playLoopingAudio,
  stopLoopingAudio,
  setLoopingAudioVolume,
  resumeAudioContext,
  createFallbackAudioIfNeeded as createPlaybackFallbackAudio
} from './audio/audioPlaybackUtils';

// Import from simulationAudioUtils
import {
  initAudioContext,
  playSimulationAudio,
  playSimulationEvent
} from './audio/simulationAudioUtils';

// Import from audioFileUtils
import { 
  checkAudioFileExists,
  getAudioFileMetadata
} from './audio/audioFileUtils';

// Import from audioGenerationUtils
import { 
  generateSampleAudio,
  createFallbackAudioIfNeeded
} from './audio/audioGenerationUtils';

// Re-export for convenience
export {
  playAudioBuffer,
  playAudioWithErrorHandling,
  playLoopingAudio,
  stopLoopingAudio,
  setLoopingAudioVolume,
  resumeAudioContext,
  createPlaybackFallbackAudio,
  initAudioContext,
  playSimulationAudio,
  playSimulationEvent,
  checkAudioFileExists,
  getAudioFileMetadata,
  generateSampleAudio,
  createFallbackAudioIfNeeded
};

// Provide a simplified API for common audio operations
export const playSound = async (url: string): Promise<void> => {
  try {
    const audioContext = initAudioContext();
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    playAudioBuffer(audioBuffer, 0.5);
  } catch (error) {
    console.error('Error playing sound:', error);
  }
};

export const generateBeep = (duration: number = 0.5, frequency: number = 440): void => {
  const buffer = generateSampleAudio(frequency, duration, 'sine');
  if (buffer) {
    playAudioBuffer(buffer, 0.3);
  }
};

export const generateErrorSound = (): void => {
  const buffer1 = generateSampleAudio(220, 0.1, 'sawtooth');
  if (buffer1) {
    playAudioBuffer(buffer1, 0.3);
    setTimeout(() => {
      const buffer2 = generateSampleAudio(180, 0.2, 'sawtooth');
      if (buffer2) {
        playAudioBuffer(buffer2, 0.3);
      }
    }, 150);
  }
};
