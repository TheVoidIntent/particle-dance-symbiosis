
// Global audio context
let audioContext: AudioContext | null = null;

/**
 * Initialize audio context
 */
export function initAudioContext(): AudioContext {
  if (!audioContext) {
    try {
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      console.log("🔊 Audio context initialized");
    } catch (error) {
      console.error("Failed to initialize audio context:", error);
      // Create a mock audio context as fallback
      audioContext = createMockAudioContext();
    }
  }
  return audioContext;
}

/**
 * Create a mock audio context for environments where Web Audio API is not available
 */
function createMockAudioContext(): AudioContext {
  const mockContext = {
    createBuffer: () => ({}),
    createBufferSource: () => ({ 
      connect: () => {}, 
      start: () => {},
      stop: () => {}
    }),
    createGain: () => ({ 
      connect: () => {},
      gain: { value: 1 }
    }),
    decodeAudioData: () => Promise.resolve({}),
    destination: {},
    currentTime: 0,
    sampleRate: 44100,
    state: 'running',
    resume: () => Promise.resolve(),
  } as unknown as AudioContext;
  
  return mockContext;
}

/**
 * Play audio for simulation events
 */
export function playSimulationEvent(
  eventType: 'particle_creation' | 'particle_interaction' | 'cluster_formation' | 'robot_evolution' | 'intent_spike' | 'inflation',
  options: { 
    intensity?: number; 
    count?: number;
    frequency?: number;
  } = {}
): void {
  // This is a placeholder implementation
  // In a real application, this would use the Web Audio API to create sounds
  console.log(`🔊 Playing audio for event: ${eventType}`, options);
  
  // In a production implementation, we would create different sounds based on the event type
  // For now, we're just logging the event
}

// Add missing audio utilities that were referenced in other files
export function playSimulationAudio(soundType: string, options: any = {}): void {
  console.log(`🔊 Playing simulation audio: ${soundType}`, options);
}

export function generateParticleSoundscape(particles: any[], options: any = {}): void {
  console.log(`🔊 Generating particle soundscape for ${particles.length} particles`);
}

export function startSimulationAudioStream(): void {
  console.log("🔊 Starting simulation audio stream");
}

export function stopSimulationAudioStream(): void {
  console.log("🔊 Stopping simulation audio stream");
}

export function isSimulationAudioPlaying(): boolean {
  return false; // Placeholder implementation
}

export function setSimulationAudioVolume(volume: number): void {
  console.log(`🔊 Setting simulation audio volume to ${volume}`);
}
