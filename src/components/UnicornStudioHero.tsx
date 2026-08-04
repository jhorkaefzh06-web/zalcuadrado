'use client';
import Link from 'next/link';
import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules';
import { Sparkles, Wine, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import SpotlightButton from '@/components/SpotlightButton';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';

const slides = [
  {
    badge: '✨ EL ARTE DE BEBER BIEN — DELIVERY 24 HORAS',
    title: (
      <>
        Destilados Premium & <br />
        <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100 bg-clip-text text-transparent">
          Hielo Artesanal Perfecto
        </span>
      </>
    ),
    description: 'Eleva tus momentos disfrutando de nuestra selección de bebidas y promociones exclusivas, acompañados de nuestro hielo cristalino de fusión ultra lenta. En la puerta de tu casa en minutos.',
    primaryBtn: {
      text: 'Comprar Hielo',
      href: '/productos?category=hielos',
      icon: <Sparkles className="w-5 h-5 text-amber-200" />
    },
    secondaryBtn: {
      text: 'Explorar bebidas',
      href: '/productos?category=bebidas',
      icon: <Wine className="w-5 h-5 text-amber-400" />
    },
    glowColor: 'rgba(245, 158, 11, 0.15)', // Amber glow
  },
  {
    badge: '💎 PUREZA EXCLUSIVA — HIELOS GOURMET',
    title: (
      <>
        Hielo Cristalino <br />
        <span className="bg-gradient-to-r from-sky-200 via-sky-400 to-sky-100 bg-clip-text text-transparent">
          De Fusión Ultra Lenta
        </span>
      </>
    ),
    description: 'Nuestra tecnología y cuidado artesanal aseguran cubos y esferas de hielo cristalino 100% puro. Sin impurezas, sin diluir tus bebidas favoritas para un sabor inalterado.',
    primaryBtn: {
      text: 'Catálogo de Hielos',
      href: '/productos?category=hielos',
      icon: <Sparkles className="w-5 h-5 text-sky-200" />
    },
    secondaryBtn: {
      text: '¿Cómo lo hacemos?',
      href: '#seccion-3d-parallax',
      icon: <Wine className="w-5 h-5 text-sky-400" />
    },
    glowColor: 'rgba(14, 165, 233, 0.15)', // Sky/Blue glow
  },
  {
    badge: '🎉 COMBOS & PROMOCIONES — AHORRA MÁS',
    title: (
      <>
        Promociones Activas & <br />
        <span className="bg-gradient-to-r from-rose-200 via-rose-400 to-rose-100 bg-clip-text text-transparent">
          Combos Especiales
        </span>
      </>
    ),
    description: 'Encuentra las mejores combinaciones de licores y hielos cristalinos al mejor precio. Perfectos para tus reuniones y celebraciones express.',
    primaryBtn: {
      text: 'Ver Promociones',
      href: '#promotions-section',
      icon: <Sparkles className="w-5 h-5 text-rose-200" />
    },
    secondaryBtn: {
      text: 'Ver Todo',
      href: '/productos',
      icon: <Wine className="w-5 h-5 text-rose-400" />
    },
    glowColor: 'rgba(244, 63, 94, 0.15)', // Rose glow
  },
  {
    badge: '⚡ DELIVERY EXPRESS — 24 HORAS ACTIVO',
    title: (
      <>
        ¿Reunión de última hora? <br />
        <span className="bg-gradient-to-r from-emerald-200 via-emerald-400 to-emerald-100 bg-clip-text text-transparent">
          Despacho Express las 24/7
        </span>
      </>
    ),
    description: 'No te preocupes por el hielo ni los licores. Llevamos todo listo para servir directamente a tu puerta en tiempo récord. ¡El servicio nocturno líder de la ciudad!',
    primaryBtn: {
      text: 'Pedir por WhatsApp',
      href: 'https://wa.me/51999999999',
      icon: <Sparkles className="w-5 h-5 text-emerald-200" />
    },
    secondaryBtn: {
      text: 'Catálogo de Bebidas',
      href: '/productos?category=bebidas',
      icon: <Wine className="w-5 h-5 text-emerald-400" />
    },
    glowColor: 'rgba(16, 185, 129, 0.15)', // Emerald glow
    isBanner: true,
  },
  {
    isImageOnly: true,
    imageUrl: '/whiskey_ice_banner.png',
    href: '/productos?filter=promo',
    glowColor: 'rgba(251, 191, 36, 0.1)', // Subtle amber glow
  }
];

export default function UnicornStudioHero() {
  const [activeIndex, setActiveIndex] = useState(0);

  // Framer motion variants for rich text animation on active slide change
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring' as const,
        stiffness: 100,
        damping: 20,
      }
    }
  };

  return (
    <section className="relative w-full flex items-center justify-center select-none overflow-hidden h-dvh -mt-20 md:-mt-24">
      <Swiper
        modules={[Autoplay, Pagination, Navigation, EffectFade]}
        effect={'fade'}
        fadeEffect={{ crossFade: true }}
        speed={800}
        autoplay={{
          delay: 6000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        pagination={{
          clickable: true,
          bulletClass: 'swiper-pagination-bullet !bg-brand-400 !opacity-50 hover:!opacity-100 transition-all duration-300',
          bulletActiveClass: '!bg-amber-400 !opacity-100 !w-8 rounded-full',
        }}
        navigation={{
          nextEl: '.hero-swiper-button-next',
          prevEl: '.hero-swiper-button-prev',
        }}
        loop={true}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        className="w-full h-full absolute inset-0"
      >
        {slides.map((slide, idx) => (
          <SwiperSlide key={idx} className="relative w-full h-full flex items-center justify-center">
            {slide.isImageOnly ? (
              <Link
                href={slide.href || '#'}
                className="absolute inset-0 block w-full h-full z-10 group overflow-hidden"
              >
                <img
                  src={slide.imageUrl}
                  alt="Promotional Banner"
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                {/* Ambient Radial Background Glow matching slide theme */}
                <div
                  className="absolute inset-0 pointer-events-none transition-all duration-1000 z-20"
                  style={{
                    background: `radial-gradient(circle at 50% 50%, ${slide.glowColor} 0%, transparent 80%)`
                  }}
                />
                {/* Subtle dark overlay */}
                <div className="absolute inset-0 bg-brand-950/20 group-hover:bg-brand-950/10 transition-colors duration-300 z-15" />
              </Link>
            ) : (
              <>
                {/* Ambient Radial Background Glow matching slide theme */}
                <div
                  className="absolute inset-0 pointer-events-none transition-all duration-1000 z-0"
                  style={{
                    background: `radial-gradient(circle at 50% 50%, ${slide.glowColor} 0%, transparent 70%)`
                  }}
                />

                {/* Slide Content */}
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex items-center h-full pt-20 md:pt-24">
                  {/* Only animate elements if slide is active to trigger on transition */}
                  {activeIndex === idx && (
                    <motion.div
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                      className={`w-full space-y-6 text-center mx-auto ${
                        slide.isBanner ? 'max-w-3xl' : 'max-w-2xl sm:text-left sm:mx-0'
                      }`}
                    >
                      {/* Badge */}
                      <motion.div
                        variants={itemVariants}
                        className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-brand-900/60 backdrop-blur-md border border-white/10 text-amber-300 text-xs uppercase tracking-widest font-extrabold shadow-lg"
                      >
                        <span>{slide.badge}</span>
                      </motion.div>

                      {/* Headline */}
                      <motion.h1
                        variants={itemVariants}
                        className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)]"
                      >
                        {slide.title}
                      </motion.h1>

                      {/* Subtitle */}
                      <motion.p
                        variants={itemVariants}
                        className="text-base sm:text-lg text-brand-200 leading-relaxed font-medium drop-shadow-md"
                      >
                        {slide.description}
                      </motion.p>

                      {/* Action Buttons */}
                      <motion.div
                        variants={itemVariants}
                        className={`pt-4 flex flex-wrap items-center gap-4 justify-center ${
                          slide.isBanner ? '' : 'sm:justify-start'
                        }`}
                      >
                        {slide.primaryBtn && (
                          <SpotlightButton
                            href={slide.primaryBtn.href}
                            variant="primary"
                            size="lg"
                            icon={slide.primaryBtn.icon}
                          >
                            {slide.primaryBtn.text}
                          </SpotlightButton>
                        )}

                        {slide.secondaryBtn && (
                          <SpotlightButton
                            href={slide.secondaryBtn.href}
                            variant="secondary"
                            size="lg"
                            icon={slide.secondaryBtn.icon}
                          >
                            {slide.secondaryBtn.text}
                          </SpotlightButton>
                        )}
                      </motion.div>
                    </motion.div>
                  )}
                </div>
              </>
            )}
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Premium Glassmorphic Navigation Buttons */}
      <button
        className="hero-swiper-button-prev absolute left-4 z-30 flex items-center justify-center w-12 h-12 rounded-full border border-white/10 bg-brand-950/40 text-brand-300 backdrop-blur-md hover:bg-brand-900/60 hover:text-white transition-all duration-300 cursor-pointer shadow-lg active:scale-95 md:left-8"
        aria-label="Anterior"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        className="hero-swiper-button-next absolute right-4 z-30 flex items-center justify-center w-12 h-12 rounded-full border border-white/10 bg-brand-950/40 text-brand-300 backdrop-blur-md hover:bg-brand-900/60 hover:text-white transition-all duration-300 cursor-pointer shadow-lg active:scale-95 md:right-8"
        aria-label="Siguiente"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </section>
  );
}

