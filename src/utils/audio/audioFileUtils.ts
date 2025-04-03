
/**
 * Get available audio files for the simulation
 */
export function getAvailableAudioFiles(): string[] {
  return [
    'ambient_field.mp3',
    'particle_creation.mp3',
    'particle_interaction.mp3',
    'cluster_formation.mp3',
    'inflation_event.mp3',
    'anomaly_detection.mp3',
    'robot_evolution.mp3'
  ];
}

/**
 * Preload audio files
 * @param files Array of audio file paths to preload
 */
export function preloadAudioFiles(files: string[] = getAvailableAudioFiles()): Promise<void[]> {
  return Promise.all(
    files.map(file => 
      new Promise<void>((resolve, reject) => {
        try {
          const audio = new Audio(`/audio/${file}`);
          audio.addEventListener('canplaythrough', () => {
            console.log(`Preloaded audio file: ${file}`);
            resolve();
          });
          audio.addEventListener('error', (error) => {
            console.error(`Error preloading audio file ${file}:`, error);
            reject(error);
          });
          // Trigger loading
          audio.load();
        } catch (error) {
          console.error(`Error setting up preload for audio file ${file}:`, error);
          reject(error);
        }
      })
    )
  );
}

/**
 * Check if an audio file exists
 * @param filename The filename to check
 */
export function checkAudioFileExists(filename: string): Promise<boolean> {
  return new Promise((resolve) => {
    fetch(`/audio/${filename}`)
      .then(response => {
        resolve(response.ok);
      })
      .catch(() => {
        resolve(false);
      });
  });
}

/**
 * Get metadata for an audio file
 * @param filename The filename to get metadata for
 */
export function getAudioFileMetadata(filename: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const audio = new Audio(`/audio/${filename}`);
    
    audio.addEventListener('loadedmetadata', () => {
      resolve({
        duration: audio.duration,
        channels: 2, // Assumption, we can't detect this from the Audio API
        sampleRate: 44100, // Assumption, we can't detect this from the Audio API
        format: filename.split('.').pop(),
        filename
      });
    });
    
    audio.addEventListener('error', (error) => {
      reject(error);
    });
    
    audio.load();
  });
}
