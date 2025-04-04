
/**
 * Simple Sound Generator for the Universe Simulator
 * Creates cosmic bell-like tones from particle interactions
 */

// Audio context and master gain
let audioContext: AudioContext | null = null;
let masterGain: GainNode | null = null;
let isAudioEnabled = false;

/**
 * Initialize the audio system
 */
export function initAudio(): void {
  try {
    if (!audioContext) {
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      masterGain = audioContext.createGain();
      masterGain.gain.value = 0.3; // Default volume
      masterGain.connect(audioContext.destination);
      isAudioEnabled = true;
      console.log("Audio system initialized");
    }
  } catch (error) {
    console.error("Failed to initialize audio:", error);
  }
}

/**
 * Set the master volume
 */
export function setVolume(level: number): void {
  if (!masterGain) return;
  masterGain.gain.value = Math.max(0, Math.min(1, level));
}

/**
 * Enable or disable audio
 */
export function setAudioEnabled(enabled: boolean): void {
  isAudioEnabled = enabled;
  if (!enabled && masterGain) {
    masterGain.gain.value = 0;
  } else if (enabled && masterGain) {
    masterGain.gain.value = 0.3;
  }
}

/**
 * Generate a harmonious tone based on particle charge
 */
function chargeToHarmony(charge: string): number[] {
  // Return frequency sets (musical chords) based on charge
  switch (charge) {
    case 'positive': 
      return [261.63, 329.63, 392.00]; // C major chord (C E G)
    case 'negative': 
      return [293.66, 349.23, 440.00]; // D minor chord (D F A)
    case 'neutral': 
      return [293.66, 370.00, 440.00]; // D major chord (D F# A)
    default: 
      return [261.63, 329.63, 392.00]; // Default to C major
  }
}

/**
 * Generate a bell-like tone
 */
function generateBellTone(frequency: number, duration: number, volume: number = 0.1): void {
  if (!audioContext || !masterGain || !isAudioEnabled) return;
  
  try {
    // Create oscillator for the main tone
    const oscillator = audioContext.createOscillator();
    // Create gain node for envelope shaping
    const gainNode = audioContext.createGain();
    
    // Bell-like tones often use sine waves
    oscillator.type = 'sine';
    oscillator.frequency.value = frequency;
    
    // Create a gentle attack and long release for bell-like sound
    gainNode.gain.value = 0;
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    // Quick attack
    gainNode.gain.linearRampToValueAtTime(volume, audioContext.currentTime + 0.02);
    // Long release with slight curve for natural decay
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
    
    // Connect nodes
    oscillator.connect(gainNode);
    gainNode.connect(masterGain);
    
    // Start and stop
    oscillator.start();
    oscillator.stop(audioContext.currentTime + duration + 0.1);
    
    // Clean up
    setTimeout(() => {
      oscillator.disconnect();
      gainNode.disconnect();
    }, (duration + 0.2) * 1000);
  } catch (error) {
    console.error("Error generating bell tone:", error);
  }
}

/**
 * Play a harmonic chord for particle creation
 */
export function playParticleCreationSound(charge: string): void {
  if (!isAudioEnabled) return;
  
  const harmonics = chargeToHarmony(charge);
  
  // Play a gentle chord with staggered timing
  harmonics.forEach((freq, index) => {
    setTimeout(() => {
      generateBellTone(freq, 1.2 - (index * 0.2), 0.06);
    }, index * 100);
  });
}

/**
 * Play a harmonious interaction sound
 */
export function playInteractionSound(charge1: string, charge2: string): void {
  if (!isAudioEnabled) return;
  
  const harmony1 = chargeToHarmony(charge1);
  const harmony2 = chargeToHarmony(charge2);
  
  // Pick one note from each harmony to create an interesting interval
  const note1 = harmony1[Math.floor(Math.random() * harmony1.length)];
  const note2 = harmony2[Math.floor(Math.random() * harmony2.length)];
  
  // Play both notes with slight delay
  generateBellTone(note1, 0.8, 0.05);
  setTimeout(() => {
    generateBellTone(note2, 0.6, 0.03);
  }, 150);
}

/**
 * Play a cosmic resonance sound for field fluctuation
 */
export function playFluctuationSound(intensity: number): void {
  if (!isAudioEnabled) return;
  
  // Create a cosmic shimmer effect with multiple tones
  // Base frequency varies with intensity
  const baseFreq = 150 + (intensity * 200);
  
  // Play a series of harmonically related tones
  const harmonics = [1, 1.5, 2, 2.5, 3];
  harmonics.forEach((harmonic, index) => {
    setTimeout(() => {
      generateBellTone(
        baseFreq * harmonic, 
        1.5 - (index * 0.2), 
        0.02 * (1 - (index * 0.1))
      );
    }, index * 80);
  });
}

/**
 * Play a celestial emergence sound
 */
export function playEmergenceSound(complexity: number): void {
  if (!isAudioEnabled) return;
  
  // Create an ascending cosmic sequence
  const baseNote = 200 + (complexity * 100);
  
  // Higher complexity = more complex/complete scale
  const scaleLength = 3 + Math.floor(complexity * 5);
  
  // Major scale frequency ratios (whole and half steps)
  const majorScaleRatios = [1, 9/8, 5/4, 4/3, 3/2, 5/3, 15/8, 2];
  
  // Play ascending scale notes in sequence
  for (let i = 0; i < scaleLength; i++) {
    setTimeout(() => {
      generateBellTone(
        baseNote * majorScaleRatios[i], 
        0.7 + (i * 0.1), 
        0.07 - (i * 0.005)
      );
    }, i * 150);
  }
}

/**
 * Clean up audio system
 */
export function cleanupAudio(): void {
  if (audioContext) {
    audioContext.close().catch(e => console.error("Error closing audio context:", e));
    audioContext = null;
    masterGain = null;
  }
}
