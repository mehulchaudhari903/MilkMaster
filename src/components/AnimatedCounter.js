import React, { useState, useEffect, useRef } from 'react';

const AnimatedCounter = ({ target, duration = 2000, prefix = '', suffix = '+' }) => {
  const [count, setCount] = useState(0);
  const requestRef = useRef();
  const previousTimeRef = useRef();
  const startTimeRef = useRef();

  // Custom easing function for smoother animation
  const easeOutExpo = (x) => {
    return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
  };

  const animate = (time) => {
    if (startTimeRef.current === undefined) {
      startTimeRef.current = time;
    }

    const elapsed = time - startTimeRef.current;
    const progress = Math.min(elapsed / duration, 1);
    
    // Use the easing function for smoother animation
    const easedProgress = easeOutExpo(progress);
    const currentCount = Math.floor(easedProgress * target);
    
    setCount(currentCount);

    if (progress < 1) {
      previousTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animate);
    }
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [target, duration]);

  return (
    <span className="inline-block transition-all duration-300">
      {prefix}
      <span className="inline-block min-w-[2ch] text-center transform transition-transform duration-300 hover:scale-110">
        {count}
      </span>
      {suffix}
    </span>
  );
};

export default AnimatedCounter; 