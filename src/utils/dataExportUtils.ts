
import { saveAs } from 'file-saver';
import { parse } from 'date-fns';
import { SimulationStats } from '@/types/simulation';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Types
interface DataPoint {
  timestamp: number;
  stats: SimulationStats;
  particles?: any[];
}

// In-memory storage for data points
let simulationDataPoints: DataPoint[] = [];
let dataCollectionActive = false;

// Toggle data collection
export function toggleDataCollection(): boolean {
  dataCollectionActive = !dataCollectionActive;
  if (!dataCollectionActive) {
    simulationDataPoints = [];
  }
  return dataCollectionActive;
}

// Check if data collection is active
export function isDataCollectionActive(): boolean {
  return dataCollectionActive;
}

// Record a data point
export function recordDataPoint(stats: SimulationStats, particles?: any[]): void {
  if (!dataCollectionActive) return;
  
  simulationDataPoints.push({
    timestamp: Date.now(),
    stats,
    particles: particles ? [...particles] : undefined
  });
  
  console.log(`Data point recorded: ${simulationDataPoints.length} total points`);
}

// Clear all simulation data
export function clearSimulationData(): void {
  simulationDataPoints = [];
  console.log('Simulation data cleared');
}

// Get the number of data points collected
export function getDataPointCount(): number {
  return simulationDataPoints.length;
}

// Check if there is any data to export
export function hasDataToExport(): boolean {
  return simulationDataPoints.length > 0;
}

// Export data as CSV
export function exportDataAsCsv(filename: string = 'simulation_data'): void {
  if (simulationDataPoints.length === 0) {
    console.warn('No data to export');
    return;
  }
  
  // Get all possible stat keys from all data points
  const allKeys = new Set<string>();
  simulationDataPoints.forEach(point => {
    Object.keys(point.stats).forEach(key => allKeys.add(key));
  });
  
  // Create header row
  const headerRow = ['timestamp', ...Array.from(allKeys)];
  
  // Create data rows
  const dataRows = simulationDataPoints.map(point => {
    const row: (string | number)[] = [new Date(point.timestamp).toISOString()];
    
    // Add each stat, or 'N/A' if missing
    Array.from(allKeys).forEach(key => {
      const value = (point.stats as any)[key];
      row.push(value !== undefined ? value : 'N/A');
    });
    
    return row;
  });
  
  // Combine header and data rows
  const csvContent = [
    headerRow.join(','),
    ...dataRows.map(row => row.join(','))
  ].join('\n');
  
  // Create and download the file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
  saveAs(blob, `${filename}_${Date.now()}.csv`);
}

// Export data as JSON
export function exportDataAsJson(filename: string = 'simulation_data'): void {
  if (simulationDataPoints.length === 0) {
    console.warn('No data to export');
    return;
  }
  
  const jsonData = {
    exportTimestamp: Date.now(),
    totalDataPoints: simulationDataPoints.length,
    dataPoints: simulationDataPoints
  };
  
  // Create and download the file
  const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
  saveAs(blob, `${filename}_${Date.now()}.json`);
}

// Export data as PDF
export function exportDataAsPdf(filename: string = 'simulation_report'): void {
  if (simulationDataPoints.length === 0) {
    console.warn('No data to export');
    return;
  }
  
  // Create new PDF document
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(18);
  doc.text('Intent Simulation Data Report', 14, 22);
  
  // Add metadata
  doc.setFontSize(12);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 32);
  doc.text(`Data Points: ${simulationDataPoints.length}`, 14, 38);
  
  // Calculate stats summary
  const lastPoint = simulationDataPoints[simulationDataPoints.length - 1];
  const firstPoint = simulationDataPoints[0];
  
  // Create summary table
  const summaryData = [
    ['Start Time', new Date(firstPoint.timestamp).toLocaleString()],
    ['End Time', new Date(lastPoint.timestamp).toLocaleString()],
    ['Duration', `${Math.round((lastPoint.timestamp - firstPoint.timestamp) / 1000)} seconds`],
    ['Particle Count (Final)', lastPoint.stats.particleCount || 'N/A'],
    ['Complexity Index (Final)', lastPoint.stats.complexityIndex?.toFixed(2) || 'N/A'],
    ['Avg. Knowledge (Final)', lastPoint.stats.averageKnowledge?.toFixed(2) || 'N/A']
  ];
  
  autoTable(doc, {
    head: [['Metric', 'Value']],
    body: summaryData,
    startY: 45,
    theme: 'grid'
  });
  
  // Create data samples table (just show a few points)
  const sampleIndices = [0];
  if (simulationDataPoints.length > 1) sampleIndices.push(Math.floor(simulationDataPoints.length / 2));
  if (simulationDataPoints.length > 2) sampleIndices.push(simulationDataPoints.length - 1);
  
  const sampleData = sampleIndices.map(index => {
    const point = simulationDataPoints[index];
    return [
      new Date(point.timestamp).toLocaleString(),
      point.stats.particleCount || 'N/A',
      point.stats.complexityIndex?.toFixed(2) || 'N/A',
      point.stats.averageKnowledge?.toFixed(2) || 'N/A'
    ];
  });
  
  autoTable(doc, {
    head: [['Timestamp', 'Particles', 'Complexity', 'Knowledge']],
    body: sampleData,
    startY: doc.lastAutoTable.finalY + 15,
    theme: 'grid',
    headStyles: { fillColor: [66, 135, 245] }
  });
  
  // Save the document
  doc.save(`${filename}_${Date.now()}.pdf`);
}

// Load stored data points
export function getStoredDataPoints(): DataPoint[] {
  return [...simulationDataPoints];
}

// Check if we should collect data
export function shouldCollectData(): boolean {
  return dataCollectionActive;
}
