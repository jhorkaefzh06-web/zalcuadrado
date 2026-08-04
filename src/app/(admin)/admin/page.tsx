'use client';

import { useState } from 'react';
import { DollarSign, ShoppingCart, Package, Users, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { PRODUCTS } from '@/lib/mockData';

export default function AdminDashboardPage() {
  // Mock recent orders data
  const [orders] = useState([
    { id: 'ORD-9821', client: 'Carlos Mendoza', total: 119.99, date: 'Hoy, 15:30', status: 'entregado', item: 'Whisky Macallan 12 Años' },
    { id: 'ORD-9820', client: 'Andrea Delgado', total: 43.00, date: 'Hoy, 14:15', status: 'pendiente', item: 'Hielo Esferas x12 + Ron Zacapa' },
    { id: 'ORD-9819', client: 'Jorge Ramírez', total: 195.00, date: 'Ayer, 21:00', status: 'entregado', item: 'Vino Vega Sicilia 5º Año' },
    { id: 'ORD-9818', client: 'Lucía Benavides', total: 29.99, date: 'Ayer, 18:45', status: 'cancelado', item: 'Pack Cervezas IPA Set x6' },
    { id: 'ORD-9817', client: 'Miguel Torres', total: 79.99, date: 'Ayer, 11:30', status: 'entregado', item: 'Champagne Moët & Chandon' },
  ]);

  const stats = [
    { name: 'Ventas Totales', value: 'S/ 12,450.00', diff: '+12.5%', isUp: true, icon: DollarSign },
    { name: 'Pedidos de Hoy', value: '24', diff: '+8.3%', isUp: true, icon: ShoppingCart },
    { name: 'Productos Activos', value: PRODUCTS.length.toString(), diff: '0.0%', isUp: true, icon: Package },
    { name: 'Clientes Nuevos', value: '85', diff: '-2.4%', isUp: false, icon: Users },
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
          <button className="text-xs font-bold text-amber-500 hover:text-amber-400 transition-colors cursor-pointer">
            Ver Todos
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                <th className="pb-3 pl-4">ID Pedido</th>
                <th className="pb-3">Cliente</th>
                <th className="pb-3">Detalle</th>
                <th className="pb-3">Fecha</th>
                <th className="pb-3">Total</th>
                <th className="pb-3 text-center">Estado</th>
              </tr>
            </thead>
            <tbody className="text-xs divide-y divide-slate-800/50">
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-slate-850/50 transition-colors">
                  <td className="py-4 pl-4 font-bold text-amber-500">{o.id}</td>
                  <td className="py-4 font-bold text-white">{o.client}</td>
                  <td className="py-4 text-slate-300 max-w-[200px] truncate">{o.item}</td>
                  <td className="py-4 text-slate-400">{o.date}</td>
                  <td className="py-4 font-extrabold text-white">S/ {o.total.toFixed(2)}</td>
                  <td className="py-4 text-center">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-[9px] font-extrabold uppercase border ${
                      o.status === 'entregado'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25'
                        : o.status === 'pendiente'
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/25'
                        : 'bg-rose-500/10 text-rose-400 border-rose-500/25'
                    }`}>
                      {o.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
    </div>
  );
}
