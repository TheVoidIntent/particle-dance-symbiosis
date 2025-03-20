
import React from 'react';
import AnimatedText from './AnimatedText';
import { cn } from '@/lib/utils';
import { Sparkles, Zap, Shield, Clock, Star, Settings } from 'lucide-react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  delay?: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon, delay = 0 }) => {
  return (
    <div 
      className="p-6 rounded-xl glass transition-all duration-300 hover:shadow-elevated group"
      style={{ 
        transitionDelay: `${delay}ms`,
        opacity: 0,
        transform: 'translateY(20px)',
        animation: 'slide-up 0.6s ease-out forwards',
        animationDelay: `${delay}ms`
      }}
    >
      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-5 text-primary transition-transform duration-300 group-hover:scale-110">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
};

const Features: React.FC = () => {
  const features = [
    {
      icon: <Sparkles size={24} />,
      title: "Intuitive Design",
      description: "Clean, simple interface that puts the focus on what matters most.",
    },
    {
      icon: <Zap size={24} />,
      title: "Lightning Fast",
      description: "Optimized performance ensures a smooth experience every time.",
    },
    {
      icon: <Shield size={24} />,
      title: "Secure & Private",
      description: "Your data is protected with industry-leading encryption and privacy controls.",
    },
    {
      icon: <Clock size={24} />,
      title: "Saves Time",
      description: "Streamlined workflows and automations help you accomplish more in less time.",
    },
    {
      icon: <Star size={24} />,
      title: "Premium Quality",
      description: "Crafted with attention to every detail for an exceptional experience.",
    },
    {
      icon: <Settings size={24} />,
      title: "Highly Customizable",
      description: "Tailor the experience to your needs with powerful customization options.",
    }
  ];

  return (
    <section id="features" className="section-padding relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-primary/5 rounded-full filter blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full filter blur-3xl" />
      </div>

      <div className="section-container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block mb-4">
            <span className="bg-primary/10 text-primary px-3 py-1.5 rounded-full text-xs font-medium">
              Features
            </span>
          </div>
          
          <AnimatedText 
            text="Designed for the details that matter"
            tag="h2"
            className="text-3xl md:text-4xl font-semibold mb-5 tracking-tight text-balance"
            animation="slide-up"
            delay={100}
          />
          
          <AnimatedText
            text="Every feature has been thoughtfully considered to enhance your experience and provide real value."
            tag="p"
            className="text-muted-foreground text-lg leading-relaxed"
            animation="slide-up"
            delay={200}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={100 + index * 100}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
