
/**
 * Check if an audio file exists
 */
export function checkAudioFileExists(filePath: string): Promise<boolean> {
  return new Promise((resolve) => {
    fetch(filePath, { method: 'HEAD' })
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
 */
export function getAudioFileMetadata(filePath: string): Promise<{ 
  exists: boolean;
  contentType?: string;
  contentLength?: number;
}> {
  return new Promise((resolve) => {
    fetch(filePath, { method: 'HEAD' })
      .then(response => {
        if (response.ok) {
          resolve({
            exists: true,
            contentType: response.headers.get('content-type') || undefined,
            contentLength: parseInt(response.headers.get('content-length') || '0') || undefined
          });
        } else {
          resolve({ exists: false });
        }
      })
      .catch(() => {
        resolve({ exists: false });
      });
  });
}

/**
 * Get a list of available audio files (mock implementation)
 */
export function getAvailableAudioFiles(): string[] {
  // In a real app, this would fetch from an API or read from a directory
  return [
    'particle_creation.mp3',
    'particle_interaction.mp3',
    'cluster_formation.mp3',
    'inflation_event.mp3',
    'intent_spike.mp3'
  ];
}
