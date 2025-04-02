
/**
 * Utilities for generating audio on the fly
 */

// Create or get shared audio context for all audio generation
let audioGenContext: AudioContext | null = null;

// Creates a sample audio tone with specified parameters
export const generateSampleAudio = (
  duration: number = 0.5,
  waveType: OscillatorType = 'sine',
  frequency: number = 440,
  volume: number = 0.5
): void => {
  try {
    // Create or reuse audio context
    if (!audioGenContext) {
      audioGenContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    // If context is suspended (due to autoplay policy), try to resume it
    if (audioGenContext.state === 'suspended') {
      audioGenContext.resume().catch(error => {
        console.warn('Could not resume audio context:', error);
        return; // Exit if we can't resume
      });
    }
    
    // Create oscillator and gain node
    const oscillator = audioGenContext.createOscillator();
    const gainNode = audioGenContext.createGain();
    
    // Connect the nodes
    oscillator.connect(gainNode);
    gainNode.connect(audioGenContext.destination);
    
    // Set the parameters
    oscillator.type = waveType;
    oscillator.frequency.value = frequency;
    
    // Apply volume with smoothing to avoid clicks
    gainNode.gain.setValueAtTime(0, audioGenContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(volume, audioGenContext.currentTime + 0.05);
    gainNode.gain.linearRampToValueAtTime(0, audioGenContext.currentTime + duration);
    
    // Start and stop the oscillator
    oscillator.start();
    oscillator.stop(audioGenContext.currentTime + duration);
    
    // Clean up when done
    oscillator.onended = () => {
      oscillator.disconnect();
      gainNode.disconnect();
    };
    
    console.log(`Generated audio: ${waveType} wave at ${frequency}Hz for ${duration}s`);
  } catch (error) {
    console.error('Error generating audio:', error);
  }
};

// Create fallback audio for error cases
export const createFallbackAudioIfNeeded = () => {
  generateSampleAudio(0.2, 'sawtooth', 220, 0.3);
  
  // Add a second tone after a brief pause
  setTimeout(() => {
    generateSampleAudio(0.2, 'sawtooth', 180, 0.3);
  }, 250);
  
  return true;
};

// Generate complex tone from particle data (useful for sonification)
export const generateParticleTone = (
  charge: 'positive' | 'negative' | 'neutral',
  energy: number = 0.5,
  complexity: number = 1
): void => {
  // Base frequency based on particle charge
  const baseFreq = charge === 'positive' ? 440 : 
                   charge === 'negative' ? 220 : 330;
  
  // Higher complexity means more harmonics
  const harmonics = Math.min(5, Math.max(1, Math.floor(complexity * 3)));
  
  // Generate the primary tone
  generateSampleAudio(
    0.5 + (energy * 0.5), // Duration based on energy
    charge === 'positive' ? 'sine' : 
    charge === 'negative' ? 'square' : 'triangle',
    baseFreq,
    0.3 * energy
  );
  
  // Add harmonics
  for (let i = 1; i <= harmonics; i++) {
    setTimeout(() => {
      generateSampleAudio(
        0.3 + (energy * 0.3), 
        'sine',
        baseFreq * (1 + (i * 0.5)),
        0.1 * energy / i
      );
    }, i * 100);
  }
};
