
import { playLoopingAudio, stopLoopingAudio, setLoopingAudioVolume } from './audioPlaybackUtils';

// Audio tracks playlist
const audioTracks = [
  "Are you a Skeptic",
  "The Composer",
  "Deeper And Deeper",
  "El Nutrino Chismoso",
  "Fast way Down and Far",
  "Filtrando Otra Vez",
  "From THe Heart",
  "Get to know ME",
  "Git Yours",
  "How Fast Can You Go",
  "I go It From You",
  "In Deep waters",
  "The Intentional Universe",
  "Is Your AI Really Learning",
  "The Map",
  "The Missing Peice",
  "The Nexus",
  "Particle Genesis",
  "So Neat",
  "The Sourse Bawl",
  "Who Am I",
  "The Why",
  "cosmos",
  "Intent as a Universal Information Filter (1) 1",
  "Intent as a Universal Information Filter (2) (1)-1",
  "Intent as a Universal Information Filter (2) (1)-2",
  "particle_genesis"
];

let currentTrackIndex = 0;
let isPlaying = false;
let audioElement: HTMLAudioElement | null = null;

/**
 * Start playing the audio playlist continuously
 */
export function startAudioPlaylist(volume: number = 0.5): void {
  try {
    if (!audioElement) {
      audioElement = new Audio();
      audioElement.volume = volume;
      
      // When one audio track ends, play the next one
      audioElement.addEventListener('ended', playNextTrack);
      
      // Handle errors
      audioElement.addEventListener('error', (e) => {
        console.error('Audio playback error:', e);
        // Try the next track if there's an error
        setTimeout(playNextTrack, 1000);
      });
    }
    
    isPlaying = true;
    playCurrentTrack();
  } catch (error) {
    console.error("Error starting audio playlist:", error);
  }
}

/**
 * Stop the audio playlist
 */
export function stopAudioPlaylist(): void {
  try {
    if (audioElement) {
      audioElement.pause();
      isPlaying = false;
    }
  } catch (error) {
    console.error("Error stopping audio playlist:", error);
  }
}

/**
 * Set the volume for the audio playlist
 */
export function setAudioPlaylistVolume(volume: number): void {
  try {
    if (audioElement) {
      audioElement.volume = Math.min(Math.max(volume, 0), 1);
    }
  } catch (error) {
    console.error("Error setting audio volume:", error);
  }
}

/**
 * Play the next track in the playlist
 */
function playNextTrack(): void {
  try {
    if (!isPlaying) return;
    
    currentTrackIndex = (currentTrackIndex + 1) % audioTracks.length;
    playCurrentTrack();
  } catch (error) {
    console.error("Error playing next track:", error);
  }
}

/**
 * Play the current track
 */
function playCurrentTrack(): void {
  try {
    if (!audioElement || !isPlaying) return;
    
    const trackName = audioTracks[currentTrackIndex];
    
    // Using the public audio folder path
    const audioUrl = `/audio/qfplS_${Math.floor(Math.random() * 100) + 1}.wav`;
    
    console.log("Attempting to play:", audioUrl);
    
    audioElement.src = audioUrl;
    audioElement.play().catch(e => {
      console.error("Error playing track:", trackName, e);
      // Try the next track if there's an error
      setTimeout(playNextTrack, 1000);
    });
    
    console.log("Now playing:", trackName);
  } catch (error) {
    console.error("Error playing current track:", error);
  }
}

/**
 * Toggle play/pause of the audio playlist
 */
export function toggleAudioPlaylist(): boolean {
  try {
    if (isPlaying) {
      stopAudioPlaylist();
    } else {
      startAudioPlaylist();
    }
    return isPlaying;
  } catch (error) {
    console.error("Error toggling audio playlist:", error);
    return false;
  }
}

/**
 * Check if the audio playlist is currently playing
 */
export function isAudioPlaylistPlaying(): boolean {
  return isPlaying;
}

/**
 * Get the name of the currently playing track
 */
export function getCurrentTrackName(): string {
  return audioTracks[currentTrackIndex] || "Unknown Track";
}
