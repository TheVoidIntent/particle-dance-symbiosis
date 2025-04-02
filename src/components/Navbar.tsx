
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Beaker, // Using Beaker instead of Flask which doesn't exist in lucide-react
  BookOpen, 
  Brain, 
  Code, 
  Home, 
  Settings 
} from 'lucide-react';

// Add the interface to define the component props
interface NavbarProps {
  isCreatorVersion?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ isCreatorVersion = false }) => {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-indigo-600">
            <Beaker className="h-6 w-6" />
            <span>IntentSim.org</span>
          </Link>
          
          <nav className="hidden md:flex gap-6">
            <Link to="/" className="text-sm font-medium hover:text-indigo-600">Home</Link>
            <Link to="/universe" className="text-sm font-medium hover:text-indigo-600">Simulation</Link>
            <Link to="/theory" className="text-sm font-medium hover:text-indigo-600">Theory</Link>
            <Link to="/notebook" className="text-sm font-medium hover:text-indigo-600">Notebook</Link>
            <Link to="/assistant" className="text-sm font-medium hover:text-indigo-600">Assistant</Link>
          </nav>
        </div>
        
        <div className="flex items-center gap-4">
          {isCreatorVersion ? (
            <Button variant="outline" size="sm" className="hidden md:flex gap-1">
              <Code className="h-4 w-4" />
              <span>Creator Mode</span>
            </Button>
          ) : (
            <Link to="/auth">
              <Button variant="outline" size="sm" className="hidden md:flex gap-1">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </Button>
            </Link>
          )}
          
          <Button className="flex gap-1">
            <Brain className="h-4 w-4" />
            <span className="hidden md:inline">Explore</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
