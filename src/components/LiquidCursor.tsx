'use client';

import { useEffect, useState } from 'react';

export function LiquidCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setPosition({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div
      className="pointer-events-none fixed top-0 left-0 z-[1000] hidden sm:block transition-all duration-300 ease-out"
      style={{ transform: `translate3d(${position.x - 8}px, ${position.y - 8}px, 0)` }}
    >
      <div className="h-4 w-4 rounded-full bg-gradient-to-r from-cyan-300/30 to-cyan-400/20 blur-sm" />
    </div>
  );
}
