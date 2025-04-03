
import { jsPDF } from 'jspdf';
import { SimulationState } from './simulation/state';

/**
 * Export simulation data to PDF for NotebookLM
 * @param simulationState Current simulation state
 * @returns Filename of the exported PDF
 */
export async function exportSimulationDataToPDF(simulationState: SimulationState): Promise<string> {
  // Create a new PDF document
  const doc = new jsPDF();
  const timestamp = new Date().toISOString().replace(/:/g, '-').slice(0, 19);
  const filename = `simulation-data-${timestamp}.pdf`;
  
  // Add title
  doc.setFontSize(16);
  doc.text('Simulation Data Export', 15, 15);
  
  // Add timestamp
  doc.setFontSize(12);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 15, 25);
  
  // Add basic simulation stats
  doc.text('Simulation Statistics:', 15, 35);
  doc.setFontSize(10);
  doc.text(`Particles: ${simulationState.particles.length}`, 20, 45);
  doc.text(`Interactions: ${simulationState.interactionsCount}`, 20, 52);
  doc.text(`Simulation Time: ${simulationState.simulationTime.toFixed(2)}`, 20, 59);
  doc.text(`Frame Count: ${simulationState.frameCount}`, 20, 66);
  
  // Add particle type breakdown
  const positiveCount = simulationState.particles.filter(p => p.charge === 'positive').length;
  const negativeCount = simulationState.particles.filter(p => p.charge === 'negative').length;
  const neutralCount = simulationState.particles.filter(p => p.charge === 'neutral').length;
  
  doc.text('Particle Distribution:', 15, 76);
  doc.text(`Positive: ${positiveCount}`, 20, 83);
  doc.text(`Negative: ${negativeCount}`, 20, 90);
  doc.text(`Neutral: ${neutralCount}`, 20, 97);
  
  // Add cluster analysis if available
  doc.text('Intent Field Analysis:', 15, 107);
  doc.text('Data is being continuously processed for emergent patterns...', 20, 114);
  
  // Add robot evolution section
  doc.text('Robot Evolution Status:', 15, 124);
  doc.text('Monitoring for emergent intelligent agents...', 20, 131);
  
  // Save the PDF
  try {
    // In a real implementation, we would save the file to disk or cloud storage
    console.log(`Simulation data exported to PDF: ${filename}`);
    
    // For browser environment, we'd trigger a download
    if (typeof window !== 'undefined') {
      doc.save(filename);
    }
    
    return filename;
  } catch (error) {
    console.error('Error saving PDF:', error);
    return '';
  }
}

/**
 * Schedule regular exports to NotebookLM
 * @param intervalMinutes Minutes between exports
 * @returns Cleanup function
 */
export function scheduleRegularExports(intervalMinutes: number = 30): () => void {
  console.log(`Scheduling regular exports every ${intervalMinutes} minutes`);
  
  // Set up interval for regular exports
  const intervalId = setInterval(() => {
    // Import the simulation state dynamically to avoid circular dependencies
    import('./simulation/state').then(({ simulationState }) => {
      console.log('Running scheduled export to NotebookLM');
      exportSimulationDataToPDF(simulationState)
        .then(filename => {
          if (filename) {
            console.log(`Successfully exported data to ${filename}`);
          }
        })
        .catch(error => {
          console.error('Error in scheduled export:', error);
        });
    });
  }, intervalMinutes * 60 * 1000);
  
  // Return cleanup function
  return () => {
    clearInterval(intervalId);
    console.log('Regular exports stopped');
  };
}

/**
 * Initialize NotebookLM integration
 */
export function initNotebookLmIntegration(): void {
  console.log('Initializing NotebookLM integration');
  
  // Start regular exports
  const cleanup = scheduleRegularExports(30); // Export every 30 minutes
  
  // Handle cleanup on window unload
  if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', cleanup);
  }
}
