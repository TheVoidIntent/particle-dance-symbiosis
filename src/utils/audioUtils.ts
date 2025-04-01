
// Re-export audio utilities from the audio subdirectories
export * from './audio/audioGenerationUtils';
export * from './audio/audioPlaybackUtils';
export * from './audio/simulationAudioUtils';

// Provide a simplified API for common audio operations
import { playAudioWithErrorHandling, createFallbackAudioIfNeeded } from './audio/audioPlaybackUtils';
import { generateSampleAudio } from './audio/audioGenerationUtils';

// Export common audio utility functions
export const playSound = (url: string): Promise<void> => {
  return playAudioWithErrorHandling(url);
};

export const generateBeep = (duration: number = 0.5, frequency: number = 440): void => {
  generateSampleAudio(duration, 'sine', frequency);
};

export const generateErrorSound = (): void => {
  generateSampleAudio(0.1, 'sawtooth', 220);
  setTimeout(() => generateSampleAudio(0.2, 'sawtooth', 180), 150);
};
