
// Export all audio utilities from this index file
export * from './audioFileUtils';
export * from './audioGenerationUtils';
export * from './simulationAudioUtils';

// Export from audioPlaybackUtils but rename the duplicated function
import { 
  playAudioWithErrorHandling,
  createFallbackAudioIfNeeded as createFallbackAudio 
} from './audioPlaybackUtils';

export {
  playAudioWithErrorHandling,
  createFallbackAudio
};
