
// Export all audio utilities from this index file
export * from './audioFileUtils';
export * from './audioGenerationUtils';
export * from './simulationAudioUtils';
export * from './audioPlaybackUtils';

// Re-export specific functions with new names to avoid conflicts
import { 
  initAudioContext as initPlaybackAudioContext,
  getAvailableAudioFiles as getPlaybackAudioFiles,
  createFallbackAudioIfNeeded as createPlaybackFallbackAudio
} from './audioPlaybackUtils';

export {
  initPlaybackAudioContext,
  getPlaybackAudioFiles,
  createPlaybackFallbackAudio
};
