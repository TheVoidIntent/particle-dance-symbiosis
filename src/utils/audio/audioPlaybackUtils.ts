
import { toast } from "sonner";
import { createFallbackAudioIfNeeded } from "./audioGenerationUtils";

/**
 * Utilities for audio playback with error handling
 */

/**
 * Play an audio file with comprehensive error handling
 */
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
