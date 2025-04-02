
import React, { useState } from 'react';
import { getAvailableAtlasDatasets, fetchAtlasData, generateAtlasCitation } from '@/utils/atlasDataIntegration';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface AtlasDataSelectorProps {
  onDatasetSelected: (datasetId: string) => void;
  isLoading?: boolean;
}

const AtlasDataSelector: React.FC<AtlasDataSelectorProps> = ({ 
  onDatasetSelected,
  isLoading = false
}) => {
  const [selectedDataset, setSelectedDataset] = useState('6900'); // Default to Pb-Pb collision data
  const [loading, setLoading] = useState(false);
  const datasets = getAvailableAtlasDatasets();

  const handleDatasetChange = (value: string) => {
    setSelectedDataset(value);
  };

  const handleLoadDataset = async () => {
    setLoading(true);
    try {
      await onDatasetSelected(selectedDataset);
      const citation = generateAtlasCitation(null);
      
      // Copy citation to clipboard
      navigator.clipboard.writeText(citation)
        .then(() => {
          toast.success("Citation copied to clipboard", {
            description: "Remember to cite this dataset in your research"
          });
        })
        .catch(() => {
          console.error("Failed to copy citation");
        });
      
    } catch (error) {
      console.error("Error loading dataset:", error);
      toast.error("Failed to load dataset");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-slate-800 border-slate-700 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg text-white">ATLAS Data Integration</CardTitle>
        <CardDescription className="text-slate-300">
          Load real particle data from CERN's ATLAS experiment
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="dataset-select" className="text-sm font-medium text-slate-300">
              Select Dataset
            </label>
            <Select 
              value={selectedDataset} 
              onValueChange={handleDatasetChange}
            >
              <SelectTrigger id="dataset-select" className="bg-slate-700 border-slate-600 text-white">
                <SelectValue placeholder="Select a dataset" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700 text-white">
                {datasets.map(dataset => (
                  <SelectItem 
                    key={dataset.id} 
                    value={dataset.id}
                    className="hover:bg-slate-700 focus:bg-slate-700"
                  >
                    {dataset.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {selectedDataset === '6900' && (
            <div className="bg-slate-700 p-2 rounded text-xs text-slate-300">
              <p>DAOD_HION14 format 2015 Pb-Pb Open Data from the ATLAS experiment</p>
              <p className="mt-1">DOI: 10.7483/OPENDATA.ATLAS.IKCT.HH28</p>
              <div className="flex flex-wrap gap-1 mt-2">
                <Badge variant="outline" className="bg-blue-900/30 text-blue-300 border-blue-700">
                  Heavy-Ion Physics
                </Badge>
                <Badge variant="outline" className="bg-purple-900/30 text-purple-300 border-purple-700">
                  Pb-Pb
                </Badge>
                <Badge variant="outline" className="bg-green-900/30 text-green-300 border-green-700">
                  5.02 TeV
                </Badge>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
          onClick={handleLoadDataset}
          disabled={loading || isLoading}
        >
          {(loading || isLoading) ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading ATLAS Data...
            </>
          ) : (
            'Load ATLAS Data'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AtlasDataSelector;
