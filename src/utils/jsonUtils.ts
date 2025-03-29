/**
 * Utility functions for handling JSON serialization/deserialization
 * with support for special values like Infinity
 */

// Stringify an object with support for Infinity and other non-standard JSON values
export function stringifyWithInfinity(obj: any): string {
  return JSON.stringify(obj, (key, value) => {
    // Handle special number values
    if (typeof value === 'number') {
      if (value === Infinity) return "Infinity";
      if (value === -Infinity) return "-Infinity";
      if (Number.isNaN(value)) return "NaN";
    }
    return value;
  });
}

// Parse JSON with support for Infinity and other non-standard JSON values
export function parseJsonWithInfinity(json: string): any {
  return JSON.parse(json, (key, value) => {
    // Convert string representations back to their special number values
    if (value === "Infinity") return Infinity;
    if (value === "-Infinity") return -Infinity;
    if (value === "NaN") return NaN;
    return value;
  });
}

// Compress large JSON data for storage efficiency
export function compressJson(jsonString: string): string {
  // This is a simple placeholder - for real compression, you'd want to use
  // a library like pako or lz-string, but to keep dependencies minimal,
  // we're just using this method
  try {
    return btoa(encodeURIComponent(jsonString));
  } catch (e) {
    console.error("JSON compression failed", e);
    return jsonString;
  }
}

// Decompress JSON data
export function decompressJson(compressed: string): string {
  try {
    return decodeURIComponent(atob(compressed));
  } catch (e) {
    console.error("JSON decompression failed", e);
    return compressed;
  }
}

// For large datasets, consider compression
export function storeCompressedJson(key: string, data: any): boolean {
  try {
    const jsonString = stringifyWithInfinity(data);
    
    // Only compress if the data is large
    const shouldCompress = jsonString.length > 100000;
    const valueToStore = shouldCompress 
      ? `compressed:${compressJson(jsonString)}`
      : jsonString;
    
    localStorage.setItem(key, valueToStore);
    return true;
  } catch (e) {
    console.error(`Failed to store data for key ${key}:`, e);
    return false;
  }
}

// Retrieve and potentially decompress stored data
export function retrieveCompressedJson(key: string): any | null {
  try {
    const stored = localStorage.getItem(key);
    if (!stored) return null;
    
    // Check if data is compressed
    if (stored.startsWith('compressed:')) {
      const compressed = stored.substring(11);
      const decompressed = decompressJson(compressed);
      return parseJsonWithInfinity(decompressed);
    }
    
    // Not compressed
    return parseJsonWithInfinity(stored);
  } catch (e) {
    console.error(`Failed to retrieve data for key ${key}:`, e);
    return null;
  }
}
