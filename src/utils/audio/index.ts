
// Export audio utilities from individual files
export { 
  playSimulationAudio,
  playSimulationEvent,
  generateParticleSoundscape,
  startSimulationAudioStream,
  stopSimulationAudioStream,
  isSimulationAudioPlaying,
  setSimulationAudioVolume
} from './simulationAudioUtils';

export {
  checkAudioFileExists,
  getAudioFileMetadata
} from './audioFileUtils';

export {
  generateSampleAudio
} from './audioGenerationUtils';

// Export from audioPlaybackUtils with unique names
export {
  playAudio,
  playAudioWithErrorHandling,
  playLoopingAudio,
  stopLoopingAudio,
  setLoopingAudioVolume,
  resumeAudioContext,
  createFallbackAudioIfNeeded as createPlaybackFallbackAudio
} from './audioPlaybackUtils';

// Export initialization function with namespace
export { initAudioContext } from './audioPlaybackUtils';
