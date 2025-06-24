"use client";

import React, { useRef, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

// This uses a generic type 'T' to make the component polymorphic and type-safe.
// It accepts any props that the rendered element would, like `id`.
type AnimatedSectionProps<T extends React.ElementType = 'div'> = {
  as?: T;
  children: React.ReactNode;
  className?: string;
  delay?: number;
} & Omit<React.ComponentPropsWithoutRef<T>, 'as' | 'children' | 'className' | 'delay'>;

export const AnimatedSection = <T extends React.ElementType = 'div'>({
  as,
  children,
  className,
  delay = 0,
  ...rest // This captures any other props like `id`
}: AnimatedSectionProps<T>) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // The hook remains the same.
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
          if(ref.current) {
            observer.unobserve(ref.current);
          }
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [delay]);
  
  // Use `as` prop to define the component, defaulting to 'div'.
  const Component = as || 'div';

  return (
    <Component
      // Use 'any' for the ref because TypeScript can't easily reconcile the
      // polymorphic 'Component' with a specific element ref type.
      ref={ref as any} 
      className={cn(
        'transition-all duration-1000',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10',
        className
      )}
      {...rest} // Spread the rest of the props (e.g., id="services")
    >
      {children}
    </Component>
  );
};