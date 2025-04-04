
interface DataPoint {
  name: string;
  value: number;
}

export const generateParticleData = (dataType: string): DataPoint[] => {
  if (dataType === 'charge') {
    return [
      { name: 'Positive', value: Math.floor(Math.random() * 50) + 30 },
      { name: 'Negative', value: Math.floor(Math.random() * 40) + 20 },
      { name: 'Neutral', value: Math.floor(Math.random() * 30) + 10 },
    ];
  } else if (dataType === 'knowledge') {
    return [
      { name: 'High', value: Math.floor(Math.random() * 30) + 10 },
      { name: 'Medium', value: Math.floor(Math.random() * 40) + 30 },
      { name: 'Low', value: Math.floor(Math.random() * 30) + 20 },
    ];
  } else if (dataType === 'type') {
    return [
      { name: 'Standard', value: Math.floor(Math.random() * 60) + 40 },
      { name: 'Quantum', value: Math.floor(Math.random() * 20) + 10 },
      { name: 'Hybrid', value: Math.floor(Math.random() * 15) + 5 },
    ];
  }
  return [];
};

export const generateInteractionData = (): DataPoint[] => {
  return [
    { name: 'Knowledge Exchange', value: Math.floor(Math.random() * 100) + 200 },
    { name: 'Repulsion', value: Math.floor(Math.random() * 50) + 100 },
    { name: 'Attraction', value: Math.floor(Math.random() * 80) + 150 },
    { name: 'Neutral', value: Math.floor(Math.random() * 40) + 80 },
  ];
};

export const generateTimeSeriesDataPoint = () => {
  return {
    time: new Date().toLocaleTimeString(),
    particles: Math.floor(Math.random() * 20) + 80,
    interactions: Math.floor(Math.random() * 50) + 200,
    knowledge: (Math.random() * 0.3) + 0.5,
  };
};

export const generateTimeSeriesData = (prevData: any[]) => {
  const newData = [...prevData, generateTimeSeriesDataPoint()];
  if (newData.length > 20) {
    return newData.slice(newData.length - 20);
  }
  return newData;
};
