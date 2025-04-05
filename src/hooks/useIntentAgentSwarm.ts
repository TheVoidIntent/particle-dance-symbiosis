
import { useState, useEffect, useRef } from 'react';
import { AgentSwarm } from '@/utils/intentAgent/AgentSwarm';
import { IntentAgent } from '@/utils/intentAgent/IntentAgent';
import { Particle } from '@/types/simulation';
import { calculateSystemEntropy } from '@/utils/particles/entropyUtils';

interface AudioFeature {
  peak_freq: number;
  avg_power: number;
  time: number;
}

export const useIntentAgentSwarm = (initialClusterCount: number = 3) => {
  const [swarm, setSwarm] = useState<AgentSwarm | null>(null);
  const [agentData, setAgentData] = useState<any[]>([]);
  const [consensus, setConsensus] = useState<string | null>(null);
  const audioFeedRef = useRef<AudioFeature[]>([]);
  const simSnapshotsRef = useRef<any[]>([]);
  const cycleCountRef = useRef(0);
  
  // Initialize agent swarm
  useEffect(() => {
    const newSwarm = new AgentSwarm(initialClusterCount);
    setSwarm(newSwarm);
    setAgentData(newSwarm.getVisualizationData());
  }, [initialClusterCount]);
  
  // Function to add audio data from microphone input
  const addAudioData = (frequency: number, power: number) => {
    if (frequency && power) {
      const now = Date.now();
      audioFeedRef.current.push({
        peak_freq: frequency,
        avg_power: power,
        time: now
      });
      
      // Cap the array length to prevent memory issues
      if (audioFeedRef.current.length > 1000) {
        audioFeedRef.current = audioFeedRef.current.slice(-1000);
      }
    }
  };
  
  // Function to add simulation data from particles
  const addSimulationData = (particles: Particle[]) => {
    if (particles && particles.length > 0) {
      const entropy = calculateSystemEntropy(particles);
      const positions = particles.map(p => [p.x, p.y] as [number, number]);
      
      const clusterCount = particles.filter(p => p.clusterID !== null).length;
      
      simSnapshotsRef.current.push({
        entropy,
        positions,
        tick: cycleCountRef.current,
        cluster_count: clusterCount
      });
      
      // Cap the array length to prevent memory issues
      if (simSnapshotsRef.current.length > 1000) {
        simSnapshotsRef.current = simSnapshotsRef.current.slice(-1000);
      }
      
      cycleCountRef.current++;
    }
  };
  
  // Function to run a cycle manually
  const runCycle = () => {
    if (!swarm || audioFeedRef.current.length === 0 || simSnapshotsRef.current.length === 0) {
      return;
    }
    
    swarm.runCycle(audioFeedRef.current, simSnapshotsRef.current);
    const newConsensus = swarm.evaluateFieldConsensus();
    setConsensus(newConsensus);
    setAgentData(swarm.getVisualizationData());
  };
  
  // Function to create a standalone agent for experimentation
  const createStandaloneAgent = (id?: string) => {
    return new IntentAgent(id, { particle_count: 1 });
  };
  
  return {
    swarm,
    agentData,
    consensus,
    addAudioData,
    addSimulationData,
    runCycle,
    createStandaloneAgent,
    getReflections: () => swarm?.getAgentReflections() || {},
    cycleCount: cycleCountRef.current
  };
};

export default useIntentAgentSwarm;
