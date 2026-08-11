'use client';

import { motion } from 'framer-motion';
import Bottle3D from '@/components/Bottle3D';

export default function QuienesSomos() {
  return (
    <div className="w-full min-h-[80vh] flex items-center justify-center pb-12 text-white relative overflow-hidden">
      {/* Background soft ambient glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full filter blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-600/5 rounded-full filter blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="space-y-6"
          >
            <span className="text-xs font-black uppercase tracking-widest text-amber-500">Z² EXPERIENCE</span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight">
              ¿Quiénes <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100 bg-clip-text text-transparent drop-shadow-[0_2px_10px_rgba(245,158,11,0.2)]">Somos?</span>
            </h1>
            
            <p className="text-brand-300 leading-relaxed text-base sm:text-lg">
              En Z² redefinimos el concepto de disfrutar de una buena bebida. No solo te ofrecemos licores seleccionados de alta gama, sino que creamos el complemento perfecto con nuestro hielo gourmet cristalino de fusión ultra lenta, diseñado artesanalmente para mantener el sabor intacto de tu copa. Nos mueve la pasión por el detalle, la calidad excepcional y un servicio express las 24 horas.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4">
              <motion.div 
                whileHover={{ y: -5 }}
                className="p-5 rounded-2xl bg-brand-900/40 border border-amber-500/20 space-y-2 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:border-amber-400/40 hover:shadow-[0_0_15px_rgba(245,158,11,0.15)] transition-all duration-300"
              >
                <span className="text-amber-400 font-extrabold text-lg">Calidad Artesanal</span>
                <p className="text-xs text-brand-300 leading-relaxed">
                  Hielos de pureza cristalina elaborados bajo rigurosos procesos y una selección premium de destilados.
                </p>
              </motion.div>

              <motion.div 
                whileHover={{ y: -5 }}
                className="p-5 rounded-2xl bg-brand-900/40 border border-amber-500/20 space-y-2 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:border-amber-400/40 hover:shadow-[0_0_15px_rgba(245,158,11,0.15)] transition-all duration-300"
              >
                <span className="text-amber-400 font-extrabold text-lg">Experiencia Z²</span>
                <p className="text-xs text-brand-300 leading-relaxed">
                  Servicio express de delivery las 24 horas del día. Listos para abastecer y realzar tus celebraciones.
                </p>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="flex justify-center items-center relative"
          >
            {/* Ambient lighting behind bottle */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-amber-500/10 rounded-full filter blur-[100px] pointer-events-none" />
            
            <Bottle3D
              imageSrc="/hero-bottle-3d.png"
              altText="Botella Johnnie Walker Black Label Z2"
              className="w-full max-w-md drop-shadow-[0_10px_30px_rgba(0,0,0,0.6)]"
            />
          </motion.div>

        </div>
      </div>
    </div>
  );
}
