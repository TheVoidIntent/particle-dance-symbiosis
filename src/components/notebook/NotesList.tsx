
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { FileText } from 'lucide-react';

const NotesList: React.FC = () => {
  const notes = [
    {
      id: 1,
      title: "AI Agent Simulations: Intent, Complexity, and Emergence",
      excerpt: "These new datasets from the AI agent simulation provide a fascinating opportunity to study how intent manifests in information exchange between particles.",
      icon: "doc"
    },
    {
      id: 2,
      title: "AI Agent Simulation: Dynamics of Intent",
      excerpt: "Drawing upon the information provided in the sources, specifically the new datasets labeled with intent characteristics, we can observe several patterns.",
      icon: "doc"
    },
    {
      id: 3,
      title: "Cosmic Dawn, AI Learning, and Simulated Reality",
      excerpt: "It appears the majority of the provided text consists of numerical data and code snippets related to simulations of particle interactions governed by intent.",
      icon: "doc"
    }
  ];

  return (
    <div className="space-y-3">
      {notes.map(note => (
        <Card key={note.id} className="bg-gray-800/40 border-gray-700/50 hover:bg-gray-800/60 transition-colors cursor-pointer">
          <CardContent className="p-4">
            <div className="flex gap-3">
              <FileText className="h-5 w-5 text-amber-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-medium text-white mb-1">{note.title}</h3>
                <p className="text-sm text-gray-400 line-clamp-2">{note.excerpt}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default NotesList;
