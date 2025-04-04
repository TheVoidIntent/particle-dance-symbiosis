
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
  "Intent as a Universal Information Filter (2) copy",
  "Intent as a Universal Information Filter (5)",
  "IntentSim_Podcast_Ep01",
  "particle_genesis"
];

let currentTrackIndex = 0;
let isPlaying = false;
let audioElement: HTMLAudioElement | null = null;

/**
 * Start playing the audio playlist in loop
 */
export function startAudioPlaylist(initialVolume: number = 0.5): void {
  if (!audioElement) {
    audioElement = new Audio();
    audioElement.id = 'audio-playlist';
    audioElement.volume = initialVolume;
    
    // When one audio track ends, play the next one
    audioElement.addEventListener('ended', playNextTrack);
    
    // Handle errors
    audioElement.addEventListener('error', (e) => {
      console.error('Audio playback error:', e);
      // Try the next track if there's an error
      setTimeout(playNextTrack, 1000);
    });
    
    document.body.appendChild(audioElement);
  }
  
  isPlaying = true;
  playCurrentTrack();
}

/**
 * Stop the audio playlist
 */
export function stopAudioPlaylist(): void {
  if (audioElement) {
    audioElement.pause();
    isPlaying = false;
  }
}

/**
 * Set the volume for the audio playlist
 */
export function setAudioPlaylistVolume(volume: number): void {
  if (audioElement) {
    audioElement.volume = Math.min(Math.max(volume, 0), 1);
  }
}

/**
 * Play the next track in the playlist
 */
function playNextTrack(): void {
  if (!isPlaying) return;
  
  currentTrackIndex = (currentTrackIndex + 1) % audioTracks.length;
  playCurrentTrack();
}

/**
 * Play the current track
 */
function playCurrentTrack(): void {
  if (!audioElement || !isPlaying) return;
  
  const trackName = audioTracks[currentTrackIndex];
  // Using the public audio folder path
  const audioUrl = `/audio/${trackName}.wav`;
  
  audioElement.src = audioUrl;
  audioElement.play().catch(e => {
    console.error("Error playing track:", trackName, e);
    // Try the next track if there's an error
    setTimeout(playNextTrack, 1000);
  });
  
  console.log("Now playing:", trackName);
}

/**
 * Toggle play/pause of the audio playlist
 */
export function toggleAudioPlaylist(): boolean {
  if (isPlaying) {
    stopAudioPlaylist();
  } else {
    startAudioPlaylist();
  }
  return isPlaying;
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
  return audioTracks[currentTrackIndex];
}
