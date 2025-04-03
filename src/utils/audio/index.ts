
// Export all audio-related utilities for easy imports
export {
  playLoopingAudio,
  stopLoopingAudio,
  setLoopingAudioVolume
} from './audioPlaybackUtils';

export {
  getAvailableAudioFiles,
  checkAudioFileExists
} from './audioFileUtils';

export {
  playSimulationEventSound,
  initAudioContext 
} from './simulationAudioUtils';

export {
  createAudioContext,
  generateTone,
  generateToneSequence
} from './audioGenerationUtils';
