
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
  getAudioFileMetadata,
  getAvailableAudioFiles
} from './audioFileUtils';

export {
  generateSampleAudio,
  generateParticleTone
} from './audioGenerationUtils';

// Export from audioPlaybackUtils
export {
  playAudio,
  playAudioWithErrorHandling,
  playLoopingAudio,
  stopLoopingAudio,
  setLoopingAudioVolume,
  resumeAudioContext,
  createFallbackAudioIfNeeded as createPlaybackFallbackAudio,
  initAudioContext
} from './audioPlaybackUtils';
