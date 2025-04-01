
// This file re-exports all audio utilities from the new structure
// for backward compatibility
import { checkAudioFileExists } from './audio/audioFileUtils';
import { playAudioWithErrorHandling } from './audio/audioPlaybackUtils';
import { createFallbackAudioIfNeeded, generateSampleAudio } from './audio/audioGenerationUtils';
import { 
  playSimulationEvent, 
  playSimulationAudio, 
  startSimulationAudioStream, 
  stopSimulationAudioStream,
  generateParticleSoundscape
} from './audio/simulationAudioUtils';

// Re-export all functions to maintain compatibility with existing code
export { 
  checkAudioFileExists,
  playAudioWithErrorHandling,
  createFallbackAudioIfNeeded,
  generateSampleAudio,
  // Simulation audio utilities
  playSimulationEvent,
  playSimulationAudio,
  startSimulationAudioStream,
  stopSimulationAudioStream,
  generateParticleSoundscape
};
