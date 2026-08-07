'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Trash2, ShoppingBag, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

const WHATSAPP_NUMBER = '51960871790';

export default function CartDrawer() {
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    clearCart,
    cartTotal,
    cartCount
  } = useCart();

  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [clientName, setClientName] = useState('');
  const [clientAddress, setClientAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !clientAddress.trim()) {
      setCheckoutError('Por favor completa todos los campos.');
      return;
    }

    if (clientAddress.trim().length < 5) {
      setCheckoutError('Por favor ingresa una dirección de entrega válida.');
      return;
    }

    setIsSubmitting(true);
    setCheckoutError(null);

    try {
      const orderItems = cartItems.map(item => {
        const activePrice = item.product.isPromo && item.product.promoPrice ? item.product.promoPrice : item.product.price;
        return {
          id: item.product.id,
          name: item.product.name,
          brand: item.product.brand,
          price: activePrice,
          quantity: item.quantity
        };
      });

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName: clientName.trim(),
          clientAddress: clientAddress.trim(),
          items: orderItems,
          total: cartTotal
        })
      });

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData.error || 'Ocurrió un error al procesar el pedido.');
      }

      const orderId = resData.orderId;

      // Build WhatsApp URL (Standard WA chat redirect)
      let messageText = `¡Hola Hielos & Bebidas Z²! Acabo de generar mi pedido *#${orderId.slice(0, 8).toUpperCase()}*:\n\n`;
      messageText += `👤 *Cliente:* ${clientName.trim()}\n`;
      messageText += `📍 *Dirección:* ${clientAddress.trim()}\n\n`;
      messageText += `🛒 *Detalle del Pedido:*\n`;

      cartItems.forEach((item) => {
        const activePrice = item.product.isPromo && item.product.promoPrice ? item.product.promoPrice : item.product.price;
        const subtotal = activePrice * item.quantity;
        messageText += `🔹 *${item.quantity}x* ${item.product.name} (S/ ${activePrice.toFixed(2)} c/u) - *S/ ${subtotal.toFixed(2)}*\n`;
      });

      messageText += `\n💵 *Total: S/ ${cartTotal.toFixed(2)}*\n\n`;
      messageText += `🔗 *Ver Estado del Pedido:* ${window.location.origin}/pedido/${orderId}\n\n`;
      messageText += `📍 Quedo a la espera de coordinar la dirección de entrega y medio de pago. ¡Gracias!`;

      const encoded = encodeURIComponent(messageText);
      const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;
      
      // Reset checkout states and clear cart
      clearCart();
      setShowCheckoutForm(false);
      setClientName('');
      setClientAddress('');
      setIsCartOpen(false);

      // Redirect to WhatsApp
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch (err: any) {
      console.error('Checkout error:', err);
      setCheckoutError(err.message || 'Fallo al procesar el checkout.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] cursor-pointer"
          />

          {/* Drawer Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-screen w-full sm:w-[450px] bg-brand-950/95 backdrop-blur-md border-l border-white/10 shadow-2xl z-[101] flex flex-col"
          >
            {/* Header */}
            <div className="p-5 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <ShoppingBag className="w-5 h-5 text-amber-400" />
                <h2 className="text-lg font-bold text-white tracking-wide">Tu Pedido</h2>
                <span className="bg-amber-400/25 border border-amber-400/30 text-amber-300 text-xs px-2 py-0.5 rounded-full font-extrabold">
                  {cartCount}
                </span>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 rounded-xl text-brand-400 hover:text-white hover:bg-white/5 transition-all duration-200 cursor-pointer"
                aria-label="Cerrar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-grow overflow-y-auto p-5 space-y-4 scrollbar-thin">
              {showCheckoutForm ? (
                <form onSubmit={handleCheckoutSubmit} className="space-y-4 py-2">
                  <h3 className="text-white font-bold text-sm border-b border-white/5 pb-2 mb-2">Tus Datos para el Envío</h3>
                  
                  {checkoutError && (
                    <div className="bg-red-500/10 border border-red-500/25 text-red-400 p-3.5 rounded-xl text-xs leading-relaxed">
                      {checkoutError}
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-brand-300 uppercase tracking-wider block pl-1">Nombre Completo *</label>
                    <input
                      type="text"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="Ej: Juan Pérez"
                      className="w-full bg-brand-950/80 border border-white/10 text-white rounded-xl py-2.5 px-4 text-xs focus:outline-none focus:border-amber-400 placeholder:text-brand-500"
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-brand-300 uppercase tracking-wider block pl-1">Dirección de Entrega *</label>
                    <input
                      type="text"
                      value={clientAddress}
                      onChange={(e) => setClientAddress(e.target.value)}
                      placeholder="Ej: Av. Larco 123, Dpto 402, Miraflores"
                      className="w-full bg-brand-950/80 border border-white/10 text-white rounded-xl py-2.5 px-4 text-xs focus:outline-none focus:border-amber-400 placeholder:text-brand-500"
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="p-3 bg-amber-400/5 border border-amber-400/10 rounded-xl text-[10px] text-amber-300/80 leading-normal">
                    📌 Al confirmar, crearemos tu pedido y te redireccionaremos a WhatsApp para coordinar el pago. Tu stock quedará reservado temporalmente.
                  </div>
                </form>
              ) : cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="p-4 rounded-full bg-brand-900/60 border border-white/5 text-brand-400">
                    <ShoppingBag className="w-12 h-12" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-base">¿Tienes sed?</h3>
                    <p className="text-xs text-brand-400 max-w-[240px] mt-1 mx-auto">
                      Tu carrito está vacío. Agrega tus botellas favoritas y hielos gourmet para empezar.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="btn-spotlight px-6 py-2.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-extrabold hover:bg-amber-500/25 transition-all duration-200 cursor-pointer"
                  >
                    Explorar Productos
                  </button>
                </div>
              ) : (
                cartItems.map((item) => {
                  const activePrice = item.product.isPromo && item.product.promoPrice ? item.product.promoPrice : item.product.price;
                  return (
                    <motion.div
                      layout
                      key={item.product.id}
                      className="flex items-center space-x-4 bg-brand-900/40 p-3 rounded-2xl border border-white/5 hover:border-white/10 transition-all duration-200"
                    >
                      {/* Product Thumbnail */}
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded-xl border border-white/5 shrink-0"
                      />

                      {/* Detail Column */}
                      <div className="flex-grow min-w-0 space-y-1">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-white text-xs font-bold truncate">
                            {item.product.name}
                          </h4>
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-brand-500 hover:text-red-400 p-1 rounded-lg hover:bg-white/5 transition-colors shrink-0 cursor-pointer"
                            aria-label="Eliminar item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-[10px] text-brand-400 font-extrabold uppercase tracking-wider">
                          {item.product.brand}
                        </p>

                        <div className="flex items-center justify-between pt-1">
                          {/* Price */}
                          <div className="text-xs font-extrabold text-amber-400">
                            S/ {(activePrice * item.quantity).toFixed(2)}
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center space-x-2 bg-brand-950/80 border border-white/5 rounded-lg p-0.5">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="p-1 text-brand-400 hover:text-white hover:bg-white/5 rounded transition-all cursor-pointer"
                              aria-label="Reducir cantidad"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-white font-bold text-xs w-5 text-center select-none">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="p-1 text-brand-400 hover:text-white hover:bg-white/5 rounded transition-all cursor-pointer"
                              aria-label="Aumentar cantidad"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>

            {/* Footer Summary & Checkout */}
            {cartItems.length > 0 && (
              <div className="p-5 border-t border-white/10 bg-brand-950/40 space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-brand-300 font-bold">Subtotal</span>
                  <span className="text-white font-black text-lg">S/ {cartTotal.toFixed(2)}</span>
                </div>
                
                {!showCheckoutForm ? (
                  <>
                    <div className="p-3 bg-brand-900/25 border border-white/5 rounded-2xl text-[10px] text-brand-400 leading-normal">
                      🚚 *Despacho Express 24 Horas* a temperatura perfecta. El costo de envío se confirmará al coordinar tu dirección por chat.
                    </div>

                    <button
                      onClick={() => setShowCheckoutForm(true)}
                      className="w-full btn-spotlight flex items-center justify-center space-x-2.5 py-3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-sm tracking-wide shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 transform active:scale-98 cursor-pointer"
                    >
                      <MessageSquare className="w-4 h-4 fill-white" />
                      <span>Pedir por WhatsApp</span>
                    </button>
                  </>
                ) : (
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setShowCheckoutForm(false)}
                      className="flex-1 py-3 border border-white/10 text-white hover:bg-white/5 text-xs font-bold rounded-full transition-colors cursor-pointer"
                      disabled={isSubmitting}
                    >
                      Volver
                    </button>
                    
                    <button
                      type="button"
                      onClick={handleCheckoutSubmit}
                      disabled={isSubmitting}
                      className="flex-[2] py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-xs font-extrabold rounded-full flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-emerald-500/10"
                    >
                      {isSubmitting ? 'Procesando...' : 'Confirmar Pedido'}
                    </button>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
