
/**
 * Create an audio context for audio generation
 */
let audioContextInstance: AudioContext | null = null;

export function createAudioContext(): AudioContext | null {
  try {
    if (!audioContextInstance) {
      audioContextInstance = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextInstance;
  } catch (e) {
    console.error('Failed to create AudioContext', e);
    return null;
  }
}

/**
 * Generate a simple sine wave tone
 * @param frequency The frequency of the tone in Hz
 * @param duration The duration of the tone in seconds
 * @param volume The volume of the tone (0-1)
 */
export function generateTone(frequency: number, duration: number, volume: number = 0.5): void {
  const audioContext = createAudioContext();
  if (!audioContext) return;
  
  try {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.value = frequency;
    
    gainNode.gain.value = volume;
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + duration);
  } catch (e) {
    console.error('Error generating tone', e);
  }
}

/**
 * Generate a sequence of tones
 * @param frequencies Array of frequencies
 * @param durations Array of durations
 * @param volume The volume of the tones
 */
export function generateToneSequence(
  frequencies: number[],
  durations: number[],
  volume: number = 0.5
): void {
  const audioContext = createAudioContext();
  if (!audioContext) return;
  
  let startTime = audioContext.currentTime;
  
  frequencies.forEach((freq, index) => {
    const duration = durations[index] || durations[0];
    
    try {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.type = 'sine';
      oscillator.frequency.value = freq;
      
      gainNode.gain.value = volume;
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.start(startTime);
      oscillator.stop(startTime + duration);
      
      startTime += duration;
    } catch (e) {
      console.error('Error generating tone in sequence', e);
    }
  });
}
