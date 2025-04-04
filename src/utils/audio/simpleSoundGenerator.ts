
/**
 * Cosmic Sonata Sound Generator for the Universe Simulator
 * Creates harmonious, bell-like tones that reflect the information density,
 * intent, and emergent properties of particles in the simulation
 */

// Audio context and master gain
let audioContext: AudioContext | null = null;
let masterGain: GainNode | null = null;
let isAudioEnabled = false;

// Reverb for cosmic ambience
let reverbNode: ConvolverNode | null = null;

/**
 * Initialize the audio system
 */
export function initAudio(): void {
  try {
    if (!audioContext) {
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      masterGain = audioContext.createGain();
      masterGain.gain.value = 0.3; // Default volume
      
      // Create reverb for spacious sound
      createReverb().then(reverb => {
        if (audioContext && masterGain) {
          reverbNode = reverb;
          masterGain.connect(reverbNode);
          reverbNode.connect(audioContext.destination);
        }
      });
      
      isAudioEnabled = true;
      console.log("Cosmic Sonata audio system initialized");
    }
  } catch (error) {
    console.error("Failed to initialize audio:", error);
  }
}

/**
 * Create a reverb effect for spatial dimension
 */
async function createReverb(): Promise<ConvolverNode> {
  if (!audioContext) throw new Error("Audio context not initialized");
  
  const reverb = audioContext.createConvolver();
  const reverbTime = 2.5; // seconds
  const sampleRate = audioContext.sampleRate;
  const length = reverbTime * sampleRate;
  const impulse = audioContext.createBuffer(2, length, sampleRate);
  
  // Create impulse response for left and right channels
  for (let channel = 0; channel < 2; channel++) {
    const impulseData = impulse.getChannelData(channel);
    for (let i = 0; i < length; i++) {
      // Exponential decay
      const decay = Math.exp(-i / (sampleRate * reverbTime * 0.5));
      // Random reflection pattern for cosmic ambience
      impulseData[i] = (Math.random() * 2 - 1) * decay;
    }
  }
  
  reverb.buffer = impulse;
  return reverb;
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
 * Generate harmonious chord progressions based on particle properties
 * @param charge The charge type of the particle
 * @returns Array of frequencies representing a harmonic chord
 */
function chargeToHarmony(charge: string): number[] {
  // Return frequency sets (musical chords) based on charge type
  // Using more harmonious intervals for a pleasing cosmic sound
  switch (charge) {
    case 'positive': 
      return [261.63, 329.63, 392.00, 523.25]; // C major 7 chord (C E G C')
    case 'negative': 
      return [293.66, 349.23, 440.00, 523.25]; // D minor 7 chord (D F A C)
    case 'neutral': 
      return [293.66, 370.00, 440.00, 587.33]; // D major 7 chord (D F# A D')
    default: 
      return [261.63, 329.63, 392.00, 523.25]; // Default to C major 7
  }
}

/**
 * Generate a bell-like tone with harmonics for a celestial sound
 * @param frequency The fundamental frequency
 * @param duration Duration in seconds
 * @param volume Volume level (0-1)
 * @param harmonic Optional harmonic ratio
 */
function generateCelestialTone(
  frequency: number, 
  duration: number, 
  volume: number = 0.1,
  harmonic: number = 1
): void {
  if (!audioContext || !masterGain || !isAudioEnabled) return;
  
  try {
    // Create a bell's complexity using multiple oscillators
    const oscillators: OscillatorNode[] = [];
    const gainNodes: GainNode[] = [];
    
    // Bell-like tones use multiple sine waves at harmonic frequencies
    const harmonics = [1, 2, 2.76, 3.51, 4.1];
    
    harmonics.forEach((harmonicRatio, i) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      // Adjust frequency based on harmonic ratio
      oscillator.type = i === 0 ? 'sine' : 'sine';
      oscillator.frequency.value = frequency * harmonicRatio * harmonic;
      
      // Each harmonic has diminishing volume
      const harmonicVolume = volume * (1 / (i + 1)) * 0.5;
      
      // Create a gentle attack and long release for bell-like sound
      gainNode.gain.value = 0;
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      // Gentle attack
      gainNode.gain.linearRampToValueAtTime(harmonicVolume, audioContext.currentTime + 0.01 * (i + 1));
      // Long release with exponential curve for natural bell decay
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration * (1 - (i * 0.1)));
      
      // Connect nodes
      oscillator.connect(gainNode);
      gainNode.connect(masterGain);
      
      // Start and stop
      oscillator.start();
      oscillator.stop(audioContext.currentTime + duration + 0.1);
      
      oscillators.push(oscillator);
      gainNodes.push(gainNode);
    });
    
    // Clean up
    setTimeout(() => {
      oscillators.forEach(osc => osc.disconnect());
      gainNodes.forEach(gain => gain.disconnect());
    }, (duration + 0.2) * 1000);
  } catch (error) {
    console.error("Error generating celestial tone:", error);
  }
}

