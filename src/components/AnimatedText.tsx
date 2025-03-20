
import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedTextProps {
  text: string;
  className?: string;
  animation?: 'fade-in' | 'slide-up' | 'slide-down' | 'slide-in-right' | 'slide-in-left';
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
  delay?: number;
  staggerChildren?: boolean;
  staggerDelay?: number;
  threshold?: number;
}

const AnimatedText: React.FC<AnimatedTextProps> = ({
  text,
  className,
  animation = 'fade-in',
  tag = 'p',
  delay = 0,
  staggerChildren = false,
  staggerDelay = 50,
  threshold = 0.3,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const element = entry.target as HTMLElement;
            element.style.opacity = '1';
            element.style.transform = 'translate(0, 0)';
            
            if (staggerChildren && element.children.length > 0) {
              Array.from(element.children).forEach((child, index) => {
                const childEl = child as HTMLElement;
                childEl.style.transitionDelay = `${delay + index * staggerDelay}ms`;
                childEl.style.opacity = '1';
                childEl.style.transform = 'translate(0, 0)';
              });
            }
            
            observer.unobserve(element);
          }
        });
      },
      { threshold }
    );

    observer.observe(ref.current);

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [delay, staggerChildren, staggerDelay, threshold]);

  const getAnimationStyles = () => {
    const styles = {
      opacity: '0',
      transition: 'opacity 0.6s ease-out, transform 0.6s ease-out',
      transitionDelay: `${delay}ms`,
    };

    if (animation === 'fade-in') {
      return styles;
    } else if (animation === 'slide-up') {
      return { ...styles, transform: 'translateY(20px)' };
    } else if (animation === 'slide-down') {
      return { ...styles, transform: 'translateY(-20px)' };
    } else if (animation === 'slide-in-right') {
      return { ...styles, transform: 'translateX(20px)' };
    } else if (animation === 'slide-in-left') {
      return { ...styles, transform: 'translateX(-20px)' };
    }
    
    return styles;
  };

  const renderContent = () => {
    if (!staggerChildren) {
      return text;
    }

    // Split text into words for staggered animation
    return text.split(' ').map((word, index) => (
      <span
        key={index}
        className="inline-block opacity-0"
        style={{
          transition: 'opacity 0.6s ease-out, transform 0.6s ease-out',
          transform: animation.includes('slide') ? 'translateY(20px)' : 'none',
        }}
      >
        {word}
        {index < text.split(' ').length - 1 ? ' ' : ''}
      </span>
    ));
  };

  const TagName = tag as keyof JSX.IntrinsicElements;

  return (
    <div ref={ref} style={getAnimationStyles()}>
      <TagName className={cn(className)}>
        {renderContent()}
      </TagName>
    </div>
  );
};

export default AnimatedText;
