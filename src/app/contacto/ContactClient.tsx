'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Mail, Phone, MapPin, Send, MessageSquare, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

import { SERVICES } from '@/lib/mockData';
import { submitContactMessage } from '@/lib/supabase';

export default function ContactClient() {
  const searchParams = useSearchParams();

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Pre-fill subject based on service query parameter
  useEffect(() => {
    const serviceId = searchParams.get('service');
    if (serviceId) {
      const selectedService = SERVICES.find((s) => s.id === serviceId);
      if (selectedService) {
        setFormData((prev) => ({
          ...prev,
          subject: `Cotización: ${selectedService.name}`,
          message: `Hola ZetaCorp,\n\nMe interesa solicitar una cotización formal y obtener más detalles sobre el servicio de "${selectedService.name}". Quedo atento a su respuesta.\n\nSaludos.`,
        }));
      }
    }
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setStatus('error');
      setErrorMessage('Por favor rellene todos los campos requeridos.');
      return;
    }

    setStatus('submitting');
    setErrorMessage('');

    try {
      await submitContactMessage(formData);
      
      setStatus('success');
      // Fire confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      // Clear form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
    } catch (err: any) {
      console.error(err);
      setStatus('error');
      setErrorMessage('Ocurrió un error al enviar el mensaje. Inténtelo de nuevo.');
    }
  };

  return (
    <div className="w-full pb-20">
      {/* 1. Header Banner */}
      <section className="relative h-[30vh] md:h-[40vh] bg-brand-900 flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-brand-950/70 z-10" />
        <img
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1600&auto=format&fit=crop"
          alt="Contacto ZetaCorp"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 z-20 flex flex-col justify-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
          <span className="text-xs uppercase tracking-widest text-primary-400 font-semibold mb-2">
            Estamos para Ayudarte
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            Contáctanos
          </h1>
          <p className="text-lg text-brand-300 max-w-xl mt-4">
            Escríbenos tus dudas o cotizaciones y un especialista te responderá en menos de 24 horas.
          </p>
        </div>
      </section>

      {/* 2. Grid section: Form vs Details */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Details & Map */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold tracking-tight text-brand-900 dark:text-white">
                Información de Contacto
              </h2>
              <p className="text-xs sm:text-sm text-brand-500 dark:text-brand-400 leading-relaxed">
                ¿Prefieres hablar directamente? Escríbenos a nuestro correo corporativo o llámanos a nuestras líneas de atención.
              </p>
            </div>

            {/* Direct Details Cards */}
            <div className="space-y-4">
              {/* Address */}
              <div className="flex items-start space-x-4 p-5 glass rounded-2xl">
                <div className="p-3 bg-primary-100 dark:bg-primary-950 text-primary-600 dark:text-primary-400 rounded-xl">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-brand-900 dark:text-white">Nuestra Oficina</h4>
                  <p className="text-xs text-brand-500 dark:text-brand-400 mt-1">Av. Innovación 101, Piso 5, San Isidro, Lima - Perú</p>
                </div>
              </div>

              {/* Phones */}
              <div className="flex items-start space-x-4 p-5 glass rounded-2xl">
                <div className="p-3 bg-accent-pink/10 text-accent-pink rounded-xl">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-brand-900 dark:text-white">Teléfonos de Atención</h4>
                  <p className="text-xs text-brand-500 dark:text-brand-400 mt-1">+51 (1) 400-9876 / +51 987 654 321</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start space-x-4 p-5 glass rounded-2xl">
                <div className="p-3 bg-accent-amber/10 text-accent-amber rounded-xl">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-brand-900 dark:text-white">Correo Electrónico</h4>
                  <p className="text-xs text-brand-500 dark:text-brand-400 mt-1">
                    <a href="mailto:hola@zetacorp.com" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                      hola@zetacorp.com
                    </a>
                  </p>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-start space-x-4 p-5 glass rounded-2xl">
                <div className="p-3 bg-green-100 dark:bg-green-950/40 text-green-600 dark:text-green-400 rounded-xl">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-brand-900 dark:text-white">Horario de Operaciones</h4>
                  <p className="text-xs text-brand-500 dark:text-brand-400 mt-1">Lunes a Viernes: 9:00 AM - 6:00 PM</p>
                </div>
              </div>
            </div>

            {/* Google map iframe with premium styling filter */}
            <div className="w-full h-64 rounded-3xl overflow-hidden shadow-md border border-brand-200/50 dark:border-brand-850 relative">
              {/* Map container with filter applying automatically */}
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3901.37894263155!2d-77.0319717!3d-12.0861183!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9105c865fa55e8c1%3A0x7d6f5cfa4ff819c9!2sSan%20Isidro%2C%20Lima!5e0!3m2!1ses-419!2spe!4v1680000000000!5m2!1ses-419!2spe"
                className="w-full h-full border-0 dark:brightness-[0.85] dark:contrast-[1.1] dark:hue-rotate-[180deg] dark:invert"
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Mapa de San Isidro"
              ></iframe>
            </div>

          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <div className="glass p-8 md:p-10 rounded-3xl space-y-6">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-primary-100 dark:bg-primary-950 text-primary-600 dark:text-primary-400">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-brand-900 dark:text-white">Envíanos un Mensaje</h3>
              </div>

              {/* Form elements */}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Name input */}
                  <div className="space-y-1.5">
                    <label htmlFor="contact-name" className="text-xs font-bold text-brand-500 dark:text-brand-400 uppercase tracking-wide">
                      Nombre Completo *
                    </label>
                    <input
                      type="text"
                      id="contact-name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      disabled={status === 'submitting'}
                      placeholder="Ej. Juan Pérez"
                      className="w-full px-4 py-3 rounded-xl border border-brand-200 dark:border-brand-800 bg-white dark:bg-brand-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 text-brand-850 dark:text-brand-200 disabled:opacity-50"
                    />
                  </div>

                  {/* Email input */}
                  <div className="space-y-1.5">
                    <label htmlFor="contact-email" className="text-xs font-bold text-brand-500 dark:text-brand-400 uppercase tracking-wide">
                      Correo Electrónico *
                    </label>
                    <input
                      type="email"
                      id="contact-email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      disabled={status === 'submitting'}
                      placeholder="Ej. juan@correo.com"
                      className="w-full px-4 py-3 rounded-xl border border-brand-200 dark:border-brand-800 bg-white dark:bg-brand-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 text-brand-850 dark:text-brand-200 disabled:opacity-50"
                    />
                  </div>
                </div>

                {/* Subject input */}
                <div className="space-y-1.5">
                  <label htmlFor="contact-subject" className="text-xs font-bold text-brand-500 dark:text-brand-400 uppercase tracking-wide">
                    Asunto *
                    </label>
                  <input
                    type="text"
                    id="contact-subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    disabled={status === 'submitting'}
                    placeholder="Ej. Cotización de Equipos / Consulta Técnica"
                    className="w-full px-4 py-3 rounded-xl border border-brand-200 dark:border-brand-800 bg-white dark:bg-brand-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 text-brand-850 dark:text-brand-200 disabled:opacity-50"
                  />
                </div>

                {/* Message input */}
                <div className="space-y-1.5">
                  <label htmlFor="contact-message" className="text-xs font-bold text-brand-500 dark:text-brand-400 uppercase tracking-wide">
                    Mensaje *
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    disabled={status === 'submitting'}
                    placeholder="Escribe tu mensaje o detalles de cotización..."
                    className="w-full px-4 py-3 rounded-xl border border-brand-200 dark:border-brand-800 bg-white dark:bg-brand-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 text-brand-850 dark:text-brand-200 disabled:opacity-50 resize-y"
                  ></textarea>
                </div>

                {/* Notifications feedback */}
                <AnimatePresence mode="wait">
                  {status === 'error' && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="p-4 rounded-xl bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 text-xs font-semibold flex items-center space-x-2"
                    >
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>{errorMessage}</span>
                    </motion.div>
                  )}

                  {status === 'success' && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="p-4 rounded-xl bg-green-50 dark:bg-green-950/20 text-green-600 dark:text-green-400 text-xs font-semibold flex items-center space-x-2.5"
                    >
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>¡Mensaje enviado con éxito! Nos comunicaremos contigo muy pronto.</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="w-full py-3.5 bg-gradient-to-r from-primary-600 to-accent-pink hover:from-primary-700 hover:to-accent-rose text-white text-sm font-bold rounded-xl shadow-md hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:scale-100 transition-all flex items-center justify-center space-x-2"
                >
                  {status === 'submitting' ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Enviando...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Enviar Mensaje</span>
                    </>
                  )}
                </button>

              </form>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
