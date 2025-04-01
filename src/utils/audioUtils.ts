
import { toast } from "sonner";

/**
 * Utility functions for audio file handling and diagnostics
 */

// Simple function to check if a file exists by making a HEAD request
export const checkAudioFileExists = async (path: string): Promise<{
  exists: boolean;
  contentType?: string;
  size?: string;
  status?: number;
  error?: string;
}> => {
  try {
    console.log("Checking if audio file exists:", path);
    
    // Try to fetch the file with HEAD request first
    const response = await fetch(path, { 
      method: 'HEAD',
      cache: 'no-cache' // Prevent caching to get fresh response
    });
    
    if (response.ok) {
      // File exists, get some info about it
      const contentType = response.headers.get('Content-Type');
      const contentLength = response.headers.get('Content-Length');
      
      console.log(`Audio file check successful: ${path}`, {
        contentType,
        size: contentLength ? `${(parseInt(contentLength) / 1024).toFixed(2)} KB` : undefined
      });
      
      return {
        exists: true,
        contentType: contentType || undefined,
        size: contentLength ? `${(parseInt(contentLength) / 1024).toFixed(2)} KB` : undefined,
        status: response.status
      };
    } else {
      // File doesn't exist with HEAD, try GET as fallback
      // Some servers don't support HEAD requests properly
      console.log("HEAD request failed, trying GET request as fallback");
      
      const getResponse = await fetch(path, { 
        method: 'GET',
        headers: { 'Range': 'bytes=0-0' } // Only request the first byte to minimize data transfer
      });
      
      if (getResponse.ok) {
        return {
          exists: true,
          contentType: getResponse.headers.get('Content-Type') || undefined,
          status: getResponse.status
        };
      }
      
      // Both HEAD and GET failed
      console.warn(`Audio file not found: ${path} (HTTP ${response.status})`);
      return {
        exists: false,
        status: response.status,
        error: `File not found (HTTP ${response.status})`
      };
    }
  } catch (err) {
    // Error checking file
    console.error(`Error checking audio file: ${path}`, err);
    return {
      exists: false,
      error: `Error checking file: ${err instanceof Error ? err.message : String(err)}`
    };
  }
};

// Create a sample audio file if none exists
export const createFallbackAudioIfNeeded = () => {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  
  // Create an oscillator
  const oscillator = audioContext.createOscillator();
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // A4 note
  
  // Create a gain node to control volume
  const gainNode = audioContext.createGain();
  gainNode.gain.setValueAtTime(0.1, audioContext.currentTime); // Set volume to 10%
  
  // Connect the oscillator to the gain node, then to the audio context destination
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  // Set up a short beep
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.5); // 0.5 second beep
  
  return "Generated audio fallback";
};

// Play an audio file with error handling
export const playAudioWithErrorHandling = (audioUrl: string): {
  play: () => void;
  stop: () => void;
  isPlaying: boolean;
} => {
  let audioElement: HTMLAudioElement | null = null;
  let playing = false;
  
  const play = () => {
    if (audioElement) {
      // Stop existing playback
      audioElement.pause();
      audioElement = null;
    }
    
    // Create new audio element
    audioElement = new Audio(audioUrl);
    audioElement.volume = 0.7; // Set default volume to 70%
    
    // Set up error handling
    audioElement.addEventListener('error', (e) => {
      const errorCode = audioElement?.error?.code;
      let errorMessage = 'Unknown audio error';
      
      switch (errorCode) {
        case 1:
          errorMessage = 'Fetching process aborted by user';
          break;
        case 2:
          errorMessage = 'Network error while loading audio';
          break;
        case 3:
          errorMessage = 'Error decoding audio file - file may be corrupted';
          break;
        case 4:
          errorMessage = 'Audio format not supported by your browser';
          break;
      }
      
      console.error("Audio playback error:", errorMessage, audioElement?.error);
      toast.error(`Audio playback error: ${errorMessage}`);
      playing = false;
    });
    
    audioElement.addEventListener('ended', () => {
      console.log("Audio playback ended normally");
      playing = false;
    });
    
    // Try to play the audio
    audioElement.play()
      .then(() => {
        playing = true;
        console.log("Audio playback started successfully");
      })
      .catch(err => {
        console.error("Failed to play audio:", err);
        toast.error(`Failed to play audio: ${err instanceof Error ? err.message : String(err)}`);
        playing = false;
        
        // Create fallback audio if playback fails
        createFallbackAudioIfNeeded();
      });
  };
  
  const stop = () => {
    if (audioElement) {
      audioElement.pause();
      audioElement = null;
      playing = false;
    }
  };
  
  return {
    play,
    stop,
    get isPlaying() { return playing; }
  };
};

