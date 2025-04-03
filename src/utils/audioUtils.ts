
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
    // For now, return mock data
    return [
      'ambient_background.mp3',
      'particle_creation.mp3',
      'intent_fluctuation.mp3',
      'cluster_formation.mp3'
    ];
  } catch (error) {
    console.error('Error getting audio files:', error);
    return [];
  }
}

/**
 * Play a sound for a simulation event
 * @param eventType Type of event to play sound for
 * @param intensity Optional intensity of the sound (volume, pitch)
 */
export function playSimulationEventSound(eventType: string, intensity: number = 0.5): void {
  // Implementation for playing audio based on event
  console.log(`Playing sound for ${eventType} at intensity ${intensity}`);
  
  // Map event types to specific audio files
  const audioMap: Record<string, string> = {
    'particle_creation': '/audio/particle_creation.mp3',
    'particle_interaction': '/audio/particle_interaction.mp3',
    'cluster_formation': '/audio/cluster_formation.mp3',
    'intent_fluctuation': '/audio/intent_fluctuation.mp3',
    'inflation_event': '/audio/inflation_event.mp3',
    'robot_evolution': '/audio/robot_evolution.mp3'
  };
  
  if (audioMap[eventType]) {
    try {
      const audio = new Audio(audioMap[eventType]);
      audio.volume = Math.min(Math.max(intensity, 0.1), 1.0);
      audio.play().catch(e => console.error("Error playing audio:", e));
    } catch (e) {
      console.error("Error initializing audio:", e);
    }
  }
}

/**
 * Initialize the audio context (needed for Web Audio API)
 * Required to be called from a user interaction event
 */
export function initAudioContext(): void {
  try {
    // Create AudioContext if it doesn't exist
    if (typeof window !== 'undefined' && window.AudioContext) {
      const audioContext = new window.AudioContext();
      console.log("AudioContext initialized:", audioContext.state);
    }
  } catch (e) {
    console.error("Error initializing AudioContext:", e);
  }
}

/**
 * Play looping background audio
 * @param url URL of the audio file
 */
export function playLoopingAudio(url: string, id: string, volume: number = 0.5): void {
  try {
    const audioElement = document.getElementById(id) as HTMLAudioElement || new Audio();
    
    if (!document.getElementById(id)) {
      audioElement.id = id;
      audioElement.loop = true;
      audioElement.volume = volume;
      document.body.appendChild(audioElement);
    }
    
    audioElement.src = url;
    audioElement.play().catch(e => console.error("Error playing audio:", e));
  } catch (e) {
    console.error("Error with looping audio:", e);
  }
}

/**
 * Stop looping background audio
 */
export function stopLoopingAudio(id: string): void {
  try {
    const audioElement = document.getElementById(id) as HTMLAudioElement;
    if (audioElement) {
      audioElement.pause();
      audioElement.currentTime = 0;
    }
  } catch (e) {
    console.error("Error stopping audio:", e);
  }
}

/**
 * Set volume for looping audio
 */
export function setLoopingAudioVolume(id: string, volume: number): void {
  try {
    const audioElement = document.getElementById(id) as HTMLAudioElement;
    if (audioElement) {
      audioElement.volume = Math.min(Math.max(volume, 0), 1);
    }
  } catch (e) {
    console.error("Error setting audio volume:", e);
  }
}
