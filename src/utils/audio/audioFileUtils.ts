
/**
 * Check if an audio file exists
 */
export const checkAudioFileExists = async (filePath: string): Promise<boolean> => {
  try {
    const response = await fetch(filePath, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    console.error('Error checking audio file:', error);
    return false;
  }
};

/**
 * Get metadata for an audio file
 */
export const getAudioFileMetadata = async (filePath: string): Promise<any> => {
  try {
    // In a real implementation, this would extract metadata from the audio file
    // For now, just return a basic object
    return {
      exists: await checkAudioFileExists(filePath),
      path: filePath,
      filename: filePath.split('/').pop() || '',
      timestamp: Date.now()
    };
  } catch (error) {
    console.error('Error getting audio file metadata:', error);
    return null;
  }
};

/**
 * Get a list of available audio files
 */
export const getAvailableAudioFiles = async (directory: string = '/audio'): Promise<string[]> => {
  // This would typically call an API endpoint to list files
  // For now, return a static list
  return [
    `${directory}/particle_creation.mp3`,
    `${directory}/cluster_formation.mp3`,
    `${directory}/robot_evolution.mp3`
  ];
};
