
import { IntentAgent } from './IntentAgent';

export interface AudioFeed {
  peak_freq: number;
  avg_power: number;
  time: number;
}

export interface SimSnapshot {
  entropy?: number;
  positions?: [number, number][];
  tick?: number;
  cluster_count?: number;
}

export class AgentSwarm {
  agents: IntentAgent[];
  
  constructor(clusterCount: number) {
    this.agents = [];
    for (let i = 0; i < clusterCount; i++) {
      const agentId = `IntentAgent_${i}`;
      const signature = { type: `stable_cluster_${i}`, particle_count: 1 };
      this.agents.push(new IntentAgent(agentId, signature));
    }
  }
  
  runCycle(audioFeed: AudioFeed[], simSnapshots: SimSnapshot[]): void {
    const limit = Math.min(audioFeed.length, simSnapshots.length);
    
    for (let i = 0; i < limit; i++) {
      for (const agent of this.agents) {
        agent.perceiveFromAudio([audioFeed[i]]);
        agent.learnFromSim(simSnapshots[i]);
        const action = agent.act();
        agent.addLogEntry(action);
      }
    }
    
    this.evaluateFieldConsensus();
  }
  
  evaluateFieldConsensus(): void {
    console.log("\n[Field Consensus Evaluation Starting]");
    const globalTally: Record<string, number> = { 'Pass': 0, 'Neutral': 0, 'Fail': 0 };
    
    for (const agent of this.agents) {
      const results = agent.summarizeTests();
      for (const key in globalTally) {
        globalTally[key] += results[key as keyof typeof results] || 0;
      }
    }
    
    const total = Object.values(globalTally).reduce((sum, val) => sum + val, 0);
    let consensus = 'Neutral';
    let maxCount = 0;
    
    for (const [key, value] of Object.entries(globalTally)) {
      if (value > maxCount) {
        maxCount = value;
        consensus = key;
      }
    }
    
    console.log(`[Field Consensus: ${consensus}] — Results:`, globalTally);
    
    for (const agent of this.agents) {
      agent.peer_consensus = consensus;
    }
    
    return consensus;
  }
  
  getAgentReflections(): Record<string, string> {
    const reflections: Record<string, string> = {};
    
    for (const agent of this.agents) {
      reflections[agent.agent_id] = agent.exportReflections();
    }
    
    return reflections;
  }
  
  getVisualizationData() {
    return this.agents.map(agent => agent.getVisualizationData());
  }
}

