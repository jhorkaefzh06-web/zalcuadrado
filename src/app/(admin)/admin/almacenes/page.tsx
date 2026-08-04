'use client';

import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Plus, Edit, Trash2, X, AlertTriangle, Check, Loader2, Warehouse, MapPin } from 'lucide-react';

interface WarehouseItem {
  id: string;
  name: string;
  location: string;
  created_at?: string;
}

export default function AdminWarehousesPage() {
  const [warehouses, setWarehouses] = useState<WarehouseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingWarehouse, setEditingWarehouse] = useState<WarehouseItem | null>(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formLocation, setFormLocation] = useState('');

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const fetchWarehouses = async () => {
    setLoading(true);
    setError(null);
    try {
      if (isSupabaseConfigured && supabase) {
        const { data, error: fetchErr } = await supabase
          .from('warehouses')
          .select('*')
          .order('name');
        if (fetchErr) throw fetchErr;
        setWarehouses(data || []);
      } else {
        const stored = localStorage.getItem('z2_mock_warehouses');
        if (stored) {
          setWarehouses(JSON.parse(stored));
        } else {
          const initial: WarehouseItem[] = [
            { id: 'w-1', name: 'Almacén Central - San Isidro', location: 'Av. Javier Prado Este 1250, San Isidro' },
            { id: 'w-2', name: 'Almacén Express - Miraflores', location: 'Calle Larco 450, Miraflores' },
            { id: 'w-3', name: 'Almacén Distribución - Surco', location: 'Av. Caminos del Inca 820, Surco' }
          ];
          setWarehouses(initial);
          localStorage.setItem('z2_mock_warehouses', JSON.stringify(initial));
        }
      }
    } catch (err: any) {
      console.error('Fetch warehouses error:', err);
      setError('Error al cargar almacenes: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingWarehouse(null);
    setFormName('');
    setFormLocation('');
    setModalOpen(true);
  };

  const openEditModal = (w: WarehouseItem) => {
    setEditingWarehouse(w);
    setFormName(w.name);
    setFormLocation(w.location);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const nameTrim = formName.trim();
    const locationTrim = formLocation.trim();

    if (!nameTrim || !locationTrim) {
      setError('Por favor completa todos los campos.');
      return;
    }

    try {
      if (isSupabaseConfigured && supabase) {
        const payload = editingWarehouse 
          ? { id: editingWarehouse.id, name: nameTrim, location: locationTrim }
          : { name: nameTrim, location: locationTrim };

        const { error: saveErr } = await supabase
          .from('warehouses')
          .upsert([payload]);
        
        if (saveErr) throw saveErr;
      } else {
        let updated: WarehouseItem[];
        if (editingWarehouse) {
          updated = warehouses.map(w => w.id === editingWarehouse.id 
            ? { ...w, name: nameTrim, location: locationTrim } 
            : w
          );
        } else {
          const newW: WarehouseItem = {
            id: 'w_' + Math.random().toString(36).substr(2, 9),
            name: nameTrim,
            location: locationTrim
          };
          updated = [...warehouses, newW];
        }
        setWarehouses(updated);
        localStorage.setItem('z2_mock_warehouses', JSON.stringify(updated));
      }

      setSuccess(editingWarehouse ? 'Almacén actualizado correctamente.' : 'Almacén creado con éxito.');
      setModalOpen(false);
      fetchWarehouses();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError('Error al guardar almacén: ' + err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este almacén? Se eliminarán los registros de inventario asociados.')) return;
    setError(null);
    setSuccess(null);

    try {
      if (isSupabaseConfigured && supabase) {
        const { error: delErr } = await supabase
          .from('warehouses')
          .delete()
          .eq('id', id);
        if (delErr) throw delErr;
      } else {
        const updated = warehouses.filter(w => w.id !== id);
        setWarehouses(updated);
        localStorage.setItem('z2_mock_warehouses', JSON.stringify(updated));
      }
      setSuccess('Almacén eliminado con éxito.');
      fetchWarehouses();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError('Error al eliminar almacén: ' + err.message);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide">Mantenedor de Almacenes</h2>
          <p className="text-xs text-slate-400 mt-1">Crea, edita o elimina los locales de almacenamiento físico.</p>
        </div>
        
        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 px-5 py-3 bg-amber-500 hover:bg-amber-400 text-slate-900 font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Agregar Almacén</span>
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

      {/* Warehouses Grid */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-4 bg-slate-900 border border-slate-800 rounded-3xl">
          <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Cargando almacenes...</p>
        </div>
      ) : warehouses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {warehouses.map((w) => (
            <div
              key={w.id}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-start justify-between space-x-3">
                <div className="flex items-center space-x-3 min-w-0">
                  <div className="p-3 bg-slate-950 rounded-2xl text-amber-500 border border-slate-800 shrink-0">
                    <Warehouse className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-white text-sm truncate">{w.name}</h4>
                    <span className="font-mono text-[9px] text-slate-500 uppercase truncate block max-w-[120px]">{w.id}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-1.5 shrink-0">
                  <button
                    onClick={() => openEditModal(w)}
                    className="p-1.5 bg-slate-950 hover:bg-slate-850 border border-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
                    title="Editar"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(w.id)}
                    className="p-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                    title="Eliminar"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="flex items-start gap-2 bg-slate-950/60 p-3.5 border border-slate-850 rounded-2xl">
                <MapPin className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                <span className="text-xs text-slate-300 leading-normal">{w.location}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-10 text-center">
          <p className="text-xs text-slate-400 font-bold">No hay almacenes configurados. Haz clic en "Agregar Almacén" arriba.</p>
        </div>
      )}

      {/* FORM MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <div onClick={() => setModalOpen(false)} className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm cursor-default" />
          <div className="relative max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-2xl z-101">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-sm font-black text-white uppercase tracking-wider">
                {editingWarehouse ? 'Editar Almacén' : 'Nuevo Almacén'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white"><X className="w-4 h-4" /></button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Nombre Almacén *</label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Ej: Almacén Norte"
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-2 px-3 text-xs"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Dirección / Localización *</label>
                <input
                  type="text"
                  value={formLocation}
                  onChange={(e) => setFormLocation(e.target.value)}
                  placeholder="Av. Principal 123, Distrito"
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-2 px-3 text-xs"
                  required
                />
              </div>

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
