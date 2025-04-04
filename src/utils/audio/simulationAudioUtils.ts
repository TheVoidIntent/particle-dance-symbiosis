
/**
 * Play a sound for a simulation event
 * @param eventType Type of event to play sound for
 * @param intensity Optional intensity of the sound (volume, pitch)
 */
export function playSimulationEventSound(eventType: string, intensity: number = 0.5): void {
  // Map event types to specific audio files (these are placeholders)
  const audioMap: Record<string, string> = {
    'particle_creation': '/audio/sample-placeholder.mp3',
    'particle_interaction': '/audio/sample-placeholder.mp3',
    'cluster_formation': '/audio/sample-placeholder.mp3',
    'intent_fluctuation': '/audio/sample-placeholder.mp3',
    'inflation_event': '/audio/sample-placeholder.mp3',
    'robot_evolution': '/audio/sample-placeholder.mp3'
  };
  
  if (audioMap[eventType]) {
    try {
      const audio = new Audio(audioMap[eventType]);
      audio.volume = Math.min(Math.max(intensity, 0.1), 1.0);
      
      // Only attempt to play if we have a valid URL
      if (audio.src && !audio.src.endsWith('undefined')) {
        audio.play().catch(e => console.error("Error playing audio:", e));
      }
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

// Placeholder functions to maintain API compatibility
export function generateInteractionAudio(): void {}
export function generateFieldFluctuationAudio(): void {}
export function generateParticleSoundscape(): void {}
export function startSimulationAudioStream(): void {}
export function stopSimulationAudioStream(): void {}
export function isSimulationAudioPlaying(): boolean { return false; }
export function setSimulationAudioVolume(): void {}
export function playSimulationBackgroundLoop(): void {}
