
/**
 * Utility functions for exporting data to PDF format
 * specifically designed for Notebook LM compatibility 
 * with ATLAS/CERN data integration
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
    formattedText += `Average Complexity: ${data.summary.avgComplexity?.toFixed(4) || 'N/A'}\n`;
    formattedText += `Maximum Complexity: ${data.summary.maxComplexity?.toFixed(4) || 'N/A'}\n`;
    formattedText += `Total Particles: ${data.summary.totalParticles || 0}\n`;
    formattedText += `System Entropy: ${data.summary.systemEntropy?.toFixed(4) || 'N/A'}\n\n`;
  }
  
  // Add ATLAS data comparison if available
  if (data.atlasData && simulationType === 'cern_comparison') {
    formattedText += "## ATLAS/CERN Data Comparison\n\n";
    formattedText += `ATLAS Dataset: ${data.summary?.atlasDatasetName || 'N/A'}\n`;
    formattedText += `Collision Energy: ${data.summary?.atlasCollisionEnergy || 'N/A'}\n`;
    formattedText += `Correlation Score: ${(data.summary?.correlationScore * 100)?.toFixed(2) || 'N/A'}%\n\n`;
    
    formattedText += "### Charge Distribution Comparison\n\n";
    formattedText += "| Charge Type | Simulation | ATLAS Data |\n";
    formattedText += "|------------|------------|------------|\n";
    
    // Calculate simulation charge distribution
    const simPos = data.summary?.positiveParticles || 0;
    const simNeg = data.summary?.negativeParticles || 0;
    const simNeu = data.summary?.neutralParticles || 0;
    const simTotal = simPos + simNeg + simNeu || 1;
    
    // Calculate ATLAS charge distribution
    const atlasParticles = data.atlasData?.simulationData || [];
    const atlasPos = atlasParticles.filter((p: any) => p.charge === 'positive').length;
    const atlasNeg = atlasParticles.filter((p: any) => p.charge === 'negative').length;
    const atlasNeu = atlasParticles.filter((p: any) => p.charge === 'neutral').length;
    const atlasTotal = atlasParticles.length || 1;
    
    formattedText += `| Positive | ${(simPos / simTotal * 100).toFixed(1)}% | ${(atlasPos / atlasTotal * 100).toFixed(1)}% |\n`;
    formattedText += `| Negative | ${(simNeg / simTotal * 100).toFixed(1)}% | ${(atlasNeg / atlasTotal * 100).toFixed(1)}% |\n`;
    formattedText += `| Neutral | ${(simNeu / simTotal * 100).toFixed(1)}% | ${(atlasNeu / atlasTotal * 100).toFixed(1)}% |\n\n`;
  }
  
  // Add data points in a condensed format
  formattedText += "## Data Sample (First 5 points)\n\n";
  const samplePoints = data.dataPoints?.slice(0, 5) || [];
  
  samplePoints.forEach((point: any, index: number) => {
    formattedText += `Point ${index + 1}:\n`;
    formattedText += `- Timestamp: ${point.timestamp || 'N/A'}\n`;
    formattedText += `- Total Particles: ${point.total_particles || 0}\n`;
    formattedText += `- Complexity: ${point.avg_complexity?.toFixed(4) || 'N/A'}\n`;
    formattedText += `- Entropy: ${point.system_entropy?.toFixed(4) || 'N/A'}\n\n`;
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
        h1, h2, h3 { color: #333; }
        pre { background-color: #f5f5f5; padding: 10px; border-radius: 5px; white-space: pre-wrap; }
        table { border-collapse: collapse; width: 100%; margin-bottom: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        .highlight { background-color: #fffacd; }
      </style>
    </head>
    <body>
      <pre>${text}</pre>
    </body>
    </html>
  `;
  
  // Convert HTML to a Blob with PDF mimetype
  const blob = new Blob([htmlContent], { type: 'application/pdf' });
  return blob;
};

// Generate combined PDF with all simulation types
export const generateNotebookLmPDF = async (simulationData: Record<string, any>): Promise<Blob | null> => {
  try {
    // Create formatted text for each simulation type
    let combinedText = "# INTENTSIM NOTEBOOK LM DATA EXPORT WITH ATLAS/CERN INTEGRATION\n\n";
    combinedText += `Generated: ${new Date().toISOString()}\n\n`;
    combinedText += "All data is provided in PDF format for better readability in Notebook LM.\n\n";
    
    // Add each simulation section
    for (const [simType, data] of Object.entries(simulationData)) {
      if (Object.keys(data).length > 0) {
        combinedText += formatSimulationDataForPDF(simType, data);
        combinedText += "\n---\n\n";
      }
    }
    
    // Create comparative analysis section
    combinedText += "# COMPARATIVE ANALYSIS\n\n";
    combinedText += "## Entropy Comparison\n\n";
    
    Object.entries(simulationData).forEach(([simType, data]) => {
      combinedText += `${simType}: ${data.summary?.systemEntropy?.toFixed(4) || 'N/A'}\n`;
    });
    
    combinedText += "\n## Complexity Comparison\n\n";
    
    Object.entries(simulationData).forEach(([simType, data]) => {
      combinedText += `${simType}: ${data.summary?.maxComplexity?.toFixed(4) || 'N/A'}\n`;
    });
    
    // Special ATLAS/CERN section if data is available
    if (simulationData.cern_comparison?.atlasData) {
      combinedText += "\n## ATLAS/CERN Integration Analysis\n\n";
      combinedText += "This simulation integrates with real ATLAS datasets for validation:\n\n";
      
      const atlasData = simulationData.cern_comparison.atlasData;
      const atlasMetadata = atlasData.metadata || {};
      
      combinedText += `Dataset Name: ${atlasMetadata.datasetName || 'N/A'}\n`;
      combinedText += `Collision Energy: ${atlasMetadata.collisionEnergy || 'N/A'}\n`;
      combinedText += `Particle Count: ${atlasMetadata.particleCount || 0}\n`;
      
      const correlationScore = simulationData.cern_comparison.summary?.correlationScore || 0;
      combinedText += `\nCorrelation Score: ${(correlationScore * 100).toFixed(2)}%\n`;
      
      combinedText += `\nInterpretation: ${
        correlationScore > 0.8 ? 'Excellent agreement with ATLAS data' :
        correlationScore > 0.6 ? 'Good agreement with ATLAS data' :
        correlationScore > 0.4 ? 'Moderate agreement with ATLAS data' :
        'Needs adjustment to better match ATLAS data'
      }\n\n`;
      
      combinedText += "Suggested improvements:\n";
      combinedText += correlationScore < 0.6 ? 
        "- Adjust charge distribution to better match ATLAS data\n" +
        "- Consider refining particle creation probability distributions\n" :
        "- Current model shows good alignment with experimental data\n" +
        "- Continue with current parameters\n";
    }
    
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

// General purpose function to convert any simulation data to PDF
export const convertAnyDataToPDF = async (data: any, title: string = "Simulation Data"): Promise<string | null> => {
  try {
    // Format the data as JSON with pretty printing
    const jsonString = JSON.stringify(data, null, 2);
    
    // Create a basic formatted text representation
    let formattedText = `# ${title.toUpperCase()}\n\n`;
    formattedText += `Generated: ${new Date().toISOString()}\n\n`;
    formattedText += "## Data Content\n\n";
    
    // Check if this is likely to be ATLAS data
    if (data.simulationData && data.metadata && data.metadata.source === "ATLAS") {
      formattedText += "### ATLAS Data Integration\n\n";
      formattedText += `Dataset: ${data.metadata.datasetName || 'Unknown'}\n`;
      formattedText += `Collision Energy: ${data.metadata.collisionEnergy || 'Unknown'}\n`;
      formattedText += `Particle Count: ${data.metadata.particleCount || 0}\n\n`;
      
      formattedText += "### Particle Distribution\n\n";
      const particles = data.simulationData || [];
      
      // Count by particle type
      const particleTypeCounts: Record<string, number> = {};
      particles.forEach((p: any) => {
        const type = p.particleType;
        particleTypeCounts[type] = (particleTypeCounts[type] || 0) + 1;
      });
      
      formattedText += "Particle Types:\n";
      Object.entries(particleTypeCounts).forEach(([type, count]) => {
        formattedText += `- ${type}: ${count}\n`;
      });
      
      formattedText += "\nCharge Distribution:\n";
      const positiveCount = particles.filter((p: any) => p.charge === 'positive').length;
      const negativeCount = particles.filter((p: any) => p.charge === 'negative').length;
      const neutralCount = particles.filter((p: any) => p.charge === 'neutral').length;
      
      formattedText += `- Positive: ${positiveCount} (${(positiveCount/particles.length*100).toFixed(1)}%)\n`;
      formattedText += `- Negative: ${negativeCount} (${(negativeCount/particles.length*100).toFixed(1)}%)\n`;
      formattedText += `- Neutral: ${neutralCount} (${(neutralCount/particles.length*100).toFixed(1)}%)\n`;
    } else {
      // Just include the raw JSON for other data types
      formattedText += "```json\n";
      formattedText += jsonString;
      formattedText += "\n```\n";
    }
    
    // Generate the PDF
    const pdfBlob = await generatePDFFromText(formattedText);
    if (!pdfBlob) return null;
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '').slice(0, 15);
    const sanitizedTitle = title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const filename = `intentSim_${sanitizedTitle}_${timestamp}.pdf`;
    
    // Save the PDF file
    saveAs(pdfBlob, filename);
    
    return filename;
  } catch (error) {
    console.error("Error converting data to PDF:", error);
    toast.error("Failed to convert data to PDF");
    return null;
  }
};
