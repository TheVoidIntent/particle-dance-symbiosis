/**
 * Create a new audio context for sound generation
 * @returns AudioContext instance
 */
export function createAudioContext(): AudioContext | null {
  try {
    if (typeof window !== 'undefined' && window.AudioContext) {
      return new window.AudioContext();
    }
    return null;
  } catch (e) {
    console.error("Error creating AudioContext:", e);
    return null;
  }
}

/**
 * Generate a tone with the given frequency
 * @param frequency Frequency of the tone in Hz
 * @param duration Duration of the tone in seconds
 * @param volume Volume of the tone (0-1)
 */
export function generateTone(frequency: number, duration: number = 0.5, volume: number = 0.5): void {
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
    
    setTimeout(() => {
      oscillator.stop();
      // Close the audio context after a short delay
      setTimeout(() => {
        audioContext.close().catch(e => console.error("Error closing AudioContext:", e));
      }, 100);
    }, duration * 1000);
  } catch (e) {
    console.error("Error generating tone:", e);
  }
}

/**
 * Generate a sequence of tones
 * @param frequencies Array of frequencies to play in sequence
 * @param duration Duration of each tone in seconds
 * @param interval Interval between tones in seconds
 * @param volume Volume of the tones (0-1)
 */
export function generateToneSequence(
  frequencies: number[], 
  duration: number = 0.2, 
  interval: number = 0.1, 
  volume: number = 0.5
): void {
  let index = 0;
  
  const playNext = () => {
    if (index < frequencies.length) {
      generateTone(frequencies[index], duration, volume);
      index++;
      setTimeout(playNext, (duration + interval) * 1000);
    }
  };
  
  playNext();
}
