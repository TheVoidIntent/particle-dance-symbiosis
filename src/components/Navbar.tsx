
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { Home, Info, Beaker, BookOpen, BookText, Bot, LayoutDashboard } from 'lucide-react';

const Navbar: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const navItems = [
    { path: '/', label: 'Home', icon: <Home className="h-4 w-4 mr-2" /> },
    { path: '/about', label: 'About', icon: <Info className="h-4 w-4 mr-2" /> },
    { path: '/simulation', label: 'Simulation', icon: <Beaker className="h-4 w-4 mr-2" /> },
    { path: '/universe', label: 'Universe', icon: <LayoutDashboard className="h-4 w-4 mr-2" /> },
    { path: '/research', label: 'Research', icon: <BookOpen className="h-4 w-4 mr-2" /> },
    { path: '/notebook', label: 'Notebook', icon: <BookText className="h-4 w-4 mr-2" /> },
    { path: '/intentsimon', label: 'IntentSimon', icon: <Bot className="h-4 w-4 mr-2" /> },
  ];
  
  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                Intent<span className="text-indigo-600">Sim</span>
              </span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={isActive(item.path) ? "default" : "ghost"}
                  className={isActive(item.path) ? "bg-indigo-600 text-white" : ""}
                >
                  {item.icon}
                  {item.label}
                </Button>
              </Link>
            ))}
          </div>
          
          <div className="md:hidden flex items-center">
            {/* Mobile menu button would go here */}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
