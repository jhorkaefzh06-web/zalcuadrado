'use client';

import { motion } from 'framer-motion';
import { Target, Compass, Users, Trophy, Award, Heart, Sparkles } from 'lucide-react';

const METRICS = [
  { id: 1, val: '10+', label: 'Años de Trayectoria', desc: 'Liderando el mercado corporativo y minorista.', icon: Trophy },
  { id: 2, val: '15k+', label: 'Clientes Felices', desc: 'Profesionales y empresas de todo el país.', icon: Users },
  { id: 3, val: '120+', label: 'Productos Premium', desc: 'Dispositivos y mobiliario homologado.', icon: Award },
  { id: 4, val: '99.8%', label: 'Soporte Exitoso', desc: 'Índice de satisfacción en instalaciones.', icon: Heart },
];

const TEAM = [
  {
    id: 1,
    name: 'Alejandro Rossi',
    role: 'Director General & Fundador',
    bio: 'Más de 15 años liderando proyectos de transformación digital y desarrollo de mobiliario ergonómico en Latinoamérica.',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&auto=format&fit=crop',
  },
  {
    id: 2,
    name: 'Valeria Benítez',
    role: 'Directora de UX y Ergonomía',
    bio: 'Especialista en medicina ocupacional y diseño de interfaces físicas. Apasionada por mejorar la salud en el trabajo.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop',
  },
  {
    id: 3,
    name: 'Mateo Shin',
    role: 'Director de Innovación Tecnológica',
    bio: 'Ingeniero de sistemas enfocado en domótica integrada, IoT y optimización de redes inteligentes para el hogar.',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=400&auto=format&fit=crop',
  },
];

export default function QuienesSomos() {
  return (
    <div className="w-full pb-20">
      
      {/* 1. Header Banner */}
      <section className="relative h-[35vh] md:h-[45vh] bg-brand-900 flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-brand-950/70 z-10" />
        <img
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1600&auto=format&fit=crop"
          alt="Corporativo"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 z-20 flex flex-col justify-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs uppercase tracking-widest text-primary-400 font-semibold mb-2"
          >
            Nuestra Esencia
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-extrabold tracking-tight"
          >
            Quiénes Somos
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-brand-300 max-w-xl mt-4"
          >
            Conoce el origen, los valores y el equipo humano detrás de ZetaCorp.
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
            <div className="inline-flex p-3 rounded-xl bg-primary-100 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400">
              <Sparkles className="w-6 h-6" />
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight">
              Nuestra Trayectoria e Historia
            </h2>
            <p className="text-brand-600 dark:text-brand-300 leading-relaxed text-sm">
              Fundada en 2016, ZetaCorp nació de una premisa fundamental: el entorno físico y tecnológico influye directamente en nuestro bienestar mental y físico. Comenzamos como una pequeña consultora de ergonomía en Lima y rápidamente evolucionamos al ver la necesidad de productos de alta fidelidad que se ajustaran a las exigencias modernas del trabajo remoto e híbrido.
            </p>
            <p className="text-brand-600 dark:text-brand-300 leading-relaxed text-sm">
              Hoy en día, somos un referente regional en el equipamiento de oficinas y hogares inteligentes. No nos limitamos a vender muebles o gadgets; diseñamos ecosistemas completos integrando tecnologías de domótica de bajo consumo con soluciones de postura corporal premium, garantizando confort duradero y eficiencia óptima.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute -top-4 -left-4 w-72 h-72 bg-primary-400/10 rounded-full filter blur-3xl" />
            <div className="absolute -bottom-4 -right-4 w-72 h-72 bg-accent-pink/10 rounded-full filter blur-3xl" />
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-brand-200/50 dark:border-brand-850">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop"
                alt="Colaboradores ZetaCorp"
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
              <div className="p-3 rounded-2xl bg-primary-100 dark:bg-primary-950/50 text-primary-600 dark:text-primary-400 w-fit">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold tracking-tight">Nuestra Misión</h3>
              <p className="text-brand-600 dark:text-brand-300 text-sm leading-relaxed">
                Empoderar a profesionales y organizaciones proporcionando herramientas ergonómicas de vanguardia y tecnologías inteligentes integradas que fomenten la salud, incrementen la eficiencia laboral y transformen los espacios cotidianos en lugares inspiradores.
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
              <div className="p-3 rounded-2xl bg-accent-pink/10 text-accent-pink w-fit">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold tracking-tight">Nuestra Visión</h3>
              <p className="text-brand-600 dark:text-brand-300 text-sm leading-relaxed">
                Ser la marca líder y referente absoluto en soluciones integradas de bienestar ergonómico y tecnología para el hogar en Latinoamérica, destacando por nuestro compromiso constante con la innovación, el ecodiseño y el soporte técnico especializado.
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
                <div className="p-4 rounded-full bg-brand-100 dark:bg-brand-900 text-primary-600 dark:text-primary-400 w-fit mx-auto shadow-sm">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-4xl font-extrabold text-brand-900 dark:text-white pt-2 bg-gradient-to-r from-primary-600 to-accent-pink bg-clip-text text-transparent">
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
            <span className="text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400">
              Liderazgo
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mt-2">
              Nuestro Equipo Directivo
            </h2>
            <p className="text-brand-500 dark:text-brand-400 mt-3">
              Conoce a las mentes innovadoras que dirigen la estrategia de ZetaCorp hacia el futuro.
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
                  <span className="inline-block text-xs font-semibold px-2.5 py-1 bg-primary-100 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 rounded-lg">
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
