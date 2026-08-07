'use client';

import { useState, useEffect } from 'react';
import { DollarSign, ShoppingCart, Package, Users, ArrowUpRight, ArrowDownRight, Loader2 } from 'lucide-react';
import { PRODUCTS } from '@/lib/mockData';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeProductsCount, setActiveProductsCount] = useState(PRODUCTS.length);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // 1. Fetch products count from DB if available
      const pRes = await fetch('/api/products');
      if (pRes.ok) {
        const pData = await pRes.json();
        if (pData && pData.length > 0) {
          setActiveProductsCount(pData.length);
        }
      }

      // 2. Fetch orders from API
      const oRes = await fetch('/api/orders');
      if (oRes.ok) {
        const oData = await oRes.json();
        setOrders(oData || []);
      }
    } catch (e) {
      console.error('Error fetching dashboard data:', e);
    } finally {
      setLoading(false);
    }
  };

  // Calculate actual stats
  const totalSales = orders
    .filter(o => o.status === 'pagado' || o.status === 'entregado')
    .reduce((acc, o) => acc + Number(o.total || 0), 0);

  const todayOrders = orders.filter(o => {
    const orderDate = new Date(o.created_at);
    const today = new Date();
    return orderDate.getDate() === today.getDate() &&
      orderDate.getMonth() === today.getMonth() &&
      orderDate.getFullYear() === today.getFullYear();
  }).length;

  const uniqueClients = new Set(orders.map(o => o.whatsapp_number)).size;

  const stats = [
    { name: 'Ventas Totales', value: `S/ ${totalSales.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, diff: '+15.2%', isUp: true, icon: DollarSign },
    { name: 'Pedidos de Hoy', value: todayOrders.toString(), diff: '+4.5%', isUp: true, icon: ShoppingCart },
    { name: 'Productos Activos', value: activeProductsCount.toString(), diff: '0.0%', isUp: true, icon: Package },
    { name: 'Clientes Únicos', value: uniqueClients.toString(), diff: '+6.1%', isUp: true, icon: Users },
  ];

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide">Dashboard Resumen</h2>
          <p className="text-xs text-slate-400 mt-1">Monitorea las ventas, pedidos y catálogo de Hielos & Bebidas Z².</p>
        </div>
        
        {/* Date Filter button */}
        <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs shrink-0">
          <button className="bg-amber-500 text-slate-950 font-extrabold px-3 py-1.5 rounded-lg cursor-pointer">Hoy</button>
          <button className="text-slate-400 hover:text-white px-3 py-1.5 cursor-pointer">Semana</button>
          <button className="text-slate-400 hover:text-white px-3 py-1.5 cursor-pointer">Mes</button>
        </div>
      </div>

      {/* Summary Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-slate-850 border border-slate-800 text-amber-500 rounded-2xl">
                  <Icon className="w-5 h-5" />
                </div>
                <div className={`flex items-center space-x-0.5 text-xs font-bold ${
                  stat.isUp ? 'text-emerald-400' : 'text-rose-400'
                }`}>
                  <span>{stat.diff}</span>
                  {stat.isUp ? (
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  ) : (
                    <ArrowDownRight className="w-3.5 h-3.5" />
                  )}
                </div>
              </div>

              <div>
                <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">{stat.name}</p>
                <h3 className="text-2xl font-black text-white mt-1">{stat.value}</h3>
              </div>
            </div>
          );
        })}
      </div>

      {/* Analytics Charts & Orders Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Charts / Analytics Placeholders */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h3 className="text-sm font-black text-white uppercase tracking-wider">Flujo de Ventas (Soles)</h3>
            <span className="text-[10px] text-amber-500 font-bold bg-amber-500/10 px-2 py-0.5 border border-amber-500/20 rounded-md">
              En Vivo 24h
            </span>
          </div>

          {/* Simulated Chart Bars layout */}
          <div className="h-64 flex items-end justify-between gap-2.5 pt-4">
            {[1200, 1800, 1400, 2200, 3100, 2800, 3900, 4500, 3800, 5200, 6100, 7500].map((val, idx) => {
              const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
              const heightPct = `${Math.round((val / 7500) * 100)}%`;
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end relative">
                  {/* Tooltip bar value */}
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-slate-950 border border-slate-800 text-[9px] font-bold text-white px-1.5 py-0.5 rounded shadow-lg absolute bottom-full mb-1 z-10">
                    S/{val}
                  </span>
                  
                  {/* Chart Bar */}
                  <div
                    className="w-full bg-slate-800 hover:bg-amber-500 transition-all duration-300 rounded-t-lg shadow-inner cursor-pointer"
                    style={{ height: heightPct }}
                  />
                  
                  {/* X Axis Label */}
                  <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mt-1">{months[idx]}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Quick Settings/Catálogo summary widget */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h3 className="text-sm font-black text-white uppercase tracking-wider">Productos por Stock</h3>
            <span className="text-[10px] text-rose-500 font-bold bg-rose-500/10 px-2 py-0.5 border border-rose-500/20 rounded-md">
              Poco Stock
            </span>
          </div>

          <div className="space-y-4">
            {PRODUCTS.slice(0, 4).map((p) => (
              <div key={p.id} className="flex items-center justify-between bg-slate-850 p-3 rounded-2xl border border-slate-800">
                <div className="flex items-center space-x-3 min-w-0">
                  <img src={p.image} alt={p.name} className="w-10 h-10 object-cover rounded-lg border border-slate-700 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate">{p.name}</p>
                    <p className="text-[9px] text-slate-400 font-extrabold uppercase mt-0.5">{p.brand}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-extrabold text-amber-500">S/ {p.price.toFixed(2)}</p>
                  <p className="text-[9px] text-rose-400 font-bold mt-0.5">Stock: {p.countInStock}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <h3 className="text-sm font-black text-white uppercase tracking-wider">Pedidos Recientes</h3>
          <Link href="/admin/pedidos" className="text-xs font-bold text-amber-500 hover:text-amber-400 transition-colors cursor-pointer">
            Ver Todos
          </Link>
        </div>

        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-6 h-6 text-amber-500 animate-spin" />
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Cargando...</p>
          </div>
        ) : orders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                  <th className="pb-3 pl-4">ID Pedido</th>
                  <th className="pb-3">Cliente</th>
                  <th className="pb-3">Detalle</th>
                  <th className="pb-3">Fecha</th>
                  <th className="pb-3 text-right">Total</th>
                  <th className="pb-3 text-center">Estado</th>
                </tr>
              </thead>
              <tbody className="text-xs divide-y divide-slate-800/50">
                {orders.slice(0, 5).map((o) => {
                  const formattedDate = new Date(o.created_at).toLocaleDateString('es-PE', {
                    day: '2-digit',
                    month: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                  });
                  const itemsSummary = (o.items || []).map((i: any) => `${i.quantity}x ${i.name}`).join(', ');

                  return (
                    <tr key={o.id} className="hover:bg-slate-850/50 transition-colors">
                      <td className="py-4 pl-4 font-mono font-bold text-amber-500">#{o.id.slice(0, 8).toUpperCase()}</td>
                      <td className="py-4 font-bold text-white">{o.client_name}</td>
                      <td className="py-4 text-slate-300 max-w-[200px] truncate" title={itemsSummary}>{itemsSummary}</td>
                      <td className="py-4 text-slate-400">{formattedDate}</td>
                      <td className="py-4 font-extrabold text-white text-right">S/ {Number(o.total || 0).toFixed(2)}</td>
                      <td className="py-4 text-center">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-[9px] font-extrabold uppercase border ${
                          o.status === 'entregado'
                            ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/25'
                            : o.status === 'pagado'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25'
                            : o.status === 'pendiente'
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/25'
                            : 'bg-rose-500/10 text-rose-400 border-rose-500/25'
                        }`}>
                          {o.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center">
            <p className="text-xs text-slate-500">No hay pedidos registrados en el catálogo.</p>
          </div>
        )}
      </div>
      
    </div>
  );
}
