
import { initAudioContext } from "./simulationAudioUtils";

/**
 * Play audio from buffer with volume control
 */
export function playAudio(
  buffer: AudioBuffer,
  volume: number = 0.5,
  loop: boolean = false
): { source: AudioBufferSourceNode; gain: GainNode } {
  const context = initAudioContext();
  
  // Create source and gain nodes
  const source = context.createBufferSource();
  const gainNode = context.createGain();
  
  // Set buffer and loop
  source.buffer = buffer;
  source.loop = loop;
  
  // Set volume
  gainNode.gain.value = volume;
  
  // Connect nodes
  source.connect(gainNode);
  gainNode.connect(context.destination);
  
  // Start playback
  source.start(0);
  
  return { source, gain: gainNode };
}

/**
 * Play audio with error handling
 */
export function playAudioWithErrorHandling(
  buffer: AudioBuffer | null,
  volume: number = 0.5,
  onError?: () => void
): { source?: AudioBufferSourceNode; gain?: GainNode } {
  if (!buffer) {
    console.error("Audio buffer is null or undefined");
    if (onError) onError();
    return {};
  }
  
  try {
    return playAudio(buffer, volume);
  } catch (error) {
    console.error("Failed to play audio:", error);
    if (onError) onError();
    return {};
  }
}

/**
 * Play audio from URL
 */
export async function playAudioFromURL(
  url: string,
  volume: number = 0.5
): Promise<{ source: AudioBufferSourceNode; gain: GainNode } | null> {
  const context = initAudioContext();
  
  try {
    // Fetch audio data
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    
    // Decode audio data
    const audioBuffer = await context.decodeAudioData(arrayBuffer);
    
    // Create source and gain nodes
    const source = context.createBufferSource();
    const gainNode = context.createGain();
    
    // Set buffer
    source.buffer = audioBuffer;
    
    // Set volume
    gainNode.gain.value = volume;
    
    // Connect nodes
    source.connect(gainNode);
    gainNode.connect(context.destination);
    
    // Start playback
    source.start(0);
    
    return { source, gain: gainNode };
  } catch (error) {
    console.error("Error playing audio from URL:", error);
    return null;
  }
}

/**
 * Play looping audio with controllable parameters
 */
let loopingSource: AudioBufferSourceNode | null = null;
let loopingGain: GainNode | null = null;

export function playLoopingAudio(
  buffer: AudioBuffer,
  volume: number = 0.3
): void {
  // Stop any currently playing looping audio
  stopLoopingAudio();
  
  const context = initAudioContext();
  
  // Create source and gain nodes
  const source = context.createBufferSource();
  const gainNode = context.createGain();
  
  // Set buffer and loop
  source.buffer = buffer;
  source.loop = true;
  
  // Set volume
  gainNode.gain.value = volume;
  
  // Connect nodes
  source.connect(gainNode);
  gainNode.connect(context.destination);
  
  // Start playback
  source.start(0);
  
  // Store references
  loopingSource = source;
  loopingGain = gainNode;
}

/**
 * Stop currently playing looping audio
 */
export function stopLoopingAudio(): void {
  if (loopingSource) {
    try {
      loopingSource.stop();
      loopingSource = null;
      loopingGain = null;
    } catch (error) {
      console.error("Error stopping looping audio:", error);
    }
  }
}

/**
 * Set volume of currently playing looping audio
 */
export function setLoopingAudioVolume(volume: number): void {
  if (loopingGain) {
    loopingGain.gain.value = Math.max(0, Math.min(1, volume));
  }
}

/**
 * Resume audio context if suspended
 */
export async function resumeAudioContext(): Promise<boolean> {
  const context = initAudioContext();
  
  if (context.state === 'suspended') {
    try {
      await context.resume();
      return true;
    } catch (error) {
      console.error("Failed to resume audio context:", error);
      return false;
    }
  }
  
  return context.state === 'running';
}

/**
 * Create fallback audio for iOS and other platforms that require user interaction
 */
export function createFallbackAudioIfNeeded(): boolean {
  const context = initAudioContext();
  
  try {
    // Create a short silent buffer
    const buffer = context.createBuffer(1, context.sampleRate * 0.1, context.sampleRate);
    const source = context.createBufferSource();
    
    // Connect and play
    source.buffer = buffer;
    source.connect(context.destination);
    source.start(context.currentTime);
    
    return true;
  } catch (error) {
    console.error("Error creating fallback audio:", error);
    return false;
  }
}
