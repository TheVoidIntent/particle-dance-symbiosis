
// Audio playback utilities

// Create a single audio context for all audio playback
let sharedAudioContext: AudioContext | null = null;

// Create fallback audio when needed
export const createFallbackAudioIfNeeded = () => {
  try {
    // Try to create an audio context if we don't have one
    if (!sharedAudioContext) {
      sharedAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    // If context is suspended (due to autoplay policy), try to resume it
    if (sharedAudioContext.state === 'suspended') {
      sharedAudioContext.resume().catch(e => {
        console.warn('Could not resume audio context:', e);
      });
    }
    
    // Generate a simple beep sound
    const oscillator = sharedAudioContext.createOscillator();
    const gainNode = sharedAudioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(sharedAudioContext.destination);
    
    oscillator.type = 'sine';
    oscillator.frequency.value = 440; // A4 note
    gainNode.gain.value = 0.1;
    
    oscillator.start();
    setTimeout(() => {
      oscillator.stop();
    }, 200);
    
    return true;
  } catch (error) {
    console.error("Failed to create fallback audio:", error);
    return false;
  }
};

// Play audio with error handling
export const playAudioWithErrorHandling = (url: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Try to play using Audio element
    const audio = new Audio(url);
    
    audio.onended = () => {
      resolve();
    };
    
    audio.onerror = (error) => {
      console.error(`Error playing audio from ${url}:`, error);
      createFallbackAudioIfNeeded();
      reject(error);
    };
    
    // Try to play and handle autoplay restrictions
    const playPromise = audio.play();
    
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        console.error(`Error playing audio from ${url}:`, error);
        
        // If it's an autoplay restriction, add event listeners to enable audio on next user interaction
        if (error.name === 'NotAllowedError') {
          console.log('Audio playback was prevented by autoplay policy. Click anywhere to enable audio.');
          
          const enableAudio = () => {
            audio.play().catch(e => {
              console.error('Still failed to play audio after user interaction:', e);
              createFallbackAudioIfNeeded();
            });
            
            // Clean up event listeners
            document.removeEventListener('click', enableAudio);
            document.removeEventListener('touchstart', enableAudio);
            document.removeEventListener('keydown', enableAudio);
          };
          
          // Add event listeners for user interaction
          document.addEventListener('click', enableAudio, { once: true });
          document.addEventListener('touchstart', enableAudio, { once: true });
          document.addEventListener('keydown', enableAudio, { once: true });
        }
        
        createFallbackAudioIfNeeded();
        reject(error);
      });
    }
  });
};

// Variables for looping audio
let loopAudioElement: HTMLAudioElement | null = null;
let loopAudioContext: AudioContext | null = null;
let loopAudioSource: MediaElementAudioSourceNode | null = null;
let loopAudioGain: GainNode | null = null;

// Play audio in a continuous loop with better handling of autoplay restrictions
export const playLoopingAudio = (url: string, volume: number = 0.5): void => {
  // Stop any existing audio loop
  if (loopAudioElement) {
    stopLoopingAudio();
  }
  
  try {
    // Create audio context if it doesn't exist
    if (!loopAudioContext) {
      loopAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    // Create new audio element
    const audio = new Audio(url);
    audio.loop = true;
    audio.autoplay = true;
    
    // Connect through audio context for volume control
    loopAudioSource = loopAudioContext.createMediaElementSource(audio);
    loopAudioGain = loopAudioContext.createGain();
    loopAudioGain.gain.value = volume;
    
    loopAudioSource.connect(loopAudioGain);
    loopAudioGain.connect(loopAudioContext.destination);
    
    // Store the element for later control
    loopAudioElement = audio;
    
    // Play and handle autoplay restrictions
    const playPromise = audio.play();
    
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        console.error(`Error looping audio from ${url}:`, error);
        
        // If it's an autoplay restriction, add event listeners to enable audio on next user interaction
        if (error.name === 'NotAllowedError') {
          console.log('Audio playback was prevented by autoplay policy. Click anywhere to enable audio.');
          
          const enableLoopingAudio = () => {
            if (loopAudioElement) {
              loopAudioElement.play().catch(e => {
                console.error('Still failed to play audio after user interaction:', e);
              });
            }
            
            // Clean up event listeners
            document.removeEventListener('click', enableLoopingAudio);
            document.removeEventListener('touchstart', enableLoopingAudio);
            document.removeEventListener('keydown', enableLoopingAudio);
          };
          
          // Add event listeners for user interaction
          document.addEventListener('click', enableLoopingAudio, { once: true });
          document.addEventListener('touchstart', enableLoopingAudio, { once: true });
          document.addEventListener('keydown', enableLoopingAudio, { once: true });
        }
      });
    }
    
    console.log(`Started looping audio: ${url}`);
  } catch (error) {
    console.error(`Failed to create looping audio: ${error}`);
    createFallbackAudioIfNeeded();
  }
};

// Stop looping audio
export const stopLoopingAudio = (): void => {
  if (loopAudioElement) {
    loopAudioElement.pause();
    loopAudioElement.src = '';
    loopAudioElement = null;
  }
  
  if (loopAudioSource) {
    loopAudioSource.disconnect();
    loopAudioSource = null;
  }
  
  if (loopAudioGain) {
    loopAudioGain.disconnect();
    loopAudioGain = null;
  }
  
  console.log("Stopped looping audio");
};

// Set volume for looping audio
export const setLoopingAudioVolume = (volume: number): void => {
  if (loopAudioGain) {
    loopAudioGain.gain.value = Math.max(0, Math.min(1, volume));
    console.log(`Set looping audio volume to: ${volume}`);
  } else if (loopAudioElement) {
    loopAudioElement.volume = Math.max(0, Math.min(1, volume));
    console.log(`Set looping audio volume to: ${volume} (using element property)`);
  }
};
