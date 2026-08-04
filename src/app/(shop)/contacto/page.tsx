import { Suspense } from 'react';
import ContactClient from './ContactClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Contáctanos | ZetaCorp",
  description: "Ponte en contacto con el equipo de ZetaCorp. Realiza tus consultas o cotizaciones sobre ergonomía y tecnología.",
};

export default function ContactPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col justify-center items-center min-h-[50vh] space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        <p className="text-sm text-brand-400 animate-pulse">Cargando formulario de contacto...</p>
      </div>
    }>
      <ContactClient />
    </Suspense>
  );
}
