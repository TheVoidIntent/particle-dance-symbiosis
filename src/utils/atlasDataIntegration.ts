
/**
 * Atlas dataset type definition
 */
export interface AtlasParticle {
  id: string;
  type: string;
  energy: number;
  momentum: number;
  position: {
    x: number;
    y: number;
    z: number;
  };
  particleType: string;
  charge: 'positive' | 'negative' | 'neutral';
}

export interface AtlasDataset {
  id: string;
  name: string;
  description: string;
  particles: AtlasParticle[];
  collisionEnergy: number;
  date: string;
  experimentType: string;
  particleCount: number;
  runNumber: string;
  detectorConfiguration: string;
  year: number;
  DOI: string;
  format: string;
  dataSize: string;
  eventCount: number;
}

/**
 * Get available ATLAS datasets
 */
export function getAvailableAtlasDatasets(): AtlasDataset[] {
  // Mocked data - in a real application, this would fetch from an API
  return [
    {
      id: 'atlas-1',
      name: 'Higgs Boson Candidate Events',
      description: 'ATLAS Higgs boson candidate events from 2012 data',
      particles: Array.from({ length: 25 }, (_, i) => ({
        id: `particle-${i}`,
        type: i % 3 === 0 ? 'boson' : 'fermion',
        energy: 100 + Math.random() * 900,
        momentum: 50 + Math.random() * 450,
        position: {
          x: Math.random() * 100 - 50,
          y: Math.random() * 100 - 50,
          z: Math.random() * 100 - 50
        },
        particleType: i % 3 === 0 ? 'higgs' : i % 3 === 1 ? 'electron' : 'muon',
        charge: i % 3 === 0 ? 'neutral' : i % 3 === 1 ? 'negative' : 'positive'
      })),
      collisionEnergy: 8000,
      date: '2012-07-04',
      experimentType: 'pp collision',
      particleCount: 25,
      runNumber: '205071',
      detectorConfiguration: 'Standard',
      year: 2012,
      DOI: '10.7483/OPENDATA.ATLAS.ZBP2.M5T8',
      format: 'ROOT',
      dataSize: '1.2 GB',
      eventCount: 1000
    },
    {
      id: 'atlas-2',
      name: 'Z Boson Event Display',
      description: 'ATLAS Z boson event displays from 2011 data',
      particles: Array.from({ length: 18 }, (_, i) => ({
        id: `particle-${i}`,
        type: i % 3 === 0 ? 'boson' : 'fermion',
        energy: 80 + Math.random() * 300,
        momentum: 40 + Math.random() * 150,
        position: {
          x: Math.random() * 100 - 50,
          y: Math.random() * 100 - 50,
          z: Math.random() * 100 - 50
        },
        particleType: i % 3 === 0 ? 'z-boson' : i % 3 === 1 ? 'electron' : 'positron',
        charge: i % 3 === 0 ? 'neutral' : i % 3 === 1 ? 'negative' : 'positive'
      })),
      collisionEnergy: 7000,
      date: '2011-05-14',
      experimentType: 'pp collision',
      particleCount: 18,
      runNumber: '189751',
      detectorConfiguration: 'Standard',
      year: 2011,
      DOI: '10.7483/OPENDATA.ATLAS.72WR.3YMY',
      format: 'ROOT',
      dataSize: '890 MB',
      eventCount: 750
    }
  ];
}

/**
 * Get ATLAS dataset by ID
 */
export function getAtlasDatasetById(id: string): AtlasDataset | undefined {
  const datasets = getAvailableAtlasDatasets();
  return datasets.find(dataset => dataset.id === id);
}

/**
 * Import ATLAS dataset into simulation
 */
export function importAtlasDatasetToSimulation(datasetId: string): boolean {
  try {
    console.log(`Importing ATLAS dataset ${datasetId} into simulation`);
    // Implementation would go here
    return true;
  } catch (error) {
    console.error('Error importing ATLAS dataset:', error);
    return false;
  }
}
