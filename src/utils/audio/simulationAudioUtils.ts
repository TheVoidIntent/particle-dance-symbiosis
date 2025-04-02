
// Audio context for browser audio API
let audioContext: AudioContext | null = null;
const audioSources: { [key: string]: AudioBufferSourceNode } = {};
const audioBuffers: { [key: string]: AudioBuffer } = {};
const audioVolumes: { [key: string]: GainNode } = {};

// Initialize audio context (needs to be called after user interaction)
export function initAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    console.log('Audio context initialized');
  }
  return audioContext;
}

// Load audio file and return a promise that resolves to an AudioBuffer
export async function loadAudio(url: string): Promise<AudioBuffer> {
  if (!audioContext) initAudioContext();
  
  // Return cached buffer if available
  if (audioBuffers[url]) {
    return audioBuffers[url];
  }
  
  try {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext!.decodeAudioData(arrayBuffer);
    
    // Cache the buffer
    audioBuffers[url] = audioBuffer;
    return audioBuffer;
  } catch (error) {
    console.error('Error loading audio:', error);
    throw error;
  }
}

// Play a sound with options
export async function playSound(
  url: string, 
  options: { 
    volume?: number; 
    loop?: boolean; 
    playbackRate?: number;
    detune?: number;
  } = {}
): Promise<void> {
  if (!audioContext) initAudioContext();
  
  try {
    const buffer = await loadAudio(url);
    
    // Create source node
    const source = audioContext!.createBufferSource();
    source.buffer = buffer;
    source.loop = options.loop || false;
    
    if (options.playbackRate) source.playbackRate.value = options.playbackRate;
    if (options.detune) source.detune.value = options.detune;
    
    // Create gain node for volume
    const gainNode = audioContext!.createGain();
    gainNode.gain.value = options.volume !== undefined ? options.volume : 1.0;
    
    // Connect nodes
    source.connect(gainNode);
    gainNode.connect(audioContext!.destination);
    
    // Start playback
    source.start(0);
    
    // Store for later reference
    const id = `${url}_${Date.now()}`;
    audioSources[id] = source;
    audioVolumes[id] = gainNode;
    
    // Clean up when done
    source.onended = () => {
      delete audioSources[id];
      delete audioVolumes[id];
    };
    
    return Promise.resolve();
  } catch (error) {
    console.error('Error playing sound:', error);
    return Promise.reject(error);
  }
}

// Play event-based sounds
export function playSimulationEvent(
  eventType: 'particle_creation' | 'particle_interaction' | 'field_fluctuation' | 'anomaly_detected' | 'inflation_event',
  data?: any
): void {
  // Make sure context is initialized
  if (!audioContext || audioContext.state === 'suspended') {
    initAudioContext();
    audioContext?.resume();
  }
  
  const baseVolume = 0.2;
  
  switch (eventType) {
    case 'particle_creation':
      const charge = data?.charge || 'neutral';
      const soundUrl = charge === 'positive' 
        ? '/audio/positive_creation.mp3'
        : charge === 'negative' 
          ? '/audio/negative_creation.mp3'
          : '/audio/neutral_creation.mp3';
      
      playSound(soundUrl, { 
        volume: baseVolume * 0.8,
        playbackRate: 1.0 + Math.random() * 0.2 - 0.1
      });
      break;
      
    case 'particle_interaction':
      const intensity = data?.intensity || 0.5;
      playSound('/audio/interaction.mp3', { 
        volume: baseVolume * intensity,
        playbackRate: 0.8 + intensity * 0.4
      });
      break;
      
    case 'field_fluctuation':
      const magnitude = data?.magnitude || 0.5;
      playSound('/audio/fluctuation.mp3', { 
        volume: baseVolume * magnitude * 0.7,
        playbackRate: 0.7 + magnitude * 0.6
      });
      break;
      
    case 'anomaly_detected':
      const severity = data?.severity || 0.5;
      playSound('/audio/anomaly.mp3', { 
        volume: baseVolume * (0.8 + severity * 0.4),
        playbackRate: 0.9 + severity * 0.2
      });
      break;
      
    case 'inflation_event':
      playSound('/audio/inflation.mp3', { 
        volume: baseVolume * 1.2,
        playbackRate: 1.0
      });
      break;
      
    default:
      console.warn(`Unknown event type: ${eventType}`);
  }
}

// Stop all audio
export function stopAllAudio(): void {
  Object.values(audioSources).forEach(source => {
    try {
      source.stop();
    } catch (e) {
      // Ignore errors from already stopped sources
    }
  });
}

// Suspend audio context to save resources
export function suspendAudio(): void {
  if (audioContext) {
    audioContext.suspend();
  }
}

// Resume audio context
export function resumeAudio(): void {
  if (audioContext) {
    audioContext.resume();
  }
}
