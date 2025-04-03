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

// Implement the missing functions
export function generateInteractionAudio(intensity: number = 0.5): void {
  playSimulationEventSound('particle_interaction', intensity);
}

export function generateFieldFluctuationAudio(intensity: number = 0.5): void {
  playSimulationEventSound('intent_fluctuation', intensity);
}

export function generateParticleSoundscape(particleCount: number): void {
  const intensity = Math.min(particleCount / 100, 1.0);
  playSimulationEventSound('particle_creation', intensity);
}

export function startSimulationAudioStream(): void {
  console.log("Starting simulation audio stream");
  // Implementation would connect to audio context and start streaming
}

export function stopSimulationAudioStream(): void {
  console.log("Stopping simulation audio stream");
  // Implementation would disconnect from audio context and stop streaming
}

export function isSimulationAudioPlaying(): boolean {
  // This would check if the audio stream is active
  return false;
}

export function setSimulationAudioVolume(volume: number): void {
  // Implementation would set the master volume for all simulation audio
  console.log(`Setting simulation audio volume to ${volume}`);
}

// Function to play a continuous background loop for the simulation
export function playSimulationBackgroundLoop(audioUrl: string, volume: number = 0.5): HTMLAudioElement {
  try {
    const audio = new Audio(audioUrl);
    audio.loop = true;
    audio.volume = Math.min(Math.max(volume, 0), 1.0);
    audio.autoplay = true;
    
    // Handle errors and auto-restart if playback fails
    audio.addEventListener('error', (e) => {
      console.error("Error in background audio loop:", e);
      // Try to restart after a delay
      setTimeout(() => {
        audio.play().catch(err => console.error("Failed to restart audio:", err));
      }, 3000);
    });
    
    // Ensure it keeps playing
    audio.addEventListener('ended', () => {
      audio.currentTime = 0;
      audio.play().catch(e => console.error("Error restarting audio loop:", e));
    });
    
    audio.play().catch(e => console.error("Error starting background audio:", e));
    return audio;
  } catch (e) {
    console.error("Error setting up background audio loop:", e);
    return new Audio(); // Return empty audio element on error
  }
}
