
/**
 * Utility functions for handling JSON serialization/deserialization with special values
 */

/**
 * Parse JSON with special handling for Infinity and similar values
 */
export const parseJsonWithInfinity = (jsonString: string): any => {
  return JSON.parse(jsonString, (key, value) => {
    // Convert string 'Infinity', '-Infinity' back to actual numbers
    if (value === 'Infinity') return Infinity;
    if (value === '-Infinity') return -Infinity;
    if (value === 'NaN') return NaN;
    return value;
  });
};

/**
 * Stringify with special handling for Infinity and similar values
 */
export const stringifyWithInfinity = (data: any, space: number = 2): string => {
  return JSON.stringify(data, (key, value) => {
    // Convert Infinity, -Infinity, NaN to strings
    if (value === Infinity) return 'Infinity';
    if (value === -Infinity) return '-Infinity';
    if (typeof value === 'number' && isNaN(value)) return 'NaN';
    return value;
  }, space);
};

/**
 * Save data to localStorage with error handling and Infinity support
 */
export const saveToLocalStorage = (key: string, data: any): boolean => {
  try {
    const serialized = stringifyWithInfinity(data);
    localStorage.setItem(key, serialized);
    return true;
  } catch (error) {
    console.error(`Error saving to localStorage (${key}):`, error);
    return false;
  }
};

/**
 * Get data from localStorage with error handling and Infinity support
 */
export const getFromLocalStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const serialized = localStorage.getItem(key);
    if (serialized === null) return defaultValue;
    return parseJsonWithInfinity(serialized);
  } catch (error) {
    console.error(`Error getting from localStorage (${key}):`, error);
    return defaultValue;
  }
};

/**
 * Generate a unique ID for tracking objects
 */
export const generateUniqueId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
};
