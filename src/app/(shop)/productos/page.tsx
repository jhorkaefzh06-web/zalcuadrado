import { Suspense } from 'react';
import ProductsClient from './ProductsClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Catálogo de Productos | ZetaCorp",
  description: "Explora nuestra amplia variedad de productos tecnológicos, de audio, ergonómicos y mobiliario inteligente.",
};

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col justify-center items-center min-h-[50vh] space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        <p className="text-sm text-brand-400 animate-pulse">Cargando catálogo...</p>
      </div>
    }>
      <ProductsClient />
    </Suspense>
  );
}
