
import { Particle } from '@/types/simulation';
import { v4 as uuidv4 } from 'uuid';

export interface ClusterSignature {
  type?: string;
  particle_count: number;
  centroid?: [number, number];
  density?: number;
  total_intent?: number;
}

export interface PerceptionEntry {
  time: number;
  signal: number;
}

export interface KnowledgeEntry {
  entropy: number;
  signature: ClusterSignature;
  tick: number;
}

export interface NexusPrinciple {
  centroid?: [number, number];
  inferred_rule: string;
  intent_conservation: number;
  belief_strength: number;
}

export interface TestResult {
  tick: number;
  entropy: number;
  expected_stability: number;
  outcome: 'Pass' | 'Neutral' | 'Fail';
}

export interface LogEntry {
  timestamp: string;
  tick: number;
  action: string;
  reflection: string;
}

export class IntentAgent {
  agent_id: string;
  origin_cluster: ClusterSignature;
  knowledge_base: KnowledgeEntry[];
  intent_field: Record<number, number>;
  energy: number;
  perception_log: PerceptionEntry[];
  memory_score: number;
  intent_mass: number;
  particle_count: number;
  log_entries: LogEntry[];
  nexus_principles: NexusPrinciple[];
  test_results: TestResult[];
  peer_consensus: string | null;

  constructor(agent_id?: string, cluster_signature?: ClusterSignature) {
    this.agent_id = agent_id || `IntentAgent_${uuidv4().slice(0, 8)}`;
    this.origin_cluster = cluster_signature || { particle_count: 1 };
    this.knowledge_base = [];
    this.intent_field = {};
    this.energy = 1.0;
    this.perception_log = [];
    this.memory_score = 0.0;
    this.intent_mass = 0.0;
    this.particle_count = cluster_signature?.particle_count || 1;
    this.log_entries = [];
    this.nexus_principles = [];
    this.test_results = [];
    this.peer_consensus = null;
    
    console.log(`Initialized ${this.agent_id} with origin:`, this.origin_cluster);
  }

  perceiveFromAudio(audioFeatures: Array<{peak_freq: number, avg_power: number, time: number}>): void {
    for (const entry of audioFeatures) {
      const freq = entry.peak_freq;
      const power = entry.avg_power;
      const intentSignal = power * Math.sin(freq);
      this.perception_log.push({ time: entry.time, signal: intentSignal });
      this._updateInternalField(intentSignal);
    }
  }

  learnFromSim(snapshot: {entropy?: number, positions?: [number, number][], tick?: number}): void {
    const entropy = snapshot.entropy;
    const clusterPositions = snapshot.positions || [];
    
    if (entropy !== undefined) {
      const signature = this._generateSignature(clusterPositions);
      this.knowledge_base.push({
        entropy,
        signature,
        tick: snapshot.tick || this.knowledge_base.length
      });
      
      this._updateMemoryScore(entropy);
      this._infuseClusterIntent(signature);
      this._reflectOnNexus(signature);
      this._testNexusHypothesis(entropy, signature);
    }
  }

  _generateSignature(positions: [number, number][]): ClusterSignature {
    if (!positions.length) {
      return { centroid: [0, 0], density: 0, total_intent: 0, particle_count: 0 };
    }
    
    const xVals = positions.map(pos => pos[0]);
    const yVals = positions.map(pos => pos[1]);
    const count = positions.length;
    
    const xMean = xVals.reduce((sum, x) => sum + x, 0) / count;
    const yMean = yVals.reduce((sum, y) => sum + y, 0) / count;
    const centroid: [number, number] = [xMean, yMean];
    
    const xRange = Math.max(...xVals) - Math.min(...xVals) + 1;
    const density = count / (xRange * xRange);
    const total_intent = density * count;
    
    return { centroid, density, total_intent, particle_count: count };
  }

  _updateInternalField(signal: number): void {
    const t = this.perception_log.length;
    this.intent_field[t] = signal;
    this.energy += signal * 0.001;
    this.energy = Math.min(Math.max(this.energy, 0.0), 1.5);
  }

