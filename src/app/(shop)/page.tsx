/* eslint-disable */
'use client';

import Link from 'next/link';
import * as Icons from 'lucide-react';
import { motion } from 'framer-motion';

import { CATEGORIES, TESTIMONIALS } from '@/lib/mockData';
import { useProducts } from '@/hooks/useProducts';
import UnicornStudioHero from '@/components/UnicornStudioHero';

export default function Home() {
  const { products: PRODUCTS } = useProducts();
  const promoProducts = PRODUCTS.filter(p => p.isPromo);

  return (
    <div className="w-full pb-16">

      {/* 1. HERO UNICORN STUDIO 3D PARALLAX WITH HD BOTTLE & WATER FALL EFFECT */}
      <UnicornStudioHero />




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
