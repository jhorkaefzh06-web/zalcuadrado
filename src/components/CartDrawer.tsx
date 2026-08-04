'use client';

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
    cartTotal,
    cartCount
  } = useCart();

  const handleCheckout = () => {
    if (cartItems.length === 0) return;

    let messageText = '¡Hola Hielos & Bebidas Z²! Me gustaría realizar el siguiente pedido:\n\n';
    
    cartItems.forEach((item) => {
      const activePrice = item.product.isPromo && item.product.promoPrice ? item.product.promoPrice : item.product.price;
      const subtotal = activePrice * item.quantity;
      messageText += `🔹 *${item.quantity}x* ${item.product.name} (S/ ${activePrice.toFixed(2)} c/u) - *S/ ${subtotal.toFixed(2)}*\n`;
    });

    messageText += `\n💵 *Total a pagar: S/ ${cartTotal.toFixed(2)}*\n\n`;
    messageText += `📍 Quedo a la espera de coordinar la dirección de entrega y medio de pago. ¡Gracias!`;

    const encoded = encodeURIComponent(messageText);
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;
    window.open(url, '_blank', 'noopener,noreferrer');
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
              {cartItems.length === 0 ? (
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
                
                <div className="p-3 bg-brand-900/25 border border-white/5 rounded-2xl text-[10px] text-brand-400 leading-normal">
                  🚚 *Despacho Express 24 Horas* a temperatura perfecta. El costo de envío se confirmará al coordinar tu dirección por chat.
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full btn-spotlight flex items-center justify-center space-x-2.5 py-3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-sm tracking-wide shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 transform active:scale-98 cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 fill-white" />
                  <span>Pedir por WhatsApp</span>
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
