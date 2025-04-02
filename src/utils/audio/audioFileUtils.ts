
import { toast } from "sonner";

/**
 * Check if an audio file exists and can be loaded
 */
export const checkAudioFileExists = async (url: string): Promise<{ exists: boolean; error?: any }> => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return { 
      exists: response.ok,
    };
  } catch (error) {
    console.error(`Error checking audio file ${url}:`, error);
    return { 
      exists: false, 
      error 
    };
  }
};

/**
 * Get all available audio files in a directory
 * Note: This is a stub since we can't directly list files from the client
 * In a real implementation, this would need server API support
 */
export const getAvailableAudioFiles = async (directory: string): Promise<string[]> => {
  // This is a placeholder that would normally require server-side implementation
  // For now, we'll return a hardcoded list of known files
  const knownFiles = [
    'positive_particle_birth.mp3',
    'negative_particle_birth.mp3',
    'neutral_particle_birth.mp3', 
    'interaction_low.mp3',
    'interaction_medium.mp3',
    'interaction_high.mp3',
    'anomaly_detected.mp3',
    'inflation_event.mp3',
    'field_fluctuation.mp3',
    'ambience_loop.mp3'
  ];
  
  // Filter to only return files that actually exist
  const existingFiles: string[] = [];
  
  for (const file of knownFiles) {
    const { exists } = await checkAudioFileExists(`/audio/intentsim_page/${file}`);
    if (exists) {
      existingFiles.push(file);
    }
  }
  
  return existingFiles;
};

/**
 * Get audio file metadata (duration, format, etc.)
 * This is a stub as browser API limitations make this difficult without server support
 */
export const getAudioFileMetadata = async (url: string): Promise<{ 
  duration?: number; 
  format?: string;
  sampleRate?: number;
  error?: any;
}> => {
  try {
    // Create an audio element to load the file
    const audio = new Audio();
    audio.src = url;
    
    // Return a promise that resolves when metadata is loaded
    return new Promise((resolve) => {
      audio.addEventListener('loadedmetadata', () => {
        resolve({
          duration: audio.duration,
          format: url.split('.').pop() || 'unknown',
          sampleRate: 44100 // Default value as this isn't easily accessible
        });
      });
      
      audio.addEventListener('error', (error) => {
        resolve({ 
          error: error 
        });
      });
      
      // Set a timeout in case the metadata loading hangs
      setTimeout(() => {
        if (!audio.duration) {
          resolve({ 
            error: new Error('Timeout while loading audio metadata') 
          });
        }
      }, 5000);
    });
  } catch (error) {
    console.error(`Error getting audio metadata for ${url}:`, error);
    return { 
      error 
    };
  }
};
