
let audioContext: AudioContext | null = null;
let gainNode: GainNode | null = null;
let loopingAudio: { source: AudioBufferSourceNode | null; url: string } = { source: null, url: '' };

// Initialize audio context
export function initAudioContext(): AudioContext {
  if (audioContext) return audioContext;
  
  try {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    gainNode = audioContext.createGain();
    gainNode.connect(audioContext.destination);
    console.log('Audio context initialized');
    return audioContext;
  } catch (error) {
    console.error('Failed to create audio context:', error);
    throw error;
  }
}

// Load audio file
export async function loadAudioFile(url: string): Promise<AudioBuffer> {
  if (!audioContext) initAudioContext();
  
  try {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext!.decodeAudioData(arrayBuffer);
    return audioBuffer;
  } catch (error) {
    console.error('Error loading audio file:', error);
    throw error;
  }
}

// Play audio once
export async function playAudio(url: string, volume: number = 1.0): Promise<void> {
  if (!audioContext) initAudioContext();
  
  try {
    const audioBuffer = await loadAudioFile(url);
    const source = audioContext!.createBufferSource();
    source.buffer = audioBuffer;
    
    const localGainNode = audioContext!.createGain();
    localGainNode.gain.value = volume;
    
    source.connect(localGainNode);
    localGainNode.connect(audioContext!.destination);
    
    source.start(0);
    return Promise.resolve();
  } catch (error) {
    console.error('Error playing audio:', error);
    return Promise.reject(error);
  }
}

// Play looping audio
export async function playLoopingAudio(url: string, volume: number = 1.0): Promise<void> {
  if (!audioContext) initAudioContext();
  
  // Stop any currently playing looping audio
  if (loopingAudio.source) {
    try {
      loopingAudio.source.stop();
      loopingAudio.source = null;
    } catch (e) {
      // Ignore errors from already stopped sources
    }
  }
  
  try {
    const audioBuffer = await loadAudioFile(url);
    const source = audioContext!.createBufferSource();
    source.buffer = audioBuffer;
    source.loop = true;
    
    if (!gainNode) {
      gainNode = audioContext!.createGain();
      gainNode.connect(audioContext!.destination);
    }
    
    gainNode.gain.value = volume;
    source.connect(gainNode);
    
    source.start(0);
    loopingAudio = { source, url };
    
    return Promise.resolve();
  } catch (error) {
    console.error('Error playing looping audio:', error);
    return Promise.reject(error);
  }
}

// Stop looping audio
export function stopLoopingAudio(): void {
  if (loopingAudio.source) {
    try {
      loopingAudio.source.stop();
      loopingAudio.source = null;
    } catch (e) {
      // Ignore errors from already stopped sources
    }
  }
}

// Set looping audio volume
export function setLoopingAudioVolume(volume: number): void {
  if (gainNode) {
    gainNode.gain.value = volume;
  }
}

// Resume audio context (needed after user interaction in some browsers)
export function resumeAudioContext(): Promise<void> {
  if (audioContext && audioContext.state === 'suspended') {
    return audioContext.resume();
  }
  return Promise.resolve();
}

// Get a list of available audio files
export function getAvailableAudioFiles(directory: string): Promise<string[]> {
  // This is a mock implementation - in a real app, you'd need a server endpoint to list files
  // For now, return some hardcoded examples
  return Promise.resolve([
    'ambient_loop.mp3',
    'particle_creation.mp3',
    'particle_interaction.mp3',
    'field_fluctuation.mp3',
    'anomaly_detected.mp3',
    'simulation_start.mp3'
  ]);
}
