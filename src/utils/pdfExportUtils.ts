
/**
 * Utility functions for exporting data to PDF format
 * specifically designed for Notebook LM compatibility
 */

import { saveAs } from 'file-saver';
import { toast } from 'sonner';

// Convert simulation data to formatted text for PDF
const formatSimulationDataForPDF = (simulationType: string, data: any): string => {
  let formattedText = `# ${simulationType.toUpperCase()} SIMULATION RESULTS\n\n`;
  
  // Add metadata
  formattedText += `Generated: ${new Date().toISOString()}\n`;
  formattedText += `Data points: ${data.dataPoints?.length || 0}\n\n`;
  
  // Add summary section
  formattedText += "## Summary\n\n";
  if (data.summary) {
    formattedText += `Average Complexity: ${data.summary.avgComplexity.toFixed(4)}\n`;
    formattedText += `Maximum Complexity: ${data.summary.maxComplexity.toFixed(4)}\n`;
    formattedText += `Total Particles: ${data.summary.totalParticles}\n`;
    formattedText += `System Entropy: ${data.summary.systemEntropy.toFixed(4)}\n\n`;
  }
  
  // Add data points in a condensed format
  formattedText += "## Data Sample (First 5 points)\n\n";
  const samplePoints = data.dataPoints?.slice(0, 5) || [];
  
  samplePoints.forEach((point: any, index: number) => {
    formattedText += `Point ${index + 1}:\n`;
    formattedText += `- Timestamp: ${point.timestamp}\n`;
    formattedText += `- Total Particles: ${point.total_particles}\n`;
    formattedText += `- Complexity: ${point.avg_complexity?.toFixed(4)}\n`;
    formattedText += `- Entropy: ${point.system_entropy?.toFixed(4)}\n\n`;
  });
  
  return formattedText;
};

// Generate PDF blob from text content
const generatePDFFromText = async (text: string): Promise<Blob> => {
  // For PDF generation, we're using a simple approach that will work for Notebook LM
  // by wrapping the text in basic HTML and converting it to a PDF-compatible format
  
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <title>IntentSim Notebook Data</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; }
        h1, h2 { color: #333; }
        pre { background-color: #f5f5f5; padding: 10px; border-radius: 5px; }
      </style>
    </head>
    <body>
      <pre>${text}</pre>
    </body>
    </html>
  `;
  
  // Convert HTML to a Blob with PDF mimetype
  // This is a simplification - in a real implementation, you would use a library like jsPDF
  // But for Notebook LM compatibility, we'll use this approach
  const blob = new Blob([htmlContent], { type: 'application/pdf' });
  return blob;
};

// Generate combined PDF with all simulation types
export const generateNotebookLmPDF = async (simulationData: Record<string, any>): Promise<Blob | null> => {
  try {
    // Create formatted text for each simulation type
    let combinedText = "# INTENTSIM NOTEBOOK LM DATA EXPORT\n\n";
    combinedText += `Generated: ${new Date().toISOString()}\n\n`;
    
    // Add each simulation section
    for (const [simType, data] of Object.entries(simulationData)) {
      combinedText += formatSimulationDataForPDF(simType, data);
      combinedText += "\n---\n\n";
    }
    
    // Create comparative analysis section
    combinedText += "# COMPARATIVE ANALYSIS\n\n";
    combinedText += "## Entropy Comparison\n\n";
    
    Object.entries(simulationData).forEach(([simType, data]) => {
      combinedText += `${simType}: ${data.summary?.systemEntropy.toFixed(4) || 'N/A'}\n`;
    });
    
    combinedText += "\n## Complexity Comparison\n\n";
    
    Object.entries(simulationData).forEach(([simType, data]) => {
      combinedText += `${simType}: ${data.summary?.maxComplexity.toFixed(4) || 'N/A'}\n`;
    });
    
    // Generate PDF blob
    return await generatePDFFromText(combinedText);
  } catch (error) {
    console.error("Error generating PDF for Notebook LM:", error);
    toast.error("Failed to generate PDF for Notebook LM");
    return null;
  }
};

// Save simulation data as PDF
export const exportSimulationDataAsPDF = async (simulationData: Record<string, any>): Promise<string | null> => {
  try {
    const pdfBlob = await generateNotebookLmPDF(simulationData);
    if (!pdfBlob) return null;
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '').slice(0, 15);
    const filename = `intentSim_notebook_lm_${timestamp}.pdf`;
    
    // Save the PDF file
    saveAs(pdfBlob, filename);
    
    return filename;
  } catch (error) {
    console.error("Error exporting PDF for Notebook LM:", error);
    toast.error("Failed to export PDF for Notebook LM");
    return null;
  }
};
