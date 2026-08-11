'use client';

import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { ShoppingBag, Clock, Check, X, ShieldAlert, AlertTriangle, Loader2, Search, ExternalLink, MessageSquare, CheckCircle, Trash } from 'lucide-react';

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

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null); // holds orderId being updated
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState<'todos' | 'pendiente' | 'pagado' | 'entregado' | 'cancelado'>('todos');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;

    // Realtime listener for incoming orders or modifications
    const channel = supabase
      .channel('public:orders_admin')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        () => {
          // Play a notification sound for new orders if possible
          try {
            const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-120.wav');
            audio.volume = 0.5;
            audio.play();
          } catch (e) {
            console.log('Audio autoplay blocked or failed');
          }
          fetchOrdersSilent();
        }
      )
      .subscribe();

    return () => {
      if (supabase) {
        supabase.removeChannel(channel);
      }
    };
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/orders');
      if (!res.ok) throw new Error('No se pudieron obtener los pedidos.');
      const data = await res.json();
      setOrders(data || []);
    } catch (err: any) {
      console.error('Fetch orders error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrdersSilent = async () => {
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data || []);
      }
    } catch (e) {
      console.error('Silent fetch failed:', e);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: 'pendiente' | 'pagado' | 'entregado' | 'cancelado') => {
    if (newStatus === 'cancelado' && !confirm('¿Estás seguro de cancelar este pedido? Se devolverá la reserva de stock al almacén.')) {
      return;
    }

    setActionLoading(orderId);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch('/api/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status: newStatus })
      });

      const resData = await res.json();
      if (!res.ok) throw new Error(resData.error || 'Fallo al actualizar el pedido.');

      setSuccess(`Pedido actualizado a "${newStatus.toUpperCase()}" correctamente.`);
      setTimeout(() => setSuccess(null), 3000);
      fetchOrdersSilent();
    } catch (err: any) {
      console.error('Update status error:', err);
      setError(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleContactCustomer = (order: Order) => {
    const message = `Hola ${order.client_name}, te escribo de Hielos & Bebidas Z² respecto a tu pedido *#${order.id.slice(0, 8).toUpperCase()}*.`;
    window.open(`https://wa.me/51${order.whatsapp_number}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const filteredOrders = orders.filter(o => {
    const matchesStatus = statusFilter === 'todos' || o.status === statusFilter;
    const matchesSearch = o.client_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.whatsapp_number.includes(searchQuery) ||
      (o.address && o.address.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pendiente':
        return 'text-amber-400 bg-amber-500/10 border border-amber-500/20';
      case 'pagado':
        return 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20';
      case 'entregado':
        return 'text-indigo-400 bg-indigo-500/10 border border-indigo-500/20';
      case 'cancelado':
        return 'text-rose-400 bg-rose-500/10 border border-rose-500/20';
      default:
        return 'text-slate-400 bg-slate-550/10 border border-slate-500/20';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide">Gestión de Pedidos</h2>
          <p className="text-xs text-slate-400 mt-1">Monitorea pedidos entrantes de WhatsApp, confirma pagos y despacha inventario en tiempo real.</p>
        </div>
      </div>

      {/* Alerts */}
      {success && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4 rounded-2xl flex items-center gap-2 text-xs">
          <Check className="w-4 h-4 shrink-0" />
          <span>{success}</span>
        </div>
      )}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-2xl flex items-start gap-2.5 text-xs">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Toolbar Filter / Search */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-900 border border-slate-800 p-4 rounded-3xl items-center shadow-md">
        
        {/* Status Tab buttons */}
        <div className="md:col-span-2 flex flex-wrap gap-1.5">
          {(['todos', 'pendiente', 'pagado', 'entregado', 'cancelado'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`py-2 px-3.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                statusFilter === st
                  ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                  : 'bg-slate-950 text-slate-400 border border-slate-850 hover:text-white'
              }`}
            >
              {st} ({orders.filter(o => st === 'todos' || o.status === st).length})
            </button>
          ))}
        </div>

        {/* Text Search input */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por cliente o código..."
            className="w-full bg-slate-950 border border-slate-850 text-white pl-10 pr-4 py-2.5 rounded-xl text-xs focus:outline-none focus:border-amber-500"
          />
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
        </div>
      </div>

      {/* Orders Grid/Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-4">
            <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Cargando pedidos...</p>
          </div>
        ) : filteredOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest bg-slate-900/55">
                  <th className="py-4 pl-6">Código / Fecha</th>
                  <th className="py-4">Cliente</th>
                  <th className="py-4">Productos Pedidos</th>
                  <th className="py-4 text-right">Total</th>
                  <th className="py-4 text-center">Estado</th>
                  <th className="py-4 text-center pr-6">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40 text-xs">
                {filteredOrders.map((ord) => {
                  const formattedDate = new Date(ord.created_at).toLocaleString('es-PE', {
                    day: '2-digit',
                    month: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                  });

                  return (
                    <tr key={ord.id} className="hover:bg-slate-850/30 transition-colors">
                      {/* Code/Date */}
                      <td className="py-4 pl-6">
                        <span className="font-mono font-black text-white text-[11px]">#{ord.id.slice(0, 8).toUpperCase()}</span>
                        <span className="block text-[9px] text-slate-500 font-mono mt-0.5">{formattedDate}</span>
                      </td>

                      {/* Customer Info */}
                      <td className="py-4">
                        <p className="font-bold text-white">{ord.client_name}</p>
                        {ord.address && (
                          <span className="text-[10px] text-slate-400 font-medium max-w-[185px] block truncate" title={ord.address}>
                            📍 {ord.address}
                          </span>
                        )}
                      </td>

                      {/* Items details summary */}
                      <td className="py-4 max-w-[240px]">
                        <div className="space-y-1">
                          {ord.items.map((item, idx) => (
                            <p key={idx} className="text-[10px] text-slate-350 truncate">
                              <span className="font-extrabold text-amber-500">{item.quantity}x</span> {item.name}
                            </p>
                          ))}
                        </div>
                      </td>

                      {/* Total */}
                      <td className="py-4 text-right font-black text-white">
                        S/ {ord.total.toFixed(2)}
                      </td>

                      {/* Status */}
                      <td className="py-4 text-center">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${getStatusBadge(ord.status)}`}>
                          {ord.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-4 text-center pr-6">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Contact via WhatsApp */}
                          <button
                            onClick={() => handleContactCustomer(ord)}
                            title="Contactar Cliente"
                            className="p-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-lg border border-emerald-500/15 cursor-pointer"
                          >
                            <MessageSquare className="w-3.5 h-3.5 fill-emerald-400/10" />
                          </button>

                          {/* Open tracking page */}
                          <a
                            href={`/pedido/${ord.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Ver Seguimiento"
                            className="p-1.5 bg-slate-950 hover:bg-slate-800 text-slate-300 rounded-lg border border-slate-850 cursor-pointer"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>

                          {/* Action flow based on status */}
                          {actionLoading === ord.id ? (
                            <Loader2 className="w-4 h-4 text-amber-500 animate-spin" />
                          ) : (
                            <>
                              {/* {ord.status === 'pendiente' && (
                                <>
                                  <button
                                    onClick={() => updateOrderStatus(ord.id, 'pagado')}
                                    title="Marcar como Pagado"
                                    className="p-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-lg cursor-pointer"
                                  >
                                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                                  </button>
                                  <button
                                    onClick={() => updateOrderStatus(ord.id, 'cancelado')}
                                    title="Cancelar Pedido"
                                    className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg border border-rose-500/15 cursor-pointer"
                                  >
                                    <X className="w-3.5 h-3.5 stroke-[3]" />
                                  </button>
                                </>
                              )} */}

                              {ord.status === 'pagado' && (
                                <button
                                  onClick={() => updateOrderStatus(ord.id, 'entregado')}
                                  title="Marcar como Entregado"
                                  className="p-1.5 bg-indigo-500 hover:bg-indigo-400 text-slate-950 rounded-lg cursor-pointer flex items-center gap-1"
                                >
                                  <CheckCircle className="w-3.5 h-3.5" />
                                  <span className="text-[9px] font-black uppercase pr-0.5">Entregar</span>
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-20 text-center space-y-3">
            <ShoppingBag className="w-10 h-10 text-slate-700 mx-auto" />
            <p className="text-xs font-bold text-white">No se encontraron pedidos.</p>
            <p className="text-[10px] text-slate-400">Los pedidos entrantes se listarán aquí automáticamente.</p>
          </div>
        )}
      </div>

    </div>
  );
}
