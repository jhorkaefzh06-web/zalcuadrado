'use client';

export default function Background3DCanvas() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Static HD Background Image Layer */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: `url('/new-background.png')`,
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