  _updateMemoryScore(entropy: number): void {
    if (entropy < 1.0) {
      this.memory_score += 1.0;
    } else if (entropy > 2.5) {
      this.memory_score -= 0.5;
    } else {
      this.memory_score += 0.1;
    }
  }

  _infuseClusterIntent(signature: ClusterSignature): void {
    this.intent_mass += signature.total_intent || 0;
    this.particle_count = signature.particle_count || 1;
  }

  _reflectOnNexus(signature: ClusterSignature): void {
    const principle: NexusPrinciple = {
      centroid: signature.centroid,
      inferred_rule: `Intent clusters stabilize when density > ${(signature.density || 0).toFixed(2)}`,
      intent_conservation: signature.total_intent || 0,
      belief_strength: (signature.total_intent || 0) / Math.max(signature.particle_count || 1, 1)
    };
    this.nexus_principles.push(principle);
  }

  _testNexusHypothesis(entropy: number, signature: ClusterSignature): void {
    const expected_stability = (signature.total_intent || 0) / Math.max(signature.particle_count || 1, 1);
    let outcome: 'Pass' | 'Neutral' | 'Fail';
    
    if (entropy < 1.5 && expected_stability > 0.75) {
      outcome = 'Pass';
    } else if (entropy >= 1.5 && entropy <= 2.5) {
      outcome = 'Neutral';
    } else {
      outcome = 'Fail';
    }
    
    this.test_results.push({
      tick: this.knowledge_base.length,
      entropy,
      expected_stability,
      outcome
    });
  }

  act(): string {
    if (!this.knowledge_base.length) {
      return "Observe";
    }
    
    const recent = this.knowledge_base[this.knowledge_base.length - 1];
    
    if (recent.entropy < 1.0) {
      return "Stabilize";
    } else if (recent.entropy > 2.5) {
      return "SignalNearbyAgents";
    } else {
      return "TradeKnowledge";
    }
  }

  reflect(): string {
    if (!this.knowledge_base.length) {
      return "No memories yet.";
    }
    
    const last = this.knowledge_base[this.knowledge_base.length - 1];
    const nexus_notes = this.nexus_principles.length ? this.nexus_principles[this.nexus_principles.length - 1] : {};
    const last_test = this.test_results.length ? this.test_results[this.test_results.length - 1] : {};
    
    return `At tick ${last.tick}, entropy was ${last.entropy.toFixed(2)}. ` +
           `Memory score: ${this.memory_score.toFixed(2)}. Energy: ${this.energy.toFixed(2)}. ` +
           `Intent Mass: ${this.intent_mass.toFixed(2)}. Particles: ${this.particle_count}. ` +
           `Nexus Insight: ${nexus_notes.inferred_rule || 'None'}, ` +
           `Belief Strength: ${(nexus_notes.belief_strength || 0).toFixed(3)}. ` +
           `Validation Outcome: ${last_test.outcome || 'N/A'}. ` +
           `Peer Consensus: ${this.peer_consensus || 'Pending'}`;
  }

  summarizeTests(): Record<string, number> {
    const tally: Record<string, number> = { 'Pass': 0, 'Neutral': 0, 'Fail': 0 };
    
    for (const result of this.test_results) {
      tally[result.outcome] = (tally[result.outcome] || 0) + 1;
    }
    
    return tally;
  }

  addLogEntry(action: string): void {
    const timestamp = new Date().toISOString();
    const tick = this.knowledge_base.length;
    const reflection = this.reflect();
    
    this.log_entries.push({
      timestamp,
      tick,
      action,
      reflection
    });
  }

  exportReflections(): string {
    let output = '';
    for (const log of this.log_entries) {
      output += `${log.timestamp} [Tick ${log.tick}] ${log.action} → ${log.reflection}\n`;
    }
    return output;
  }

  // Generate data for visualization
  getVisualizationData() {
    return {
      id: this.agent_id,
      energy: this.energy,
      memory: this.memory_score,
      intentMass: this.intent_mass,
      particles: this.particle_count,
      knowledgeEntries: this.knowledge_base.length,
      testResults: this.summarizeTests(),
      lastAction: this.log_entries.length ? this.log_entries[this.log_entries.length - 1].action : 'None'
    };
  }
}

