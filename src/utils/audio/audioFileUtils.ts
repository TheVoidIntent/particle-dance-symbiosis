
/**
 * Check if an audio file exists
 * @param path Path to the audio file
 * @returns Object with exists property
 */
export const checkAudioFileExists = async (path: string): Promise<{exists: boolean}> => {
  try {
    const response = await fetch(path, { method: 'HEAD' });
    return { exists: response.ok };
  } catch (error) {
    console.error('Error checking audio file:', error);
    return { exists: false };
  }
};

/**
 * Get audio file metadata
 * @param path Path to the audio file
 * @returns Object with metadata
 */
export const getAudioFileMetadata = async (path: string): Promise<{
  duration: number;
  size: number;
  exists: boolean;
}> => {
  try {
    const response = await fetch(path, { method: 'HEAD' });
    
    if (!response.ok) {
      return { duration: 0, size: 0, exists: false };
    }
    
    const contentLength = response.headers.get('Content-Length');
    const size = contentLength ? parseInt(contentLength, 10) : 0;
    
    // Creating an Audio element to get duration
    const audio = new Audio(path);
    
    return new Promise((resolve) => {
      audio.addEventListener('loadedmetadata', () => {
        resolve({
          duration: audio.duration,
          size,
          exists: true
        });
      });
      
      audio.addEventListener('error', () => {
        resolve({
          duration: 0,
          size,
          exists: true
        });
      });
    });
  } catch (error) {
    console.error('Error getting audio metadata:', error);
    return { duration: 0, size: 0, exists: false };
  }
};

/**
 * Get a list of available audio files
 * @param directory Directory to search in
 * @returns Array of file paths
 */
export const getAvailableAudioFiles = async (directory: string): Promise<string[]> => {
  try {
    // In a real app, this would make an API call to get available files
    // For now, we'll return some mock files
    return [
      'ambient_1.mp3',
      'particle_creation.mp3',
      'particle_interaction.mp3',
      'cluster_formation.mp3',
      'inflation_event.mp3'
    ];
  } catch (error) {
    console.error('Error getting audio files:', error);
    return [];
  }
};
