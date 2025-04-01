
import { toast } from "sonner";

/**
 * Check if an audio file exists and can be loaded
 */
export const checkAudioFileExists = async (url: string): Promise<{ exists: boolean; error?: any }> => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return { 
      exists: response.ok,
    };
  } catch (error) {
    console.error(`Error checking audio file ${url}:`, error);
    return { 
      exists: false, 
      error 
    };
  }
};
