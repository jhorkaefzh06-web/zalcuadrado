/* eslint-disable */
'use client';

import Link from 'next/link';
import * as Icons from 'lucide-react';
import { motion } from 'framer-motion';

import { CATEGORIES, PRODUCTS, TESTIMONIALS } from '@/lib/mockData';
import UnicornStudioHero from '@/components/UnicornStudioHero';
import Bottle3D from '@/components/Bottle3D';

import SpotlightButton from '@/components/SpotlightButton';

// Dynamic Icon rendering helper
function CategoryIcon({ name, className = "w-6 h-6" }: { name: string; className?: string }) {
  const IconComponent = (Icons as any)[name] || Icons.Wine;
  return <IconComponent className={className} />;
}

export default function Home() {
  const promoProducts = PRODUCTS.filter(p => p.isPromo);

  const displayCategories = [
    {
      id: "hielos",
      name: "Hielos & Hielo Gourmet",
      description: "Hielo cristalino en esferas, cubos macizos, escamas y hielo seco para coctelería.",
      icon: "Sparkles",
      image: "https://images.unsplash.com/photo-1517559132301-7e137c887960?q=80&w=800&auto=format&fit=crop",
      href: "/productos?category=hielos"
    },
    {
      id: "bebidas",
      name: "Bebidas & Licores",
      description: "Whiskies, Vinos, Rones, Tequilas, Ginebras y cervezas importadas.",
      icon: "Wine",
      image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=800&auto=format&fit=crop",
      href: "/productos?category=bebidas"
    },
    {
      id: "promociones",
      name: "Promociones & Ofertas",
      description: "Aprovecha descuentos exclusivos, combos y promociones especiales del día.",
      icon: "Tag",
      image: "https://images.unsplash.com/photo-1572715655204-47e297d386ce?q=80&w=800&auto=format&fit=crop",
      href: "/productos?filter=promo"
    }
  ];

  return (
    <div className="w-full pb-16">
      
      {/* 1. HERO UNICORN STUDIO 3D PARALLAX WITH HD BOTTLE & WATER FALL EFFECT */}
      <UnicornStudioHero />

      {/* 2. SECCIÓN DESTACADA: BOTELLA EN EFECTO 3D PARALLAX INTERACTIVO CON EL CURSOR */}
      <section id="seccion-3d-parallax" className="w-full bg-gradient-to-b from-brand-950 via-brand-900 to-brand-950 text-white py-16 md:py-24 border-b border-brand-800/50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Texto descriptivo de la experiencia 3D */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="inline-flex items-center space-x-2 text-xs uppercase tracking-widest font-bold px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400">
                <Icons.Sparkles className="w-4 h-4 text-amber-400" />
                <span>Experiencia 3D Parallax & Agua en Movimiento</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
                Licorería Premium con <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100 bg-clip-text text-transparent">Efecto 3D Estilo Unicorn Studio</span>
              </h2>
              <p className="text-brand-300 leading-relaxed text-base">
                Disfruta del fondo interactivo con gotas de agua y destellos de hielo cayendo sobre la botella en tiempo real. Mueve tu cursor para experimentar la profundidad tridimensional.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-brand-800/40 border border-amber-500/20 space-y-1">
                  <span className="text-amber-400 font-bold text-lg">Hielo Gourmet Z²</span>
                  <p className="text-xs text-brand-300">Esferas cristalinas de fusión ultra lenta</p>
                </div>
                <div className="p-4 rounded-xl bg-brand-800/40 border border-amber-500/20 space-y-1">
                  <span className="text-amber-400 font-bold text-lg">Delivery 24/7</span>
                  <p className="text-xs text-brand-300">Envíos helados en menos de 45 minutos</p>
                </div>
              </div>
              <div className="pt-4 flex flex-wrap gap-4">
                <SpotlightButton
                  href="/productos?category=hielos"
                  variant="primary"
                  size="md"
                >
                  Pedir Hielos Gourmet
                </SpotlightButton>
                <SpotlightButton
                  href="/productos?category=bebidas"
                  variant="secondary"
                  size="md"
                >
                  Catálogo de Bebidas
                </SpotlightButton>
              </div>
            </motion.div>

            {/* Contenedor 3D Interactivo con la botella y el cursor */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="flex justify-center items-center"
            >
              <Bottle3D
                imageSrc="/hero-bottle-3d.png"
                altText="Botella Johnnie Walker Black Label 3D"
                className="w-full max-w-lg"
              />
            </motion.div>

          </div>
        </div>
      </section>

      {/* 3. CATEGORIES SECTION */}
      <section id="categories-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            Nuestra Selección de Hielos & Bebidas
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mt-2">
            Explora por Categoría
          </h2>
          <p className="text-brand-500 dark:text-brand-400 mt-3">
            Hielos gourmet cristalinos, nuestra cava exclusiva de licores y las mejores ofertas del día.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {displayCategories.map((cat, index) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                href={cat.href}
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
                  <div className="p-3 rounded-xl bg-white/10 backdrop-blur-md w-fit mb-3 group-hover:bg-amber-600 transition-colors">
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

      {/* 4. PROMOTIONS SECTION */}
      <section id="promotions-section" className="bg-brand-100 dark:bg-brand-900/30 py-16 md:py-24 border-y border-brand-200/30 dark:border-brand-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                Oportunidades Únicas
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mt-2">
                Promociones Destacadas
              </h2>
            </div>
            <Link
              href="/productos?filter=promo"
              className="mt-4 md:mt-0 text-sm font-bold text-amber-600 dark:text-amber-400 hover:underline inline-flex items-center space-x-1"
            >
              <span>Ver todas las ofertas</span>
              <Icons.ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {promoProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white dark:bg-brand-900 rounded-2xl overflow-hidden shadow-lg border border-brand-200/60 dark:border-brand-800/60 flex flex-col justify-between group hover:-translate-y-1 transition-all duration-300"
              >
                <div>
                  <div className="relative h-64 overflow-hidden bg-brand-950">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-4 left-4 bg-amber-500 text-brand-950 font-extrabold text-xs px-3 py-1.5 rounded-full uppercase tracking-wider shadow-md">
                      Oferta Especial
                    </span>
                  </div>
                  <div className="p-6">
                    <div className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1">
                      {product.brand}
                    </div>
                    <h3 className="text-lg font-bold text-brand-900 dark:text-white line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-sm text-brand-500 dark:text-brand-400 mt-2 line-clamp-2">
                      {product.description}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-brand-100 dark:border-brand-800/50 flex items-center justify-between mt-4">
                  <div>
                    <span className="text-xs text-brand-400 line-through mr-2">
                      ${product.price.toFixed(2)}
                    </span>
                    <span className="text-2xl font-extrabold text-amber-600 dark:text-amber-400">
                      ${product.promoPrice?.toFixed(2)}
                    </span>
                  </div>
                  <Link
                    href={`/contacto`}
                    className="p-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-brand-950 font-bold transition-colors shadow-md"
                  >
                    <Icons.ShoppingBag className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
