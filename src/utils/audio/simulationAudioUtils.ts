
// Audio context and utilities for simulation sounds
let audioContext: AudioContext | null = null;
let masterGainNode: GainNode | null = null;
let isAudioInitialized = false;
let audioVolume = 0.5;

/**
 * Initialize the audio context for simulation sounds
 */
export const initAudioContext = (): AudioContext => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    masterGainNode = audioContext.createGain();
    masterGainNode.gain.value = audioVolume;
    masterGainNode.connect(audioContext.destination);
    isAudioInitialized = true;
    console.log('Audio context initialized');
  }
  return audioContext;
};

/**
 * Play a sound for a simulation event
 */
export const playSimulationEvent = (
  eventType: string, 
  options: Record<string, any> = {}
): void => {
  if (!isAudioInitialized) {
    try {
      initAudioContext();
    } catch (error) {
      console.error('Failed to initialize audio:', error);
      return;
    }
  }

  if (!audioContext || audioContext.state === 'closed') {
    console.warn('Audio context is not available or closed');
    return;
  }

  // Resume audio context if it's suspended (browser autoplay policy)
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }

  try {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    // Configure sound based on event type
    switch (eventType) {
      case 'particle_creation':
        // Different sound for different particle charges
        if (options.eventType === 'positive') {
          oscillator.type = 'sine';
          oscillator.frequency.value = 440; // A4
        } else if (options.eventType === 'negative') {
          oscillator.type = 'triangle';
          oscillator.frequency.value = 329.63; // E4
        } else {
          oscillator.type = 'sine';
          oscillator.frequency.value = 392; // G4
        }
        
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        oscillator.connect(gainNode);
        gainNode.connect(masterGainNode as GainNode);
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.5);
        break;
        
      case 'cluster_formation':
        // Cluster formation sound
        oscillator.type = 'sine';
        oscillator.frequency.value = 523.25; // C5
        
        gainNode.gain.setValueAtTime(0.2 * (options.intensity || 1), audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1.0);
        
        oscillator.connect(gainNode);
        gainNode.connect(masterGainNode as GainNode);
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 1.0);
        break;
        
      case 'robot_evolution':
        // Robot evolution sound - more complex
        const count = options.count || 1;
        
        for (let i = 0; i < count; i++) {
          setTimeout(() => {
            const osc = audioContext?.createOscillator();
            const gain = audioContext?.createGain();
            
            if (!osc || !gain || !audioContext) return;
            
            osc.type = 'sawtooth';
            osc.frequency.value = 880 - i * 50; // Start high and go down
            
            gain.gain.setValueAtTime(0.1, audioContext.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1.5);
            
            osc.connect(gain);
            gain.connect(masterGainNode as GainNode);
            
            osc.start();
            osc.stop(audioContext.currentTime + 1.5);
          }, i * 200);
        }
        break;
        
      default:
        // Generic event sound
        oscillator.type = 'sine';
        oscillator.frequency.value = 220;
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
        
        oscillator.connect(gainNode);
        gainNode.connect(masterGainNode as GainNode);
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.2);
    }
  } catch (error) {
    console.error('Error playing simulation event sound:', error);
  }
};

/**
 * Generate a continuous soundscape based on particle states
 */
export const generateParticleSoundscape = (
  particles: any[], 
  intensity = 0.5
): void => {
  // Implementation would go here
  console.log(`Generating soundscape for ${particles.length} particles at intensity ${intensity}`);
};

/**
 * Start continuous audio stream for simulation
 */
export const startSimulationAudioStream = (): void => {
  // Implementation would go here
  console.log('Starting simulation audio stream');
};

/**
 * Stop continuous audio stream
 */
export const stopSimulationAudioStream = (): void => {
  // Implementation would go here
  console.log('Stopping simulation audio stream');
};

/**
 * Check if simulation audio is currently playing
 */
export const isSimulationAudioPlaying = (): boolean => {
  return isAudioInitialized && !!audioContext && audioContext.state === 'running';
};

/**
 * Set the simulation audio volume
 */
export const setSimulationAudioVolume = (volume: number): void => {
  audioVolume = Math.max(0, Math.min(1, volume));
  
  if (masterGainNode) {
    masterGainNode.gain.setValueAtTime(audioVolume, audioContext?.currentTime || 0);
  }
};

/**
 * Play a simulation audio with specific parameters
 */
export const playSimulationAudio = (
  frequency: number, 
  duration: number, 
  type: OscillatorType = 'sine', 
  volume = 0.5
): void => {
  if (!isAudioInitialized) {
    try {
      initAudioContext();
    } catch (error) {
      console.error('Failed to initialize audio:', error);
      return;
    }
  }

  if (!audioContext) return;

  try {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.type = type;
    oscillator.frequency.value = frequency;
    
    gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
    
    oscillator.connect(gainNode);
    gainNode.connect(masterGainNode as GainNode);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + duration);
  } catch (error) {
    console.error('Error playing simulation audio:', error);
  }
};
