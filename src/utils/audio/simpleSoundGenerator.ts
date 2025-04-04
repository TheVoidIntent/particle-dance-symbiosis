
/**
 * Simple Sound Generator for the Universe Simulator
 * Converts particle properties into sound parameters
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
 * Convert particle charge to frequency
 */
function chargeToFrequency(charge: string): number {
  switch (charge) {
    case 'positive': return 440; // A4
    case 'negative': return 329.63; // E4
    case 'neutral': return 392; // G4
    default: return 440;
  }
}

/**
 * Convert particle energy to duration
 */
function energyToDuration(energy: number): number {
  return Math.min(0.1 + energy / 500, 0.5); // 0.1 to 0.5 seconds
}

/**
 * Generate a tone
 */
function generateTone(frequency: number, duration: number, volume: number = 0.1): void {
  if (!audioContext || !masterGain || !isAudioEnabled) return;
  
  try {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.value = frequency;
    
    gainNode.gain.value = 0;
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(volume, audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
    
    oscillator.connect(gainNode);
    gainNode.connect(masterGain);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + duration + 0.05);
    
    // Clean up
    setTimeout(() => {
      oscillator.disconnect();
      gainNode.disconnect();
    }, (duration + 0.1) * 1000);
  } catch (error) {
    console.error("Error generating tone:", error);
  }
}

/**
 * Play a sound for particle creation
 */
export function playParticleCreationSound(charge: string): void {
  if (!isAudioEnabled) return;
  
  const baseFreq = chargeToFrequency(charge);
  const duration = 0.3;
  
  generateTone(baseFreq, duration, 0.1);
  setTimeout(() => generateTone(baseFreq * 1.5, duration * 0.5, 0.05), 100);
}

/**
 * Play a sound for particle interaction
 */
export function playInteractionSound(charge1: string, charge2: string): void {
  if (!isAudioEnabled) return;
  
  const freq1 = chargeToFrequency(charge1);
  const freq2 = chargeToFrequency(charge2);
  const avgFreq = (freq1 + freq2) / 2;
  
  generateTone(avgFreq, 0.2, 0.08);
}

/**
 * Play a sound for field fluctuation
 */
export function playFluctuationSound(intensity: number): void {
  if (!isAudioEnabled) return;
  
  const baseFreq = 200 + intensity * 300;
  generateTone(baseFreq, 0.4, 0.05);
}

/**
 * Play a sound for emergence events
 */
export function playEmergenceSound(complexity: number): void {
  if (!isAudioEnabled) return;
  
  const baseFreq = 300;
  const duration = 0.8;
  
  // Play a series of ascending tones
  for (let i = 0; i < 4; i++) {
    setTimeout(() => {
      generateTone(baseFreq + (i * 100), duration - (i * 0.1), 0.1);
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
