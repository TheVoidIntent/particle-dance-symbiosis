
// Export the audio functions
export function playSimulationEventSound(eventType: string, intensity: number = 0.5): void {
  // Map event types to specific audio files
  const audioMap: Record<string, string> = {
    'particle_creation': '/audio/particle_creation.mp3',
    'particle_interaction': '/audio/particle_interaction.mp3',
    'cluster_formation': '/audio/cluster_formation.mp3',
    'intent_fluctuation': '/audio/intent_fluctuation.mp3',
    'inflation_event': '/audio/inflation_event.mp3',
    'robot_evolution': '/audio/robot_evolution.mp3'
  };
  
  if (audioMap[eventType]) {
    try {
      const audio = new Audio(audioMap[eventType]);
      audio.volume = Math.min(Math.max(intensity, 0.1), 1.0);
      audio.play().catch(e => console.error("Error playing audio:", e));
    } catch (e) {
      console.error("Error initializing audio:", e);
    }
  }
}

export function initAudioContext(): void {
  try {
    // Create AudioContext if it doesn't exist
    if (typeof window !== 'undefined' && window.AudioContext) {
      const audioContext = new window.AudioContext();
      console.log("AudioContext initialized:", audioContext.state);
    }
  } catch (e) {
    console.error("Error initializing AudioContext:", e);
  }
}
