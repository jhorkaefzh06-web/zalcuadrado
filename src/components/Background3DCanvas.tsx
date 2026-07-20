'use client';

import { useRef, useEffect } from 'react';

export default function Background3DCanvas() {
  const bgImageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 1. Full Page Interactive 3D Parallax Tilt
  useEffect(() => {
    const bgImage = bgImageRef.current;
    if (!bgImage) return;

    let reqId: number;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;

      targetX = (e.clientX - centerX) / (window.innerWidth / 2);
      targetY = (e.clientY - centerY) / (window.innerHeight / 2);
    };

    const animateParallax = () => {
      currentX += (targetX - currentX) * 0.05;
      currentY += (targetY - currentY) * 0.05;

      const rotateY = currentX * 10;
      const rotateX = -currentY * 10;
      const translateX = currentX * 12;
      const translateY = currentY * 12;

      bgImage.style.transform = `perspective(1200px) rotateY(${rotateY}deg) rotateX(${rotateX}deg) translate3d(${translateX}px, ${translateY}px, 0) scale(1.06)`;

      reqId = requestAnimationFrame(animateParallax);
    };

    window.addEventListener('mousemove', handleMouseMove);
    animateParallax();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(reqId);
    };
  }, []);

  // 2. Full Screen Falling Water Droplets & Ice Sparkles Canvas Effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    interface Particle {
      x: number;
      y: number;
      radius: number;
      speedY: number;
      speedX: number;
      length: number;
      color: string;
      isSparkle: boolean;
      angle: number;
    }

    const particleCount = 100;
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2.5 + 1,
        speedY: Math.random() * 3.5 + 1.5,
        speedX: (Math.random() - 0.5) * 0.8,
        length: Math.random() * 20 + 8,
        color: Math.random() > 0.3 ? '#bae6fd' : '#fef08a',
        isSparkle: Math.random() > 0.6,
        angle: Math.random() * Math.PI * 2,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX;
        p.angle += 0.03;

        if (p.y > height + 20) {
          p.y = -20;
          p.x = Math.random() * width;
        }

        // Draw Water Drop Streak
        ctx.beginPath();
        const gradient = ctx.createLinearGradient(p.x, p.y, p.x + p.speedX, p.y + p.length);
        gradient.addColorStop(0, `${p.color}00`);
        gradient.addColorStop(0.5, p.color);
        gradient.addColorStop(1, `${p.color}00`);

        ctx.strokeStyle = gradient;
        ctx.lineWidth = p.radius;
        ctx.lineCap = 'round';
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x + p.speedX * 2, p.y + p.length);
        ctx.stroke();

        // Draw Ice Sparkle / Light Glow
        if (p.isSparkle) {
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.angle);
          ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
          ctx.shadowBlur = 8;
          ctx.shadowColor = '#f59e0b';
          ctx.beginPath();
          ctx.arc(0, 0, p.radius * 1.4, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* HD Bottle Background Image Layer */}
      <div
        ref={bgImageRef}
        className="absolute inset-0 w-full h-full transition-transform duration-100 ease-out"
        style={{
          backgroundImage: `url('/hero-bottle-3d.png')`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
        }}
      />

      {/* Dark Vignette Overlay for readable text across whole page */}
      <div className="absolute inset-0 bg-brand-950/75 dark:bg-brand-950/80 backdrop-blur-[2px]" />

      {/* Canvas Overlay for Falling Water & Ice Sparkles */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
}
