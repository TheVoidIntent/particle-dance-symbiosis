
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AnomalyEvent } from '@/utils/particleUtils';

interface AnomaliesTabProps {
  anomalies: AnomalyEvent[];
}

const AnomaliesTab: React.FC<AnomaliesTabProps> = ({ anomalies }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Anomalies & Significant Events</CardTitle>
        <CardDescription>
          System-detected phase transitions, emergent behaviors, and other significant events.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {anomalies.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            <p>No anomalies detected yet.</p>
            <p className="text-sm mt-2">Continue running the simulation to observe emergent behaviors.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {anomalies.slice().reverse().map((anomaly, index) => (
              <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium">
                    {anomaly.type.split('_').map(word => 
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')}
                  </h3>
                  <span className="text-xs text-gray-500">t={anomaly.timestamp}</span>
                </div>
                <p className="text-sm mb-2">{anomaly.description}</p>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Affected Particles: {anomaly.affectedParticles}</span>
                  <span>Severity: {Math.floor(anomaly.severity * 100)}%</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AnomaliesTab;
