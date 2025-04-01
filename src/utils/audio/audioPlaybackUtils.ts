
import { toast } from "sonner";
import { createFallbackAudioIfNeeded } from "./audioGenerationUtils";
import { checkAudioFileExists } from "./audioFileUtils";

/**
 * Utilities for audio playback with error handling
 */

/**
 * Play an audio file with comprehensive error handling
 */
export const playAudioWithErrorHandling = async (audioUrl: string): Promise<{
  play: () => void;
  stop: () => void;
  isPlaying: boolean;
}> => {
  let audioElement: HTMLAudioElement | null = null;
  let playing = false;
  
  // First check if the audio file exists and is valid
  const fileCheck = await checkAudioFileExists(audioUrl);
  console.log(`Audio file check for ${audioUrl}:`, fileCheck);
  
  if (!fileCheck.exists || fileCheck.error) {
    console.warn(`Audio file not found or has errors: ${audioUrl}`, fileCheck.error);
    toast.error(`Audio file not available: ${fileCheck.error || 'Unknown error'}`);
    // Return a dummy player that will generate a fallback sound
    return {
      play: () => {
        console.log("Playing fallback audio instead of missing file:", audioUrl);
        createFallbackAudioIfNeeded();
        playing = true;
        // Set a timeout to simulate the audio ending
        setTimeout(() => {
          playing = false;
        }, 1000);
      },
      stop: () => {
        playing = false;
      },
      get isPlaying() { return playing; }
    };
  }
  
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
      
      // Create fallback audio if playback fails
      createFallbackAudioIfNeeded();
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
