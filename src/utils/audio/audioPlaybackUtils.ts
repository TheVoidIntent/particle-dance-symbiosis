
// Export the required function directly
export const createFallbackAudioIfNeeded = () => {
  // Generate a simple beep sound if audio file can't be found
  try {
    const context = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(context.destination);
    
    oscillator.type = 'sine';
    oscillator.frequency.value = 440; // A4 note
    gainNode.gain.value = 0.1;
    
    oscillator.start();
    setTimeout(() => {
      oscillator.stop();
      context.close();
    }, 200);
    
    return true;
  } catch (error) {
    console.error("Failed to create fallback audio:", error);
    return false;
  }
};

// Add a new function for audio playback with error handling
export const playAudioWithErrorHandling = (url: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const audio = new Audio(url);
    
    audio.onended = () => {
      resolve();
    };
    
    audio.onerror = (error) => {
      console.error(`Error playing audio from ${url}:`, error);
      createFallbackAudioIfNeeded();
      reject(error);
    };
    
    audio.play().catch(error => {
      console.error(`Error playing audio from ${url}:`, error);
      createFallbackAudioIfNeeded();
      reject(error);
    });
  });
};

// Play audio in a continuous loop
let loopAudioElement: HTMLAudioElement | null = null;

export const playLoopingAudio = (url: string, volume: number = 0.5): void => {
  // Stop any existing audio loop
  if (loopAudioElement) {
    loopAudioElement.pause();
    loopAudioElement.src = '';
    loopAudioElement = null;
  }
  
  try {
    const audio = new Audio(url);
    audio.loop = true;
    audio.volume = volume;
    audio.autoplay = true;
    
    // Store the element for later control
    loopAudioElement = audio;
    
    audio.play().catch(error => {
      console.error(`Error looping audio from ${url}:`, error);
      createFallbackAudioIfNeeded();
    });
    
    console.log(`Started looping audio: ${url}`);
  } catch (error) {
    console.error(`Failed to create looping audio: ${error}`);
    createFallbackAudioIfNeeded();
  }
};

export const stopLoopingAudio = (): void => {
  if (loopAudioElement) {
    loopAudioElement.pause();
    loopAudioElement.src = '';
    loopAudioElement = null;
    console.log("Stopped looping audio");
  }
};

export const setLoopingAudioVolume = (volume: number): void => {
  if (loopAudioElement) {
    loopAudioElement.volume = Math.max(0, Math.min(1, volume));
    console.log(`Set looping audio volume to: ${volume}`);
  }
};
