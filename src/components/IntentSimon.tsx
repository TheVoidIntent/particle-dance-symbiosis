
import React from 'react';

interface IntentSimonProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  animate?: boolean;
}

const IntentSimon: React.FC<IntentSimonProps> = ({ 
  className = '', 
  size = 'md',
  animate = true 
}) => {
  // Size mapping
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-32 h-32',
    lg: 'w-64 h-64'
  };
  
  // Animation classes
  const animationClass = animate ? 'animate-pulse' : '';
  
  return (
    <div className={`relative ${sizeClasses[size]} ${animationClass} ${className}`}>
      <img 
        src="/lovable-uploads/246abda5-e73b-4b1b-bbaf-2febd4548f9c.png" 
        alt="IntentSim(on) Mascot" 
        className="w-full h-full object-contain"
      />
      {animate && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-1/4 h-1/4 bg-yellow-300 rounded-full opacity-0 animate-ping-slow"></div>
        </div>
      )}
    </div>
  );
};

export default IntentSimon;
