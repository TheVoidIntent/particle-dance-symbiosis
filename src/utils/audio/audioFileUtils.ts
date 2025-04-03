
/**
 * Get available audio files from a directory
 * @param directory The directory to check for audio files
 * @returns Promise resolving to an array of available audio files
 */
export async function getAvailableAudioFiles(directory: string): Promise<string[]> {
  // This is a placeholder implementation since browser JavaScript can't directly
  // read directory contents due to security restrictions
  
  // In a real implementation, this would call an API endpoint that returns
  // a list of available audio files
  
  // For demo purposes, return some dummy files
  return [
    'ambient_background.mp3',
    'particle_creation.mp3',
    'intent_fluctuation.mp3',
    'cluster_formation.mp3',
    'inflation_event.mp3',
    'robot_evolution.mp3'
  ];
}

/**
 * Check if an audio file exists and is playable
 * @param url URL of the audio file to check
 * @returns Promise resolving to an object with exists flag
 */
export async function checkAudioFileExists(url: string): Promise<{ exists: boolean, status?: number }> {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return {
      exists: response.ok,
      status: response.status
    };
  } catch (error) {
    console.error('Error checking audio file existence:', error);
    return { exists: false };
  }
}
