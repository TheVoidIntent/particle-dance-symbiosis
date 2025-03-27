
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SimulationStats } from '@/types/simulation';

interface EntropyAnalysisTabProps {
  stats: SimulationStats;
}

const EntropyAnalysisTab: React.FC<EntropyAnalysisTabProps> = ({ stats }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Advanced Entropy & Emergence Analysis</CardTitle>
        <CardDescription>
          In-depth analysis of entropy patterns, clustering behaviors, and information-based emergent properties
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Entropy Analysis</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-card border rounded-lg p-4 text-center">
                <div className="text-sm text-muted-foreground mb-1">Shannon Entropy</div>
                <div className="text-2xl font-bold">{stats.shannonEntropy?.toFixed(3) || "0.000"}</div>
                <div className="text-xs mt-1">Particle Distribution Randomness</div>
              </div>
              <div className="bg-card border rounded-lg p-4 text-center">
                <div className="text-sm text-muted-foreground mb-1">Spatial Entropy</div>
                <div className="text-2xl font-bold">{stats.spatialEntropy?.toFixed(3) || "0.000"}</div>
                <div className="text-xs mt-1">Position Distribution Randomness</div>
              </div>
              <div className="bg-card border rounded-lg p-4 text-center">
                <div className="text-sm text-muted-foreground mb-1">Field Order</div>
                <div className="text-2xl font-bold">{stats.fieldOrderParameter?.toFixed(3) || "0.000"}</div>
                <div className="text-xs mt-1">Intent Field Alignment (Higher = More Order)</div>
              </div>
              <div className="bg-card border rounded-lg p-4 text-center">
                <div className="text-sm text-muted-foreground mb-1">Entropy Delta</div>
                <div className={`text-2xl font-bold ${Number(stats.clusterEntropyDelta || 0) < 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {stats.clusterEntropyDelta?.toFixed(3) || "0.000"}
                </div>
                <div className="text-xs mt-1">Cluster vs. Non-Cluster Entropy Difference</div>
              </div>
            </div>
            
            <h3 className="text-lg font-medium mt-6">Clustering Behavior</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-card border rounded-lg p-4 text-center">
                <div className="text-sm text-muted-foreground mb-1">Cluster Lifetime</div>
                <div className="text-2xl font-bold">{stats.clusterLifetime?.toFixed(0) || "0"}</div>
                <div className="text-xs mt-1">Stability of Particle Clusters</div>
              </div>
              <div className="bg-card border rounded-lg p-4 text-center">
                <div className="text-sm text-muted-foreground mb-1">Information Density</div>
                <div className="text-2xl font-bold">{stats.informationDensity?.toFixed(2) || "0.00"}</div>
                <div className="text-xs mt-1">Knowledge Concentration in Clusters</div>
              </div>
              <div className="bg-card border rounded-lg p-4 text-center">
                <div className="text-sm text-muted-foreground mb-1">Kolmogorov Complexity</div>
                <div className="text-2xl font-bold">{stats.kolmogorovComplexity?.toFixed(3) || "0.000"}</div>
                <div className="text-xs mt-1">System Pattern Complexity</div>
              </div>
              <div className="bg-card border rounded-lg p-4 text-center">
                <div className="text-sm text-muted-foreground mb-1">Active Clusters</div>
                <div className="text-2xl font-bold">{stats.clusterCount}</div>
                <div className="text-xs mt-1">Number of Stable Particle Groups</div>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Interpretation Guide</h3>
            <div className="bg-muted rounded-lg p-4 space-y-3">
              <div>
                <h4 className="font-medium">Shannon Entropy vs Spatial Entropy</h4>
                <p className="text-sm">
                  Shannon entropy measures disorder in particle types/charges, while spatial entropy measures
                  evenness of particle distribution across space. Lower values indicate more ordered systems.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium">Negative Entropy Delta</h4>
                <p className="text-sm">
                  A negative entropy delta means clusters have lower entropy than unclustered particles,
                  suggesting self-organization rather than random grouping. This indicates intent-driven
                  pattern formation.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium">Information Density & Gravity-Like Effects</h4>
                <p className="text-sm">
                  High information density in clusters can create gravity-like effects, pulling in other particles.
                  This demonstrates how knowledge/intent can behave similar to a physical force.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium">Field Order Parameter</h4>
                <p className="text-sm">
                  Values near 1 indicate an ordered, aligned intent field, while values near 0 indicate a more
                  random, chaotic field. Phase transitions often correlate with sudden changes in this value.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium">Kolmogorov Complexity</h4>
                <p className="text-sm">
                  Measures how "compressible" the system's pattern is. Higher values indicate more
                  complex, sophisticated patterns that can't be easily described with simple rules.
                </p>
              </div>
            </div>
            
            <div className="border rounded-lg p-4 mt-6">
              <h3 className="text-lg font-medium mb-2">Real-Time Analysis</h3>
              <p className="text-sm mb-3">
                Current system state assessment based on entropy metrics:
              </p>
              <div className="bg-card p-3 rounded text-sm">
                {stats.shannonEntropy && stats.spatialEntropy && stats.fieldOrderParameter ? (
                  stats.shannonEntropy < 0.3 && stats.fieldOrderParameter > 0.7 ? (
                    <span className="text-green-500">
                      Highly ordered system with strong intent field alignment. Structural stability is high.
                    </span>
                  ) : stats.shannonEntropy > 0.7 && stats.fieldOrderParameter < 0.3 ? (
                    <span className="text-red-500">
                      Highly chaotic system with minimal structure. Random interactions dominate.
                    </span>
                  ) : stats.clusterEntropyDelta && stats.clusterEntropyDelta < -0.2 ? (
                    <span className="text-blue-500">
                      Intent-driven self-organization detected. Clusters show significantly more order than surroundings.
                    </span>
                  ) : stats.informationDensity && stats.informationDensity > 5 ? (
                    <span className="text-purple-500">
                      High information gravity detected. Knowledge is concentrating in specific regions.
                    </span>
                  ) : (
                    <span>
                      Balanced system with moderate order and chaos. Normal evolution patterns.
                    </span>
                  )
                ) : (
                  <span>Gathering data for analysis...</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EntropyAnalysisTab;
