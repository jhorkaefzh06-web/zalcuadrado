'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, Wine, ShieldAlert } from 'lucide-react';

import SpotlightButton from '@/components/SpotlightButton';

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
            <span>✨ EL ARTE DE BEBER BIEN — DELIVERY las 24 horas</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]"
          >
            Destilados Premium & <br />
            <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100 bg-clip-text text-transparent">
              Hielo Artesanal Perfecto
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-base sm:text-lg text-brand-200 leading-relaxed font-medium drop-shadow-md"
          >
            Eleva tus momentos disfrutando de nuestra selección de bebidas y promociones exclusivas, acompañados de nuestro hielo cristalino de fusión ultra lenta. En la puerta de tu casa en minutos.
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="pt-4 flex flex-wrap items-center gap-4 justify-center sm:justify-start"
          >
            <SpotlightButton
              href="/productos?category=hielos"
              variant="primary"
              size="lg"
              icon={<Sparkles className="w-5 h-5 text-amber-200" />}
            >
              Comprar Hielo
            </SpotlightButton>

            <SpotlightButton
              href="/productos?category=bebidas"
              variant="secondary"
              size="lg"
              icon={<Wine className="w-5 h-5 text-amber-400" />}
            >
              Explorar bebidas
            </SpotlightButton>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
