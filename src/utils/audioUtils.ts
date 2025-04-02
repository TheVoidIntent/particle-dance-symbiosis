
// Re-export audio utilities from the audio subdirectories
export * from './audio/audioPlaybackUtils';
export * from './audio/simulationAudioUtils';
export * from './audio/audioFileUtils';

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
import { playAudio, playAudioWithErrorHandling } from './audio/audioPlaybackUtils';
import { checkAudioFileExists } from './audio/audioFileUtils';

// Re-export explicitly to avoid ambiguity
export {
  checkAudioFileExists,
  playAudioWithErrorHandling
};

// Export common audio utility functions - renamed to avoid collision
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
