
// Utility functions for exporting simulation data

// Get the current simulation data (mock implementation for now)
export const getSimulationData = () => {
  try {
    // This would normally come from a store or API
    const data = JSON.parse(localStorage.getItem('currentSimulationData') || '[]');
    return data;
  } catch (error) {
    console.error('Error retrieving simulation data:', error);
    return [];
  }
};

// Export data as CSV
export const exportAsCSV = (data: any[], filename: string) => {
  if (!data.length) return;
  
  // Get headers from the first object
  const headers = Object.keys(data[0]);
  
  // Convert each object to a CSV row
  const csvRows = [
    headers.join(','), // Header row
    ...data.map(row => 
      headers.map(header => {
        // Handle special values like Infinity
        if (row[header] === Infinity || row[header] === -Infinity) {
          return '"Infinity"';
        }
        // Handle nested objects
        if (typeof row[header] === 'object' && row[header] !== null) {
          return `"${JSON.stringify(row[header]).replace(/"/g, '""')}"`;
        }
        // Handle other values
        return `"${row[header]}"`
      }).join(',')
    )
  ];
  
  // Create CSV content
  const csvContent = csvRows.join('\n');
  
  // Create a blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Export data as JSON
export const exportAsJSON = (data: any, filename: string) => {
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
  const jsonString = JSON.stringify(processedData, null, 2);
  
  // Create a blob and download
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.json`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
