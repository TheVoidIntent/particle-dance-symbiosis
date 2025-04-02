
/**
 * Utilities for audio playback
 */

// Shared audio context for all playback
let audioContext: AudioContext | null = null;

// Initialize or get the audio context
export const initAudioContext = (): AudioContext => {
  if (!audioContext) {
    try {
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      console.log('Audio context initialized successfully');
    } catch (error) {
      console.error('Failed to create audio context:', error);
      throw error;
    }
  }
  return audioContext;
};

// Resume the audio context (needed for autoplay policy)
export const resumeAudioContext = async (): Promise<boolean> => {
  try {
    const context = initAudioContext();
    if (context.state === 'suspended') {
      await context.resume();
      console.log('Audio context resumed successfully');
    }
    return true;
  } catch (error) {
    console.error('Failed to resume audio context:', error);
    return false;
  }
};

// Play an audio file with basic error handling
export const playAudio = async (url: string): Promise<void> => {
  try {
    await resumeAudioContext();
    const audio = new Audio(url);
    audio.volume = 0.5; // Default volume
    return audio.play();
  } catch (error) {
    console.error(`Error playing audio ${url}:`, error);
    throw error;
  }
};

// Play audio with fallback for error handling
export const playAudioWithErrorHandling = async (url: string): Promise<boolean> => {
  try {
    await playAudio(url);
    return true;
  } catch (error) {
    console.warn(`Error playing ${url}, using fallback:`, error);
    createFallbackAudioIfNeeded();
    return false;
  }
};

// For looping background audio
let loopingAudio: HTMLAudioElement | null = null;
let loopingGainNode: GainNode | null = null;
let loopingSource: AudioBufferSourceNode | null = null;

// Play looping audio (for background sounds)
export const playLoopingAudio = async (url: string, volume: number = 0.3): Promise<boolean> => {
  try {
    stopLoopingAudio(); // Stop any existing looping audio
    
    const context = initAudioContext();
    await resumeAudioContext();
    
    // Fetch the audio data
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await context.decodeAudioData(arrayBuffer);
    
    // Create source and gain nodes
    loopingSource = context.createBufferSource();
    loopingGainNode = context.createGain();
    
    // Connect nodes
    loopingSource.buffer = audioBuffer;
    loopingSource.loop = true;
    loopingSource.connect(loopingGainNode);
    loopingGainNode.connect(context.destination);
    
    // Set volume and start
    loopingGainNode.gain.setValueAtTime(volume, context.currentTime);
    loopingSource.start(0);
    
    return true;
  } catch (error) {
    console.error('Error playing looping audio:', error);
    return false;
  }
};

// Stop the looping audio
export const stopLoopingAudio = (): void => {
  try {
    if (loopingSource) {
      loopingSource.stop();
      loopingSource.disconnect();
      loopingSource = null;
    }
    
    if (loopingGainNode) {
      loopingGainNode.disconnect();
      loopingGainNode = null;
    }
    
    if (loopingAudio) {
      loopingAudio.pause();
      loopingAudio.currentTime = 0;
      loopingAudio = null;
    }
  } catch (error) {
    console.error('Error stopping looping audio:', error);
  }
};

// Adjust looping audio volume
export const setLoopingAudioVolume = (volume: number): void => {
  try {
    if (loopingGainNode && audioContext) {
      loopingGainNode.gain.setValueAtTime(
        Math.max(0, Math.min(1, volume)), 
        audioContext.currentTime
      );
    } else if (loopingAudio) {
      loopingAudio.volume = Math.max(0, Math.min(1, volume));
    }
  } catch (error) {
    console.error('Error setting looping audio volume:', error);
  }
};

// Create a fallback audio for error cases
export const createFallbackAudioIfNeeded = (): void => {
  try {
    const context = initAudioContext();
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(440, context.currentTime);
    
    gainNode.gain.setValueAtTime(0, context.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.2, context.currentTime + 0.05);
    gainNode.gain.linearRampToValueAtTime(0, context.currentTime + 0.3);
    
    oscillator.connect(gainNode);
    gainNode.connect(context.destination);
    
    oscillator.start();
    oscillator.stop(context.currentTime + 0.3);
  } catch (error) {
    console.error('Error creating fallback audio:', error);
  }
};
