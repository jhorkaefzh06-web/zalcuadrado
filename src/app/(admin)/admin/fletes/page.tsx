'use client';

import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Plus, Edit, Trash2, X, AlertTriangle, Check, Loader2, Truck, MapPin } from 'lucide-react';

interface ShippingRate {
  id: string;
  department: string;
  province: string;
  district: string;
  cost: number;
  created_at?: string;
}

export default function AdminShippingRatesPage() {
  const [rates, setRates] = useState<ShippingRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Search filter
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRate, setEditingRate] = useState<ShippingRate | null>(null);

  // Form State
  const [formDepartment, setFormDepartment] = useState('Lima');
  const [formProvince, setFormProvince] = useState('Lima');
  const [formDistrict, setFormDistrict] = useState('');
  const [formCost, setFormCost] = useState(0);

  useEffect(() => {
    fetchRates();
  }, []);

  const fetchRates = async () => {
    setLoading(true);
    setError(null);
    try {
      if (isSupabaseConfigured && supabase) {
        const { data, error: fetchErr } = await supabase
          .from('shipping_rates')
          .select('*')
          .order('district');
        if (fetchErr) throw fetchErr;
        setRates(data || []);
      } else {
        const stored = localStorage.getItem('z2_mock_shipping_rates');
        if (stored) {
          setRates(JSON.parse(stored));
        } else {
          const initial: ShippingRate[] = [
            { id: 'sr-1', department: 'Lima', province: 'Lima', district: 'San Isidro', cost: 10.00 },
            { id: 'sr-2', department: 'Lima', province: 'Lima', district: 'Miraflores', cost: 12.00 },
            { id: 'sr-3', department: 'Lima', province: 'Lima', district: 'Santiago de Surco', cost: 12.00 },
            { id: 'sr-4', department: 'Lima', province: 'Lima', district: 'La Molina', cost: 15.00 },
            { id: 'sr-5', department: 'Lima', province: 'Lima', district: 'San Borja', cost: 11.00 },
          ];
          setRates(initial);
          localStorage.setItem('z2_mock_shipping_rates', JSON.stringify(initial));
        }
      }
    } catch (err: any) {
      console.error('Fetch rates error:', err);
      setError('Error al cargar fletes: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingRate(null);
    setFormDepartment('Lima');
    setFormProvince('Lima');
    setFormDistrict('');
    setFormCost(10.00);
    setModalOpen(true);
  };

  const openEditModal = (sr: ShippingRate) => {
    setEditingRate(sr);
    setFormDepartment(sr.department);
    setFormProvince(sr.province);
    setFormDistrict(sr.district);
    setFormCost(sr.cost);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const deptTrim = formDepartment.trim();
    const provTrim = formProvince.trim();
    const distTrim = formDistrict.trim();
    const costVal = Number(formCost);

    if (!deptTrim || !provTrim || !distTrim || costVal < 0) {
      setError('Por favor completa todos los campos con valores válidos.');
      return;
    }

    try {
      if (isSupabaseConfigured && supabase) {
        const payload = editingRate
          ? { id: editingRate.id, department: deptTrim, province: provTrim, district: distTrim, cost: costVal }
          : { department: deptTrim, province: provTrim, district: distTrim, cost: costVal };

        const { error: saveErr } = await supabase
          .from('shipping_rates')
          .upsert([payload]);
        
        if (saveErr) throw saveErr;
      } else {
        let updated: ShippingRate[];
        if (editingRate) {
          updated = rates.map(sr => sr.id === editingRate.id
            ? { ...sr, department: deptTrim, province: provTrim, district: distTrim, cost: costVal }
            : sr
          );
        } else {
          // Check duplicates
          const exists = rates.find(r => r.district.toLowerCase() === distTrim.toLowerCase() && r.province.toLowerCase() === provTrim.toLowerCase());
          if (exists) {
            setError('Ya existe un flete configurado para este distrito.');
            return;
          }

          const newSr: ShippingRate = {
            id: 'sr_' + Math.random().toString(36).substr(2, 9),
            department: deptTrim,
            province: provTrim,
            district: distTrim,
            cost: costVal
          };
          updated = [...rates, newSr];
        }
        setRates(updated);
        localStorage.setItem('z2_mock_shipping_rates', JSON.stringify(updated));
      }

      setSuccess(editingRate ? 'Flete actualizado correctamente.' : 'Flete creado con éxito.');
      setModalOpen(false);
      fetchRates();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError('Error al guardar flete: ' + err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta tarifa de flete?')) return;
    setError(null);
    setSuccess(null);

    try {
      if (isSupabaseConfigured && supabase) {
        const { error: delErr } = await supabase
          .from('shipping_rates')
          .delete()
          .eq('id', id);
        if (delErr) throw delErr;
      } else {
        const updated = rates.filter(sr => sr.id !== id);
        setRates(updated);
        localStorage.setItem('z2_mock_shipping_rates', JSON.stringify(updated));
      }
      setSuccess('Tarifa de flete eliminada.');
      fetchRates();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError('Error al eliminar tarifa: ' + err.message);
    }
  };

  const filteredRates = rates.filter(sr => {
    const term = searchQuery.toLowerCase();
    return sr.district.toLowerCase().includes(term) ||
      sr.province.toLowerCase().includes(term) ||
      sr.department.toLowerCase().includes(term);
  });

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide">Mantenedor de Fletes</h2>
          <p className="text-xs text-slate-400 mt-1">Configura las tarifas de envío (delivery) por Departamento, Provincia y Distrito.</p>
        </div>
        
        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 px-5 py-3 bg-amber-500 hover:bg-amber-400 text-slate-900 font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Configurar Tarifa</span>
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

      {/* Search Filter bar */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por distrito, provincia o departamento..."
            className="w-full bg-slate-950 border border-slate-800 text-white pl-10 pr-4 py-2.5 rounded-xl text-xs focus:outline-none focus:border-amber-500 transition-colors"
          />
          <MapPin className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
        </div>
      </div>

      {/* Shipping Rates Table Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-4">
            <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Cargando tarifas...</p>
          </div>
        ) : filteredRates.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest bg-slate-900/55">
                  <th className="py-4 pl-6">Departamento</th>
                  <th className="py-4">Provincia</th>
                  <th className="py-4">Distrito</th>
                  <th className="py-4 text-right">Costo Delivery</th>
                  <th className="py-4 text-center pr-6">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40 text-xs">
                {filteredRates.map((sr) => (
                  <tr key={sr.id} className="hover:bg-slate-850/30 transition-colors">
                    <td className="py-4 pl-6 font-bold text-white">{sr.department}</td>
                    <td className="py-4 text-slate-300">{sr.province}</td>
                    <td className="py-4 font-bold text-slate-200">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-500" />
                        {sr.district}
                      </div>
                    </td>
                    <td className="py-4 text-right font-black text-amber-500">S/ {sr.cost.toFixed(2)}</td>
                    <td className="py-4 text-center pr-6">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => openEditModal(sr)}
                          className="p-2 bg-slate-800 hover:bg-slate-700 border border-slate-700/60 rounded-lg text-slate-300 hover:text-white transition-colors cursor-pointer"
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(sr.id)}
                          className="p-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 text-center space-y-2">
            <Truck className="w-8 h-8 text-slate-600 mx-auto" />
            <p className="text-xs font-bold text-white">No hay fletes registrados.</p>
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
                {editingRate ? 'Editar Tarifa de Flete' : 'Nueva Tarifa de Flete'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white"><X className="w-4 h-4" /></button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Departamento *</label>
                <input
                  type="text"
                  value={formDepartment}
                  onChange={(e) => setFormDepartment(e.target.value)}
                  placeholder="Ej: Lima"
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-2 px-3 text-xs"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Provincia *</label>
                <input
                  type="text"
                  value={formProvince}
                  onChange={(e) => setFormProvince(e.target.value)}
                  placeholder="Ej: Lima"
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-2 px-3 text-xs"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Distrito *</label>
                <input
                  type="text"
                  value={formDistrict}
                  onChange={(e) => setFormDistrict(e.target.value)}
                  placeholder="Ej: Miraflores"
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-2 px-3 text-xs"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Costo de Delivery (S/) *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formCost}
                  onChange={(e) => setFormCost(Number(e.target.value))}
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
