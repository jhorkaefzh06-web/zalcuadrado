'use client';

import { useState } from 'react';
import * as Icons from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { NEWS, NewsItem } from '@/lib/mockData';

export default function NoticiasPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [activeNews, setActiveNews] = useState<NewsItem | null>(null);

  // Extract unique categories
  const categories = ['todos', ...Array.from(new Set(NEWS.map((n) => n.category)))];

  // Filter news
  const filteredNews = NEWS.filter((item) => {
    if (selectedCategory !== 'todos' && item.category !== selectedCategory) {
      return false;
    }
    return true;
  });

  return (
    <div className="w-full pb-20">
      
      {/* 1. Header Banner */}
      <section className="relative h-[30vh] md:h-[40vh] bg-brand-900 flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-brand-950/75 z-10" />
        <img
          src="https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=1600&auto=format&fit=crop"
          alt="Blog de Enología y Coctelería"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 z-20 flex flex-col justify-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
          <span className="text-xs uppercase tracking-widest text-amber-400 font-bold mb-2">
            Cultura & Maridaje
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            Blog & Notas de Cata
          </h1>
          <p className="text-lg text-brand-300 max-w-xl mt-4">
            Guías de maridaje, recetas de cócteles de autor y secretos de añejamiento en barrica.
          </p>
        </div>
      </section>

      {/* 2. Main news grid & filters */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        
        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all border shadow-sm ${
                selectedCategory === cat
                  ? 'bg-amber-600 text-white border-transparent'
                  : 'bg-white dark:bg-brand-900 border-brand-200 dark:border-brand-800 text-brand-700 dark:text-brand-300 hover:bg-brand-50'
              }`}
            >
              {cat === 'todos' ? 'Ver Todas' : cat}
            </button>
          ))}
        </div>

        {/* Grid List */}
        {filteredNews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredNews.map((item, index) => (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setActiveNews(item)}
                className="glass rounded-3xl overflow-hidden cursor-pointer flex flex-col justify-between hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all border border-brand-200/50 dark:border-brand-800/50"
              >
                <div>
                  {/* Article Image */}
                  <div className="aspect-[16/10] w-full bg-brand-100 dark:bg-brand-900/40 relative">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-3 left-4 px-2.5 py-1 text-[10px] uppercase font-bold text-white bg-amber-600 rounded-lg shadow-sm">
                      {item.category}
                    </span>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 md:p-8 space-y-3">
                    <div className="flex items-center text-xs text-brand-450 dark:text-brand-400 space-x-4">
                      <span className="flex items-center space-x-1">
                        <Icons.Calendar className="w-3.5 h-3.5 text-amber-500" />
                        <span>{item.date}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Icons.Clock className="w-3.5 h-3.5 text-amber-500" />
                        <span>{item.readTime}</span>
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-brand-900 dark:text-white line-clamp-2 leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs text-brand-500 dark:text-brand-400 leading-relaxed line-clamp-3">
                      {item.excerpt}
                    </p>
                  </div>
                </div>

                {/* Footer read-more indicators */}
                <div className="p-6 md:px-8 md:pb-8 pt-0 border-t border-brand-200/50 dark:border-brand-850 flex items-center justify-between text-xs font-bold text-amber-600 dark:text-amber-400">
                  <span>Por {item.author}</span>
                  <span className="flex items-center space-x-1 hover:translate-x-1 transition-transform">
                    <span>Leer Artículo</span>
                    <Icons.ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </motion.article>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-brand-400">No hay artículos registrados bajo esta categoría.</p>
          </div>
        )}
      </section>

      {/* 3. Reading Details Modal */}
      <AnimatePresence>
        {activeNews && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ y: 50, scale: 0.95 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 50, scale: 0.95 }}
              transition={{ type: 'spring', duration: 0.4 }}
              className="bg-white dark:bg-brand-950 rounded-3xl w-full max-w-3xl max-h-[85vh] overflow-y-auto shadow-2xl relative border border-brand-800"
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveNews(null)}
                className="absolute top-4 right-4 z-20 p-2 rounded-xl bg-black/40 hover:bg-black/60 text-white backdrop-blur-md transition-colors"
                aria-label="Cerrar modal"
              >
                <Icons.X className="w-5 h-5" />
              </button>

              {/* Banner Image */}
              <div className="w-full aspect-[21/9] bg-brand-200 relative">
                <img
                  src={activeNews.image}
                  alt={activeNews.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute bottom-4 left-6 right-6 text-white space-y-2">
                  <span className="inline-block px-2.5 py-1 text-[10px] uppercase font-bold bg-amber-600 rounded-lg">
                    {activeNews.category}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight leading-snug">
                    {activeNews.title}
                  </h2>
                </div>
              </div>

              {/* Content Body */}
              <div className="p-6 sm:p-8 space-y-6">
                <div className="flex flex-wrap items-center justify-between text-xs text-brand-450 dark:text-brand-400 pb-4 border-b border-brand-200/50 dark:border-brand-800/50 gap-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-950 flex items-center justify-center font-bold text-amber-600">
                      {activeNews.author.substring(0, 2).toUpperCase()}
                    </div>
                    <span>Escrito por <strong>{activeNews.author}</strong></span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center space-x-1">
                      <Icons.Calendar className="w-4 h-4 text-amber-500" />
                      <span>{activeNews.date}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Icons.Clock className="w-4 h-4 text-amber-500" />
                      <span>{activeNews.readTime}</span>
                    </span>
                  </div>
                </div>

                <div className="prose dark:prose-invert max-w-none text-brand-700 dark:text-brand-350 text-sm leading-relaxed space-y-4">
                  <p className="font-semibold text-brand-900 dark:text-white text-base">
                    {activeNews.excerpt}
                  </p>
                  <p>{activeNews.content}</p>
                  <p>
                    Además de los puntos destacados, nuestros sommeliers aconsejan mantener las botellas de vino tinto acostadas en un lugar oscuro y con temperatura constante entre 14°C y 16°C. El almacenamiento adecuado preserva la flexibilidad del corcho natural y previene la oxidación prematura del producto.
                  </p>
                  <p>
                    Zeta Spirits continuará publicando guías exclusivas e invitando a reconocidos sommeliers y mixólogos. Suscríbete a nuestro boletín para recibir recomendaciones semanales de maridaje.
                  </p>
                </div>

                {/* Footer action */}
                <div className="pt-6 border-t border-brand-200/50 dark:border-brand-800/50 flex justify-end">
                  <button
                    onClick={() => setActiveNews(null)}
                    className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs transition-colors"
                  >
                    Volver al Blog
                  </button>
                </div>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
