
import React from 'react';
import { Info, MoreVertical, Plus, FileText, BookOpen, HelpCircle, BarChart } from 'lucide-react';
import { Button } from "@/components/ui/button";
import AudioNotePlayer from "./AudioNotePlayer";
import NotesList from "./NotesList";
import { toast } from "sonner";

interface SourcesTabContentProps {
  currentAudio: {
    title: string;
    progress: number;
    duration: number;
    url: string;
  };
  isPlaying: boolean;
  onTogglePlay: () => void;
  onAddNote: () => void;
}

const SourcesTabContent: React.FC<SourcesTabContentProps> = ({
  currentAudio,
  isPlaying,
  onTogglePlay,
  onAddNote
}) => {
  return (
    <div className="space-y-6 mt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Audio Overview</h2>
        <Info className="h-5 w-5 text-gray-400" />
      </div>
      
      <AudioNotePlayer 
        title={currentAudio.title}
        progress={currentAudio.progress}
        duration={currentAudio.duration}
        isPlaying={isPlaying}
        onTogglePlay={onTogglePlay}
        audioUrl={currentAudio.url}
      />
      
      <div className="bg-gray-800/40 rounded-lg p-4 border border-gray-700/50 text-center">
        <p className="text-gray-300 flex items-center justify-center gap-2">
          Interactive mode <span className="bg-gray-700 text-xs px-2 py-0.5 rounded-full">BETA</span>
        </p>
      </div>
      
      <div className="flex items-center justify-between mt-8">
        <h2 className="text-xl font-semibold text-white">Notes</h2>
        <MoreVertical className="h-5 w-5 text-gray-400" />
      </div>
      
      <Button onClick={onAddNote} className="w-full flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700">
        <Plus className="h-4 w-4" />
        Add note
      </Button>
      
      <div className="grid grid-cols-2 gap-3">
        <Button variant="outline" className="flex items-center justify-center gap-2">
          <BookOpen className="h-4 w-4" />
          Study guide
        </Button>
        <Button variant="outline" className="flex items-center justify-center gap-2">
          <FileText className="h-4 w-4" />
          Briefing doc
        </Button>
        <Button variant="outline" className="flex items-center justify-center gap-2">
          <HelpCircle className="h-4 w-4" />
          FAQ
        </Button>
        <Button variant="outline" className="flex items-center justify-center gap-2">
          <BarChart className="h-4 w-4" />
          Timeline
        </Button>
      </div>
      
      <NotesList />
    </div>
  );
};

export default SourcesTabContent;
