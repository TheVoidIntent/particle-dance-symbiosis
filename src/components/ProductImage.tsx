
import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface ProductImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  animation?: 'fade-in' | 'scale-in' | 'slide-up';
  delay?: number;
}

const ProductImage: React.FC<ProductImageProps> = ({
  src,
  alt,
  className,
  width,
  height,
  priority = false,
  animation = 'fade-in',
  delay = 0,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (priority) {
      setIsInView(true);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (wrapperRef.current && !priority) {
      observer.observe(wrapperRef.current);
    }

    return () => {
      if (wrapperRef.current && !priority) {
        observer.unobserve(wrapperRef.current);
      }
    };
  }, [priority]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const getAnimationClass = () => {
    switch (animation) {
      case 'fade-in':
        return 'animate-fade-in';
      case 'scale-in':
        return 'animate-scale-in';
      case 'slide-up':
        return 'animate-slide-up';
      default:
        return 'animate-fade-in';
    }
  };

  return (
    <div
      ref={wrapperRef}
      className={cn(
        'relative overflow-hidden',
        className
      )}
      style={{ width, height, aspectRatio: width && height ? width / height : undefined }}
    >
      {!isLoaded && (
        <div className="absolute inset-0 bg-muted/20 animate-pulse" />
      )}
      
      {isInView && (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          width={width}
          height={height}
          onLoad={handleLoad}
          className={cn(
            'w-full h-full object-cover transition-all duration-500',
            isLoaded ? 'opacity-100' : 'opacity-0',
            isLoaded && getAnimationClass(),
            'animate-delay-' + delay
          )}
          style={{
            animationDelay: `${delay}ms`,
          }}
        />
      )}
    </div>
  );
};

export default ProductImage;
