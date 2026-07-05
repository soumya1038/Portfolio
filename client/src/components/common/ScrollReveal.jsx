import { useEffect, useRef, useState } from 'react';

/**
 * ScrollReveal Component
 * Wraps elements and reveals them with high-performance CSS transitions as they scroll into view.
 * 
 * Props:
 * - children: React.ReactNode (The content to reveal)
 * - animation: 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right' | 'scale-up' (Default: 'fade-up')
 * - duration: number (Transition duration in ms, default 850)
 * - delay: number (Transition delay in ms, default 0)
 * - threshold: number (Intersection threshold 0-1, default 0.05)
 * - triggerOnce: boolean (Whether to run only once or toggle every time, default true)
 * - className: string (Optional extra classes for the wrapper)
 */
export default function ScrollReveal({
  children,
  animation = 'fade-up',
  duration = 1100,
  delay = 0,
  threshold = 0.05,
  triggerOnce = true,
  className = '',
}) {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce) {
            observer.unobserve(element);
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    observer.observe(element);

    return () => {
      if (element && !triggerOnce) {
        observer.unobserve(element);
      }
      observer.disconnect();
    };
  }, [threshold, triggerOnce]);

  const animClasses = {
    'fade-up': 'reveal-fade-up',
    'fade-down': 'reveal-fade-down',
    'fade-left': 'reveal-fade-left',
    'fade-right': 'reveal-fade-right',
    'scale-up': 'reveal-scale-up',
  };

  const currentAnimClass = animClasses[animation] || 'reveal-fade-up';

  const style = {
    transitionDuration: `${duration}ms`,
    transitionDelay: `${delay}ms`,
  };

  return (
    <div
      ref={elementRef}
      className={`reveal-hidden ${currentAnimClass} ${isVisible ? 'reveal-visible' : ''} ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}
