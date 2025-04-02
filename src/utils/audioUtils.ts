
// Re-export audio utilities from the audio subdirectories
// But avoid duplicate exports by being more selective

// Import specific functions from audioPlaybackUtils
import { 
  playAudio, 
  playAudioWithErrorHandling,
  playLoopingAudio,
  stopLoopingAudio,
  setLoopingAudioVolume,
  resumeAudioContext,
  createFallbackAudioIfNeeded as createPlaybackFallbackAudio,
  // Import but don't re-export directly to avoid duplicate
  initAudioContext as importedInitAudioContext
} from './audio/audioPlaybackUtils';

// Explicitly re-export with unique namespace to avoid ambiguity
export {
  playAudio,
  playAudioWithErrorHandling,
  playLoopingAudio,
  stopLoopingAudio,
  setLoopingAudioVolume,
  resumeAudioContext,
  createPlaybackFallbackAudio,
  // Export with original name since it's specifically referenced this way
  importedInitAudioContext as initAudioContext
};

// Import and re-export from simulationAudioUtils
export * from './audio/simulationAudioUtils';

// Import specific functions from audioFileUtils to avoid duplicate imports
import { 
  checkAudioFileExists,
  getAudioFileMetadata
} from './audio/audioFileUtils';

// Explicitly re-export to avoid ambiguity
export {
  checkAudioFileExists,
  getAudioFileMetadata
};

// Explicitly re-export from audioGenerationUtils to avoid name collision
import { 
  generateSampleAudio, 
  createFallbackAudioIfNeeded as createGenerationFallbackAudio 
} from './audio/audioGenerationUtils';

export {
  generateSampleAudio,
  createGenerationFallbackAudio
};

// Provide a simplified API for common audio operations
export const playSound = (url: string): Promise<void> => {
  return playAudio(url);
};

export const generateBeep = (duration: number = 0.5, frequency: number = 440): void => {
  generateSampleAudio(duration, 'sine', frequency);
};

export const generateErrorSound = (): void => {
  generateSampleAudio(0.1, 'sawtooth', 220);
  setTimeout(() => generateSampleAudio(0.2, 'sawtooth', 180), 150);
};