/**
 * Play a harmonic chord for particle creation - representing new information entering the universe
 * @param charge The charge type of the particle
 */
export function playParticleCreationSound(charge: string): void {
  if (!isAudioEnabled) return;
  
  const harmonics = chargeToHarmony(charge);
  
  // Play a gentle ascending arpeggio for creation
  harmonics.forEach((freq, index) => {
    setTimeout(() => {
      generateCelestialTone(freq, 1.5 - (index * 0.1), 0.07);
    }, index * 120);
  });
}

/**
 * Play an interaction sound representing information exchange between particles
 * @param charge1 Charge of first particle
 * @param charge2 Charge of second particle
 */
export function playInteractionSound(charge1: string, charge2: string): void {
  if (!isAudioEnabled) return;
  
  const harmony1 = chargeToHarmony(charge1);
  const harmony2 = chargeToHarmony(charge2);
  
  // Create a chord progression based on interacting particles
  // First play a note from first particle
  const note1 = harmony1[Math.floor(Math.random() * harmony1.length)];
  
  // Then a note from second particle to create an interval relationship
  const note2 = harmony2[Math.floor(Math.random() * harmony2.length)];
  
  // Calculate information exchange "weight" by the interval relationship
  const intervalRatio = Math.max(note1, note2) / Math.min(note1, note2);
  
  // Play both notes with slight delay for call and response effect
  generateCelestialTone(note1, 0.9, 0.05, 1);
  setTimeout(() => {
    generateCelestialTone(note2, 0.8, 0.04, intervalRatio);
  }, 180);
}

/**
 * Play a fluctuation sound representing intent field energy
 * @param intensity The intensity of the fluctuation
 */
export function playFluctuationSound(intensity: number): void {
  if (!isAudioEnabled) return;
  
  // Create a cosmic shimmer effect reflecting the intent field
  // Base frequency varies with intensity - higher intensity = higher pitch
  const baseFreq = 150 + (intensity * 250);
  
  // Play a series of harmonically related tones creating a celestial shimmer
  const harmonics = [1, 1.5, 2, 2.5, 3];
  harmonics.forEach((harmonic, index) => {
    setTimeout(() => {
      generateCelestialTone(
        baseFreq * harmonic, 
        1.8 - (index * 0.15), 
        0.025 * (1 - (index * 0.15)),
        1 + (intensity * 0.5)
      );
    }, index * 100);
  });
}

/**
 * Play an emergence sound representing new complex structures forming
 * @param complexity Level of complexity (0-1)
 */
export function playEmergenceSound(complexity: number): void {
  if (!isAudioEnabled) return;
  
  // Create an ascending celestial sequence representing emergence
  // Higher complexity = more complex, complete scale (information richness)
  const baseNote = 190 + (complexity * 120);
  
  // Higher complexity = more notes in the scale
  const scaleLength = 3 + Math.floor(complexity * 5);
  
  // Pentatonic scale for more harmonious cosmic sound (works well in any combination)
  const pentatonicRatios = [1, 9/8, 5/4, 3/2, 5/3, 2];
  
  // Play ascending scale notes in sequence - representing emergent order
  for (let i = 0; i < Math.min(scaleLength, pentatonicRatios.length); i++) {
    setTimeout(() => {
      generateCelestialTone(
        baseNote * pentatonicRatios[i], 
        0.9 + (i * 0.15), 
        0.06 - (i * 0.004),
        1 + (complexity * 0.2)
      );
    }, i * 180);
  }
  
  // For higher complexity, add a chord at the end representing the complete structure
  if (complexity > 0.7) {
    setTimeout(() => {
      // Play final "resolution" chord
      [0, 2, 4].forEach((idx, i) => {
        setTimeout(() => {
          const noteIdx = Math.min(idx, pentatonicRatios.length - 1);
          generateCelestialTone(
            baseNote * pentatonicRatios[noteIdx], 
            2.0, 
            0.08 - (i * 0.01)
          );
        }, i * 80);
      });
    }, scaleLength * 180 + 100);
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
    reverbNode = null;
  }
}
