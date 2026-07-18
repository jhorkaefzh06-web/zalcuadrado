'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import * as Icons from 'lucide-react';
import { motion } from 'framer-motion';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

import { CATEGORIES, PRODUCTS, TESTIMONIALS } from '@/lib/mockData';

// Dynamic Icon rendering helper
function CategoryIcon({ name, className = "w-6 h-6" }: { name: string; className?: string }) {
  const IconComponent = (Icons as any)[name] || Icons.HelpCircle;
  return <IconComponent className={className} />;
}

const HERO_SLIDES = [
  {
    id: 1,
    title: 'Redefine tu Espacio de Trabajo',
    subtitle: 'Mobiliario ergonómico premium diseñado para maximizar tu salud, confort y concentración diaria.',
    image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1600&auto=format&fit=crop',
    ctaText: 'Ver Muebles',
    ctaLink: '/productos?category=oficina',
    accentColor: 'from-primary-500 to-accent-pink',
  },
  {
    id: 2,
    title: 'Tecnología y Gadgets de Vanguardia',
    subtitle: 'Potencia tu productividad y flujo de trabajo digital con dispositivos y accesorios inteligentes.',
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1600&auto=format&fit=crop',
    ctaText: 'Explorar Tecnología',
    ctaLink: '/productos?category=tecnologia',
    accentColor: 'from-accent-violet to-primary-600',
  },
  {
    id: 3,
    title: 'Soporte y Domótica Especializada',
    subtitle: 'Asesoramiento ergonómico personalizado e instalación profesional para el hogar inteligente.',
    image: 'https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=1600&auto=format&fit=crop',
    ctaText: 'Conocer Servicios',
    ctaLink: '/servicios',
    accentColor: 'from-accent-amber to-accent-rose',
  },
];

