'use client';

import { useEffect, useState } from 'react';

export function LiquidCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setPosition({ x: event.clientX, y: event.clientY });
    };

    const handleMouseDown = () => setIsActive(true);
    const handleMouseUp = () => setIsActive(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <div
      className={`pointer-events-none fixed top-0 left-0 z-[1000] hidden sm:block transition-all duration-200 ease-out ${
        isActive ? 'scale-125 opacity-100' : 'scale-100 opacity-90'
      }`}
      style={{ transform: `translate3d(${position.x - 26}px, ${position.y - 26}px, 0)` }}
    >
      <div className="h-14 w-14 rounded-full border border-cyan-400/40 bg-cyan-400/10 backdrop-blur-sm shadow-[0_0_60px_rgba(56,189,248,0.35)]" />
    </div>
  );
}
