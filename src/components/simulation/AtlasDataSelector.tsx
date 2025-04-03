
import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Download, Database } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getAvailableAtlasDatasets, AtlasDataset } from '@/utils/atlasDataIntegration';

interface AtlasDataSelectorProps {
  onDatasetSelect: (dataset: AtlasDataset) => void;
}

const AtlasDataSelector: React.FC<AtlasDataSelectorProps> = ({ onDatasetSelect }) => {
  const [datasets, setDatasets] = useState<AtlasDataset[]>([]);
  const [selectedDatasetId, setSelectedDatasetId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    // Load available datasets
    setIsLoading(true);
    try {
      const availableDatasets = getAvailableAtlasDatasets();
      setDatasets(availableDatasets);
      
      // Select the first dataset by default if any exist
      if (availableDatasets.length > 0) {
        setSelectedDatasetId(availableDatasets[0].id);
      }
    } catch (error) {
      console.error('Error loading ATLAS datasets:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const handleSelectDataset = (datasetId: string) => {
    setSelectedDatasetId(datasetId);
    const selected = datasets.find(d => d.id === datasetId);
    if (selected) {
      onDatasetSelect(selected);
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg font-medium">
          <Database className="h-5 w-5 inline mr-2" />
          ATLAS Data
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-gray-500">
          Select ATLAS experimental data to overlay on your simulation
        </div>
        
        <div className="space-y-2">
          <Select
            value={selectedDatasetId}
            onValueChange={handleSelectDataset}
            disabled={isLoading || datasets.length === 0}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a dataset" />
            </SelectTrigger>
            <SelectContent>
              {datasets.map(dataset => (
                <SelectItem key={dataset.id} value={dataset.id}>
                  {dataset.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <div className="flex justify-end">
            <Button 
              variant="outline" 
              size="sm"
              disabled={!selectedDatasetId || isLoading}
              onClick={() => {
                const selected = datasets.find(d => d.id === selectedDatasetId);
                if (selected) onDatasetSelect(selected);
              }}
            >
              <Download className="h-4 w-4 mr-1" />
              Import Data
            </Button>
          </div>
        </div>
        
        {datasets.length === 0 && !isLoading && (
          <div className="py-2 text-center text-gray-500 text-sm">
            No ATLAS datasets available
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AtlasDataSelector;