export default function Home() {
  const promoProducts = PRODUCTS.filter(p => p.isPromo);

  return (
    <div className="w-full pb-16">
      
      {/* 1. HERO SLIDER */}
      <section id="hero-slider" className="w-full h-[65vh] md:h-[80vh] bg-brand-900 relative overflow-hidden">
        <Swiper
          modules={[Navigation, Pagination, Autoplay, EffectFade]}
          effect={'fade'}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 6000, disableOnInteraction: false }}
          loop
          className="w-full h-full"
        >
          {HERO_SLIDES.map((slide) => (
            <SwiperSlide key={slide.id} className="relative w-full h-full">
              {/* Background Image with dark overlay */}
              <div className="absolute inset-0 bg-brand-950/60 z-10" />
              <div className="absolute inset-0 w-full h-full">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Slide Content */}
              <div className="absolute inset-0 z-20 flex items-center justify-start max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-2xl text-left text-white space-y-6">
                  <motion.span
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-block text-xs uppercase tracking-widest font-semibold px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20"
                  >
                    Exclusivo ZetaCorp
                  </motion.span>
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight"
                  >
                    {slide.title}
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-lg text-brand-200"
                  >
                    {slide.subtitle}
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="pt-2"
                  >
                    <Link
                      href={slide.ctaLink}
                      className={`px-8 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r ${slide.accentColor} text-white shadow-lg shadow-primary-500/20 hover:scale-[1.03] active:scale-[0.97] transition-all inline-block`}
                    >
                      {slide.ctaText}
                    </Link>
                  </motion.div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* 2. CATEGORIES SECTION */}
      <section id="categories-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400">
            Nuestros Universos
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mt-2">
            Compra por Categoría
          </h2>
          <p className="text-brand-500 dark:text-brand-400 mt-3">
            Explora nuestra cuidada selección de productos diseñados para cada aspecto de tu rutina productiva y bienestar.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {CATEGORIES.map((cat, index) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                href={`/productos?category=${cat.id}`}
                className="group block relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 h-64 border border-brand-200/50 dark:border-brand-800/50"
              >
                {/* Background image */}
                <div className="absolute inset-0 bg-gradient-to-t from-brand-950 via-brand-900/40 to-transparent z-10 transition-opacity group-hover:opacity-90" />
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {/* Category metadata */}
                <div className="absolute inset-0 z-20 p-5 flex flex-col justify-end text-white">
                  <div className="p-3 rounded-xl bg-white/10 backdrop-blur-md w-fit mb-3 group-hover:bg-primary-600 transition-colors">
                    <CategoryIcon name={cat.icon} className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold tracking-tight">{cat.name}</h3>
                  <p className="text-xs text-brand-300 opacity-0 group-hover:opacity-100 transition-all duration-300 mt-1 line-clamp-2">
                    {cat.description}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. PROMOTIONS SECTION */}
      <section id="promotions-section" className="bg-brand-100 dark:bg-brand-900/30 py-16 md:py-24 border-y border-brand-200/30 dark:border-brand-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div className="max-w-xl">
              <span className="text-xs font-bold uppercase tracking-wider text-accent-rose">
                Precios Especiales
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mt-2 text-brand-900 dark:text-white">
                Promociones Exclusivas
              </h2>
              <p className="text-brand-500 dark:text-brand-400 mt-3">
                No dejes pasar estos descuentos temporales en nuestros productos estrella. ¡Hasta agotar stock!
              </p>
            </div>
            <Link
              href="/productos?filter=promo"
              className="mt-4 md:mt-0 inline-flex items-center space-x-2 text-sm font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 transition-colors"
            >
              <span>Ver todas las ofertas</span>
              <Icons.ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {promoProducts.slice(0, 4).map((product, idx) => {
              const discount = Math.round(((product.price - (product.promoPrice || 0)) / product.price) * 100);
              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="glass rounded-2xl overflow-hidden flex flex-col hover:shadow-lg transition-shadow duration-300"
                >
                  {/* Image container with discount badge */}
                  <div className="relative aspect-square w-full bg-brand-100 dark:bg-brand-850">
                    <span className="absolute top-3 left-3 z-10 px-2.5 py-1 text-xs font-bold text-white bg-accent-rose rounded-lg shadow-sm">
                      -{discount}%
                    </span>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Body details */}
                  <div className="p-5 flex-grow flex flex-col justify-between">
                    <div>
                      <span className="text-xs uppercase font-medium text-brand-400">
                        {product.brand}
                      </span>
                      <h3 className="text-base font-bold text-brand-900 dark:text-white mt-1 line-clamp-1">
                        {product.name}
                      </h3>
                      {/* Star rating */}
                      <div className="flex items-center space-x-1 mt-2">
                        <Icons.Star className="w-3.5 h-3.5 text-accent-amber fill-accent-amber" />
                        <span className="text-xs font-bold text-brand-700 dark:text-brand-300">{product.rating}</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-brand-200/50 dark:border-brand-800/50 flex items-center justify-between">
                      <div>
                        <span className="text-xs line-through text-brand-400 block">
                          S/ {product.price.toFixed(2)}
                        </span>
                        <span className="text-lg font-extrabold text-accent-rose">
                          S/ {product.promoPrice?.toFixed(2)}
                        </span>
                      </div>
                      <Link
                        href={`/productos?id=${product.id}`}
                        className="p-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white transition-colors"
                        aria-label="Ver detalles"
                      >
                        <Icons.Eye className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. TESTIMONIALS SECTION */}
      <section id="testimonials-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400">
            Opiniones Reales
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mt-2">
            Lo que dicen nuestros clientes
          </h2>
          <p className="text-brand-500 dark:text-brand-400 mt-3">
            Únete a los miles de profesionales que han transformado su entorno laboral con ZetaCorp.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            loop
            spaceBetween={30}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
            }}
            className="pb-14"
          >
            {TESTIMONIALS.map((test) => (
              <SwiperSlide key={test.id}>
                <div className="glass p-8 rounded-3xl h-full flex flex-col justify-between shadow-sm relative">
                  <div className="absolute top-6 right-8 text-primary-200 dark:text-brand-800">
                    <Icons.Quote className="w-12 h-12 rotate-180" />
                  </div>
                  <div>
                    {/* Stars */}
                    <div className="flex items-center space-x-1 mb-4">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Icons.Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < test.rating
                              ? 'text-accent-amber fill-accent-amber'
                              : 'text-brand-300'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-brand-600 dark:text-brand-300 italic text-sm leading-relaxed mb-6">
                      "{test.feedback}"
                    </p>
                  </div>
                  
                  {/* User Profile */}
                  <div className="flex items-center space-x-3.5 pt-4 border-t border-brand-200/50 dark:border-brand-800/50">
                    <img
                      src={test.avatar}
                      alt={test.name}
                      className="w-12 h-12 rounded-full object-cover border border-primary-500/20"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-brand-900 dark:text-white">{test.name}</h4>
                      <p className="text-xs text-brand-400">{test.role}</p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

    </div>
  );
}
