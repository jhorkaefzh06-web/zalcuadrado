'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { ShoppingBag, Clock, CheckCircle2, XCircle, ArrowLeft, MessageSquare, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

interface OrderItem {
  id: string;
  name: string;
  brand: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  client_name: string;
  whatsapp_number: string;
  address?: string;
  total: number;
  status: 'pendiente' | 'pagado' | 'entregado' | 'cancelado';
  items: OrderItem[];
  created_at: string;
}

export default function OrderStatusPage() {
  const params = useParams();
  const orderId = params?.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  useEffect(() => {
    if (!orderId || !isSupabaseConfigured || !supabase) return;

    // Realtime channel for order updates
    const channel = supabase
      .channel(`public:orders:id=eq.${orderId}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'orders', filter: `id=eq.${orderId}` },
        (payload) => {
          console.log('Order update received in real-time:', payload.new);
          setOrder(payload.new as Order);
        }
      )
      .subscribe();

    return () => {
      if (supabase) {
        supabase.removeChannel(channel);
      }
    };
  }, [orderId]);

  const fetchOrder = async () => {
    setLoading(true);
    setError(null);
    try {
      // Use API route /api/orders?id=ORDER_ID to query bypass RLS
      const res = await fetch(`/api/orders?id=${orderId}`);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'No se pudo cargar el detalle del pedido.');
      }

      const data = await res.json();
      setOrder(data);
    } catch (err: any) {
      console.error('Error fetching order:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'pendiente':
        return {
          title: 'Pendiente de Pago',
          description: 'Tu pedido ha sido reservado. Coordina el pago con nosotros por WhatsApp.',
          color: 'text-amber-400 bg-amber-500/10 border-amber-500/25',
          icon: <Clock className="w-8 h-8 text-amber-400 animate-pulse" />
        };
      case 'pagado':
        return {
          title: 'Pago Confirmado',
          description: '¡Tu pago ha sido validado con éxito! Estamos preparando tus productos.',
          color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/25',
          icon: <ShieldCheck className="w-8 h-8 text-emerald-400" />
        };
      case 'entregado':
        return {
          title: 'Pedido Entregado',
          description: '¡Tu pedido ya fue despachado y entregado! Esperamos que lo disfrutes.',
          color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/25',
          icon: <CheckCircle2 className="w-8 h-8 text-indigo-400" />
        };
      case 'cancelado':
        return {
          title: 'Pedido Cancelado',
          description: 'El pedido fue cancelado y el stock reservado ha sido liberado.',
          color: 'text-rose-400 bg-rose-500/10 border-rose-500/25',
          icon: <XCircle className="w-8 h-8 text-rose-400" />
        };
      default:
        return {
          title: 'Estado Desconocido',
          description: 'Verificando estado del pedido...',
          color: 'text-slate-400 bg-slate-500/10 border-slate-500/25',
          icon: <Clock className="w-8 h-8 text-slate-400" />
        };
    }
  };

  const handleContactWhatsApp = () => {
    if (!order) return;
    const phone = '51960871790';
    const message = `Hola, me gustaría consultar sobre el estado de mi pedido *#${order.id.slice(0, 8).toUpperCase()}*. Nombre: ${order.client_name}`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4 bg-brand-950">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-brand-400 uppercase font-black tracking-widest">Cargando tu pedido...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-[70vh] max-w-md mx-auto flex flex-col items-center justify-center p-6 text-center space-y-5 bg-brand-950">
        <div className="p-4 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400">
          <XCircle className="w-12 h-12" />
        </div>
        <div className="space-y-2">
          <h2 className="text-lg font-black text-white">Pedido no encontrado</h2>
          <p className="text-xs text-brand-400 leading-relaxed">
            {error || 'El código del pedido no existe o es inválido.'}
          </p>
        </div>
        <Link
          href="/productos"
          className="px-6 py-2.5 rounded-full bg-slate-900 border border-white/10 hover:bg-slate-800 text-white text-xs font-bold transition-all flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Ir a la Tienda</span>
        </Link>
      </div>
    );
  }

  const statusInfo = getStatusDisplay(order.status);
  const formattedDate = new Date(order.created_at).toLocaleString('es-PE', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="min-h-[85vh] py-12 px-4 sm:px-6 bg-brand-950 flex flex-col items-center">
      <div className="w-full max-w-2xl space-y-6">
        
        {/* Back Link */}
        <Link
          href="/productos"
          className="inline-flex items-center space-x-2 text-brand-400 hover:text-white transition-colors text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al Catálogo</span>
        </Link>

        {/* Premium Status Header Box */}
        <div className={`p-6 rounded-3xl border border-white/5 shadow-xl flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-5 transition-all ${statusInfo.color}`}>
          <div className="p-3 bg-brand-950/70 border border-white/10 rounded-2xl shrink-0">
            {statusInfo.icon}
          </div>
          <div className="space-y-1">
            <h1 className="text-lg font-black tracking-wide text-white uppercase sm:normal-case">{statusInfo.title}</h1>
            <p className="text-xs opacity-90 leading-relaxed max-w-md">{statusInfo.description}</p>
          </div>
        </div>

        {/* Order Details Body */}
        <div className="bg-brand-900/25 border border-white/5 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl backdrop-blur-md">
          
          {/* Top Title/Code */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/5 pb-5 gap-3">
            <div>
              <p className="text-[10px] font-black text-brand-400 uppercase tracking-widest">Código de Pedido</p>
              <h2 className="text-lg font-black text-white font-mono mt-0.5">#{order.id.slice(0, 8).toUpperCase()}</h2>
            </div>
            <div className="sm:text-right">
              <p className="text-[10px] font-black text-brand-400 uppercase tracking-widest">Fecha de Compra</p>
              <p className="text-xs text-brand-300 font-bold mt-0.5">{formattedDate}</p>
            </div>
          </div>

          {/* Client Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-b border-white/5 pb-5">
            <div>
              <p className="text-[10px] font-black text-brand-400 uppercase tracking-widest">Cliente</p>
              <p className="text-xs text-white font-bold mt-1">{order.client_name}</p>
            </div>
            {order.address && (
              <div>
                <p className="text-[10px] font-black text-brand-400 uppercase tracking-widest">Dirección de Entrega</p>
                <p className="text-xs text-brand-300 font-bold mt-1">{order.address}</p>
              </div>
            )}
          </div>

          {/* Product Items Table */}
          <div className="space-y-3">
            <p className="text-[10px] font-black text-brand-400 uppercase tracking-widest">Detalle del Pedido</p>
            
            <div className="divide-y divide-white/5">
              {order.items.map((item) => (
                <div key={item.id} className="py-3 flex items-center justify-between gap-4 text-xs">
                  <div className="truncate">
                    <p className="font-bold text-white truncate">{item.name}</p>
                    <span className="text-[10px] text-brand-500 uppercase font-extrabold">{item.brand}</span>
                  </div>
                  <div className="flex items-center gap-6 shrink-0">
                    <span className="text-brand-400">x{item.quantity}</span>
                    <span className="font-bold text-white w-20 text-right">S/ {(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Total Row */}
            <div className="border-t border-white/10 pt-4 flex items-center justify-between">
              <span className="text-xs text-brand-300 font-bold">Total del Pedido</span>
              <span className="text-lg font-black text-amber-400">S/ {order.total.toFixed(2)}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleContactWhatsApp}
              className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs tracking-wide rounded-full flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/10"
            >
              <MessageSquare className="w-4 h-4 fill-white" />
              <span>Chatear por WhatsApp</span>
            </button>
            <Link
              href="/productos"
              className="flex-1 py-3 bg-slate-900 border border-white/10 hover:bg-slate-800 text-white text-xs font-bold rounded-full text-center hover:border-white/20 transition-colors"
            >
              Seguir Comprando
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}
