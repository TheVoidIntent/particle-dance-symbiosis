
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
  // Based on intensity (0-1), create different frequencies and patterns
  const baseFreq = 220 + (intensity * 220); // 220-440 Hz range
  
  // Multiple shimmering tones with varying durations
  const toneCount = 4 + Math.floor(intensity * 4); // 4-8 tones
  
  for (let i = 0; i < toneCount; i++) {
    // Stagger the tones for a flowing, ethereal effect
    setTimeout(() => {
      // Each tone has a slightly different frequency
      const freqOffset = (Math.random() * 40) - 20; // +/- 20 Hz
      const freq = baseFreq + freqOffset;
      
      // Intensity affects duration and volume
      const duration = 0.5 + (intensity * 1.5) + (Math.random() * 0.5);
      const volume = 0.02 + (intensity * 0.05);
      
      // Generate the tone with a harmonic ratio based on position in the sequence
      const harmonic = 1 + (i / toneCount);
      generateCelestialTone(freq, duration, volume, harmonic);
    }, i * 80); // Stagger timing
  }
}

/**
 * Play emergence sound for complex events like cluster formation
 * @param complexity The complexity level (0-1)
 */
export function playEmergenceSound(complexity: number): void {
  if (!isAudioEnabled) return;
  
  // Emergence is represented by a complex, evolving sound with multiple layers
  // Higher complexity means more layers, longer duration, and richer harmonics
  
  // Base tone - a deep, resonant frequency
  const baseFreq = 130 + (complexity * 50); // Low C to low G range
  
  // Primary chord structure based on complexity
  // More complex = more dissonant/interesting intervals
  const intervals = complexity > 0.7 
    ? [1, 1.5, 1.87, 2.5, 3.14] // Complex intervals for high complexity
    : [1, 1.5, 2, 2.5, 3];      // Simpler intervals for lower complexity
  
  // Duration grows with complexity
  const baseDuration = 2 + (complexity * 3); // 2-5 seconds
  
  // Generate the primary emergence tone
  generateCelestialTone(baseFreq, baseDuration, 0.1, 1);
  
  // Add overtone layers with delays
  intervals.forEach((interval, i) => {
    setTimeout(() => {
      // Each overtone has progressively less volume
      const overtoneVolume = 0.08 * (1 - (i / intervals.length));
      
      // Duration decreases for higher overtones
      const overtoneDuration = baseDuration * (1 - (i * 0.1));
      
      // Generate the overtone
      generateCelestialTone(baseFreq * interval, overtoneDuration, overtoneVolume, interval);
    }, i * 300 * complexity); // More complex = more spread out
  });
  
  // For high complexity, add a final "resolution" tone
  if (complexity > 0.6) {
    setTimeout(() => {
      // Resolution tone is an octave above the base
      generateCelestialTone(baseFreq * 2, baseDuration * 0.7, 0.06, 1);
    }, baseDuration * 500); // Near the end of the main sound
  }
}

/**
 * Play a cosmic bell toll sound - representing significant information density events
 * @param informationDensity The information density level (0-1)
 * @param weight The "information weight" parameter (0-1)
 */
export function playCosmicBellToll(informationDensity: number, weight: number = 0.5): void {
  if (!isAudioEnabled) return;
  
  // Base frequency lowers with higher "weight" - heavier information = deeper tone
  const baseFreq = 220 - (weight * 100); // 120-220 Hz range
  
  // Higher information density = more complex bell harmonics
  const harmonicSet = informationDensity > 0.7
    ? [1, 1.33, 1.5, 2, 2.67, 3, 4] // Rich harmonic set for high density
    : [1, 1.5, 2, 3, 4];            // Simpler set for lower density
  
  // Duration extends with information weight
  const duration = 3 + (weight * 4); // 3-7 seconds
  
  // Initial deep toll
  generateCelestialTone(baseFreq, duration, 0.15, 1);
  
  // Add harmonic overtones with slight delays to create a rich bell toll
  harmonicSet.forEach((harmonic, i) => {
    setTimeout(() => {
      const harmVolume = 0.1 * (1 - (i / (2 * harmonicSet.length)));
      const harmDuration = duration * (1 - (i * 0.08));
      
      generateCelestialTone(baseFreq * harmonic, harmDuration, harmVolume, 1);
    }, i * 80 * (1 + informationDensity)); // Wider spacing with higher density
  });
  
  // For high information density, add a subtle "resonance" layer
  if (informationDensity > 0.6) {
    // Delayed resonance effect
    setTimeout(() => {
      const resonanceFreq = baseFreq * 1.5;
      const resonanceDuration = duration * 0.8;
      
      // Create a shimmering resonance with multiple tones
      for (let j = 0; j < 3; j++) {
        setTimeout(() => {
          generateCelestialTone(
            resonanceFreq + (j * 7), // Slight frequency shift
            resonanceDuration - (j * 0.2),
            0.04 - (j * 0.01),
            1 + (j * 0.05)
          );
        }, j * 200);
      }
    }, 300);
  }
}

/**
 * Play a gravitational wave sound - representing information with "weight"
 * @param strength The strength of the gravitational effect (0-1)
 * @param complexity The complexity of the wave pattern (0-1)
 */
