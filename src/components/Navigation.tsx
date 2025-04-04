
import { Link, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { 
  Home, 
  Info, 
  Beaker, 
  BookOpen, 
  MessageSquare, 
  Menu, 
  X,
  Brain,
  Sparkles
} from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  return (
    <nav className={cn(
      "py-4 sticky top-0 z-50 transition-all duration-300",
      scrolled ? "bg-gray-900/90 backdrop-blur-md shadow-lg border-b border-gray-800" : "bg-transparent"
    )}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-indigo-400" />
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-purple-300">
              IntentSim
            </span>
          </Link>
          
          {/* Mobile menu button */}
          <button
            className="md:hidden text-gray-300 hover:text-white"
            onClick={toggleMenu}
            aria-label="Toggle navigation menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
          
          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <Link to="/">
              <Button
                variant="ghost"
                className={cn(
                  "text-gray-300 hover:text-white hover:bg-gray-800",
                  location.pathname === "/" && "text-white bg-gray-800"
                )}
              >
                <Home className="mr-2 h-4 w-4" />
                Home
              </Button>
            </Link>
            
            <Link to="/about">
              <Button
                variant="ghost"
                className={cn(
                  "text-gray-300 hover:text-white hover:bg-gray-800",
                  location.pathname === "/about" && "text-white bg-gray-800"
                )}
              >
                <Info className="mr-2 h-4 w-4" />
                About
              </Button>
            </Link>
            
            <Link to="/simulation">
              <Button
                variant="ghost"
                className={cn(
                  "text-gray-300 hover:text-white hover:bg-gray-800",
                  location.pathname === "/simulation" && "text-white bg-gray-800"
                )}
              >
                <Beaker className="mr-2 h-4 w-4" />
                Simulation
              </Button>
            </Link>
            
            <Link to="/notebook">
              <Button
                variant="ghost"
                className={cn(
                  "text-gray-300 hover:text-white hover:bg-gray-800",
                  location.pathname === "/notebook" && "text-white bg-gray-800"
                )}
              >
                <BookOpen className="mr-2 h-4 w-4" />
                Notebook
              </Button>
            </Link>
            
            <Link to="/gemini">
              <Button
                variant="ghost"
                className={cn(
                  "text-gray-300 hover:text-white hover:bg-gray-800",
                  location.pathname === "/gemini" && "text-white bg-gray-800"
                )}
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Gemini Chat
              </Button>
            </Link>
            
            <Link to="/assistant">
              <Button
                variant="ghost"
                className={cn(
                  "text-gray-300 hover:text-white hover:bg-gray-800",
                  location.pathname === "/assistant" && "text-white bg-gray-800"
                )}
              >
                <Brain className="mr-2 h-4 w-4" />
                Assistant
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Mobile navigation with animated transition */}
        {isMenuOpen && (
          <div className="mt-4 md:hidden animate-fade-in">
            <div className="flex flex-col space-y-2 pt-2 pb-3 bg-gray-900/90 backdrop-blur-md rounded-lg border border-gray-800 shadow-xl p-4">
              <Link to="/" onClick={closeMenu}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full text-left text-gray-300 hover:text-white hover:bg-gray-800",
                    location.pathname === "/" && "text-white bg-gray-800"
                  )}
                >
                  <Home className="mr-2 h-4 w-4" />
                  Home
                </Button>
              </Link>
              
              <Link to="/about" onClick={closeMenu}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full text-left text-gray-300 hover:text-white hover:bg-gray-800",
                    location.pathname === "/about" && "text-white bg-gray-800"
                  )}
                >
                  <Info className="mr-2 h-4 w-4" />
                  About
                </Button>
              </Link>
              
              <Link to="/simulation" onClick={closeMenu}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full text-left text-gray-300 hover:text-white hover:bg-gray-800",
                    location.pathname === "/simulation" && "text-white bg-gray-800"
                  )}
                >
                  <Beaker className="mr-2 h-4 w-4" />
                  Simulation
                </Button>
              </Link>
              
              <Link to="/notebook" onClick={closeMenu}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full text-left text-gray-300 hover:text-white hover:bg-gray-800",
                    location.pathname === "/notebook" && "text-white bg-gray-800"
                  )}
                >
                  <BookOpen className="mr-2 h-4 w-4" />
                  Notebook
                </Button>
              </Link>
              
              <Link to="/gemini" onClick={closeMenu}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full text-left text-gray-300 hover:text-white hover:bg-gray-800",
                    location.pathname === "/gemini" && "text-white bg-gray-800"
                  )}
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Gemini Chat
                </Button>
              </Link>
              
              <Link to="/assistant" onClick={closeMenu}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full text-left text-gray-300 hover:text-white hover:bg-gray-800",
                    location.pathname === "/assistant" && "text-white bg-gray-800"
                  )}
                >
                  <Brain className="mr-2 h-4 w-4" />
                  Assistant
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
