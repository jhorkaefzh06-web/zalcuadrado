/* eslint-disable */
'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { motion, HTMLMotionProps } from 'framer-motion';

interface SpotlightButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'glass' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  className?: string;
  spotlightColor?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export default function SpotlightButton({
  children,
  variant = 'primary',
  size = 'md',
  href,
  className = '',
  spotlightColor = 'rgba(245, 158, 11, 0.45)', // default amber glow
  icon,
  iconPosition = 'left',
  onClick,
  ...props
}: SpotlightButtonProps) {
  const btnRef = useRef<HTMLButtonElement | HTMLAnchorElement | null>(null);
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);

  // Base styles for variants
  const variantStyles = {
    primary:
      'bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-white shadow-lg shadow-amber-500/25 border border-amber-400/30 hover:border-amber-300/60',
    secondary:
      'bg-brand-900/90 text-amber-300 border border-amber-500/30 hover:border-amber-400/60 shadow-md',
    glass:
      'bg-white/10 dark:bg-brand-900/60 backdrop-blur-md text-white border border-white/20 dark:border-brand-700/50 shadow-lg',
    outline:
      'bg-transparent text-amber-400 border-2 border-amber-500/50 hover:border-amber-400 shadow-sm',
    ghost:
      'bg-transparent text-brand-200 hover:text-white hover:bg-white/5 border border-transparent',
  };

  const sizeStyles = {
    sm: 'px-4 py-2 text-xs rounded-lg gap-1.5',
    md: 'px-6 py-3 text-sm rounded-xl gap-2 font-bold',
    lg: 'px-8 py-4 text-base rounded-2xl gap-2.5 font-black',
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    btnRef.current.style.setProperty('--mouse-x', `${x}px`);
    btnRef.current.style.setProperty('--mouse-y', `${y}px`);
    btnRef.current.style.setProperty('--mouse-x-pct', `${(x / rect.width) * 100}%`);
    btnRef.current.style.setProperty('--mouse-y-pct', `${(y / rect.height) * 100}%`);
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement & HTMLAnchorElement>) => {
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const newRipple = { x, y, id: Date.now() };
      setRipples((prev) => [...prev.slice(-3), newRipple]);
    }
    if (onClick) onClick(e);
  };

  const content = (
    <>
      {/* Spotlight Radial Background Glow */}
      <span
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-[inherit]"
        style={{
          background: `radial-gradient(160px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${spotlightColor}, transparent 70%)`,
        }}
      />

      {/* Dynamic Cursor Border Highlight Effect */}
      <span
        className="pointer-events-none absolute -inset-[1px] rounded-[inherit] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(100px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(251, 191, 36, 0.7), transparent 70%)`,
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'exclude',
          WebkitMaskComposite: 'xor',
          padding: '1px',
        }}
      />

      {/* Click Ripple Effect */}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute rounded-full bg-white/40 pointer-events-none animate-ping"
          style={{
            left: ripple.x - 20,
            top: ripple.y - 20,
            width: 40,
            height: 40,
          }}
        />
      ))}

      {/* Button Content */}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {icon && iconPosition === 'left' && icon}
        <span>{children}</span>
        {icon && iconPosition === 'right' && icon}
      </span>
    </>
  );

  const motionProps: HTMLMotionProps<'button'> = {
    whileHover: { scale: 1.025, y: -2 },
    whileTap: { scale: 0.97, y: 0 },
    transition: { type: 'spring', stiffness: 400, damping: 25 },
  };

  const combinedClasses = `group relative inline-flex items-center justify-center overflow-hidden transition-all duration-300 select-none cursor-pointer btn-spotlight ${
    variantStyles[variant]
  } ${sizeStyles[size]} ${className}`;

  if (href) {
    return (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      <motion.div {...(motionProps as any)} className="inline-block">
        <Link
          href={href}
          ref={btnRef as React.RefObject<HTMLAnchorElement>}
          onPointerMove={handlePointerMove}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onClick={handleClick as any}
          className={combinedClasses}
        >
          {content}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.button
      ref={btnRef as React.RefObject<HTMLButtonElement>}
      onPointerMove={handlePointerMove}
      onClick={handleClick}
      className={combinedClasses}
      {...motionProps}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      {...(props as any)}
    >
      {content}
    </motion.button>
  );
}
