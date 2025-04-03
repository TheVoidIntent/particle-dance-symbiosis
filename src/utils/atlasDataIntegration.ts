
/**
 * Type definition for ATLAS dataset
 */
export interface AtlasDataset {
  id: string;
  name: string;
  description: string;
  particles: Array<{
    id: string;
    type: string;
    energy: number;
    momentum: number;
    position: {
      x: number;
      y: number;
      z: number;
    }
  }>;
  metadata: {
    collisionEnergy: number;
    date: string;
    experimentType: string;
    particleCount: number;
    runNumber: string;
    detectorConfiguration: string;
  };
}

/**
 * Fetch ATLAS data
 * @param datasetId The ID of the dataset to fetch
 */
export async function fetchAtlasData(datasetId: string): Promise<AtlasDataset> {
  console.log(`Fetching ATLAS data for dataset ${datasetId}`);
  
  // Return mock data
  return {
    id: datasetId,
    name: `ATLAS Run ${datasetId}`,
    description: 'Sample ATLAS collision data',
    particles: Array.from({ length: 20 }, (_, i) => ({
      id: `p-${i}`,
      type: Math.random() > 0.5 ? 'electron' : 'proton',
      energy: Math.random() * 100,
      momentum: Math.random() * 50,
      position: {
        x: (Math.random() - 0.5) * 100,
        y: (Math.random() - 0.5) * 100,
        z: (Math.random() - 0.5) * 100
      }
    })),
    metadata: {
      collisionEnergy: 13000,
      date: new Date().toISOString(),
      experimentType: 'pp-collision',
      particleCount: 20,
      runNumber: `R-${datasetId}`,
      detectorConfiguration: 'Standard'
    }
  };
}

/**
 * Generate citation for ATLAS data
 * @param dataset The dataset to generate a citation for
 */
export function generateAtlasCitation(dataset: AtlasDataset): string {
  return `ATLAS Collaboration (${new Date().getFullYear()}). ${dataset.name} [Dataset]. CERN Open Data Portal. https://doi.org/10.xxxx/atlas.${dataset.id}`;
}
