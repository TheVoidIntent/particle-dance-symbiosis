
import { toast } from "sonner";

/**
 * Utilities for checking audio file existence and metadata
 */

/**
 * Check if an audio file exists by making a HEAD request
 */
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
      
      // Verify it's actually an audio file by checking content type and size
      const isAudioContentType = contentType && contentType.includes('audio');
      const hasContent = contentLength && parseInt(contentLength) > 100;
      
      if (!isAudioContentType) {
        console.warn(`File exists but not an audio file: ${path}, content type: ${contentType}`);
        return {
          exists: false,
          contentType: contentType || undefined,
          status: response.status,
          error: `Not an audio file (${contentType || 'unknown type'})`
        };
      }
      
      if (!hasContent) {
        console.warn(`Audio file exists but is empty or too small: ${path}, size: ${contentLength || 'unknown'} bytes`);
        return {
          exists: false,
          contentType: contentType || undefined,
          size: contentLength ? `${(parseInt(contentLength) / 1024).toFixed(2)} KB` : undefined,
          status: response.status,
          error: 'Audio file is empty or too small'
        };
      }
      
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
        headers: { 'Range': 'bytes=0-1000' } // Request just enough to determine if it's audio
      });
      
      if (getResponse.ok) {
        const contentType = getResponse.headers.get('Content-Type');
        const isAudioContentType = contentType && contentType.includes('audio');
        
        if (!isAudioContentType) {
          console.warn(`File exists but not an audio file: ${path}, content type: ${contentType}`);
          return {
            exists: false,
            contentType: contentType || undefined,
            status: getResponse.status,
            error: `Not an audio file (${contentType || 'unknown type'})`
          };
        }
        
        return {
          exists: true,
          contentType: contentType || undefined,
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
