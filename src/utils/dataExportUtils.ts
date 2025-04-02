import { Particle, SimulationStats } from '@/types/simulation';
import { toast } from 'sonner';

// In-memory storage for collected data
let collectedData: any[] = [];
let dataCollectionActive = true;

// Record a data point
export function recordDataPoint(
  timestamp: number,
  particles: Particle[],
  intentField: number[][][],
  interactionsCount: number,
  clusterAnalysis: any,
  systemEntropy: number,
  complexityIndex: number,
  extraMetrics: any = {}
): void {
  if (!dataCollectionActive) return;
  
  // Calculate particle type counts
  const positiveCount = particles.filter(p => p.charge === 'positive').length;
  const negativeCount = particles.filter(p => p.charge === 'negative').length;
  const neutralCount = particles.filter(p => p.charge === 'neutral').length;
  
  // Calculate average knowledge
  const totalKnowledge = particles.reduce((sum, p) => sum + (p.knowledge || 0), 0);
  const averageKnowledge = particles.length > 0 ? totalKnowledge / particles.length : 0;
  
  // Create data point
  const dataPoint = {
    timestamp,
    particles: {
      total: particles.length,
      positive: positiveCount,
      negative: negativeCount,
      neutral: neutralCount,
      averageKnowledge,
    },
    field: {
      size: intentField.length > 0 ? [intentField.length, intentField[0].length, intentField[0][0].length] : [0, 0, 0],
      entropy: systemEntropy,
      complexity: extraMetrics.fieldOrderParameter || 0,
    },
    interactions: interactionsCount,
    clusters: {
      count: clusterAnalysis?.clusterCount || 0,
      averageSize: clusterAnalysis?.averageSize || 0,
      largestSize: clusterAnalysis?.largestSize || 0,
    },
    complexity: complexityIndex,
    metrics: extraMetrics,
    timeIso: new Date(timestamp).toISOString()
  };
  
  // Store data
  collectedData.push(dataPoint);
  
  // Trim data if it gets too large (keep last 1000 points)
  if (collectedData.length > 1000) {
    collectedData = collectedData.slice(collectedData.length - 1000);
  }
  
  // Log every 100th data point for debugging
  if (collectedData.length % 100 === 0) {
    console.log(`Data collection: ${collectedData.length} points recorded`);
  }
}

