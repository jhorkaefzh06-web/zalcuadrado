'use client';

import { motion } from 'framer-motion';
import { Target, Compass, Users, Trophy, Award, Heart, Wine } from 'lucide-react';

const METRICS = [
  { id: 1, val: '15+', label: 'Años en la Industria', desc: 'Seleccionando las mejores etiquetas de todo el mundo.', icon: Trophy },
  { id: 2, val: '50k+', label: 'Botellas Descorchadas', desc: 'Entregadas con la garantía de conservación en cava.', icon: Users },
  { id: 3, val: '300+', label: 'Etiquetas Exclusivas', desc: 'Single Malts, Gran Reserva y Champagnes AOC.', icon: Award },
  { id: 4, val: '45 min', label: 'Delivery Express', desc: 'Promedio de entrega fría lista para celebrar.', icon: Heart },
];

const TEAM = [
  {
    id: 1,
    name: 'Jean-Luc Moreau',
    role: 'Master Sommelier & Director de Cava',
    bio: 'Sommelier certificado internacionalmente con 18 años de experiencia en viñedos de Burdeos, Escocia y Mendoza.',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&auto=format&fit=crop',
  },
  {
    id: 2,
    name: 'Valeria Sotomayor',
    role: 'Head Mixologist & Directora de Catas',
    bio: 'Campeona nacional de mixología. Diseñadora de cartas de tragos de autor y directora de catas privadas.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop',
  },
  {
    id: 3,
    name: 'Alejandro Rossi',
    role: 'Fundador & Especialista en Destilados',
    bio: 'Coleccionista de whiskies raros y apasionado por la cultura de los destilados artesanales de alta gama.',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=400&auto=format&fit=crop',
  },
];

export default function QuienesSomos() {
  return (
    <div className="w-full pb-20">
      
      {/* 1. Header Banner */}
      <section className="relative h-[35vh] md:h-[45vh] bg-brand-900 flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-brand-950/75 z-10" />
        <img
          src="https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=1600&auto=format&fit=crop"
          alt="Cava de vinos"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 z-20 flex flex-col justify-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs uppercase tracking-widest text-amber-400 font-bold mb-2"
          >
            Nuestra Historia
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-extrabold tracking-tight"
          >
            Nuestra Cava & Tradición
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-brand-300 max-w-xl mt-4"
          >
            Conoce la pasión por los destilados finos, los vinos de autor y el equipo detrás de Zeta Spirits.
          </motion.p>
        </div>
      </section>

      {/* 2. History & Concept */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="inline-flex p-3 rounded-xl bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400">
              <Wine className="w-6 h-6" />
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight">
              Una Pasión por la Alta Coctelería y Enología
            </h2>
            <p className="text-brand-600 dark:text-brand-300 leading-relaxed text-sm">
              Zeta Spirits nació con el objetivo de elevar la experiencia de compra de bebidas alcohólicas y licores de alta gama. Lo que inició como una cava privada de vinos y whiskies escoceses de colección en Miraflores se convirtió rápidamente en la plataforma referente de licores premium y delivery express en frío.
            </p>
            <p className="text-brand-600 dark:text-brand-300 leading-relaxed text-sm">
              No vendemos simples botellas; brindamos momentos inolvidables. Cada etiqueta en nuestro catálogo pasa por un estricto proceso de selección llevado a cabo por nuestros sommeliers, garantizando la perfecta procedencia, temperatura óptima de almacenamiento y autenticidad del producto.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute -top-4 -left-4 w-72 h-72 bg-amber-500/10 rounded-full filter blur-3xl" />
            <div className="absolute -bottom-4 -right-4 w-72 h-72 bg-red-600/10 rounded-full filter blur-3xl" />
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-brand-200/50 dark:border-brand-850">
              <img
                src="https://images.unsplash.com/photo-1527281400683-1aae777175f8?q=80&w=800&auto=format&fit=crop"
                alt="Cava de Whiskies"
                className="w-full h-[400px] object-cover"
              />
            </div>
          </motion.div>

        </div>
      </section>

      {/* 3. Mission and Vision */}
      <section className="bg-brand-100 dark:bg-brand-900/30 py-16 md:py-20 border-y border-brand-200/50 dark:border-brand-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Mission */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass p-8 md:p-10 rounded-3xl space-y-4"
            >
              <div className="p-3 rounded-2xl bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 w-fit">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold tracking-tight">Nuestra Misión</h3>
              <p className="text-brand-600 dark:text-brand-300 text-sm leading-relaxed">
                Conectar a los amantes del buen beber con las botellas más exclusivas de todo el mundo, brindando un servicio de delivery ultra veloz en frío, asesoría personalizada de sommelier y experiencias de cata memorables.
              </p>
            </motion.div>

            {/* Vision */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              className="glass p-8 md:p-10 rounded-3xl space-y-4"
            >
              <div className="p-3 rounded-2xl bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400 w-fit">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold tracking-tight">Nuestra Visión</h3>
              <p className="text-brand-600 dark:text-brand-300 text-sm leading-relaxed">
                Convertirnos en la cava digital de licores luxury más importante y confiable del país, reconocida por nuestro estándar de calidad, innovación en maridaje y compromiso con la cultura enológica.
              </p>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 4. Metrics Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {METRICS.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <motion.div
                key={metric.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center space-y-2.5 p-6 rounded-2xl hover:bg-brand-100/50 dark:hover:bg-brand-900/10 transition-colors"
              >
                <div className="p-4 rounded-full bg-brand-100 dark:bg-brand-900 text-amber-600 dark:text-amber-400 w-fit mx-auto shadow-sm">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-4xl font-extrabold text-brand-900 dark:text-white pt-2 bg-gradient-to-r from-amber-600 to-red-600 bg-clip-text text-transparent">
                  {metric.val}
                </h3>
                <h4 className="text-sm font-bold tracking-tight text-brand-800 dark:text-brand-200">
                  {metric.label}
                </h4>
                <p className="text-xs text-brand-500 dark:text-brand-400">
                  {metric.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 5. Team Section */}
      <section className="bg-brand-100 dark:bg-brand-900/30 py-16 md:py-24 border-t border-brand-200/50 dark:border-brand-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              Expertos en Cava
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mt-2">
              Nuestro Equipo de Sommeliers & Mixólogos
            </h2>
            <p className="text-brand-500 dark:text-brand-400 mt-3">
              Conoce a los profesionales encargados de curar nuestra cava y garantizar la máxima excelencia.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TEAM.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="glass rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <div className="aspect-[4/3] w-full bg-brand-200">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover filter brightness-95"
                  />
                </div>
                <div className="p-6 md:p-8 space-y-3">
                  <h3 className="text-lg font-bold text-brand-900 dark:text-white">
                    {member.name}
                  </h3>
                  <span className="inline-block text-xs font-semibold px-2.5 py-1 bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 rounded-lg">
                    {member.role}
                  </span>
                  <p className="text-xs text-brand-600 dark:text-brand-400 leading-relaxed pt-2">
                    {member.bio}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
