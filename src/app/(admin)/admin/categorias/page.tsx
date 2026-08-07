'use client';

import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { CATEGORIES, Category } from '@/lib/mockData';
import { notifyCategoriesChanged } from '@/lib/categoriesStore';
import { Plus, Edit, Trash2, X, AlertTriangle, Check, Loader2, Folder, Grid } from 'lucide-react';

interface Subcategory {
  id: string;
  category_id: string;
  name: string;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Selection for subcategories view
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);

  // Category Modal State
  const [catModalOpen, setCatModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [catId, setCatId] = useState('');
  const [catName, setCatName] = useState('');
  const [catDescription, setCatDescription] = useState('');
  const [catIcon, setCatIcon] = useState('Wine');
  const [catImage, setCatImage] = useState('');

  // Subcategory Modal State
  const [subModalOpen, setSubModalOpen] = useState(false);
  const [editingSub, setEditingSub] = useState<Subcategory | null>(null);
  const [subId, setSubId] = useState('');
  const [subName, setSubName] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      if (isSupabaseConfigured && supabase) {
        // Fetch Categories
        const { data: cats, error: catsErr } = await supabase
          .from('categories')
          .select('*')
          .order('name');
        if (catsErr) throw catsErr;
        setCategories(cats || []);

        // Fetch Subcategories
        const { data: subs, error: subsErr } = await supabase
          .from('subcategories')
          .select('*')
          .order('name');
        if (subsErr) throw subsErr;
        setSubcategories(subs || []);
      } else {
        // Fallback local persistence
        const storedCats = localStorage.getItem('z2_mock_categories');
        const storedSubs = localStorage.getItem('z2_mock_subcategories');
        
        if (storedCats) {
          setCategories(JSON.parse(storedCats));
        } else {
          setCategories(CATEGORIES);
          localStorage.setItem('z2_mock_categories', JSON.stringify(CATEGORIES));
        }

        const initialSubs: Subcategory[] = [
          { id: 'licores', category_id: 'bebidas', name: 'Licores' },
          { id: 'vinos', category_id: 'bebidas', name: 'Vinos' },
          { id: 'espumantes', category_id: 'bebidas', name: 'Espumantes' },
          { id: 'cervezas', category_id: 'bebidas', name: 'Cervezas' },
        ];
        if (storedSubs) {
          setSubcategories(JSON.parse(storedSubs));
        } else {
          setSubcategories(initialSubs);
          localStorage.setItem('z2_mock_subcategories', JSON.stringify(initialSubs));
        }
      }
    } catch (err: any) {
      console.error('Fetch categories/subs error:', err);
      setError('Error al cargar datos: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // CATEGORY OPERATIONS
  const openAddCatModal = () => {
    setEditingCategory(null);
    setCatId('cat_' + Math.random().toString(36).substr(2, 9));
    setCatName('');
    setCatDescription('');
    setCatIcon('Wine');
    setCatImage('https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=800&auto=format&fit=crop');
    setCatModalOpen(true);
  };

  const openEditCatModal = (c: Category) => {
    setEditingCategory(c);
    setCatId(c.id);
    setCatName(c.name);
    setCatDescription(c.description);
    setCatIcon(c.icon);
    setCatImage(c.image);
    setCatModalOpen(true);
  };

  const handleSaveCat = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const payload = {
      id: catId.trim(),
      name: catName.trim(),
      description: catDescription.trim(),
      icon: catIcon,
      image: catImage.trim()
    };

    if (!payload.id || !payload.name) {
      setError('Por favor llena los campos obligatorios.');
      return;
    }

    try {
      if (isSupabaseConfigured && supabase) {
        const { error: saveErr } = await supabase
          .from('categories')
          .upsert([payload]);
        if (saveErr) throw saveErr;
      } else {
        let updated: Category[];
        if (editingCategory) {
          updated = categories.map(c => c.id === payload.id ? payload : c);
        } else {
          updated = [...categories, payload];
        }
        setCategories(updated);
        localStorage.setItem('z2_mock_categories', JSON.stringify(updated));
      }

      setSuccess(editingCategory ? 'Categoría actualizada.' : 'Categoría creada con éxito.');
      setCatModalOpen(false);
      fetchData();
      notifyCategoriesChanged();
      setActiveCategory(null);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError('Error al guardar categoría: ' + err.message);
    }
  };

  const handleDeleteCat = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta categoría? También se eliminarán las subcategorías y productos asociados.')) return;
    setError(null);
    setSuccess(null);

    try {
      if (isSupabaseConfigured && supabase) {
        const { error: delErr } = await supabase
          .from('categories')
          .delete()
          .eq('id', id);
        if (delErr) throw delErr;
      } else {
        const updated = categories.filter(c => c.id !== id);
        const updatedSubs = subcategories.filter(s => s.category_id !== id);
        setCategories(updated);
        setSubcategories(updatedSubs);
        localStorage.setItem('z2_mock_categories', JSON.stringify(updated));
        localStorage.setItem('z2_mock_subcategories', JSON.stringify(updatedSubs));
      }
      setSuccess('Categoría eliminada.');
      fetchData();
      notifyCategoriesChanged();
      setActiveCategory(null);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError('Error al eliminar categoría: ' + err.message);
    }
  };


  // SUBCATEGORY OPERATIONS
  const openAddSubModal = () => {
    if (!activeCategory) return;
    setEditingSub(null);
    setSubId('sub_' + Math.random().toString(36).substr(2, 9));
    setSubName('');
    setSubModalOpen(true);
  };

  const openEditSubModal = (s: Subcategory) => {
    setEditingSub(s);
    setSubId(s.id);
    setSubName(s.name);
    setSubModalOpen(true);
  };

  const handleSaveSub = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCategory) return;
    setError(null);
    setSuccess(null);

    const payload = {
      id: subId.trim(),
      category_id: activeCategory.id,
      name: subName.trim()
    };

    if (!payload.id || !payload.name) {
      setError('Por favor llena los campos obligatorios.');
      return;
    }

    try {
      if (isSupabaseConfigured && supabase) {
        const { error: saveErr } = await supabase
          .from('subcategories')
          .upsert([payload]);
        if (saveErr) throw saveErr;
      } else {
        let updated: Subcategory[];
        if (editingSub) {
          updated = subcategories.map(s => s.id === payload.id ? payload : s);
        } else {
          updated = [...subcategories, payload];
        }
        setSubcategories(updated);
        localStorage.setItem('z2_mock_subcategories', JSON.stringify(updated));
      }

      setSuccess(editingSub ? 'Subcategoría actualizada.' : 'Subcategoría agregada con éxito.');
      setSubModalOpen(false);
      fetchData();
      notifyCategoriesChanged();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError('Error al guardar subcategoría: ' + err.message);
    }
  };

  const handleDeleteSub = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta subcategoría?')) return;
    setError(null);
    setSuccess(null);

    try {
      if (isSupabaseConfigured && supabase) {
        const { error: delErr } = await supabase
          .from('subcategories')
          .delete()
          .eq('id', id);
        if (delErr) throw delErr;
      } else {
        const updated = subcategories.filter(s => s.id !== id);
        setSubcategories(updated);
        localStorage.setItem('z2_mock_subcategories', JSON.stringify(updated));
      }
      setSuccess('Subcategoría eliminada.');
      fetchData();
      notifyCategoriesChanged();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError('Error al eliminar subcategoría: ' + err.message);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide">Mantenedor de Categorías y Subcategorías</h2>
          <p className="text-xs text-slate-400 mt-1">Administra las categorías y subcategorías que dividen tu inventario.</p>
        </div>
        
        <button
          onClick={openAddCatModal}
          className="flex items-center justify-center gap-2 px-5 py-3 bg-amber-500 hover:bg-amber-400 text-slate-900 font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Agregar Categoría</span>
        </button>
      </div>

      {/* Success / Error Alerts */}
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

      {/* Layout Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Categories List */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Categorías Principales</h3>
          
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-4 bg-slate-900 border border-slate-800 rounded-3xl">
              <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Cargando...</p>
            </div>
          ) : categories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categories.map((c) => {
                const subCount = subcategories.filter(s => s.category_id === c.id).length;
                const isSelected = activeCategory?.id === c.id;

                return (
                  <div
                    key={c.id}
                    onClick={() => setActiveCategory(c)}
                    className={`bg-slate-900 border rounded-3xl overflow-hidden p-5 flex flex-col justify-between space-y-4 cursor-pointer hover:border-slate-700 transition-colors ${
                      isSelected ? 'border-amber-500/80 ring-2 ring-amber-500/20' : 'border-slate-800'
                    }`}
                  >
                    <div className="flex items-start justify-between space-x-3">
                      <div className="flex items-center space-x-3 min-w-0">
                        <div className="p-3 bg-slate-950 rounded-2xl text-amber-500 border border-slate-800 shrink-0">
                          <Folder className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-white text-sm truncate">{c.name}</h4>
                          <span className="font-mono text-[9px] text-slate-500 uppercase">{c.id}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => openEditCatModal(c)}
                          className="p-1.5 bg-slate-950 hover:bg-slate-850 border border-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
                          title="Editar"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteCat(c.id)}
                          className="p-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg text-red-400 hover:text-red-300 transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-slate-400 line-clamp-2 h-8 leading-relaxed">{c.description}</p>
                    
                    <div className="pt-3 border-t border-slate-850 flex items-center justify-between text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                      <span>{subCount} subcategorías</span>
                      <span className="text-amber-500 font-extrabold hover:underline">Ver detalles &rarr;</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-10 text-center">
              <p className="text-xs text-slate-400 font-bold">No hay categorías configuradas.</p>
            </div>
          )}
        </div>

        {/* Right Column: Subcategories CRUD Card */}
        <div className="space-y-4">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Detalle Subcategorías</h3>

          {activeCategory ? (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-lg">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h4 className="font-bold text-white text-sm">Sub-ítems: {activeCategory.name}</h4>
                  <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">Adminstrar subcategorías</p>
                </div>
                <button
                  onClick={openAddSubModal}
                  className="flex items-center gap-1.5 px-3 py-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-black text-[10px] uppercase rounded-xl cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Agregar</span>
                </button>
              </div>

              {/* Subcategories list */}
              <div className="space-y-2">
                {subcategories.filter(s => s.category_id === activeCategory.id).length > 0 ? (
                  subcategories
                    .filter(s => s.category_id === activeCategory.id)
                    .map((sub) => (
                      <div
                        key={sub.id}
                        className="bg-slate-950 border border-slate-850/80 rounded-xl p-3 flex items-center justify-between"
                      >
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-white truncate">{sub.name}</p>
                          <span className="font-mono text-[9px] text-slate-500 uppercase">{sub.id}</span>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-1 shrink-0">
                          <button
                            onClick={() => openEditSubModal(sub)}
                            className="p-1.5 bg-slate-900 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
                          >
                            <Edit className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleDeleteSub(sub.id)}
                            className="p-1.5 bg-red-500/10 hover:bg-red-500/20 rounded-lg text-red-400 hover:text-red-350 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="text-center py-8 text-slate-500 text-xs">
                    No hay subcategorías en esta categoría. Haz clic en "Agregar" arriba.
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-slate-900/60 border border-slate-800 border-dashed rounded-3xl p-10 text-center text-xs text-slate-400">
              Selecciona una categoría de la lista izquierda para administrar sus subcategorías.
            </div>
          )}
        </div>
      </div>

      {/* CATEGORY FORM MODAL */}
      {catModalOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <div onClick={() => setCatModalOpen(false)} className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm cursor-default" />
          <div className="relative max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-2xl z-101">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-sm font-black text-white uppercase tracking-wider">
                {editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}
              </h3>
              <button onClick={() => setCatModalOpen(false)} className="text-slate-400 hover:text-white"><X className="w-4 h-4" /></button>
            </div>

            <form onSubmit={handleSaveCat} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Código ID *</label>
                <input
                  type="text"
                  value={catId}
                  onChange={(e) => setCatId(e.target.value)}
                  disabled={!!editingCategory}
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-2 px-3 text-xs disabled:opacity-50"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Nombre *</label>
                <input
                  type="text"
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-2 px-3 text-xs"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Descripción</label>
                <textarea
                  value={catDescription}
                  onChange={(e) => setCatDescription(e.target.value)}
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-2 px-3 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Enlace de Imagen</label>
                <input
                  type="text"
                  value={catImage}
                  onChange={(e) => setCatImage(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-2 px-3 text-xs"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setCatModalOpen(false)} className="flex-1 py-2.5 bg-slate-850 hover:bg-slate-800 rounded-xl text-slate-300 font-bold text-xs uppercase cursor-pointer">
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

      {/* SUBCATEGORY FORM MODAL */}
      {subModalOpen && activeCategory && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <div onClick={() => setSubModalOpen(false)} className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm cursor-default" />
          <div className="relative max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-2xl z-101">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-sm font-black text-white uppercase tracking-wider">
                {editingSub ? 'Editar Subcategoría' : 'Nueva Subcategoría'}
              </h3>
              <button onClick={() => setSubModalOpen(false)} className="text-slate-400 hover:text-white"><X className="w-4 h-4" /></button>
            </div>

            <form onSubmit={handleSaveSub} className="space-y-4">
              <div className="p-3 bg-slate-950 border border-slate-850 rounded-xl text-xs">
                <span className="text-slate-500 font-bold">Vinculado a: </span>
                <span className="text-amber-500 font-black">{activeCategory.name}</span>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Código ID (Sub) *</label>
                <input
                  type="text"
                  value={subId}
                  onChange={(e) => setSubId(e.target.value)}
                  disabled={!!editingSub}
                  placeholder="Ej: rones"
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-2 px-3 text-xs disabled:opacity-50"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Nombre Subcategoría *</label>
                <input
                  type="text"
                  value={subName}
                  onChange={(e) => setSubName(e.target.value)}
                  placeholder="Ej: Ron Añejo"
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-2 px-3 text-xs"
                  required
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setSubModalOpen(false)} className="flex-1 py-2.5 bg-slate-850 hover:bg-slate-800 rounded-xl text-slate-300 font-bold text-xs uppercase cursor-pointer">
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
