
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
