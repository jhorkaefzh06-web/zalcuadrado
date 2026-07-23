'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function Background3DContent() {
  const searchParams = useSearchParams();
  const category = searchParams.get('category');
  const isHielos = category === 'hielos';

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Static HD Background Image Layer */}
      <div
        className="absolute inset-0 w-full h-full transition-all duration-700"
        style={{
          backgroundImage: `url(${isHielos ? '/hielos-background.jpg' : '/new-background.png'})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
        }}
      />

      {/* Brighter and sharper vignette overlay for readable text while keeping background crisp and HD */}
      <div className="absolute inset-0 bg-brand-950/30 dark:bg-brand-950/35" />
    </div>
  );
}

export default function Background3DCanvas() {
  return (
    <Suspense fallback={
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-brand-950" />
    }>
      <Background3DContent />
    </Suspense>
  );
}

