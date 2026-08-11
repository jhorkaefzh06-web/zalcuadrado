'use client';

import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { PRODUCTS, Product } from '@/lib/mockData';
import { useCategories } from '@/hooks/useCategories';
import { notifyProductsChanged } from '@/lib/productsStore';
import { Search, Plus, Edit, Trash2, X, AlertTriangle, Check, Loader2, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const { categories } = useCategories();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('todos');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [formId, setFormId] = useState('');
  const [formName, setFormName] = useState('');
  const [formBrand, setFormBrand] = useState('');
  const [formPrice, setFormPrice] = useState(0);
  const [formCategory, setFormCategory] = useState('bebidas');
  const [formDescription, setFormDescription] = useState('');
  const [formImage, setFormImage] = useState('');

  const [formIsPromo, setFormIsPromo] = useState(false);
  const [formPromoPrice, setFormPromoPrice] = useState(0);
  const [formFeatures, setFormFeatures] = useState<string[]>([]);
  const [featureInput, setFeatureInput] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formCountInStock, setFormCountInStock] = useState(10);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setError(null);
    setSuccess(null);
    setUploadingImage(true);

    const file = files[0];
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Fallo al subir la imagen');
      }

      if (data.url) {
        setFormImage(data.url);
        setSuccess('Imagen de portada subida y cargada con éxito.');
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err: any) {
      console.error('File upload error:', err);
      setError('Fallo al subir archivo: ' + err.message);
    } finally {
      setUploadingImage(false);
      e.target.value = '';
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      if (isSupabaseConfigured && supabase) {
        const { data, error: fetchErr } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (fetchErr) throw fetchErr;

        // Map column names to camelCase for match with mock types
        const mapped = (data || []).map((p: any) => ({
          id: p.id,
          name: p.name,
          price: Number(p.price),
          description: p.description,
          category: p.category,
          image: p.image,
          rating: Number(p.rating),
          brand: p.brand,
          features: p.features || [],
          isPromo: p.is_promo,
          promoPrice: p.promo_price ? Number(p.promo_price) : undefined,
          countInStock: p.count_in_stock !== undefined ? Number(p.count_in_stock) : 10,
        }));
        setProducts(mapped);
      } else {
        // Fallback local mock persistence
        const stored = localStorage.getItem('z2_mock_products');
        if (stored) {
          setProducts(JSON.parse(stored));
        } else {
          setProducts(PRODUCTS);
          localStorage.setItem('z2_mock_products', JSON.stringify(PRODUCTS));
        }
      }
    } catch (err: any) {
      console.error('Fetch products error:', err);
      setError('No se pudieron cargar los productos: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setFormId('p_' + Math.random().toString(36).substr(2, 9));
    setFormName('');
    setFormBrand('');
    setFormPrice(0);
    setFormCategory('bebidas');
    setFormDescription('');
    setFormImage('https://images.unsplash.com/photo-1527281400683-1aae777175f8?q=80&w=600&auto=format&fit=crop');
    setFormIsPromo(false);
    setFormPromoPrice(0);
    setFormFeatures([]);
    setFeatureInput('');
    setFormCountInStock(10);
    setModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormId(product.id);
    setFormName(product.name);
    setFormBrand(product.brand);
    setFormPrice(product.price);
    setFormCategory(product.category);
    setFormDescription(product.description);
    setFormImage(product.image);

    setFormIsPromo(product.isPromo);
    setFormPromoPrice(product.promoPrice || 0);
    setFormFeatures(product.features || []);
    setFeatureInput('');
    setFormCountInStock(product.countInStock !== undefined ? product.countInStock : 10);
    setModalOpen(true);
  };

  const addFeature = () => {
    if (featureInput.trim()) {
      setFormFeatures([...formFeatures, featureInput.trim()]);
      setFeatureInput('');
    }
  };

  const removeFeature = (idx: number) => {
    setFormFeatures(formFeatures.filter((_, i) => i !== idx));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const payload = {
      id: formId,
      name: formName.trim(),
      brand: formBrand.trim(),
      price: Number(formPrice),
      category: formCategory,
      description: formDescription.trim(),
      image: formImage.trim(),
      rating: editingProduct ? editingProduct.rating : 5.0,
      features: formFeatures,
      isPromo: formIsPromo,
      promoPrice: formIsPromo ? Number(formPromoPrice) : undefined,
      countInStock: Number(formCountInStock)
    };

    if (!payload.name || !payload.brand || payload.price <= 0) {
      setError('Por favor completa los campos obligatorios y define un precio válido.');
      return;
    }

    try {
      if (isSupabaseConfigured && supabase) {
        // Map camelCase to Postgres snake_case column names
        const dbPayload = {
          id: payload.id,
          name: payload.name,
          brand: payload.brand,
          price: payload.price,
          category: payload.category,
          description: payload.description,
          image: payload.image,
          rating: payload.rating,
          features: payload.features,
          is_promo: payload.isPromo,
          promo_price: payload.promoPrice,
          count_in_stock: payload.countInStock
        };

        const { error: saveErr } = await supabase
          .from('products')
          .upsert([dbPayload]);

        if (saveErr) throw saveErr;

        // Sync inventory table and log movement
        try {
          let oldStock = 0;
          let warehouseId = '';

          // 1. Fetch current stock in inventory
          const { data: invRows } = await supabase
            .from('inventory')
            .select('stock, warehouse_id')
            .eq('product_id', payload.id);

          if (invRows && invRows.length > 0) {
            oldStock = Number(invRows[0].stock || 0);
            warehouseId = invRows[0].warehouse_id;
          }

          // 2. Fetch warehouse id if not found
          if (!warehouseId) {
            const { data: whRows } = await supabase
              .from('warehouses')
              .select('id')
              .limit(1);
            if (whRows && whRows.length > 0) {
              warehouseId = whRows[0].id;
            }
          }

          if (warehouseId) {
            const newStock = payload.countInStock;
            const diff = newStock - oldStock;

            if (diff !== 0) {
              // Direct insert to stock_movements. Database trigger updates the inventory table!
              const { error: movErr } = await supabase
                .from('stock_movements')
                .insert([{
                  product_id: payload.id,
                  warehouse_id: warehouseId,
                  type: diff > 0 ? 'entrada' : 'salida',
                  quantity: Math.abs(diff),
                  reason: 'Ajuste desde Administrador'
                }]);
              
              if (movErr) console.error('Error inserting stock movement:', movErr);
            }
          }
        } catch (syncErr) {
          console.error('Error syncing stock/inventory:', syncErr);
        }
      } else {
        // Mock save
        let updated: Product[];
        if (editingProduct) {
          updated = products.map(p => p.id === payload.id ? { ...payload, countInStock: payload.countInStock } : p);
        } else {
          updated = [{ ...payload, countInStock: payload.countInStock }, ...products];
        }
        setProducts(updated);
        localStorage.setItem('z2_mock_products', JSON.stringify(updated));

        // Sync mock inventory
        try {
          const storedInv = localStorage.getItem('z2_mock_inventory');
          let inventoryList = storedInv ? JSON.parse(storedInv) : [];
          const invIndex = inventoryList.findIndex((i: any) => i.product_id === payload.id);
          if (invIndex > -1) {
            inventoryList[invIndex].stock = payload.countInStock;
          } else {
            const storedWhs = localStorage.getItem('z2_mock_warehouses');
            const whs = storedWhs ? JSON.parse(storedWhs) : [];
            if (whs.length > 0) {
              inventoryList.push({
                id: 'inv_' + Math.random().toString(36).substr(2, 9),
                product_id: payload.id,
                warehouse_id: whs[0].id,
                stock: payload.countInStock
              });
            }
          }
          localStorage.setItem('z2_mock_inventory', JSON.stringify(inventoryList));
        } catch (e) {
          console.error('Error syncing mock inventory:', e);
        }
      }

      setSuccess(editingProduct ? 'Producto actualizado correctamente.' : 'Producto creado con éxito.');
      setModalOpen(false);
      notifyProductsChanged();
      fetchProducts();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      console.error('Error saving product:', err);
      setError('No se pudo guardar el producto: ' + err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;
    setError(null);
    setSuccess(null);

    try {
      if (isSupabaseConfigured && supabase) {
        const { error: delErr } = await supabase
          .from('products')
          .delete()
          .eq('id', id);

        if (delErr) throw delErr;
      } else {
        const updated = products.filter(p => p.id !== id);
        setProducts(updated);
        localStorage.setItem('z2_mock_products', JSON.stringify(updated));
      }
      setSuccess('Producto eliminado con éxito.');
      notifyProductsChanged();
      fetchProducts();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      console.error('Error deleting product:', err);
      setError('No se pudo eliminar el producto: ' + err.message);
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesTab = true;
    if (activeTab === 'promociones') {
      matchesTab = p.isPromo === true;
    } else if (activeTab !== 'todos') {
      const catId = p.category?.toLowerCase();
      if (activeTab === 'licores') {
        matchesTab = catId === 'licores' || catId === 'bebidas';
      } else if (activeTab === 'hielo') {
        matchesTab = catId === 'hielo' || catId === 'hielos';
      } else {
        matchesTab = catId === activeTab;
      }
    }

    return matchesSearch && matchesTab;
  });

  const getProductGroups = (productList: Product[]) => {
    const groups: { id: string; name: string; products: Product[] }[] = [];
    
    // Group 1: Promociones
    groups.push({ id: 'promociones', name: '⚡ Promociones', products: [] });

    // Group 2: Categories from DB
    categories.forEach(cat => {
      let emoji = '📦';
      const idLower = cat.id.toLowerCase();
      if (idLower.includes('licor')) emoji = '🥃';
      else if (idLower.includes('vin')) emoji = '🍷';
      else if (idLower.includes('cerve')) emoji = '🍺';
      else if (idLower.includes('hiel')) emoji = '💎';
      else if (idLower.includes('cigarr')) emoji = '🚬';
      else if (idLower.includes('gaseos') || idLower.includes('soda') || idLower.includes('bebida')) emoji = '🥤';

      groups.push({
        id: cat.id,
        name: `${emoji} ${cat.name}`,
        products: []
      });
    });

    // Group 3: Otros
    groups.push({ id: 'otros', name: '📦 Otros', products: [] });

    productList.forEach(p => {
      if (p.isPromo) {
        groups[0].products.push(p);
      } else {
        const catId = p.category?.toLowerCase() || '';
        let targetGroup = groups.find(g => g.id.toLowerCase() === catId);
        if (!targetGroup) {
          if (catId === 'bebidas') targetGroup = groups.find(g => g.id.toLowerCase() === 'licores');
          else if (catId === 'hielos') targetGroup = groups.find(g => g.id.toLowerCase() === 'hielo');
        }
        
        if (targetGroup) {
          targetGroup.products.push(p);
        } else {
          groups[groups.length - 1].products.push(p);
        }
      }
    });

    return groups.filter(g => g.products.length > 0);
  };

  const productGroups = getProductGroups(filteredProducts);

  const tabs = [
    { id: 'todos', name: 'Todos' },
    { id: 'promociones', name: '⚡ Promociones' },
    ...categories
      .filter(c => c.id !== 'bebidas')
      .map(c => {
        let emoji = '📦';
        const idLower = c.id.toLowerCase();
        if (idLower.includes('licor')) emoji = '🥃';
        else if (idLower.includes('vin')) emoji = '🍷';
        else if (idLower.includes('cerve')) emoji = '🍺';
        else if (idLower.includes('hiel')) emoji = '💎';
        else if (idLower.includes('cigarr')) emoji = '🚬';
        else if (idLower.includes('gaseos') || idLower.includes('soda') || idLower.includes('bebida')) emoji = '🥤';
        
        return {
          id: c.id,
          name: `${emoji} ${c.name}`
        };
      })
  ];

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide">Mantenedor de Productos</h2>
          <p className="text-xs text-slate-400 mt-1">Crea, edita o elimina productos del catálogo general.</p>
        </div>
        
        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 px-5 py-3 bg-amber-500 hover:bg-amber-400 text-slate-900 font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Agregar Producto</span>
        </button>
      </div>

      {/* Success / Error Alerts */}
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

      {/* Filters & Tabs Bar */}
      <div className="space-y-4">
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por nombre, marca o ID..."
            className="w-full bg-slate-900 border border-slate-800 text-white pl-10 pr-4 py-3 rounded-2xl text-xs focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all duration-200"
          />
          <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
        </div>

        {/* Category Tabs */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
          {tabs.map(tab => {
            const count = tab.id === 'todos' 
              ? products.length 
              : tab.id === 'promociones' 
                ? products.filter(p => p.isPromo).length 
                : products.filter(p => {
                    const catId = p.category?.toLowerCase();
                    if (tab.id === 'licores') return catId === 'licores' || catId === 'bebidas';
                    if (tab.id === 'hielo') return catId === 'hielo' || catId === 'hielos';
                    return catId === tab.id;
                  }).length;
            
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer shrink-0 border ${
                  isActive
                    ? 'bg-amber-500 border-amber-500 text-slate-900 shadow-md shadow-amber-500/10'
                    : 'bg-slate-900 hover:bg-slate-850 border-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                <span>{tab.name}</span>
                <span className={`px-1.5 py-0.5 rounded-md text-[9px] font-black ${
                  isActive ? 'bg-slate-900/15 text-slate-900' : 'bg-slate-950 text-slate-400'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Products Table Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-4">
            <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Cargando productos...</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest bg-slate-900/55">
                  <th className="py-4 pl-6">Imagen / ID</th>
                  <th className="py-4">Nombre / Marca</th>
                  <th className="py-4 text-center">Categoría</th>
                  <th className="py-4 text-right">Precio</th>
                  <th className="py-4 text-center pr-6">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40 text-xs">
                {productGroups.map((group) => (
                  <React.Fragment key={group.id}>
                    {/* Category Divider Header Row */}
                    <tr className="bg-slate-950/60 border-y border-slate-800/80">
                      <td colSpan={5} className="py-2.5 pl-6 text-[10px] font-extrabold text-amber-500 uppercase tracking-widest">
                        <div className="flex items-center space-x-2">
                          <span>{group.name}</span>
                          <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-[9px] text-slate-400 font-black">
                            {group.products.length}
                          </span>
                        </div>
                      </td>
                    </tr>
                    
                    {/* Products of this category */}
                    {group.products.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-850/30 transition-colors">
                        <td className="py-4 pl-6">
                          <div className="flex items-center space-x-3">
                            <img src={p.image} alt={p.name} className="w-11 h-11 object-cover rounded-xl border border-slate-800 shrink-0" />
                            <span className="font-mono text-[10px] text-slate-500">{p.id}</span>
                          </div>
                        </td>
                        <td className="py-4">
                          <div>
                            <p className="font-bold text-white leading-normal">{p.name}</p>
                            <p className="text-[9px] font-black text-amber-500/80 uppercase tracking-wide mt-0.5">{p.brand}</p>
                          </div>
                        </td>
                        <td className="py-4 text-center">
                          <span className="inline-block px-2.5 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-[9px] font-bold uppercase text-slate-300">
                            {p.category}
                          </span>
                        </td>
                        <td className="py-4 text-right font-bold text-white">
                          {p.isPromo && p.promoPrice ? (
                            <div className="text-right">
                              <span className="text-[10px] line-through text-slate-500 block">S/ {p.price.toFixed(2)}</span>
                              <span className="text-amber-500">S/ {p.promoPrice.toFixed(2)}</span>
                            </div>
                          ) : (
                            <span>S/ {p.price.toFixed(2)}</span>
                          )}
                        </td>
                        <td className="py-4 text-center pr-6">
                          <div className="flex items-center justify-center space-x-2">
                            <Link
                              href={`/admin/productos/editar/${p.id}`}
                              className="p-2 bg-slate-800 hover:bg-slate-700 border border-slate-700/60 rounded-lg text-slate-300 hover:text-white transition-colors cursor-pointer"
                              title="Editar"
                            >
                              <Edit className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => handleDelete(p.id)}
                              className="p-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                              title="Eliminar"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 text-center space-y-2">
            <p className="text-sm font-bold text-white">No se encontraron productos</p>
            <p className="text-xs text-slate-400">Prueba ajustando tus parámetros de búsqueda o filtros.</p>
          </div>
        )}
      </div>

      {/* Add / Edit Slide-over Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-100 flex justify-end">
          {/* Backdrop */}
          <div
            onClick={() => setModalOpen(false)}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm cursor-default"
          />

          {/* Form Card Content */}
          <div className="relative w-full max-w-xl bg-slate-900 border-l border-slate-800 h-full flex flex-col p-6 overflow-y-auto space-y-6 shadow-2xl z-101">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-black text-white">{editingProduct ? 'Editar Producto' : 'Crear Producto'}</h3>
                <p className="text-[10px] text-slate-400 font-medium">Define los campos obligatorios del producto.</p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 rounded-lg bg-slate-850 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSave} className="flex-grow space-y-4 pb-6">
              
              {/* Product ID */}
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">ID del Producto (Código)</label>
                <input
                  type="text"
                  value={formId}
                  onChange={(e) => setFormId(e.target.value)}
                  disabled={!!editingProduct}
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-2.5 px-4 text-xs font-mono disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Product Name */}
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Nombre del Producto *</label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Whisky Red Label 1L"
                    className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-2.5 px-4 text-xs focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>

                {/* Brand */}
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Marca *</label>
                  <input
                    type="text"
                    value={formBrand}
                    onChange={(e) => setFormBrand(e.target.value)}
                    placeholder="Johnnie Walker"
                    className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-2.5 px-4 text-xs focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {/* Price */}
                <div className="space-y-1 col-span-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Precio *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-2.5 px-4 text-xs focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>

                {/* Stock */}
                <div className="space-y-1 col-span-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Stock *</label>
                  <input
                    type="number"
                    value={formCountInStock}
                    onChange={(e) => setFormCountInStock(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-2.5 px-4 text-xs focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>

                {/* Category */}
                <div className="space-y-1 col-span-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Categoría</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-white py-2.5 px-3 rounded-xl text-xs focus:outline-none focus:border-amber-500"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Promo Toggles */}
              <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-white">¿Está en Promoción?</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Aplica un descuento temporal al producto.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={formIsPromo}
                    onChange={(e) => setFormIsPromo(e.target.checked)}
                    className="w-4 h-4 border border-slate-700 bg-slate-800 rounded checked:bg-amber-500"
                  />
                </div>

                {formIsPromo && (
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Precio Promocional</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formPromoPrice}
                      onChange={(e) => setFormPromoPrice(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl py-2.5 px-4 text-xs focus:outline-none focus:border-amber-500"
                      required
                    />
                  </div>
                )}
              </div>

              {/* Image URL & Upload */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Imagen del Producto *</label>
                
                {/* File Uploader Button */}
                <div className="flex items-center gap-2">
                  <div className="relative flex-grow">
                    <input
                      type="text"
                      value={formImage}
                      onChange={(e) => setFormImage(e.target.value)}
                      placeholder="https://enlace-imagen.png"
                      className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-2.5 pl-4 pr-10 text-xs focus:outline-none focus:border-amber-500"
                      required
                    />
                    {uploadingImage && (
                      <div className="absolute right-3.5 top-3">
                        <Loader2 className="w-3.5 h-3.5 text-amber-500 animate-spin" />
                      </div>
                    )}
                  </div>
                  
                  <label className="px-4 py-2.5 bg-slate-850 hover:bg-slate-800 text-slate-200 border border-slate-800 rounded-xl cursor-pointer text-xs font-bold shrink-0 flex items-center gap-1.5 transition-colors">
                    <ImageIcon className="w-3.5 h-3.5 text-amber-500" />
                    <span>Subir</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      disabled={uploadingImage}
                    />
                  </label>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Descripción del Producto</label>
                <textarea
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-2.5 px-4 text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Features Array Tags */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Características (Tags)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    placeholder="Ej: Fusión ultra lenta"
                    className="flex-grow bg-slate-950 border border-slate-800 text-white rounded-xl py-2.5 px-4 text-xs focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={addFeature}
                    className="px-4 py-2 bg-slate-800 text-slate-200 border border-slate-700/65 font-bold text-xs rounded-xl cursor-pointer"
                  >
                    Agregar
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {formFeatures.map((feat, i) => (
                    <span key={i} className="inline-flex items-center space-x-1 px-2.5 py-1 bg-slate-950 border border-slate-800 rounded-lg text-[10px] font-bold text-slate-300">
                      <span>{feat}</span>
                      <button
                        type="button"
                        onClick={() => removeFeature(i)}
                        className="text-red-400 hover:text-red-300 cursor-pointer"
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-amber-500 hover:bg-amber-400 text-slate-900 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg cursor-pointer"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
