'use client';

import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { PRODUCTS } from '@/lib/mockData';
import { Plus, ArrowDownCircle, ArrowUpCircle, AlertTriangle, Check, Loader2, ClipboardList, Search, Warehouse } from 'lucide-react';

interface WarehouseItem {
  id: string;
  name: string;
  location: string;
}

interface StockMovement {
  id: string;
  product_id: string;
  warehouse_id: string;
  type: 'entrada' | 'salida';
  quantity: number;
  reason: string;
  created_at: string;
}

export default function AdminStockHistoryPage() {
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [warehouses, setWarehouses] = useState<WarehouseItem[]>([]);
  const [productsList, setProductsList] = useState<any[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Search Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'admin' | 'compras'>('admin');

  // Form State
  const [formProductId, setFormProductId] = useState('');
  const [formWarehouseId, setFormWarehouseId] = useState('');
  const [formType, setFormType] = useState<'entrada' | 'salida'>('entrada');
  const [formQuantity, setFormQuantity] = useState(1);
  const [formReason, setFormReason] = useState('Compra');

  useEffect(() => {
    fetchData();

    if (typeof window === 'undefined') return;

    const handleCustomEvent = () => {
      fetchData();
    };

    let bc: BroadcastChannel | null = null;
    try {
      bc = new BroadcastChannel('z2_products_sync');
      bc.onmessage = (event) => {
        if (event.data === 'products_updated') {
          fetchData();
        }
      };
    } catch (e) {
      console.warn('BroadcastChannel failed to initialize:', e);
    }

    window.addEventListener('z2_products_changed', handleCustomEvent);

    let movChannel: any = null;

    if (isSupabaseConfigured && supabase) {
      movChannel = supabase
        .channel('public:stock_movements')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'stock_movements' },
          () => {
            fetchData();
          }
        )
        .subscribe();
    }

    return () => {
      window.removeEventListener('z2_products_changed', handleCustomEvent);
      if (bc) {
        bc.close();
      }
      if (movChannel) {
        supabase?.removeChannel(movChannel);
      }
    };
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Fetch Products
      let products: any[] = PRODUCTS;
      if (isSupabaseConfigured && supabase) {
        const { data: dbProds } = await supabase.from('products').select('id, name, brand, image');
        if (dbProds) products = dbProds;
      }
      setProductsList(products);
      if (products.length > 0) setFormProductId(products[0].id);

      // 2. Fetch Warehouses
      let whs: WarehouseItem[] = [];
      if (isSupabaseConfigured && supabase) {
        const { data, error: whErr } = await supabase.from('warehouses').select('*');
        if (whErr) throw whErr;
        whs = data || [];
      } else {
        whs = JSON.parse(localStorage.getItem('z2_mock_warehouses') || '[]');
      }
      setWarehouses(whs);
      if (whs.length > 0) setFormWarehouseId(whs[0].id);

      // 3. Fetch Stock Movements
      if (isSupabaseConfigured && supabase) {
        const { data, error: mvErr } = await supabase
          .from('stock_movements')
          .select('*')
          .order('created_at', { ascending: false });
        if (mvErr) throw mvErr;
        setMovements(data || []);
      } else {
        const stored = localStorage.getItem('z2_mock_stock_movements');
        if (stored) {
          setMovements(JSON.parse(stored));
        } else {
          // Empty initial history
          const initial: StockMovement[] = [];
          setMovements(initial);
          localStorage.setItem('z2_mock_stock_movements', JSON.stringify(initial));
        }
      }
    } catch (err: any) {
      console.error('Fetch movements error:', err);
      setError('Error al cargar historial: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveMovement = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSaving(true);

    if (!formProductId || !formWarehouseId || formQuantity <= 0 || !formReason.trim()) {
      setError('Por favor completa todos los campos con valores válidos.');
      setSaving(false);
      return;
    }

    try {
      if (isSupabaseConfigured && supabase) {
        const payload = {
          product_id: formProductId,
          warehouse_id: formWarehouseId,
          type: formType,
          quantity: Math.floor(formQuantity),
          reason: formReason.trim()
        };

        const { error: saveErr } = await supabase
          .from('stock_movements')
          .insert([payload]);

        if (saveErr) throw saveErr;
      } else {
        // Mock save movement
        const newMv: StockMovement = {
          id: 'mv_' + Math.random().toString(36).substr(2, 9),
          product_id: formProductId,
          warehouse_id: formWarehouseId,
          type: formType,
          quantity: Math.floor(formQuantity),
          reason: formReason.trim(),
          created_at: new Date().toISOString()
        };

        // Update local stock list in localStorage
        const storedInv = localStorage.getItem('z2_mock_inventory');
        let inventoryList = storedInv ? JSON.parse(storedInv) : [];
        const existing = inventoryList.find((i: any) => i.product_id === formProductId && i.warehouse_id === formWarehouseId);

        if (existing) {
          existing.stock = formType === 'entrada'
            ? existing.stock + newMv.quantity
            : Math.max(0, existing.stock - newMv.quantity);
        } else {
          inventoryList.push({
            id: 'inv_' + Math.random().toString(36).substr(2, 9),
            product_id: formProductId,
            warehouse_id: formWarehouseId,
            stock: formType === 'entrada' ? newMv.quantity : 0
          });
        }

        const updatedMvs = [newMv, ...movements];
        setMovements(updatedMvs);
        localStorage.setItem('z2_mock_stock_movements', JSON.stringify(updatedMvs));
        localStorage.setItem('z2_mock_inventory', JSON.stringify(inventoryList));
      }

      setSuccess(`Historial registrado: ${formType === 'entrada' ? 'Ingreso' : 'Salida'} de ${formQuantity} unidades.`);
      setFormQuantity(1);
      fetchData();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      console.error('Error saving movement:', err);
      setError('Error al registrar movimiento: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const adminCount = movements.filter(mv => mv.reason === 'Ajuste desde Administrador').length;
  const comprasCount = movements.filter(mv => mv.reason !== 'Ajuste desde Administrador').length;

  const tabFilteredMovements = movements.filter(mv => {
    if (activeTab === 'admin') {
      return mv.reason === 'Ajuste desde Administrador';
    } else {
      return mv.reason !== 'Ajuste desde Administrador';
    }
  });

  const filteredMovements = tabFilteredMovements.filter(mv => {
    const term = searchQuery.toLowerCase();
    const prod = productsList.find(p => p.id === mv.product_id) || { name: '' };
    return mv.reason.toLowerCase().includes(term) ||
      mv.product_id.toLowerCase().includes(term) ||
      prod.name.toLowerCase().includes(term);
  });

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide">Historial de Movimientos de Stock</h2>
        <p className="text-xs text-slate-400 mt-1">Registra entradas o salidas del inventario general por almacén.</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Form Column */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 h-fit space-y-4 shadow-xl">
          <div>
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Registrar Movimiento</h3>
            <p className="text-[10px] text-slate-500 mt-1 pl-1">Afecta directamente el stock neto de forma automática.</p>
          </div>

          <form onSubmit={handleSaveMovement} className="space-y-4">
            
            {/* Product select */}
            <div className="space-y-1">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Producto *</label>
              <select
                value={formProductId}
                onChange={(e) => setFormProductId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-white py-2.5 px-3 rounded-xl text-xs focus:outline-none focus:border-amber-500"
                required
              >
                {productsList.map(p => (
                  <option key={p.id} value={p.id}>{p.name} ({p.brand})</option>
                ))}
              </select>
            </div>

            {/* Warehouse select */}
            <div className="space-y-1">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Almacén de Destino *</label>
              <select
                value={formWarehouseId}
                onChange={(e) => setFormWarehouseId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-white py-2.5 px-3 rounded-xl text-xs focus:outline-none focus:border-amber-500"
                required
              >
                {warehouses.length > 0 ? (
                  warehouses.map(w => (
                    <option key={w.id} value={w.id}>{w.name}</option>
                  ))
                ) : (
                  <option value="">No hay almacenes creados</option>
                )}
              </select>
            </div>

            {/* Type selector buttons */}
            <div className="space-y-1">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Tipo de Movimiento *</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setFormType('entrada')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-1.5 cursor-pointer ${
                    formType === 'entrada'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/40 ring-1 ring-emerald-500/10'
                      : 'bg-slate-950 text-slate-500 border-slate-850 hover:text-slate-350'
                  }`}
                >
                  <ArrowDownCircle className="w-3.5 h-3.5" />
                  <span>Entrada</span>
                </button>
                
                <button
                  type="button"
                  onClick={() => setFormType('salida')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-1.5 cursor-pointer ${
                    formType === 'salida'
                      ? 'bg-rose-500/10 text-rose-400 border-rose-500/40 ring-1 ring-rose-500/10'
                      : 'bg-slate-950 text-slate-500 border-slate-850 hover:text-slate-350'
                  }`}
                >
                  <ArrowUpCircle className="w-3.5 h-3.5" />
                  <span>Salida</span>
                </button>
              </div>
            </div>

            {/* Quantity */}
            <div className="space-y-1">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Cantidad de unidades *</label>
              <input
                type="number"
                min="1"
                value={formQuantity}
                onChange={(e) => setFormQuantity(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-2 px-3 text-xs"
                required
              />
            </div>

            {/* Reason */}
            <div className="space-y-1">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Motivo / Razón *</label>
              <select
                value={formReason}
                onChange={(e) => setFormReason(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-white py-2.5 px-3 rounded-xl text-xs focus:outline-none focus:border-amber-500"
              >
                <option value="Compra">Compra / Reabastecimiento</option>
                <option value="Venta">Venta por pedido</option>
                <option value="Ajuste">Ajuste de inventario</option>
                <option value="Merma">Merma / Pérdida / Dañado</option>
                <option value="Transferencia">Transferencia entre almacenes</option>
              </select>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={saving}
              className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg cursor-pointer flex items-center justify-center gap-2"
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>Registrar e Impactar Stock</span>
            </button>

          </form>
        </div>

        {/* Right Ledger Column */}
        <div className="lg:col-span-2 space-y-4">

          {/* Tab Selector */}
          <div className="flex bg-slate-900 border border-slate-800 p-1.5 rounded-2xl gap-1">
            <button
              type="button"
              onClick={() => setActiveTab('admin')}
              className={`flex-1 py-2 px-3 rounded-xl text-[11px] sm:text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                activeTab === 'admin'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850/50'
              }`}
            >
              <span>Historial Admin</span>
              <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                activeTab === 'admin' ? 'bg-slate-950 text-amber-500' : 'bg-slate-950/60 text-slate-450 border border-slate-850'
              }`}>
                {adminCount}
              </span>
            </button>
            
            <button
              type="button"
              onClick={() => setActiveTab('compras')}
              className={`flex-1 py-2 px-3 rounded-xl text-[11px] sm:text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                activeTab === 'compras'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850/50'
              }`}
            >
              <span>Historial Compras / Ventas</span>
              <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                activeTab === 'compras' ? 'bg-slate-950 text-amber-500' : 'bg-slate-950/60 text-slate-450 border border-slate-850'
              }`}>
                {comprasCount}
              </span>
            </button>
          </div>
          
          {/* Ledger filters */}
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-3xl flex items-center">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por motivo, código o nombre de producto..."
                className="w-full bg-slate-950 border border-slate-850 text-white pl-10 pr-4 py-2.5 rounded-xl text-xs focus:outline-none focus:border-amber-500 transition-colors"
              />
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
            </div>
          </div>

          {/* History log card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
            {loading ? (
              <div className="py-20 flex flex-col items-center justify-center space-y-4">
                <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Cargando bitácora...</p>
              </div>
            ) : filteredMovements.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest bg-slate-900/55">
                      <th className="py-4 pl-6">Fecha / Tipo</th>
                      <th className="py-4">Producto</th>
                      <th className="py-4 text-center">Almacén</th>
                      <th className="py-4 text-right">Cant.</th>
                      <th className="py-4 text-center pr-6">Motivo</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/40 text-xs">
                    {filteredMovements.map((mv) => {
                      const prod = productsList.find(p => p.id === mv.product_id) || {
                        name: 'Producto Desconocido',
                        brand: 'N/A',
                        image: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?q=80&w=600&auto=format&fit=crop'
                      };
                      const wh = warehouses.find(w => w.id === mv.warehouse_id) || { name: 'Almacén Desconocido' };
                      const formattedDate = new Date(mv.created_at).toLocaleString('es-PE', {
                        day: '2-digit',
                        month: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                      });

                      return (
                        <tr key={mv.id} className="hover:bg-slate-850/30 transition-colors">
                          <td className="py-4 pl-6">
                            <div className="flex items-center space-x-2">
                              {mv.type === 'entrada' ? (
                                <ArrowDownCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                              ) : (
                                <ArrowUpCircle className="w-4 h-4 text-rose-400 shrink-0" />
                              )}
                              <div>
                                <span className={`text-[9px] font-black uppercase ${
                                  mv.type === 'entrada' ? 'text-emerald-450' : 'text-rose-450'
                                }`}>
                                  {mv.type === 'entrada' ? 'Ingreso' : 'Salida'}
                                </span>
                                <span className="block text-[9px] text-slate-500 font-mono mt-0.5">{formattedDate}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-4">
                            <div className="flex items-center space-x-3 max-w-[200px]">
                              <img src={prod.image} alt={prod.name} className="w-8 h-8 object-cover rounded-lg border border-slate-800 shrink-0" />
                              <div className="truncate">
                                <p className="font-bold text-white truncate leading-normal">{prod.name}</p>
                                <span className="font-mono text-[9px] text-slate-500 uppercase">{mv.product_id}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 text-center">
                            <span className="inline-flex items-center gap-1 text-[10px] text-slate-400">
                              <Warehouse className="w-3 h-3 text-slate-500" />
                              {wh.name}
                            </span>
                          </td>
                          <td className="py-4 text-right font-black text-white">
                            {mv.type === 'entrada' ? `+${mv.quantity}` : `-${mv.quantity}`}
                          </td>
                          <td className="py-4 text-center pr-6">
                            <span className="inline-block px-2.5 py-0.5 rounded-full bg-slate-950 border border-slate-800 text-[10px] text-slate-350">
                              {mv.reason}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-16 text-center space-y-2">
                <ClipboardList className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="text-xs font-bold text-white">
                  {activeTab === 'admin' 
                    ? 'No hay ajustes del Administrador registrados.' 
                    : 'No hay movimientos de compras o ventas registrados.'}
                </p>
                <p className="text-[10px] text-slate-400">
                  {activeTab === 'admin' 
                    ? 'Modifica el stock al editar un producto en el catálogo para generar registros.' 
                    : 'Registra una entrada o salida en el formulario izquierdo para generar registros.'}
                </p>
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
