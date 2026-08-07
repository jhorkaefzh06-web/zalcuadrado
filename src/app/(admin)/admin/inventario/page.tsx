'use client';

import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { PRODUCTS } from '@/lib/mockData';
import { Plus, Edit, Trash2, X, AlertTriangle, Check, Loader2, Package, ClipboardList, Warehouse } from 'lucide-react';

interface WarehouseItem {
  id: string;
  name: string;
  location: string;
}

interface InventoryItem {
  id: string;
  product_id: string;
  warehouse_id: string;
  stock: number;
  updated_at?: string;
}

export default function AdminInventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [warehouses, setWarehouses] = useState<WarehouseItem[]>([]);
  const [productsList, setProductsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Selected Filter Warehouse
  const [activeWarehouseId, setActiveWarehouseId] = useState<string>('todos');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

  // Form State
  const [formProductId, setFormProductId] = useState('');
  const [formWarehouseId, setFormWarehouseId] = useState('');
  const [formStock, setFormStock] = useState(0); // Initial stock when adding mapping

  // Adjustment State (only when editing)
  const [formAdjType, setFormAdjType] = useState<'entrada' | 'salida'>('entrada');
  const [formAdjQty, setFormAdjQty] = useState(1);
  const [formAdjReason, setFormAdjReason] = useState('Compra');

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

    let invChannel: any = null;
    let movChannel: any = null;

    if (isSupabaseConfigured && supabase) {
      invChannel = supabase
        .channel('public:inventory')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'inventory' },
          () => {
            fetchData();
          }
        )
        .subscribe();

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
      if (invChannel) {
        supabase?.removeChannel(invChannel);
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
      // 1. Fetch products (local or DB)
      let products: any[] = PRODUCTS;
      if (isSupabaseConfigured && supabase) {
        const { data: dbProds } = await supabase.from('products').select('id, name, brand, image');
        if (dbProds) products = dbProds;
      }
      setProductsList(products);

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

      // 3. Fetch Inventory mapping
      if (isSupabaseConfigured && supabase) {
        const { data, error: invErr } = await supabase.from('inventory').select('*');
        if (invErr) throw invErr;
        setInventory(data || []);
      } else {
        const stored = localStorage.getItem('z2_mock_inventory');
        if (stored) {
          setInventory(JSON.parse(stored));
        } else {
          // Initialize mock associations
          const initial: InventoryItem[] = [];
          if (whs.length > 0) {
            products.forEach((p, idx) => {
              // Assign to San Isidro or Miraflores depending on index
              const whIdx = idx % whs.length;
              initial.push({
                id: `inv-${idx}`,
                product_id: p.id,
                warehouse_id: whs[whIdx].id,
                stock: Math.floor(Math.random() * 20) + 5
              });
            });
          }
          setInventory(initial);
          localStorage.setItem('z2_mock_inventory', JSON.stringify(initial));
        }
      }
    } catch (err: any) {
      console.error('Fetch inventory error:', err);
      setError('Error al cargar inventario: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingItem(null);
    setFormProductId(productsList[0]?.id || '');
    setFormWarehouseId(warehouses[0]?.id || '');
    setFormStock(0);
    setModalOpen(true);
  };

  const openEditModal = (item: InventoryItem) => {
    setEditingItem(item);
    setFormProductId(item.product_id);
    setFormWarehouseId(item.warehouse_id);
    setFormStock(item.stock);
    setFormAdjType('entrada');
    setFormAdjQty(1);
    setFormAdjReason('Compra');
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!formProductId || !formWarehouseId) {
      setError('Por favor selecciona un producto y un almacén válidos.');
      return;
    }

    try {
      if (isSupabaseConfigured && supabase) {
        if (!editingItem) {
          // Creating initial stock mapping
          if (formStock < 0) {
            setError('La cantidad inicial no puede ser negativa.');
            return;
          }
          
          // 1. Insert inventory row
          const { error: invErr } = await supabase
            .from('inventory')
            .upsert([{ product_id: formProductId, warehouse_id: formWarehouseId, stock: formStock }]);
          
          if (invErr) throw invErr;

          // 2. Log initial restock movement if stock > 0
          if (formStock > 0) {
            await supabase.from('stock_movements').insert([{
              product_id: formProductId,
              warehouse_id: formWarehouseId,
              type: 'entrada',
              quantity: formStock,
              reason: 'Compra'
            }]);
          }
        } else {
          // Registering adjustment movement for existing mapping
          if (formAdjQty <= 0) {
            setError('La cantidad a ajustar debe ser mayor a cero.');
            return;
          }

          // Directly insert into stock_movements! The trigger handles updating the stock!
          const { error: saveErr } = await supabase
            .from('stock_movements')
            .insert([{
              product_id: formProductId,
              warehouse_id: formWarehouseId,
              type: formAdjType,
              quantity: formAdjQty,
              reason: formAdjReason
            }]);

          if (saveErr) throw saveErr;
        }
      } else {
        // Local fallback simulation
        let updated: InventoryItem[];
        const storedInv = localStorage.getItem('z2_mock_inventory');
        let inventoryList: InventoryItem[] = storedInv ? JSON.parse(storedInv) : [];

        if (!editingItem) {
          // Check duplicate
          const exists = inventoryList.find(i => i.product_id === formProductId && i.warehouse_id === formWarehouseId);
          if (exists) {
            setError('Ya existe un registro para este producto en el almacén seleccionado.');
            return;
          }

          const newItem: InventoryItem = {
            id: 'inv_' + Math.random().toString(36).substr(2, 9),
            product_id: formProductId,
            warehouse_id: formWarehouseId,
            stock: formStock
          };
          updated = [...inventoryList, newItem];
          setInventory(updated);
          localStorage.setItem('z2_mock_inventory', JSON.stringify(updated));

          // Log mock movement
          if (formStock > 0) {
            const mvs = JSON.parse(localStorage.getItem('z2_mock_stock_movements') || '[]');
            mvs.unshift({
              id: 'mv_' + Math.random().toString(36).substr(2, 9),
              product_id: formProductId,
              warehouse_id: formWarehouseId,
              type: 'entrada',
              quantity: formStock,
              reason: 'Compra',
              created_at: new Date().toISOString()
            });
            localStorage.setItem('z2_mock_stock_movements', JSON.stringify(mvs));
          }
        } else {
          // Update total stock
          const matchIdx = inventoryList.findIndex(i => i.id === editingItem.id);
          if (matchIdx !== -1) {
            const item = inventoryList[matchIdx];
            const originalStock = item.stock;
            item.stock = formAdjType === 'entrada'
              ? originalStock + formAdjQty
              : Math.max(0, originalStock - formAdjQty);

            localStorage.setItem('z2_mock_inventory', JSON.stringify(inventoryList));
            setInventory(inventoryList);

            // Log mock movement
            const mvs = JSON.parse(localStorage.getItem('z2_mock_stock_movements') || '[]');
            mvs.unshift({
              id: 'mv_' + Math.random().toString(36).substr(2, 9),
              product_id: formProductId,
              warehouse_id: formWarehouseId,
              type: formAdjType,
              quantity: formAdjQty,
              reason: formAdjReason,
              created_at: new Date().toISOString()
            });
            localStorage.setItem('z2_mock_stock_movements', JSON.stringify(mvs));
          }
        }
      }

      setSuccess(editingItem ? 'Ajuste de inventario registrado con éxito.' : 'Asociación de stock creada con éxito.');
      setModalOpen(false);
      fetchData();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError('Error al registrar ajuste: ' + err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de quitar este registro de inventario?')) return;
    setError(null);
    setSuccess(null);

    try {
      if (isSupabaseConfigured && supabase) {
        const { error: delErr } = await supabase
          .from('inventory')
          .delete()
          .eq('id', id);
        if (delErr) throw delErr;
      } else {
        const updated = inventory.filter(i => i.id !== id);
        setInventory(updated);
        localStorage.setItem('z2_mock_inventory', JSON.stringify(updated));
      }
      setSuccess('Registro de inventario removido.');
      fetchData();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError('Error al eliminar registro: ' + err.message);
    }
  };

  const filteredInventory = inventory.filter(item => {
    return activeWarehouseId === 'todos' || item.warehouse_id === activeWarehouseId;
  });

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide">Control de Inventario</h2>
          <p className="text-xs text-slate-400 mt-1">Vincula productos a almacenes y controla las cantidades disponibles por local.</p>
        </div>
        
        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 px-5 py-3 bg-amber-500 hover:bg-amber-400 text-slate-900 font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Asociar Stock</span>
        </button>
      </div>

      {/* Alerts */}
      {success && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4 rounded-2xl flex items-center gap-2 text-xs">
          <Check className="w-4 h-4" />
          <span>{success}</span>
        </div>
      )}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-2xl flex items-start gap-2.5 text-xs">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Warehouse Selector Filter */}
      <div className="flex items-center space-x-3 bg-slate-900 border border-slate-800 p-4 rounded-2xl overflow-x-auto">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest shrink-0">Filtrar Almacén:</span>
        <button
          onClick={() => setActiveWarehouseId('todos')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
            activeWarehouseId === 'todos' 
              ? 'bg-amber-500 text-slate-950 shadow-md' 
              : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          Todos
        </button>
        {warehouses.map(w => (
          <button
            key={w.id}
            onClick={() => setActiveWarehouseId(w.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeWarehouseId === w.id 
                ? 'bg-amber-500 text-slate-950 shadow-md' 
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {w.name}
          </button>
        ))}
      </div>

      {/* Inventory Table Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-4">
            <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Cargando inventario...</p>
          </div>
        ) : filteredInventory.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest bg-slate-900/55">
                  <th className="py-4 pl-6">Imagen / ID</th>
                  <th className="py-4">Producto</th>
                  <th className="py-4 text-center">Almacén</th>
                  <th className="py-4 text-center">Cantidad en Stock</th>
                  <th className="py-4 text-center pr-6">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40 text-xs">
                {filteredInventory.map((item) => {
                  const prod = productsList.find(p => p.id === item.product_id) || {
                    name: 'Producto Desconocido',
                    brand: 'N/A',
                    image: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?q=80&w=600&auto=format&fit=crop'
                  };
                  const wh = warehouses.find(w => w.id === item.warehouse_id) || { name: 'Almacén Desconocido' };

                  return (
                    <tr key={item.id} className="hover:bg-slate-850/30 transition-colors">
                      <td className="py-4 pl-6">
                        <div className="flex items-center space-x-3">
                          <img src={prod.image} alt={prod.name} className="w-10 h-10 object-cover rounded-xl border border-slate-800 shrink-0" />
                          <span className="font-mono text-[10px] text-slate-500">{item.product_id}</span>
                        </div>
                      </td>
                      <td className="py-4">
                        <div>
                          <p className="font-bold text-white leading-normal">{prod.name}</p>
                          <p className="text-[9px] font-black text-slate-500 uppercase tracking-wide mt-0.5">{prod.brand}</p>
                        </div>
                      </td>
                      <td className="py-4 text-center">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-950 border border-slate-850 text-[10px] font-bold text-slate-300">
                          <Warehouse className="w-3.5 h-3.5 text-amber-500" />
                          {wh.name}
                        </span>
                      </td>
                      <td className="py-4 text-center">
                        <span className={`inline-block px-3 py-1 rounded-xl text-xs font-black ${
                          item.stock <= 5 
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' 
                            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        }`}>
                          {item.stock} unidades
                        </span>
                      </td>
                      <td className="py-4 text-center pr-6">
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            onClick={() => openEditModal(item)}
                            className="p-2 bg-slate-800 hover:bg-slate-700 border border-slate-700/60 rounded-lg text-slate-300 hover:text-white transition-colors cursor-pointer"
                            title="Editar Stock"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                            title="Desasociar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
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
            <p className="text-xs font-bold text-white">No hay existencias registradas en este almacén.</p>
          </div>
        )}
      </div>

      {/* FORM MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <div onClick={() => setModalOpen(false)} className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm cursor-default" />
          <div className="relative max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-2xl z-101">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-sm font-black text-white uppercase tracking-wider">
                {editingItem ? 'Editar Stock Asociado' : 'Asociar Producto a Almacén'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white"><X className="w-4 h-4" /></button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              
              {/* Product selection */}
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Seleccionar Producto *</label>
                <select
                  value={formProductId}
                  onChange={(e) => setFormProductId(e.target.value)}
                  disabled={!!editingItem}
                  className="w-full bg-slate-950 border border-slate-800 text-white py-2.5 px-3 rounded-xl text-xs focus:outline-none focus:border-amber-500 disabled:opacity-50"
                  required
                >
                  {productsList.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.brand})</option>
                  ))}
                </select>
              </div>

              {/* Warehouse selection */}
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Seleccionar Almacén *</label>
                <select
                  value={formWarehouseId}
                  onChange={(e) => setFormWarehouseId(e.target.value)}
                  disabled={!!editingItem}
                  className="w-full bg-slate-950 border border-slate-800 text-white py-2.5 px-3 rounded-xl text-xs focus:outline-none focus:border-amber-500 disabled:opacity-50"
                  required
                >
                  {warehouses.map(w => (
                    <option key={w.id} value={w.id}>{w.name}</option>
                  ))}
                </select>
              </div>

              {/* Quantity (Add) vs Adjustment Flow (Edit) */}
              {!editingItem ? (
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Cantidad Física Inicial en Stock *</label>
                  <input
                    type="number"
                    min="0"
                    value={formStock}
                    onChange={(e) => setFormStock(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-2 px-3 text-xs"
                    required
                  />
                </div>
              ) : (
                <div className="space-y-4 pt-2 border-t border-slate-850">
                  <div className="p-3 bg-slate-950 rounded-xl text-xs flex justify-between items-center">
                    <span className="text-slate-500 font-bold">Stock Actual en Almacén:</span>
                    <span className="text-white font-black">{formStock} unidades</span>
                  </div>

                  {/* Adjustment Type Selection */}
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Tipo de Movimiento *</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setFormAdjType('entrada');
                          setFormAdjReason('Compra');
                        }}
                        className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-1.5 cursor-pointer ${
                          formAdjType === 'entrada'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/40 ring-1 ring-emerald-500/10'
                            : 'bg-slate-950 text-slate-500 border-slate-850 hover:text-slate-350'
                        }`}
                      >
                        <span>Entrada (+)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setFormAdjType('salida');
                          setFormAdjReason('Venta');
                        }}
                        className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-1.5 cursor-pointer ${
                          formAdjType === 'salida'
                            ? 'bg-rose-500/10 text-rose-400 border-rose-500/40 ring-1 ring-rose-500/10'
                            : 'bg-slate-950 text-slate-500 border-slate-850 hover:text-slate-350'
                        }`}
                      >
                        <span>Salida (-)</span>
                      </button>
                    </div>
                  </div>

                  {/* Adjustment Quantity */}
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Cantidad a Ajustar *</label>
                    <input
                      type="number"
                      min="1"
                      value={formAdjQty}
                      onChange={(e) => setFormAdjQty(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-2 px-3 text-xs"
                      required
                    />
                  </div>

                  {/* Professional Reason Selection */}
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Motivo del Ajuste *</label>
                    <select
                      value={formAdjReason}
                      onChange={(e) => setFormAdjReason(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 text-white py-2.5 px-3 rounded-xl text-xs focus:outline-none focus:border-amber-500"
                    >
                      {formAdjType === 'entrada' ? (
                        <>
                          <option value="Compra">Compra / Reabastecimiento</option>
                          <option value="Devolución">Devolución de Cliente</option>
                          <option value="Ajuste Sobrante">Ajuste de Inventario (Sobrante)</option>
                          <option value="Traspaso Ingreso">Traspaso (Ingreso desde otro local)</option>
                        </>
                      ) : (
                        <>
                          <option value="Venta">Venta / Despacho de Pedido</option>
                          <option value="Merma">Merma / Pérdida (Dañado/Vencido)</option>
                          <option value="Robo">Robo / Extravío</option>
                          <option value="Ajuste Faltante">Ajuste de Inventario (Faltante)</option>
                          <option value="Traspaso Salida">Traspaso (Salida hacia otro local)</option>
                          <option value="Promoción">Promoción / Muestra Gratis</option>
                        </>
                      )}
                    </select>
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setModalOpen(false)} className="flex-1 py-2.5 bg-slate-850 hover:bg-slate-800 rounded-xl text-slate-300 font-bold text-xs uppercase cursor-pointer">
                  Cancelar
                </button>
                <button type="submit" className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-900 font-black text-xs uppercase rounded-xl cursor-pointer">
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