// Export collected data as JSON
export function exportDataAsJson(): string {
  const jsonData = JSON.stringify(collectedData, null, 2);
  
  // Create download link
  const blob = new Blob([jsonData], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `intentsim_data_${new Date().toISOString().slice(0,19).replace(/:/g,'-')}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  toast.success(`Exported ${collectedData.length} data points as JSON`);
  return url;
}

// Export collected data as CSV
export function exportDataAsCsv(): string {
  if (collectedData.length === 0) {
    toast.error("No data to export");
    return "";
  }
  
  // Get all possible keys to handle varying data structures
  const allKeys = new Set<string>();
  const flattenObject = (obj: any, prefix = '') => {
    for (const key in obj) {
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        flattenObject(obj[key], `${prefix}${key}_`);
      } else {
        allKeys.add(`${prefix}${key}`);
      }
    }
  };
  
  collectedData.forEach(dataPoint => flattenObject(dataPoint));
  const headers = Array.from(allKeys);
  
  // Convert data to CSV
  const getFlatValue = (obj: any, path: string): string => {
    const parts = path.split('_');
    let current = obj;
    
    for (let i = 0; i < parts.length; i++) {
      if (current === undefined || current === null) return '';
      current = current[parts[i]];
    }
    
    return current !== undefined && current !== null ? current.toString() : '';
  };
  
  const csvRows = [headers.join(',')];
  collectedData.forEach(dataPoint => {
    const values = headers.map(header => {
      const value = getFlatValue(dataPoint, header);
      // Quote strings containing commas
      return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
    });
    csvRows.push(values.join(','));
  });
  
  const csvContent = csvRows.join('\n');
  
  // Create download link
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `intentsim_data_${new Date().toISOString().slice(0,19).replace(/:/g,'-')}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  toast.success(`Exported ${collectedData.length} data points as CSV`);
  return url;
}

// Generate a PDF report with the current data
export async function exportDataAsPdf(): Promise<string> {
  try {
    // Import libraries dynamically to reduce initial load size
    const { jsPDF } = await import('jspdf');
    const { autoTable } = await import('jspdf-autotable');
    
    // Create PDF document
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(18);
    doc.text('IntentSim Simulation Data Report', 14, 22);
    
    // Add timestamp
    doc.setFontSize(12);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 30);
    
    // Add summary metrics
    doc.setFontSize(14);
    doc.text('Summary Statistics', 14, 40);
    
    const lastDataPoint = collectedData[collectedData.length - 1] || {};
    const summaryData = [
      ['Total Data Points', collectedData.length.toString()],
      ['Particle Count', lastDataPoint.particles?.total?.toString() || '0'],
      ['Positive Particles', lastDataPoint.particles?.positive?.toString() || '0'],
      ['Negative Particles', lastDataPoint.particles?.negative?.toString() || '0'],
      ['Neutral Particles', lastDataPoint.particles?.neutral?.toString() || '0'],
      ['Total Interactions', lastDataPoint.interactions?.toString() || '0'],
      ['Complexity Index', lastDataPoint.complexity?.toFixed(2) || '0'],
      ['System Entropy', lastDataPoint.field?.entropy?.toFixed(2) || '0'],
    ];
    
    autoTable(doc, {
      startY: 45,
      head: [['Metric', 'Value']],
      body: summaryData,
      theme: 'striped',
      styles: { fontSize: 10 },
      headStyles: { fillColor: [41, 128, 185] },
    });
    
    // Add data sample
    doc.setFontSize(14);
    doc.text('Data Sample (Last 10 Records)', 14, doc.lastAutoTable.finalY + 15);
    
    const sampleData = collectedData.slice(-10).map(dp => [
      new Date(dp.timestamp).toLocaleString(),
      dp.particles?.total?.toString() || '0',
      dp.interactions?.toString() || '0',
      dp.complexity?.toFixed(2) || '0',
      dp.field?.entropy?.toFixed(2) || '0',
    ]);
    
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 20,
      head: [['Timestamp', 'Particles', 'Interactions', 'Complexity', 'Entropy']],
      body: sampleData,
      theme: 'grid',
      styles: { fontSize: 8 },
      headStyles: { fillColor: [41, 128, 185] },
    });
    
    // Generate charts if data is available
    if (collectedData.length > 1) {
      try {
        // For a real implementation, we would add chart generation here
        // using libraries like Chart.js to create and embed charts
        doc.setFontSize(14);
        doc.text('Data Visualization would appear here', 14, doc.lastAutoTable.finalY + 15);
      } catch (error) {
        console.error('Error generating charts:', error);
      }
    }
    
    // Add footer
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.text(
        `IntentSim.org - Page ${i} of ${pageCount}`,
        doc.internal.pageSize.getWidth() / 2,
        doc.internal.pageSize.getHeight() - 10,
        { align: 'center' }
      );
    }
    
    // Save the PDF
    const filename = `intentsim_report_${new Date().toISOString().slice(0,19).replace(/:/g,'-')}.pdf`;
    doc.save(filename);
    
    toast.success('PDF report generated successfully');
    return filename;
  } catch (error) {
    console.error('Error generating PDF:', error);
    toast.error('Failed to generate PDF report');
    return '';
  }
}

// Toggle data collection
export function toggleDataCollection(active?: boolean): boolean {
  if (active !== undefined) {
    dataCollectionActive = active;
  } else {
    dataCollectionActive = !dataCollectionActive;
  }
  
  toast.info(dataCollectionActive ? 'Data collection enabled' : 'Data collection paused');
  return dataCollectionActive;
}

// Get data collection status
export function isDataCollectionActive(): boolean {
  return dataCollectionActive;
}

// Clear collected data
export function clearSimulationData(): void {
  collectedData = [];
  toast.info('Simulation data cleared');
}

// Clear persisted state from localStorage
export function clearPersistedState(): void {
  localStorage.removeItem('intentsim-state');
  localStorage.removeItem('motherSimulationState');
  localStorage.removeItem('simulationConfig');
  toast.info('Persisted simulation state cleared');
}

// Get collected data count
export function getDataCount(): number {
  return collectedData.length;
}

// Get last data point
export function getLastDataPoint(): any {
  return collectedData.length > 0 ? collectedData[collectedData.length - 1] : null;
}
