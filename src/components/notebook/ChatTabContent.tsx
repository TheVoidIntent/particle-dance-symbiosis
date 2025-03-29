
import React from 'react';
import { Button } from "@/components/ui/button";

const ChatTabContent: React.FC = () => {
  return (
    <div className="space-y-6 mt-6">
      <div className="bg-gray-800/40 rounded-lg p-8 border border-gray-700/50 text-center h-64 flex items-center justify-center">
        <div>
          <p className="text-gray-300 mb-3">Chat with your audio content</p>
          <Button>Start a conversation</Button>
        </div>
      </div>
    </div>
  );
};

export default ChatTabContent;
