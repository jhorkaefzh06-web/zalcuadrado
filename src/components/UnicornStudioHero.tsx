'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, Wine, ShieldAlert } from 'lucide-react';

export default function UnicornStudioHero() {
  return (
    <section className="relative w-full py-20 md:py-32 flex items-center justify-center select-none overflow-hidden">
      {/* Content Container Floating Over Global 3D Background */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center sm:text-left">
        <div className="max-w-2xl space-y-6">
          
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-amber-500/20 backdrop-blur-md border border-amber-500/40 text-amber-300 text-xs uppercase tracking-widest font-extrabold shadow-lg"
          >
            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>🔞 Hielos & Bebidas Z² — Delivery 24/7</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]"
          >
            Cava Exclusiva & <br />
            <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100 bg-clip-text text-transparent">
              Hielo Gourmet en 3D
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-base sm:text-lg text-brand-200 leading-relaxed font-medium drop-shadow-md"
          >
            Hielo en esferas de cristal de fusión ultra lenta, whiskies escoceses Single Malt, vinos reservas y licores congelados entregados en menos de 45 minutos.
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="pt-4 flex flex-wrap items-center gap-4 justify-center sm:justify-start"
          >
            <Link
              href="/productos?category=hielos"
              className="px-8 py-4 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-white shadow-xl shadow-amber-500/30 hover:scale-[1.03] active:scale-[0.97] transition-all flex items-center space-x-2"
            >
              <Sparkles className="w-5 h-5 text-amber-200" />
              <span>Pedir Hielos Gourmet</span>
            </Link>

            <Link
              href="/productos?category=bebidas"
              className="px-8 py-4 rounded-xl font-bold text-sm bg-brand-900/80 hover:bg-brand-800 text-amber-300 border border-amber-500/40 backdrop-blur-md shadow-lg hover:scale-[1.03] active:scale-[0.97] transition-all flex items-center space-x-2"
            >
              <Wine className="w-5 h-5 text-amber-400" />
              <span>Catálogo de Bebidas</span>
            </Link>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
