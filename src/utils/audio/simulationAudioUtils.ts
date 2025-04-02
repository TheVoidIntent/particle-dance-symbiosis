
// Audio utilities for the simulation

let audioContext: AudioContext | null = null;

// Initialize or get the audio context
export const initAudioContext = (): AudioContext => {
  if (!audioContext) {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      audioContext = new AudioContextClass();
      console.log('Audio context initialized');
    } catch (error) {
      console.error('Failed to create audio context:', error);
      throw new Error('Audio context initialization failed');
    }
  }
  
  return audioContext;
};

// Play simulation audio
export const playSimulationAudio = (
  frequencyStart: number = 440, 
  frequencyEnd: number = 880, 
  duration: number = 0.5, 
  volume: number = 0.2
): void => {
  const context = initAudioContext();
  
  // Create an oscillator
  const oscillator = context.createOscillator();
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(frequencyStart, context.currentTime);
  oscillator.frequency.linearRampToValueAtTime(frequencyEnd, context.currentTime + duration);
  
  // Create a gain node for volume control
  const gainNode = context.createGain();
  gainNode.gain.setValueAtTime(volume, context.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, context.currentTime + duration);
  
  // Connect nodes
  oscillator.connect(gainNode);
  gainNode.connect(context.destination);
  
  // Start and stop the oscillator
  oscillator.start();
  oscillator.stop(context.currentTime + duration);
};

// Play a simulation event sound
export const playSimulationEvent = (
  eventType: 'particle_creation' | 'cluster_formation' | 'robot_evolution' | 'inflation_event',
  options: { intensity?: number; count?: number } = {}
): void => {
  const intensity = options.intensity || 1;
  const count = options.count || 1;
  
  switch (eventType) {
    case 'particle_creation':
      playSimulationAudio(220, 440, 0.3, 0.1 * intensity);
      break;
    case 'cluster_formation':
      playSimulationAudio(330, 660, 0.5, 0.2 * intensity);
      break;
    case 'robot_evolution':
      // Play more complex sound for evolution
      for (let i = 0; i < count; i++) {
        setTimeout(() => {
          playSimulationAudio(440 * (1 + i * 0.2), 880, 0.7, 0.3);
        }, i * 200);
      }
      break;
    case 'inflation_event':
      // Play dramatic sound for inflation
      playSimulationAudio(110, 880, 1.5, 0.4);
      break;
  }
};

// Generate a soundscape based on particle properties
export const generateParticleSoundscape = (
  particles: any[],
  duration: number = 5
): void => {
  const context = initAudioContext();
  
  // Count particle types
  const positiveCount = particles.filter(p => p.charge === 'positive').length;
  const negativeCount = particles.filter(p => p.charge === 'negative').length;
  const neutralCount = particles.filter(p => p.charge === 'neutral').length;
  
  const totalParticles = particles.length;
  if (totalParticles === 0) return;
  
  // Normalize counts
  const positiveFraction = positiveCount / totalParticles;
  const negativeFraction = negativeCount / totalParticles;
  const neutralFraction = neutralCount / totalParticles;
  
  // Create oscillators for each particle type
  const createOscillator = (
    frequency: number, 
    type: OscillatorType,
    volume: number,
    delay: number = 0
  ) => {
    const oscillator = context.createOscillator();
    oscillator.type = type;
    oscillator.frequency.value = frequency;
    
    const gainNode = context.createGain();
    gainNode.gain.setValueAtTime(0, context.currentTime + delay);
    gainNode.gain.linearRampToValueAtTime(volume, context.currentTime + delay + 0.1);
    gainNode.gain.setValueAtTime(volume, context.currentTime + delay + duration - 0.1);
    gainNode.gain.linearRampToValueAtTime(0, context.currentTime + delay + duration);
    
    oscillator.connect(gainNode);
    gainNode.connect(context.destination);
    
    oscillator.start(context.currentTime + delay);
    oscillator.stop(context.currentTime + delay + duration);
  };
  
  // Create soundscape based on particle distribution
  if (positiveFraction > 0) {
    createOscillator(440, 'sine', 0.1 * positiveFraction);
  }
  
  if (negativeFraction > 0) {
    createOscillator(293.66, 'triangle', 0.1 * negativeFraction, 0.2);
  }
  
  if (neutralFraction > 0) {
    createOscillator(349.23, 'sine', 0.1 * neutralFraction, 0.4);
  }
};

// Handle streaming audio for continuous simulation
let streamingSource: AudioBufferSourceNode | null = null;
let isAudioStreaming = false;

export const startSimulationAudioStream = (): void => {
  if (isAudioStreaming) return;
  
  const context = initAudioContext();
  isAudioStreaming = true;
  
  // Create a buffer with ambient sound
  const duration = 10; // 10 second loop
  const buffer = context.createBuffer(1, context.sampleRate * duration, context.sampleRate);
  const channelData = buffer.getChannelData(0);
  
  // Fill with ambient drone sound
  for (let i = 0; i < buffer.length; i++) {
    const t = i / context.sampleRate;
    
    // Combine multiple frequencies for a complex drone
    const v1 = Math.sin(2 * Math.PI * 55 * t);
    const v2 = Math.sin(2 * Math.PI * 110 * t) * 0.5;
    const v3 = Math.sin(2 * Math.PI * 220 * t) * 0.25;
    
    // Add some noise
    const noise = (Math.random() * 2 - 1) * 0.02;
    
    channelData[i] = (v1 + v2 + v3 + noise) * 0.2;
  }
  
  // Create source and play in loop
  streamingSource = context.createBufferSource();
  streamingSource.buffer = buffer;
  streamingSource.loop = true;
  
  const gainNode = context.createGain();
  gainNode.gain.value = 0.1;
  
  streamingSource.connect(gainNode);
  gainNode.connect(context.destination);
  
  streamingSource.start();
};

export const stopSimulationAudioStream = (): void => {
  if (!isAudioStreaming || !streamingSource) return;
  
  streamingSource.stop();
  streamingSource = null;
  isAudioStreaming = false;
};

export const setSimulationAudioVolume = (volume: number): void => {
  // Implementation would adjust the gain node for the simulation audio
};

export const isSimulationAudioPlaying = (): boolean => {
  return isAudioStreaming;
};
