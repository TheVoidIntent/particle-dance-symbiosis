
import React from 'react';
import AnimatedText from './AnimatedText';
import { Star } from 'lucide-react';

interface TestimonialProps {
  quote: string;
  author: string;
  role: string;
  rating: number;
  avatarUrl: string;
  delay?: number;
}

const Testimonial: React.FC<TestimonialProps> = ({ 
  quote, 
  author, 
  role, 
  rating = 5,
  avatarUrl,
  delay = 0
}) => {
  return (
    <div 
      className="p-8 rounded-xl glass transition-all duration-300 hover:shadow-elevated"
      style={{ 
        transitionDelay: `${delay}ms`,
        opacity: 0,
        transform: 'translateY(20px)',
        animation: 'slide-up 0.6s ease-out forwards',
        animationDelay: `${delay}ms`
      }}
    >
      <div className="flex items-center space-x-1 mb-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={18}
            className={i < rating ? "fill-primary text-primary" : "text-muted stroke-muted-foreground"}
          />
        ))}
      </div>
      
      <p className="text-foreground/90 text-lg leading-relaxed mb-8">"{quote}"</p>
      
      <div className="flex items-center">
        <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
          <img 
            src={avatarUrl} 
            alt={author} 
            className="w-full h-full object-cover" 
          />
        </div>
        <div>
          <p className="font-medium">{author}</p>
          <p className="text-muted-foreground text-sm">{role}</p>
        </div>
      </div>
    </div>
  );
};

const Testimonials: React.FC = () => {
  const testimonials = [
    {
      quote: "This product has completely transformed how I approach my daily tasks. The attention to detail is impressive.",
      author: "Alex Morgan",
      role: "Product Designer",
      rating: 5,
      avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1374&auto=format&fit=crop"
    },
    {
      quote: "The simplicity and elegance of this design is unmatched. It's clear that every aspect was carefully considered.",
      author: "James Wilson",
      role: "Creative Director",
      rating: 5,
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1374&auto=format&fit=crop"
    },
    {
      quote: "I've tried many similar products, but none have matched the quality and thoughtfulness of this one.",
      author: "Sarah Chen",
      role: "UX Researcher",
      rating: 5,
      avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1470&auto=format&fit=crop"
    }
  ];

  return (
    <section id="testimonials" className="section-padding bg-secondary/50">
      <div className="section-container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block mb-4">
            <span className="bg-primary/10 text-primary px-3 py-1.5 rounded-full text-xs font-medium">
              Testimonials
            </span>
          </div>
          
          <AnimatedText 
            text="What our customers are saying"
            tag="h2"
            className="text-3xl md:text-4xl font-semibold mb-5 tracking-tight text-balance"
            animation="slide-up"
            delay={100}
          />
          
          <AnimatedText
            text="Don't just take our word for it — hear what our users have to say about their experience."
            tag="p"
            className="text-muted-foreground text-lg leading-relaxed"
            animation="slide-up"
            delay={200}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Testimonial
              key={index}
              quote={testimonial.quote}
              author={testimonial.author}
              role={testimonial.role}
              rating={testimonial.rating}
              avatarUrl={testimonial.avatarUrl}
              delay={100 + index * 100}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
