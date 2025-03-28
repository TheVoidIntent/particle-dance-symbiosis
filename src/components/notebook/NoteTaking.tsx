
import React, { useState } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Save, Mic, Upload, Image, FileText } from 'lucide-react';
import { toast } from "sonner";

const NoteTaking: React.FC = () => {
  const [noteText, setNoteText] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  const handleSaveNote = () => {
    if (!noteText.trim()) {
      toast.error("Please add some content to your note");
      return;
    }
    
    toast.success("Note saved successfully");
    setNoteText('');
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    toast(isRecording ? "Recording stopped" : "Recording started", {
      icon: <Mic className="h-4 w-4" />
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-white">Create New Note</h2>
      
      <Textarea
        placeholder="Write your notes about the intent theory and simulations..."
        className="min-h-[200px] bg-gray-800/20 border-gray-700"
        value={noteText}
        onChange={(e) => setNoteText(e.target.value)}
      />
      
      <div className="flex flex-wrap gap-3">
        <Button onClick={handleSaveNote} disabled={!noteText.trim()}>
          <Save className="h-4 w-4 mr-2" />
          Save Note
        </Button>
        
        <Button 
          variant={isRecording ? "destructive" : "outline"} 
          onClick={toggleRecording}
          className={isRecording ? "" : "border-gray-700"}
        >
          <Mic className="h-4 w-4 mr-2" />
          {isRecording ? "Stop Recording" : "Record Audio"}
        </Button>
        
        <Button variant="outline" className="border-gray-700">
          <Upload className="h-4 w-4 mr-2" />
          Upload File
        </Button>
        
        <Button variant="outline" className="border-gray-700">
          <Image className="h-4 w-4 mr-2" />
          Add Image
        </Button>
      </div>
      
      <div className="bg-gray-800/40 rounded-lg p-4 border border-gray-700/50">
        <h3 className="font-medium text-white mb-3">Quick Templates</h3>
        <div className="grid grid-cols-2 gap-3">
          <Card className="bg-gray-800 border-gray-700 hover:bg-gray-700 transition-colors cursor-pointer">
            <CardContent className="p-3 flex items-center gap-2">
              <FileText className="h-4 w-4 text-indigo-400" />
              <span className="text-sm">Observation Template</span>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800 border-gray-700 hover:bg-gray-700 transition-colors cursor-pointer">
            <CardContent className="p-3 flex items-center gap-2">
              <FileText className="h-4 w-4 text-purple-400" />
              <span className="text-sm">Hypothesis Template</span>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800 border-gray-700 hover:bg-gray-700 transition-colors cursor-pointer">
            <CardContent className="p-3 flex items-center gap-2">
              <FileText className="h-4 w-4 text-blue-400" />
              <span className="text-sm">Data Analysis Template</span>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800 border-gray-700 hover:bg-gray-700 transition-colors cursor-pointer">
            <CardContent className="p-3 flex items-center gap-2">
              <FileText className="h-4 w-4 text-amber-400" />
              <span className="text-sm">Simulation Results</span>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NoteTaking;
