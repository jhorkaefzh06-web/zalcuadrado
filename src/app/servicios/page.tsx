/* eslint-disable */
'use client';

import { useState } from 'react';
import Link from 'next/link';
import * as Icons from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SERVICES } from '@/lib/mockData';

function ServiceIcon({ name, className = "w-6 h-6" }: { name: string; className?: string }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const IconComponent = (Icons as any)[name] || Icons.Wine;
  return <IconComponent className={className} />;
}

export default function ServiciosPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
    }
  };

  return (
    <div className="w-full pb-20">
      
      {/* 1. Header Banner */}
      <section className="relative h-[35vh] md:h-[45vh] bg-brand-900 flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-brand-950/75 z-10" />
        <img
          src="https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=1600&auto=format&fit=crop"
          alt="Servicios de Cava"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 z-20 flex flex-col justify-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
          <span className="text-xs uppercase tracking-widest text-amber-400 font-bold mb-2">
            Experiencias & Atención
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            Servicios Exclusivos de Cava
          </h1>
          <p className="text-lg text-brand-300 max-w-xl mt-4">
            Delivery express en frío, degustaciones guiadas con Sommelier, regalos VIP corporativos y catering de bebidas para eventos.
          </p>
        </div>
      </section>

      {/* 2. Interactive Services List */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            Nuestra Propuesta
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight mt-2">
            Servicios a Medida
          </h2>
          <p className="text-brand-500 dark:text-brand-400 mt-3">
            Haz clic en cualquiera de nuestros servicios para ver los detalles del programa y solicitar una cotización directa.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {SERVICES.map((service, index) => {
            const isExpanded = expandedId === service.id;
            return (
              <motion.div
                key={service.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`glass rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow border border-brand-200/50 dark:border-brand-800/50 flex flex-col justify-between h-fit`}
              >
                <div>
                  {/* Service Image */}
                  <div className="aspect-video w-full relative bg-brand-100 dark:bg-brand-900/40">
                    <img
                      src={service.image}
                      alt={service.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-3 left-4 p-2.5 rounded-xl bg-white dark:bg-brand-950 text-amber-600 dark:text-amber-400 shadow-md">
                      <ServiceIcon name={service.icon} />
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 space-y-4">
                    <h3 className="text-lg font-bold text-brand-900 dark:text-white">
                      {service.name}
                    </h3>
                    <p className="text-xs text-brand-500 dark:text-brand-400 leading-relaxed">
                      {service.description}
                    </p>

                    {/* Expandable Section */}
                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.25 }}
                          className="pt-4 border-t border-brand-200/50 dark:border-brand-800/50 overflow-hidden"
                        >
                          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-2">
                            El servicio incluye:
                          </h4>
                          <ul className="space-y-2">
                            {service.details.map((detail, idx) => (
                              <li key={idx} className="flex items-start space-x-2 text-xs text-brand-600 dark:text-brand-300">
                                <Icons.CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                                <span>{detail}</span>
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="p-6 pt-0 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => toggleExpand(service.id)}
                    className="flex-1 py-2.5 rounded-xl border border-brand-200 dark:border-brand-800 hover:bg-brand-100 dark:hover:bg-brand-900 text-xs font-bold flex items-center justify-center space-x-2 text-brand-700 dark:text-brand-300"
                  >
                    <span>{isExpanded ? 'Ocultar' : 'Detalles'}</span>
                    <Icons.ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                  </button>
                  <Link
                    href={`/contacto?service=${service.id}`}
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-primary-600 to-amber-600 text-white hover:opacity-90 text-xs font-bold text-center flex items-center justify-center shadow-sm"
                  >
                    Cotizar
                  </Link>
                </div>

              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 3. CTA FAQ Banner */}
      <section className="bg-brand-950 text-white py-16 md:py-20 border-t border-brand-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-2xl md:text-3xl font-extrabold">¿Organizando un Evento Grande, Boda o Cajas Corporativas?</h2>
          <p className="text-brand-300 text-sm max-w-2xl mx-auto leading-relaxed">
            Ofrecemos venta a consignación para grandes eventos, grabado personalizado de cajas de madera de regalo y suministro de barras de tragos de autor.
          </p>
          <div className="pt-4">
            <Link
              href="/contacto"
              className="px-8 py-3.5 bg-gradient-to-r from-amber-500 to-amber-700 text-white hover:opacity-90 rounded-xl font-bold text-sm shadow-lg inline-block"
            >
              Hablar con un Sommelier Asesor
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
