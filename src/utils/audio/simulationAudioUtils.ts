
// Audio context singleton
let audioContext: AudioContext | null = null;

// Store for loaded audio buffers
const audioBuffers: { [key: string]: AudioBuffer } = {};

// Store for audio sources
const audioSources: { [key: string]: AudioBufferSourceNode } = {};

// Initialize audio context
export const initAudioContext = (): AudioContext => {
  if (!audioContext) {
    try {
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      console.log("🔊 Audio context initialized:", audioContext.state);
    } catch (e) {
      console.error("Failed to create audio context:", e);
      throw e;
    }
  }
  
  return audioContext;
};

// Get the current audio context or create one
export const getAudioContext = (): AudioContext => {
  if (!audioContext) {
    return initAudioContext();
  }
  return audioContext;
};

// Play a simulation event sound
export const playSimulationEvent = (
  eventType: 'particle_creation' | 'particle_interaction' | 'cluster_formation' | 'robot_evolution' | 'intent_spike' | 'inflation',
  options: { intensity?: number; count?: number; frequency?: number } = {}
): void => {
  const ctx = getAudioContext();
  
  // Default options
  const { 
    intensity = 0.5, 
    count = 1,
    frequency = 440
  } = options;
  
  // Create an oscillator
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();
  
  // Configure based on event type
  switch (eventType) {
    case 'particle_creation':
      oscillator.type = 'sine';
      oscillator.frequency.value = frequency;
      gainNode.gain.value = 0.1 * intensity;
      break;
    
    case 'particle_interaction':
      oscillator.type = 'triangle';
      oscillator.frequency.value = 220 + (intensity * 220);
      gainNode.gain.value = 0.05 * intensity;
      break;
      
    case 'cluster_formation':
      oscillator.type = 'sawtooth';
      oscillator.frequency.value = 165 + (count * 10);
      gainNode.gain.value = 0.2 * intensity;
      break;
      
    case 'robot_evolution':
      oscillator.type = 'square';
      oscillator.frequency.value = 330 + (count * 30);
      gainNode.gain.value = 0.3;
      break;
      
    case 'intent_spike':
      oscillator.type = 'sine';
      oscillator.frequency.value = 880;
      gainNode.gain.value = 0.2 * intensity;
      break;
      
    case 'inflation':
      oscillator.type = 'sine';
      oscillator.frequency.value = 110;
      gainNode.gain.value = 0.5;
      // Add a frequency sweep for dramatic effect
      oscillator.frequency.exponentialRampToValueAtTime(
        880, ctx.currentTime + 1.5
      );
      // Fade out
      gainNode.gain.exponentialRampToValueAtTime(
        0.001, ctx.currentTime + 2
      );
      break;
  }
  
  // Connect the nodes
  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);
  
  // Play the sound
  oscillator.start();
  oscillator.stop(ctx.currentTime + (eventType === 'inflation' ? 2 : 0.3));
  
  // Clean up
  oscillator.onended = () => {
    oscillator.disconnect();
    gainNode.disconnect();
  };
};

export const generateParticleSoundscape = (particles: any[], intentField: number[][][]): void => {
  console.log("Generating particle soundscape...");
  // Implementation would go here
};

export const startSimulationAudioStream = (): void => {
  console.log("Starting simulation audio stream...");
  // Implementation would go here
};

export const stopSimulationAudioStream = (): void => {
  console.log("Stopping simulation audio stream...");
  // Implementation would go here
};

export const isSimulationAudioPlaying = (): boolean => {
  return audioContext !== null && audioContext.state === 'running';
};

export const setSimulationAudioVolume = (volume: number): void => {
  console.log("Setting simulation audio volume:", volume);
  // Implementation would go here
};

export const playSimulationAudio = (type: string, options: any = {}): void => {
  console.log("Playing simulation audio:", type, options);
  // Implementation would go here
};
