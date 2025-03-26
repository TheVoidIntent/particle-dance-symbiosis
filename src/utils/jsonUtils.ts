
/**
 * Utilities for handling JSON data with special values like Infinity
 */

/**
 * Parse JSON text while handling Infinity values
 * @param text The JSON text to parse
 * @returns Parsed JSON object
 */
export const parseJsonWithInfinity = (text: string): any => {
  // Replace Infinity values with strings before parsing
  const processedText = text
    .replace(/"avg_knowledge":\s*Infinity/g, '"avg_knowledge": "Infinity"')
    .replace(/"complexity_index":\s*Infinity/g, '"complexity_index": "Infinity"')
    .replace(/"value":\s*Infinity/g, '"value": "Infinity"')
    .replace(/"max_complexity":\s*Infinity/g, '"max_complexity": "Infinity"');
  
  return JSON.parse(processedText);
};

/**
 * Stringify an object while handling Infinity values
 * @param data The data to stringify
 * @param space Number of spaces for indentation
 * @returns JSON string
 */
export const stringifyWithInfinity = (data: any, space: number = 2): string => {
  // Convert Infinity values to strings before JSON stringification
  const processData = (obj: any): any => {
    if (obj === null || obj === undefined) return obj;
    
    if (typeof obj === 'number') {
      if (!isFinite(obj)) return obj.toString(); // Convert Infinity to string
      return obj;
    }
    
    if (Array.isArray(obj)) {
      return obj.map(item => processData(item));
    }
    
    if (typeof obj === 'object') {
      const processed: Record<string, any> = {};
      for (const key in obj) {
        processed[key] = processData(obj[key]);
      }
      return processed;
    }
    
    return obj;
  };
  
  const processedData = processData(data);
  return JSON.stringify(processedData, null, space);
};
