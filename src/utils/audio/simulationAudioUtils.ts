
// Audio context singleton
let audioContext: AudioContext | null = null;

// Audio event sources map
const audioSources: Map<string, AudioBufferSourceNode> = new Map();

// Audio buffers cache
const audioBuffers: Map<string, AudioBuffer> = new Map();

/**
 * Initialize Web Audio API context
 */
export function initAudioContext(): AudioContext {
  if (audioContext === null) {
    try {
      // Create new audio context
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      console.log("🔊 Audio context initialized:", audioContext.state);
      
      // Modern browsers need user interaction to start audio context
      if (audioContext.state === 'suspended') {
        const resumeOnInteraction = () => {
          audioContext?.resume();
          ["mousedown", "touchstart", "keydown"].forEach(event => {
            document.removeEventListener(event, resumeOnInteraction);
          });
        };
        
        ["mousedown", "touchstart", "keydown"].forEach(event => {
          document.addEventListener(event, resumeOnInteraction);
        });
      }
    } catch (e) {
      console.error("Failed to initialize audio context:", e);
      // Create a dummy audio context to prevent errors
      const dummyContext = {
        state: 'closed',
        sampleRate: 44100,
        createBuffer: () => ({}),
        createBufferSource: () => ({}),
        createGain: () => ({ connect: () => {}, gain: { value: 0 } }),
        destination: {},
        currentTime: 0,
        decodeAudioData: () => Promise.resolve({}),
        resume: () => Promise.resolve()
      } as unknown as AudioContext;
      
      return dummyContext;
    }
  }
  
  return audioContext;
}

/**
 * Play a sound for a simulation event
 */
export function playSimulationEvent(
  eventType: 'particle_creation' | 'particle_interaction' | 'cluster_formation' | 'intent_spike' | 'inflation' | 'robot_evolution',
  options: {
    intensity?: number;
    frequency?: number;
    count?: number;
  } = {}
): void {
  const ctx = initAudioContext();
  
  // Default options
  const intensity = options.intensity || 0.5;
  const frequency = options.frequency || getFrequencyForEvent(eventType);
  
  // Create oscillator
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();
  
  // Configure oscillator
  oscillator.type = getOscillatorTypeForEvent(eventType);
  oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
  
  // Configure gain (volume)
  gainNode.gain.setValueAtTime(0, ctx.currentTime);
  gainNode.gain.linearRampToValueAtTime(0.3 * intensity, ctx.currentTime + 0.01);
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + getDurationForEvent(eventType));
  
  // Connect nodes
  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);
  
  // Start and stop
  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + getDurationForEvent(eventType));
  
  // Cleanup
  oscillator.onended = () => {
    gainNode.disconnect();
    oscillator.disconnect();
  };
}

/**
 * Get appropriate frequency for event type
 */
function getFrequencyForEvent(eventType: string): number {
  switch (eventType) {
    case 'particle_creation': return 440 + Math.random() * 220;
    case 'particle_interaction': return 220 + Math.random() * 110;
    case 'cluster_formation': return 330 + Math.random() * 165;
    case 'intent_spike': return 660 + Math.random() * 330;
    case 'inflation': return 110 + Math.random() * 55;
    case 'robot_evolution': return 880 + Math.random() * 440;
    default: return 440;
  }
}

/**
 * Get appropriate oscillator type for event
 */
function getOscillatorTypeForEvent(eventType: string): OscillatorType {
  switch (eventType) {
    case 'particle_creation': return 'sine';
    case 'particle_interaction': return 'square';
    case 'cluster_formation': return 'triangle';
    case 'intent_spike': return 'sawtooth';
    case 'inflation': return 'sine';
    case 'robot_evolution': return 'sine';
    default: return 'sine';
  }
}

/**
 * Get appropriate duration for event
 */
function getDurationForEvent(eventType: string): number {
  switch (eventType) {
    case 'particle_creation': return 0.2 + Math.random() * 0.1;
    case 'particle_interaction': return 0.1 + Math.random() * 0.05;
    case 'cluster_formation': return 0.5 + Math.random() * 0.25;
    case 'intent_spike': return 0.3 + Math.random() * 0.15;
    case 'inflation': return 1.0 + Math.random() * 0.5;
    case 'robot_evolution': return 2.0 + Math.random() * 1.0;
    default: return 0.3;
  }
}

// Export dummy functions for compatibility with existing code
export const playSimulationAudio = playSimulationEvent;
export const generateParticleSoundscape = () => {};
export const startSimulationAudioStream = () => {};
export const stopSimulationAudioStream = () => {};
export const isSimulationAudioPlaying = () => false;
export const setSimulationAudioVolume = () => {};