// Generate a sample audio for testing
export const generateSampleAudio = () => {
  // Check if the Web Audio API is supported
  if (!window.AudioContext && !(window as any).webkitAudioContext) {
    console.error("Web Audio API is not supported in this browser");
    return null;
  }
  
  try {
    // Create an offline audio context
    const offlineCtx = new OfflineAudioContext({
      numberOfChannels: 1,
      length: 44100 * 5, // 5 seconds
      sampleRate: 44100
    });
    
    // Create an oscillator
    const oscillator = offlineCtx.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(440, 0); // A4
    oscillator.frequency.linearRampToValueAtTime(880, 2.5); // Ramp to A5 over 2.5 seconds
    oscillator.frequency.linearRampToValueAtTime(440, 5); // Back to A4
    
    // Create a gain node
    const gainNode = offlineCtx.createGain();
    gainNode.gain.setValueAtTime(0, 0);
    gainNode.gain.linearRampToValueAtTime(0.7, 0.5); // Fade in
    gainNode.gain.setValueAtTime(0.7, 4);
    gainNode.gain.linearRampToValueAtTime(0, 5); // Fade out
    
    // Connect nodes
    oscillator.connect(gainNode);
    gainNode.connect(offlineCtx.destination);
    
    // Start the oscillator
    oscillator.start(0);
    oscillator.stop(5);
    
    // Render the audio
    return offlineCtx.startRendering().then(renderedBuffer => {
      // Create a blob from the rendered buffer
      const audioData = renderAudioBufferToWav(renderedBuffer);
      const audioBlob = new Blob([audioData], { type: 'audio/wav' });
      const audioUrl = URL.createObjectURL(audioBlob);
      
      return {
        url: audioUrl,
        revoke: () => URL.revokeObjectURL(audioUrl)
      };
    });
    
  } catch (error) {
    console.error("Error generating sample audio:", error);
    return null;
  }
};

// Helper function to convert AudioBuffer to WAV format
function renderAudioBufferToWav(audioBuffer: AudioBuffer): ArrayBuffer {
  const numOfChan = audioBuffer.numberOfChannels;
  const length = audioBuffer.length * numOfChan * 2;
  const buffer = new ArrayBuffer(44 + length);
  const view = new DataView(buffer);
  
  // Write WAV header
  // "RIFF" chunk descriptor
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + length, true);
  writeString(view, 8, 'WAVE');
  
  // "fmt " sub-chunk
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM format
  view.setUint16(22, numOfChan, true);
  view.setUint32(24, audioBuffer.sampleRate, true);
  view.setUint32(28, audioBuffer.sampleRate * 2 * numOfChan, true);
  view.setUint16(32, numOfChan * 2, true);
  view.setUint16(34, 16, true);
  
  // "data" sub-chunk
  writeString(view, 36, 'data');
  view.setUint32(40, length, true);
  
  // Write audio data
  const offset = 44;
  let pos = 0;
  
  for (let i = 0; i < audioBuffer.numberOfChannels; i++) {
    const channelData = audioBuffer.getChannelData(i);
    
    for (let j = 0; j < channelData.length; j++, pos += 2) {
      const sample = Math.max(-1, Math.min(1, channelData[j]));
      view.setInt16(offset + pos, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
    }
  }
  
  return buffer;
}

// Helper function to write strings to DataView
function writeString(view: DataView, offset: number, string: string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}
