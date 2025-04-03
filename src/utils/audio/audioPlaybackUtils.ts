
// Audio context for the application
let audioContext: AudioContext | null = null;
const audioElements: Map<string, HTMLAudioElement> = new Map();

/**
 * Initialize audio context
 */
export function initAudioContext(): AudioContext {
  if (!audioContext) {
    try {
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      console.log('Audio context initialized successfully');
    } catch (error) {
      console.error('Failed to initialize audio context:', error);
      throw new Error('Audio context initialization failed');
    }
  }
  return audioContext;
}

/**
 * Play a looping audio file
 * @param audioId Unique identifier for the audio
 * @param src Source URL for the audio file
 * @param volume Initial volume (0-1)
 */
export function playLoopingAudio(audioId: string, src: string, volume: number = 0.5): void {
  if (audioElements.has(audioId)) {
    console.log(`Audio ${audioId} is already playing, adjusting volume to ${volume}`);
    const audio = audioElements.get(audioId)!;
    audio.volume = volume;
    
    if (audio.paused) {
      audio.play().catch(error => {
        console.error(`Error playing audio ${audioId}:`, error);
      });
    }
    return;
  }
  
  try {
    const audio = new Audio(src);
    audio.loop = true;
    audio.volume = volume;
    audio.addEventListener('canplaythrough', () => {
      audio.play().catch(error => {
        console.error(`Error playing audio ${audioId}:`, error);
      });
    });
    audio.addEventListener('error', (error) => {
      console.error(`Error loading audio ${audioId}:`, error);
    });
    
    audioElements.set(audioId, audio);
  } catch (error) {
    console.error(`Error setting up audio ${audioId}:`, error);
  }
}

/**
 * Stop a looping audio
 * @param audioId Unique identifier for the audio
 */
export function stopLoopingAudio(audioId: string): void {
  if (audioElements.has(audioId)) {
    const audio = audioElements.get(audioId)!;
    audio.pause();
    audio.currentTime = 0;
    console.log(`Stopped audio ${audioId}`);
  }
}

/**
 * Set volume for a looping audio
 * @param audioId Unique identifier for the audio
 * @param volume Volume level (0-1)
 */
export function setLoopingAudioVolume(audioId: string, volume: number): void {
  if (audioElements.has(audioId)) {
    const audio = audioElements.get(audioId)!;
    audio.volume = Math.max(0, Math.min(1, volume));
    console.log(`Set volume to ${volume} for audio ${audioId}`);
  }
}