export function playGravitationalWaveSound(strength: number, complexity: number = 0.5): void {
  if (!isAudioEnabled) return;
  
  // Base frequency range - deeper for stronger "gravity"
  const baseFreq = 80 + ((1 - strength) * 100); // 80-180 Hz
  
  // Duration based on strength - stronger effects last longer
  const duration = 2 + (strength * 6); // 2-8 seconds
  
  // Create a gravitational wave pattern
  if (audioContext && masterGain) {
    try {
      // Main oscillator for the base wave
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      // LFO for frequency modulation to create wave-like effect
      const lfo = audioContext.createOscillator();
      const lfoGain = audioContext.createGain();
      
      // Configure the LFO
      lfo.type = 'sine';
      lfo.frequency.value = 0.1 + (complexity * 0.3); // 0.1-0.4 Hz modulation
      lfoGain.gain.value = 10 + (strength * 40);      // Modulation depth
      
      // Configure the main oscillator
      oscillator.type = 'sine';
      oscillator.frequency.value = baseFreq;
      
      // Connect LFO to oscillator frequency
      lfo.connect(lfoGain);
      lfoGain.connect(oscillator.frequency);
      
      // Configure amplitude envelope
      gainNode.gain.value = 0;
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.12 * strength, audioContext.currentTime + 1.5);
      gainNode.gain.setValueAtTime(0.12 * strength, audioContext.currentTime + duration - 1.5);
      gainNode.gain.linearRampToValueAtTime(0.001, audioContext.currentTime + duration);
      
      // Connect and start
      oscillator.connect(gainNode);
      gainNode.connect(masterGain);
      
      lfo.start();
      oscillator.start();
      
      // Add harmonics for more complex waves
      if (complexity > 0.4) {
        const harmonics = [2, 3, 5];
        harmonics.forEach((harmonic, i) => {
          setTimeout(() => {
            const harmOsc = audioContext.createOscillator();
            const harmGain = audioContext.createGain();
            
            harmOsc.type = 'sine';
            harmOsc.frequency.value = baseFreq * harmonic;
            
            harmGain.gain.value = 0;
            harmGain.gain.setValueAtTime(0, audioContext.currentTime);
            harmGain.gain.linearRampToValueAtTime(
              0.06 * strength * (1 - (i * 0.2)),
              audioContext.currentTime + 1
            );
            harmGain.gain.setValueAtTime(
              0.06 * strength * (1 - (i * 0.2)),
              audioContext.currentTime + duration - 1
            );
            harmGain.gain.linearRampToValueAtTime(0.001, audioContext.currentTime + duration);
            
            harmOsc.connect(harmGain);
            harmGain.connect(masterGain);
            
            harmOsc.start();
            harmOsc.stop(audioContext.currentTime + duration + 0.1);
          }, i * 200);
        });
      }
      
      // Stop everything
      lfo.stop(audioContext.currentTime + duration + 0.1);
      oscillator.stop(audioContext.currentTime + duration + 0.1);
      
      // Clean up
      setTimeout(() => {
        lfo.disconnect();
        lfoGain.disconnect();
        oscillator.disconnect();
        gainNode.disconnect();
      }, (duration + 0.2) * 1000);
    } catch (error) {
      console.error("Error generating gravitational wave sound:", error);
    }
  }
}

/**
 * Export sound data to NotebookLM
 * @returns Object containing audio analysis data for NotebookLM
 */
export function exportAudioDataForNotebookLM(): object {
  // Create a summary of audio activity for export to NotebookLM
  return {
    audioSystem: "Cosmic Sonata Sound Generator",
    timestamp: new Date().toISOString(),
    soundTypes: [
      {
        name: "Particle Creation",
        description: "Harmonic bell-like tones that represent new information entering the universe",
        harmonicStructure: "Based on particle charge (positive/negative/neutral)",
        frequencyRange: "260-590 Hz",
        duration: "0.8-1.5 seconds"
      },
      {
        name: "Particle Interaction",
        description: "Call and response pattern representing information exchange between particles",
        harmonicStructure: "Interval relationships based on particle charges",
        frequencyRange: "260-590 Hz",
        duration: "0.8-0.9 seconds per tone"
      },
      {
        name: "Intent Field Fluctuation",
        description: "Cosmic shimmer effect reflecting the intent field energy",
        harmonicStructure: "Multiple staggered tones with varying durations",
        frequencyRange: "200-460 Hz",
        duration: "0.5-2.0 seconds"
      },
      {
        name: "Emergence",
        description: "Complex, evolving sound with multiple layers for cluster formation events",
        harmonicStructure: "Complex intervals for high complexity, simpler for low",
        frequencyRange: "130-390 Hz",
        duration: "2.0-5.0 seconds"
      },
      {
        name: "Cosmic Bell Toll",
        description: "Deep resonant bell tones representing information density events",
        harmonicStructure: "Rich harmonic series with extended duration",
        frequencyRange: "120-880 Hz",
        duration: "3.0-7.0 seconds"
      },
      {
        name: "Gravitational Wave",
        description: "Low frequency modulated wave patterns representing information with weight",
        harmonicStructure: "Frequency modulated sine waves with harmonics",
        frequencyRange: "80-180 Hz (fundamental)",
        duration: "2.0-8.0 seconds"
      }
    ],
    soundTheory: {
      framework: "Information-Intent Nexus",
      primaryConcept: "Sound as representation of information density and intent",
      harmonicMapping: "Particle charges and types map to specific harmonic structures",
      informationWeight: "Lower frequencies represent greater information weight/gravity"
    }
  };
}

/**
 * Clean up audio resources
 */
export function cleanupAudio(): void {
  if (audioContext) {
    audioContext.close();
    audioContext = null;
  }
  masterGain = null;
  reverbNode = null;
  console.log("Audio system cleaned up");
}
