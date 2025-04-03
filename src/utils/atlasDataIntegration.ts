
export interface AtlasDataset {
  id: string;
  name: string;
  description: string;
  size: string;
  particleType: string;
  energy: string;
  year: number;
  url: string;
}

/**
 * Get available ATLAS datasets for comparison
 */
export function getAvailableAtlasDatasets(): AtlasDataset[] {
  return [
    {
      id: "6004",
      name: "13 TeV collision data (2016)",
      description: "Data from the ATLAS detector at the LHC, proton-proton collisions at 13 TeV center-of-mass energy",
      size: "2.4 TB",
      particleType: "proton-proton",
      energy: "13 TeV",
      year: 2016,
      url: "https://opendata.cern.ch/record/6004"
    },
    {
      id: "6021",
      name: "8 TeV collision data (2012)",
      description: "Data from the ATLAS detector at the LHC, proton-proton collisions at 8 TeV center-of-mass energy",
      size: "1.8 TB",
      particleType: "proton-proton",
      energy: "8 TeV",
      year: 2012,
      url: "https://opendata.cern.ch/record/6021"
    },
    {
      id: "6025",
      name: "7 TeV collision data (2011)",
      description: "Data from the ATLAS detector at the LHC, proton-proton collisions at 7 TeV center-of-mass energy",
      size: "1.3 TB",
      particleType: "proton-proton",
      energy: "7 TeV",
      year: 2011,
      url: "https://opendata.cern.ch/record/6025"
    },
    {
      id: "6030",
      name: "2.76 TeV collision data (2013)",
      description: "Data from the ATLAS detector at the LHC, proton-proton collisions at 2.76 TeV center-of-mass energy",
      size: "0.9 TB",
      particleType: "proton-proton",
      energy: "2.76 TeV",
      year: 2013,
      url: "https://opendata.cern.ch/record/6030"
    },
    {
      id: "6150",
      name: "Heavy-ion collision data (2015)",
      description: "Data from the ATLAS detector at the LHC, lead-lead collisions",
      size: "3.1 TB",
      particleType: "lead-lead",
      energy: "5.02 TeV/nucleon",
      year: 2015,
      url: "https://opendata.cern.ch/record/6150"
    }
  ];
}

/**
 * Get ATLAS dataset by ID
 */
export function getAtlasDatasetById(id: string): AtlasDataset | undefined {
  return getAvailableAtlasDatasets().find(dataset => dataset.id === id);
}

/**
 * Compare simulation data with ATLAS data
 */
export function compareWithAtlasData(datasetId: string, simulationData: any): any {
  const dataset = getAtlasDatasetById(datasetId);
  
  if (!dataset) {
    console.error(`Dataset with ID ${datasetId} not found`);
    return null;
  }
  
  // In a real application, this would query the ATLAS dataset through an API
  // Here we'll just return a mock comparison
  return {
    dataset,
    comparisonTimestamp: new Date().toISOString(),
    matchScore: 0.42 + Math.random() * 0.2,
    deviations: {
      particleDistribution: 0.31 + Math.random() * 0.2,
      energySpectrum: 0.28 + Math.random() * 0.2,
      interactionRate: 0.37 + Math.random() * 0.2,
      clusterFormation: 0.44 + Math.random() * 0.2
    },
    insights: [
      "Simulation shows higher clustering rate than real data",
      "Energy distribution is more concentrated in the simulation",
      "Real data shows more quantum-level fluctuations"
    ]
  };
}
