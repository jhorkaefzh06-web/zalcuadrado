'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Star, StarHalf, ShoppingBag, MessageCircle, ChevronLeft,
  Tag, CheckCircle2, Package, Shield, Truck, Zap, ExternalLink
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '@/lib/mockData';

const WHATSAPP_NUMBER = '51960871790';

interface Props {
  product: Product;
  related: Product[];
}

function StarRating({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: full }).map((_, i) => (
        <Star key={`f${i}`} className="w-4 h-4 fill-amber-400 text-amber-400" />
      ))}
      {half && <StarHalf className="w-4 h-4 fill-amber-400 text-amber-400" />}
      {Array.from({ length: empty }).map((_, i) => (
        <Star key={`e${i}`} className="w-4 h-4 text-slate-600" />
      ))}
    </div>
  );
}

export default function ProductDetailClient({ product, related }: Props) {
  const [selectedImage, setSelectedImage] = useState(product.image);

  const activePrice = product.isPromo && product.promoPrice ? product.promoPrice : product.price;
  const discount = product.isPromo && product.promoPrice
    ? Math.round(((product.price - product.promoPrice) / product.price) * 100)
    : null;

  const buildWhatsAppUrl = (msg: string) => {
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
  };

  const whatsappMsg = `¡Hola! Estoy interesado en el producto:\n\n*${product.name}*\nMarca: ${product.brand}\nPrecio: S/ ${activePrice.toFixed(2)}\n\n¿Pueden darme más información sobre disponibilidad y envío?`;

  return (
    <div className="min-h-screen" style={{ background: 'var(--background)' }}>

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <nav className="flex items-center gap-2 text-sm text-slate-500">
          <Link href="/" className="hover:text-primary-500 transition-colors">Inicio</Link>
          <span>/</span>
          <Link href="/productos" className="hover:text-primary-500 transition-colors">Productos</Link>
          <span>/</span>
          <span className="text-slate-300 truncate max-w-[200px]">{product.name}</span>
        </nav>
      </div>

      {/* Main product section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16">

          {/* ── Image gallery ── */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            {/* Main image */}
            <div className="relative rounded-2xl overflow-hidden aspect-square glass">
              <Image
                src={selectedImage}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.isPromo && discount && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold text-white"
                    style={{ background: 'linear-gradient(135deg, #f43f5e, #ec4899)' }}>
                    -{discount}% OFF
                  </span>
                )}
                {product.countInStock <= 8 && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold text-white"
                    style={{ background: 'linear-gradient(135deg, #f59e0b, #ef4444)' }}>
                    ¡Últimas {product.countInStock} unidades!
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnail strip (same image repeated for demo) */}
            <div className="flex gap-3">
              {[product.image, product.image, product.image].map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                    selectedImage === img
                      ? 'border-primary-500 scale-105'
                      : 'border-slate-700 hover:border-slate-500'
                  }`}
                >
                  <Image src={img} alt="" fill className="object-cover" sizes="80px" />
                </button>
              ))}
            </div>
          </motion.div>

          {/* ── Product info ── */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col gap-6"
          >
            {/* Brand + Category */}
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary-500/10 text-primary-400 border border-primary-500/20">
                {product.brand}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-400 border border-slate-700 capitalize">
                {product.category}
              </span>
            </div>

            {/* Name */}
            <h1 className="text-2xl sm:text-3xl xl:text-4xl font-bold leading-tight"
              style={{ color: 'var(--foreground)' }}>
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <StarRating rating={product.rating} />
              <span className="text-sm font-semibold text-amber-400">{product.rating}</span>
              <span className="text-sm text-slate-500">· {product.countInStock} en stock</span>
            </div>

            {/* Price block */}
            <div className="rounded-2xl p-5 glass space-y-1">
              {product.isPromo && product.promoPrice ? (
                <>
                  <div className="flex items-baseline gap-3">
                    <span className="text-4xl font-extrabold text-primary-400">
                      S/ {product.promoPrice.toFixed(2)}
                    </span>
                    {discount && (
                      <span className="px-2 py-0.5 rounded-md text-sm font-bold text-white"
                        style={{ background: 'linear-gradient(135deg, #f43f5e, #ec4899)' }}>
                        -{discount}%
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-500 line-through">
                    Antes: S/ {product.price.toFixed(2)}
                  </p>
                  <p className="text-sm text-green-400 font-medium">
                    Ahorras S/ {(product.price - product.promoPrice).toFixed(2)}
                  </p>
                </>
              ) : (
                <span className="text-4xl font-extrabold text-primary-400">
                  S/ {product.price.toFixed(2)}
                </span>
              )}
            </div>

            {/* Description */}
            <div>
              <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Descripción
              </h2>
              <p className="text-slate-300 leading-relaxed text-base">
                {product.description}
              </p>
            </div>

            {/* Features */}
            <div>
              <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
                Características principales
              </h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {product.features.map((feat, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-slate-300">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-primary-400" />
                    {feat}
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              {/* WhatsApp CTA - Primary */}
              <a
                id="product-whatsapp-cta"
                href={buildWhatsAppUrl(whatsappMsg)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2.5 py-4 px-6 rounded-2xl font-semibold text-white transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg"
                style={{ background: 'linear-gradient(135deg, #25d366 0%, #128c7e 100%)' }}
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white flex-shrink-0">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Consultar por WhatsApp
              </a>

              {/* Back to catalog */}
              <Link
                href="/productos"
                id="product-back-catalog"
                className="flex items-center justify-center gap-2 py-4 px-5 rounded-2xl font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] border border-slate-700 text-slate-300 hover:border-primary-500/50 hover:text-primary-400"
              >
                <ChevronLeft className="w-4 h-4" />
                Catálogo
              </Link>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              {[
                { icon: Shield, label: 'Garantía oficial' },
                { icon: Truck, label: 'Envío rápido' },
                { icon: Package, label: 'Empaque seguro' },
              ].map(({ icon: Icon, label }) => (
                <div key={label}
                  className="flex flex-col items-center gap-1.5 p-3 rounded-xl text-center glass">
                  <Icon className="w-5 h-5 text-primary-400" />
                  <span className="text-xs text-slate-400">{label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Full description / specs section ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Spec table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-2xl p-6 glass"
          >
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
              <Zap className="w-5 h-5 text-primary-400" />
              Especificaciones
            </h2>
            <dl className="space-y-3">
              {[
                { label: 'Marca', value: product.brand },
                { label: 'Categoría', value: product.category },
                { label: 'Calificación', value: `${product.rating} / 5 ⭐` },
                { label: 'Stock disponible', value: `${product.countInStock} unidades` },
                { label: 'Precio regular', value: `S/ ${product.price.toFixed(2)}` },
                ...(product.isPromo && product.promoPrice ? [
                  { label: 'Precio oferta', value: `S/ ${product.promoPrice.toFixed(2)}` },
                  { label: 'Descuento', value: `${discount}%` },
                ] : []),
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center py-2 border-b border-slate-800/50 last:border-0">
                  <dt className="text-sm text-slate-500">{label}</dt>
                  <dd className="text-sm font-medium text-slate-200">{value}</dd>
                </div>
              ))}
            </dl>
          </motion.div>

          {/* WhatsApp CTA card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-2xl p-6 flex flex-col justify-between gap-6 overflow-hidden relative"
            style={{ background: 'linear-gradient(135deg, rgba(37,211,102,0.12) 0%, rgba(18,140,126,0.12) 100%)', border: '1px solid rgba(37,211,102,0.2)' }}
          >
            {/* Decorative blur */}
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-20 blur-3xl"
              style={{ background: '#25d366' }} />

            <div className="relative">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #25d366, #128c7e)' }}>
                  <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-green-300">¿Te interesa este producto?</h3>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">
                Contáctanos directamente por WhatsApp. Nuestro equipo te asesorará con disponibilidad, precio final y opciones de envío en minutos.
              </p>
            </div>

            <a
              id="product-whatsapp-cta-card"
              href={buildWhatsAppUrl(whatsappMsg)}
              target="_blank"
              rel="noopener noreferrer"
              className="relative flex items-center justify-center gap-2.5 py-4 px-6 rounded-2xl font-semibold text-white transition-all hover:scale-[1.03] active:scale-[0.97] shadow-xl"
              style={{ background: 'linear-gradient(135deg, #25d366 0%, #128c7e 100%)' }}
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white flex-shrink-0">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Consultar disponibilidad
              <ExternalLink className="w-4 h-4 opacity-70" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* ── Related products ── */}
      {related.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-20">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
            <Tag className="w-5 h-5 text-primary-400" />
            Productos relacionados
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {related.map((p, i) => {
              const relPrice = p.isPromo && p.promoPrice ? p.promoPrice : p.price;
              return (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i }}
                >
                  <Link
                    href={`/productos/${p.id}`}
                    className="group block rounded-2xl overflow-hidden glass transition-all hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="relative aspect-video overflow-hidden">
                      <Image
                        src={p.image}
                        alt={p.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      {p.isPromo && (
                        <span className="absolute top-3 left-3 px-2 py-0.5 rounded-full text-xs font-bold text-white"
                          style={{ background: 'linear-gradient(135deg,#f43f5e,#ec4899)' }}>
                          OFERTA
                        </span>
                      )}
                    </div>
                    <div className="p-4">
                      <p className="text-xs text-slate-500 mb-1">{p.brand}</p>
                      <h3 className="font-semibold text-sm text-slate-200 line-clamp-2 mb-2 group-hover:text-primary-400 transition-colors">
                        {p.name}
                      </h3>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-lg font-bold text-primary-400">S/ {relPrice.toFixed(2)}</span>
                          {p.isPromo && p.promoPrice && (
                            <span className="text-xs text-slate-600 line-through ml-2">S/ {p.price.toFixed(2)}</span>
                          )}
                        </div>
                        <StarRating rating={p.rating} />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
