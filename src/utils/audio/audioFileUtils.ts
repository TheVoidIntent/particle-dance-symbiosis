
/**
 * Utility function to check if an audio file exists
 * @param url URL of the audio file to check
 * @returns Promise that resolves to an object indicating whether the file exists
 */
export async function checkAudioFileExists(url: string): Promise<{ exists: boolean; status?: number }> {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return { 
      exists: response.ok,
      status: response.status 
    };
  } catch (error) {
    console.error('Error checking audio file:', error);
    return { exists: false };
  }
}

/**
 * Get available audio files from a directory
 * @param directory The directory to look for audio files
 * @returns Array of audio file names
 */
export async function getAvailableAudioFiles(directory: string): Promise<string[]> {
  try {
    // In a real implementation, this would fetch from the server
    const audioFiles = [
      "Are you a Skeptic.wav",
      "The Composer.wav",
      "Deeper And Deeper.wav",
      "El Nutrino Chismoso.wav",
      "Fast way Down and Far.wav",
      "Filtrando Otra Vez.wav",
      "From THe Heart.wav",
      "Get to know ME.wav",
      "Git Yours.wav",
      "How Fast Can You Go.wav",
      "I go It From You.wav",
      "In Deep waters.wav",
      "The Intentional Universe.wav",
      "Is Your AI Really Learning.wav",
      "The Map.wav",
      "The Missing Peice.wav",
      "The Nexus.wav",
      "Particle Genesis.wav",
      "So Neat.wav",
      "The Sourse Bawl.wav",
      "Who Am I.wav",
      "The Why.wav",
      "cosmos.wav",
      "Intent as a Universal Information Filter (1) 1.wav",
      "Intent as a Universal Information Filter (2) (1)-1.wav",
      "Intent as a Universal Information Filter (2) (1)-2.wav",
      "Intent as a Universal Information Filter (2) copy.wav",
      "Intent as a Universal Information Filter (5).wav",
      "IntentSim_Podcast_Ep01.wav",
      "particle_genesis.wav"
    ];
    return audioFiles;
  } catch (error) {
    console.error('Error getting audio files:', error);
    return [];
  }
}
