
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
  initAudioContext,
  generateInteractionAudio,
  generateFieldFluctuationAudio,
  generateParticleSoundscape,
  startSimulationAudioStream,
  stopSimulationAudioStream,
  isSimulationAudioPlaying,
  setSimulationAudioVolume,
  playSimulationBackgroundLoop
} from './simulationAudioUtils';

export {
  createAudioContext,
  generateTone,
  generateToneSequence
} from './audioGenerationUtils';

export {
  initSimulationAudio,
  setSimulationVolume,
  stopSimulationAudio,
  // Remove duplicate export of isSimulationAudioPlaying
  playInteractionSound,
  playIntentFluctuationSound,
  startParticleSoundscape,
  playParticleCreationSound,
  playEmergenceSound
} from './simulationAudioEvents';
