
// Export all audio-related utilities for easy imports
export {
  playLoopingAudio,
  stopLoopingAudio,
  setLoopingAudioVolume,
  initAudioContext
} from './audioPlaybackUtils';

export {
  getAvailableAudioFiles,
  preloadAudioFiles,
  checkAudioFileExists,
  getAudioFileMetadata
} from './audioFileUtils';

export {
  generateInteractionAudio,
  generateFieldFluctuationAudio,
  playSimulationEventSound,
  playSimulationEvent,
  generateParticleSoundscape,
  startSimulationAudioStream,
  stopSimulationAudioStream,
  isSimulationAudioPlaying,
  setSimulationAudioVolume,
  initAudioContext as initSimulationAudioContext
} from './simulationAudioUtils';

export {
  createAudioContext,
  generateTone,
  generateToneSequence
} from './audioGenerationUtils';
