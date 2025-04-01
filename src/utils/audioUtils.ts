
// This file re-exports all audio utilities from the new structure
// for backward compatibility
import { checkAudioFileExists } from './audio/audioFileUtils';
import { playAudioWithErrorHandling } from './audio/audioPlaybackUtils';
import { createFallbackAudioIfNeeded, generateSampleAudio } from './audio/audioGenerationUtils';

// Re-export all functions to maintain compatibility with existing code
export { 
  checkAudioFileExists,
  playAudioWithErrorHandling,
  createFallbackAudioIfNeeded,
  generateSampleAudio
};
