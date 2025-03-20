
import React from 'react';
import Button from './Button';
import AnimatedText from './AnimatedText';
import ProductImage from './ProductImage';
import { ArrowRight } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section className="relative min-h-screen pt-24 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-20 right-[10%] w-96 h-96 bg-primary/5 rounded-full filter blur-3xl" />
        <div className="absolute bottom-20 left-[10%] w-96 h-96 bg-primary/5 rounded-full filter blur-3xl" />
      </div>

      <div className="section-container flex flex-col lg:flex-row items-center justify-between pt-16 md:pt-24 gap-12">
        <div className="flex-1 max-w-2xl">
          <div className="inline-block mb-5">
            <span className="bg-primary/10 text-primary px-3 py-1.5 rounded-full text-xs font-medium inline-block animate-fade-in">
              Introducing Our Latest Design
            </span>
          </div>
          
          <AnimatedText 
            text="Elevate your experience with elegant design"
            tag="h1"
            className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight leading-tight mb-6 text-balance"
            animation="slide-up"
            delay={100}
            staggerChildren
            staggerDelay={50}
          />

          <AnimatedText
            text="Discover our carefully crafted product designed with simplicity and functionality in mind. Every detail has been refined to create a seamless experience."
            tag="p"
            className="text-muted-foreground text-lg leading-relaxed mb-8"
            animation="slide-up"
            delay={300}
          />

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 animate-fade-in" style={{ animationDelay: '500ms' }}>
            <Button 
              size="lg" 
              icon={<ArrowRight size={18} />} 
              iconPosition="right"
            >
              Explore Product
            </Button>
            <Button 
              variant="outline" 
              size="lg"
            >
              Learn More
            </Button>
          </div>

          <div className="mt-12 flex items-center space-x-8 animate-fade-in" style={{ animationDelay: '700ms' }}>
            <div>
              <p className="text-3xl font-semibold mb-1">98%</p>
              <p className="text-muted-foreground text-sm">Customer Satisfaction</p>
            </div>
            <div className="h-12 w-px bg-border"></div>
            <div>
              <p className="text-3xl font-semibold mb-1">24/7</p>
              <p className="text-muted-foreground text-sm">Support Available</p>
            </div>
            <div className="h-12 w-px bg-border"></div>
            <div>
              <p className="text-3xl font-semibold mb-1">100+</p>
              <p className="text-muted-foreground text-sm">Countries Served</p>
            </div>
          </div>
        </div>

        <div className="flex-1 relative">
          <div className="relative z-10 animate-float">
            <ProductImage
              src="https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=1470&auto=format&fit=crop"
              alt="Premium Product"
              className="rounded-2xl shadow-elevated mx-auto max-w-full h-auto"
              width={600}
              height={600}
              priority
              animation="scale-in"
              delay={300}
            />
          </div>

          {/* Decorative elements */}
          <div className="absolute top-1/4 -left-4 lg:-left-12 w-20 h-20 bg-primary/10 rounded-full glass-dark z-0" />
          <div className="absolute bottom-1/4 -right-4 lg:-right-12 w-32 h-32 bg-primary/10 rounded-full glass-dark z-0" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
