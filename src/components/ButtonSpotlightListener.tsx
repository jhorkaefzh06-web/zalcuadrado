'use client';

import { useEffect } from 'react';

export default function ButtonSpotlightListener() {
  useEffect(() => {
    const handlePointerMove = (e: PointerEvent | MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest<HTMLElement>(
        'button, a, [data-spotlight], .btn, .btn-spotlight, input[type="submit"], input[type="button"]'
      );

      if (target) {
        const rect = target.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const pctX = (x / rect.width) * 100;
        const pctY = (y / rect.height) * 100;

        target.style.setProperty('--mouse-x', `${x}px`);
        target.style.setProperty('--mouse-y', `${y}px`);
        target.style.setProperty('--mouse-x-pct', `${pctX}%`);
        target.style.setProperty('--mouse-y-pct', `${pctY}%`);
      }
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('pointermove', handlePointerMove);
    };
  }, []);

  return null;
}
