'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { CATEGORIES, Product } from '@/lib/mockData';
import { notifyProductsChanged } from '@/lib/productsStore';
import { ArrowLeft, Plus, Trash2, X, AlertTriangle, Check, Loader2, GripVertical, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';

export default function AdminEditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formBrand, setFormBrand] = useState('');
  const [formPrice, setFormPrice] = useState(0);
  const [formCategory, setFormCategory] = useState('bebidas');
  const [formDescription, setFormDescription] = useState('');

  const [formIsPromo, setFormIsPromo] = useState(false);
  const [formPromoPrice, setFormPromoPrice] = useState(0);
  const [formFeatures, setFormFeatures] = useState<string[]>([]);
  const [featureInput, setFeatureInput] = useState('');
  const [formCountInStock, setFormCountInStock] = useState(10);

  // Multiple Images State
  const [formImages, setFormImages] = useState<string[]>([]);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

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
        setFormImages(prev => [...prev, data.url]);
        setSuccess('Imagen subida y agregada con éxito.');
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

  // Drag and Drop Tracker
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const fetchProduct = async () => {
    setLoading(true);
    setError(null);
    try {
      if (isSupabaseConfigured && supabase) {
        const { data, error: fetchErr } = await supabase
          .from('products')
          .select('*')
          .eq('id', productId)
          .single();

        if (fetchErr) throw fetchErr;

        if (data) {
          setFormName(data.name || '');
          setFormBrand(data.brand || '');
          setFormPrice(Number(data.price) || 0);
          setFormCategory(data.category || 'bebidas');
          setFormDescription(data.description || '');

          setFormIsPromo(data.is_promo || false);
          setFormPromoPrice(data.promo_price ? Number(data.promo_price) : 0);
          setFormFeatures(data.features || []);
          setFormCountInStock(data.count_in_stock !== undefined ? Number(data.count_in_stock) : 10);
          
          // Map DB images array or fallback to single image column
          if (data.images && data.images.length > 0) {
            setFormImages(data.images);
          } else if (data.image) {
            setFormImages([data.image]);
          } else {
            setFormImages([]);
          }
        }
      } else {
        // Fallback local products
        const stored = localStorage.getItem('z2_mock_products');
        const productsList: Product[] = stored ? JSON.parse(stored) : [];
        const found = productsList.find(p => p.id === productId);

        if (found) {
          setFormName(found.name);
          setFormBrand(found.brand);
          setFormPrice(found.price);
          setFormCategory(found.category);
          setFormDescription(found.description);

          setFormIsPromo(found.isPromo);
          setFormPromoPrice(found.promoPrice || 0);
          setFormFeatures(found.features || []);
          setFormCountInStock(found.countInStock !== undefined ? found.countInStock : 10);
          
          // In mockData.ts, products only have 'image' property. Expand to mock array
          // check if mock storage has images array
          const extendedProduct = found as any;
          if (extendedProduct.images && extendedProduct.images.length > 0) {
            setFormImages(extendedProduct.images);
          } else {
            setFormImages([found.image]);
          }
        } else {
          setError('No se encontró el producto en el catálogo.');
        }
      }
    } catch (err: any) {
      console.error('Fetch product error:', err);
      setError('Error al cargar el producto: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Image Actions
  const addImageUrl = () => {
    const url = imageUrlInput.trim();
    if (url) {
      if (formImages.includes(url)) {
        setError('Esta URL de imagen ya está agregada.');
        return;
      }
      setFormImages([...formImages, url]);
      setImageUrlInput('');
      setError(null);
    }
  };

  const removeImageUrl = (idx: number) => {
    setFormImages(formImages.filter((_, i) => i !== idx));
  };

  // DRAG & DROP HANDLERS (NATIVE HTML5)
  const handleDragStart = (idx: number) => {
    setDraggedIndex(idx);
  };

  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetIdx: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIdx) return;

    const reordered = [...formImages];
    const [removed] = reordered.splice(draggedIndex, 1);
    reordered.splice(targetIdx, 0, removed);

    setFormImages(reordered);
    setDraggedIndex(null);
  };

  // Features Actions
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
    setSaving(true);

    const payload = {
      id: productId,
      name: formName.trim(),
      brand: formBrand.trim(),
      price: Number(formPrice),
      category: formCategory,
      description: formDescription.trim(),
      // Set the cover image as the first image in array or fallback
      image: formImages.length > 0 ? formImages[0] : 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?q=80&w=600&auto=format&fit=crop',
      images: formImages,
      features: formFeatures,
      isPromo: formIsPromo,
      promoPrice: formIsPromo ? Number(formPromoPrice) : undefined,
      countInStock: Number(formCountInStock)
    };

    if (!payload.name || !payload.brand || payload.price <= 0) {
      setError('Por favor completa los campos obligatorios y define un precio válido.');
      setSaving(false);
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
          images: payload.images,
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
            .eq('product_id', productId);

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
                  product_id: productId,
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
        const stored = localStorage.getItem('z2_mock_products');
        const productsList: Product[] = stored ? JSON.parse(stored) : [];
        
        const updated = productsList.map(p => p.id === productId 
          ? {
              ...p,
              name: payload.name,
              brand: payload.brand,
              price: payload.price,
              category: payload.category,
              description: payload.description,
              image: payload.image,
              images: payload.images,
              features: payload.features,
              isPromo: payload.isPromo,
              promoPrice: payload.promoPrice,
              countInStock: payload.countInStock
            } as any
          : p
        );

        localStorage.setItem('z2_mock_products', JSON.stringify(updated));

        // Sync mock inventory
        try {
          const storedInv = localStorage.getItem('z2_mock_inventory');
          let inventoryList = storedInv ? JSON.parse(storedInv) : [];
          const invIndex = inventoryList.findIndex((i: any) => i.product_id === productId);
          if (invIndex > -1) {
            inventoryList[invIndex].stock = payload.countInStock;
          } else {
            const storedWhs = localStorage.getItem('z2_mock_warehouses');
            const whs = storedWhs ? JSON.parse(storedWhs) : [];
            if (whs.length > 0) {
              inventoryList.push({
                id: 'inv_' + Math.random().toString(36).substr(2, 9),
                product_id: productId,
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

      setSuccess('Producto guardado correctamente con sus imágenes ordenadas.');
      notifyProductsChanged();
      setTimeout(() => {
        setSuccess(null);
        router.push('/admin/productos');
      }, 1500);
    } catch (err: any) {
      console.error('Error saving product:', err);
      setError('No se pudo guardar el producto: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Header back */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link
            href="/admin/productos"
            className="p-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide">Editar Detalle de Producto</h2>
            <p className="text-xs text-slate-400 mt-1">Modifica todos los atributos del producto e ingresa múltiples fotos.</p>
          </div>
        </div>
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

      {loading ? (
        <div className="py-32 flex flex-col items-center justify-center space-y-4 bg-slate-900 border border-slate-800 rounded-3xl">
          <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Cargando detalles...</p>
        </div>
      ) : (
        <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Grid: Main Details */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* General Information Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Información General</h3>
              
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">ID del Producto (Código único)</label>
                <input
                  type="text"
                  value={productId}
                  disabled
                  className="w-full bg-slate-950/60 border border-slate-800 text-slate-500 font-mono rounded-xl py-3 px-4 text-xs cursor-not-allowed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Nombre del Producto *</label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-3 px-4 text-xs focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Marca *</label>
                  <input
                    type="text"
                    value={formBrand}
                    onChange={(e) => setFormBrand(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-3 px-4 text-xs focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Descripción del Producto</label>
                <textarea
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  rows={4}
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-3 px-4 text-xs focus:outline-none focus:border-amber-500 leading-relaxed"
                />
              </div>
            </div>

            {/* Pricing and Stock Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Precio e Inventario</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Precio de Lista (S/)*</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-3 px-4 text-xs focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Cantidad en Stock *</label>
                  <input
                    type="number"
                    value={formCountInStock}
                    onChange={(e) => setFormCountInStock(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-3 px-4 text-xs focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Categoría</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-white py-3 px-3 rounded-xl text-xs focus:outline-none focus:border-amber-500"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Promo Toggles */}
              <div className="bg-slate-950 border border-slate-850 p-4 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-white">¿Está en Promoción?</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Aplica un descuento temporal al producto.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={formIsPromo}
                    onChange={(e) => setFormIsPromo(e.target.checked)}
                    className="w-4.5 h-4.5 border border-slate-700 bg-slate-800 rounded checked:bg-amber-500"
                  />
                </div>

                {formIsPromo && (
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Precio Promocional (S/)</label>
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
            </div>

            {/* Features Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Características / Tags</h3>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  value={featureInput}
                  onChange={(e) => setFeatureInput(e.target.value)}
                  placeholder="Ej: Fusión ultra lenta (60mm)"
                  className="flex-grow bg-slate-950 border border-slate-800 text-white rounded-xl py-3 px-4 text-xs focus:outline-none focus:border-amber-500"
                />
                <button
                  type="button"
                  onClick={addFeature}
                  className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-750 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Agregar
                </button>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {formFeatures.map((feat, i) => (
                  <span key={i} className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-slate-950 border border-slate-850 rounded-xl text-[10px] font-bold text-slate-300">
                    <span>{feat}</span>
                    <button
                      type="button"
                      onClick={() => removeFeature(i)}
                      className="text-red-400 hover:text-red-300 cursor-pointer font-bold text-xs"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            </div>

          </div>

          {/* Right Grid: Multi-Images & Save Actions */}
          <div className="space-y-6">
            
            {/* Action Buttons Box */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3">
              <button
                type="submit"
                disabled={saving}
                className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg cursor-pointer flex items-center justify-center gap-2"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>Guardar Cambios</span>
              </button>
              <Link
                href="/admin/productos"
                className="w-full py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer block text-center border border-slate-750"
              >
                Cancelar
              </Link>
            </div>

            {/* Multiple Images Manager Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
              <div>
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Galería de Imágenes</h3>
                <p className="text-[10px] text-slate-500 mt-1 pl-1">Arrastra y suelta (Drag & Drop) para reordenar. La primera foto será la portada principal.</p>
              </div>

              {/* Image upload / URL Input */}
              <div className="space-y-3">
                {/* File Uploader */}
                <div className="flex flex-col items-center justify-center border border-dashed border-slate-850 rounded-2xl p-4 bg-slate-950/45 hover:bg-slate-950/70 transition-all group relative">
                  <label className="flex flex-col items-center justify-center space-y-1.5 cursor-pointer w-full h-full py-2">
                    <ImageIcon className="w-6 h-6 text-amber-500 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-wider">Subir Archivo de Imagen</span>
                    <span className="text-[9px] text-slate-500">Formatos JPG, PNG, WEBP (Max 5MB)</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      disabled={uploadingImage}
                    />
                  </label>
                  {uploadingImage && (
                    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center gap-2 rounded-2xl">
                      <Loader2 className="w-4 h-4 text-amber-500 animate-spin" />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300">Subiendo...</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-px bg-slate-800 flex-grow" />
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">o agregar URL</span>
                  <div className="h-px bg-slate-800 flex-grow" />
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={imageUrlInput}
                    onChange={(e) => setImageUrlInput(e.target.value)}
                    placeholder="https://enlace-imagen.png"
                    className="flex-grow bg-slate-950 border border-slate-800 text-white rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:border-amber-500"
                  />
                  <button
                    type="button"
                    onClick={addImageUrl}
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-750 text-slate-200 font-bold text-xs rounded-xl cursor-pointer shrink-0 border border-slate-750"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Reorder list wrapper */}
              <div className="space-y-2.5 pt-2">
                {formImages.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3">
                    {formImages.map((url, idx) => {
                      const isCover = idx === 0;

                      return (
                        <div
                          key={idx}
                          draggable
                          onDragStart={() => handleDragStart(idx)}
                          onDragOver={(e) => handleDragOver(e, idx)}
                          onDrop={(e) => handleDrop(e, idx)}
                          className={`relative group bg-slate-950 border rounded-2xl overflow-hidden aspect-square flex flex-col justify-between p-2 cursor-grab active:cursor-grabbing hover:border-slate-650 transition-all ${
                            isCover ? 'border-amber-500/80 ring-2 ring-amber-500/10' : 'border-slate-850'
                          }`}
                        >
                          <img
                            src={url}
                            alt={`Imagen ${idx + 1}`}
                            className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
                          />
                          
                          {/* Badges / Controls overlays */}
                          <div className="z-10 flex items-center justify-between w-full">
                            <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase ${
                              isCover 
                                ? 'bg-amber-500 text-slate-950' 
                                : 'bg-slate-900/80 text-slate-300 border border-slate-800'
                            }`}>
                              {isCover ? 'Portada' : `${idx + 1}`}
                            </span>

                            <button
                              type="button"
                              onClick={() => removeImageUrl(idx)}
                              className="p-1 bg-red-500/20 border border-red-500/30 text-red-400 hover:text-red-300 rounded-lg cursor-pointer z-20 opacity-0 group-hover:opacity-100 transition-opacity"
                              title="Remover"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>

                          <div className="z-10 w-full flex justify-end">
                            <GripVertical className="w-3.5 h-3.5 text-slate-400 cursor-grab opacity-40 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-12 border border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center space-y-2.5 text-slate-600">
                    <ImageIcon className="w-8 h-8" />
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Sin imágenes cargadas</p>
                  </div>
                )}
              </div>

            </div>

          </div>

        </form>
      )}

    </div>
  );
}
