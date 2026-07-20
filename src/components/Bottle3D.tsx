'use client';

import { useRef, useEffect } from 'react';

interface Bottle3DProps {
  imageSrc: string;
  altText: string;
  className?: string;
}

export default function Bottle3D({ imageSrc, altText, className = "" }: Bottle3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const bottleRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const bottle = bottleRef.current;
    if (!container || !bottle) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Calculate cursor position relative to container center
      const xAxis = (centerX - e.clientX) / 18;
      const yAxis = (centerY - e.clientY) / 18;

      bottle.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg) scale(1.03)`;
      bottle.style.animation = 'none';
    };

    const handleMouseLeave = () => {
      bottle.style.transition = 'transform 0.5s ease';
      bottle.style.transform = 'rotateY(0deg) rotateX(0deg) scale(1)';

      setTimeout(() => {
        if (bottle) {
          bottle.style.animation = 'flotar 5s ease-in-out infinite';
        }
      }, 500);
    };

    const handleMouseEnter = () => {
      bottle.style.transition = 'transform 0.1s ease-out';
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);
    container.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      container.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, []);

  return (
    <div ref={containerRef} className={`contenedor-3d p-4 select-none ${className}`}>
      <img
        ref={bottleRef}
        src={imageSrc}
        alt={altText}
        className="botella-3d max-w-full h-auto object-cover rounded-2xl shadow-2xl border border-amber-500/20"
      />
    </div>
  );
}
