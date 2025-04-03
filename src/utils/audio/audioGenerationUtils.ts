
/**
 * Create a new audio context
 */
export function createAudioContext(): AudioContext {
  return new (window.AudioContext || (window as any).webkitAudioContext)();
}

/**
 * Generate a tone with specified parameters
 * @param context Audio context
 * @param frequency Frequency in Hz
 * @param type Oscillator type
 * @param duration Duration in seconds
 * @param volume Volume (0-1)
 */
export function generateTone(
  context: AudioContext,
  frequency: number = 440,
  type: OscillatorType = 'sine',
  duration: number = 0.5,
  volume: number = 0.5
): void {
  // Create oscillator and gain nodes
  const oscillator = context.createOscillator();
  const gainNode = context.createGain();
  
  // Configure oscillator
  oscillator.type = type;
  oscillator.frequency.value = frequency;
  
  // Configure gain (volume)
  gainNode.gain.value = 0;
  
  // Connect nodes
  oscillator.connect(gainNode);
  gainNode.connect(context.destination);
  
  // Start the oscillator
  oscillator.start();
  
  // Apply volume envelope
  gainNode.gain.setValueAtTime(0, context.currentTime);
  gainNode.gain.linearRampToValueAtTime(volume, context.currentTime + 0.01);
  gainNode.gain.linearRampToValueAtTime(0, context.currentTime + duration);
  
  // Stop the oscillator after duration
  oscillator.stop(context.currentTime + duration + 0.01);
  
  // Clean up
  setTimeout(() => {
    oscillator.disconnect();
    gainNode.disconnect();
  }, duration * 1000 + 100);
}

/**
 * Generate a sequence of tones
 * @param context Audio context
 * @param frequencies Array of frequencies in Hz
 * @param durations Array of durations in seconds
 * @param types Array of oscillator types
 * @param volumes Array of volumes (0-1)
 * @param intervalBetweenNotes Time between notes in seconds
 */
export function generateToneSequence(
  context: AudioContext,
  frequencies: number[],
  durations: number[] = [],
  types: OscillatorType[] = [],
  volumes: number[] = [],
  intervalBetweenNotes: number = 0.1
): void {
  // Default duration, type and volume if not specified
  const defaultDuration = 0.5;
  const defaultType = 'sine' as OscillatorType;
  const defaultVolume = 0.5;
  
  // Play each note in sequence
  frequencies.forEach((frequency, index) => {
    const duration = durations[index] || defaultDuration;
    const type = types[index] || defaultType;
    const volume = volumes[index] || defaultVolume;
    
    // Schedule each note
    setTimeout(() => {
      generateTone(context, frequency, type, duration, volume);
    }, index * (defaultDuration + intervalBetweenNotes) * 1000);
  });
}
