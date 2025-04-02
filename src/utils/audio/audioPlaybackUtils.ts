import { initAudioContext } from './simulationAudioUtils';

// Map to keep track of looping sounds
const loopingSounds: Map<string, { source: AudioBufferSourceNode, gain: GainNode }> = new Map();

/**
 * Play an audio buffer
 */
export const playAudio = (buffer: AudioBuffer, volume: number = 0.5): void => {
  const audioContext = initAudioContext();
  
  try {
    const source = audioContext.createBufferSource();
    const gainNode = audioContext.createGain();
    
    source.buffer = buffer;
    gainNode.gain.value = volume;
    
    source.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    source.start();
  } catch (error) {
    console.error('Error playing audio:', error);
  }
};

/**
 * Play audio with error handling
 */
export const playAudioWithErrorHandling = (buffer: AudioBuffer | null, volume: number = 0.5): void => {
  if (!buffer) {
    console.warn('Attempted to play null audio buffer');
    return;
  }
  
  try {
    playAudio(buffer, volume);
  } catch (error) {
    console.error('Error playing audio with error handling:', error);
    createFallbackAudioIfNeeded();
  }
};

/**
 * Play a looping audio buffer
 */
export const playLoopingAudio = (buffer: AudioBuffer, id: string, volume: number = 0.5): void => {
  // Stop any existing loop with the same ID
  if (loopingSounds.has(id)) {
    stopLoopingAudio(id);
  }
  
  const audioContext = initAudioContext();
  
  try {
    const source = audioContext.createBufferSource();
    const gainNode = audioContext.createGain();
    
    source.buffer = buffer;
    source.loop = true;
    gainNode.gain.value = volume;
    
    source.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    source.start();
    
    loopingSounds.set(id, { source, gain: gainNode });
  } catch (error) {
    console.error(`Error playing looping audio ${id}:`, error);
  }
};

/**
 * Stop a looping audio
 */
export const stopLoopingAudio = (id: string): void => {
  const sound = loopingSounds.get(id);
  
  if (sound) {
    try {
      sound.source.stop();
      loopingSounds.delete(id);
    } catch (error) {
      console.error(`Error stopping looping audio ${id}:`, error);
    }
  }
};

/**
 * Set the volume of a looping audio
 */
export const setLoopingAudioVolume = (id: string, volume: number): void => {
  const sound = loopingSounds.get(id);
  
  if (sound) {
    try {
      sound.gain.gain.value = volume;
    } catch (error) {
      console.error(`Error setting volume for looping audio ${id}:`, error);
    }
  }
};

/**
 * Resume audio context (useful for handling autoplay restrictions)
 */
export const resumeAudioContext = async (): Promise<boolean> => {
  const audioContext = initAudioContext();
  
  if (audioContext.state === 'suspended') {
    try {
      await audioContext.resume();
      return true;
    } catch (error) {
      console.error('Error resuming audio context:', error);
      return false;
    }
  }
  
  return audioContext.state === 'running';
};

/**
 * Create a fallback audio in case of errors
 */
export const createFallbackAudioIfNeeded = (): void => {
  const audioContext = initAudioContext();
  
  try {
    // Create a silent buffer
    const buffer = audioContext.createBuffer(1, audioContext.sampleRate * 0.1, audioContext.sampleRate);
    const source = audioContext.createBufferSource();
    
    source.buffer = buffer;
    source.connect(audioContext.destination);
    
    source.start();
    source.stop(audioContext.currentTime + 0.1);
    
    console.log('Created fallback audio');
  } catch (error) {
    console.error('Error creating fallback audio:', error);
  }
};
