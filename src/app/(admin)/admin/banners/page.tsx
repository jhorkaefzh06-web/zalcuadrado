'use client';

import React, { useState, useEffect } from 'react';
import { useBanners } from '@/hooks/useBanners';
import { saveBannerToStore, deleteBannerFromStore, Banner } from '@/lib/bannersStore';
import { Plus, Edit, Trash2, X, AlertTriangle, Check, Loader2, Image as ImageIcon, Link as LinkIcon } from 'lucide-react';
import Link from 'next/link';

export default function AdminBannersPage() {
  const { banners, loading, refetch } = useBanners();
  
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);

  // Form State
  const [formId, setFormId] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formHref, setFormHref] = useState('');
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
        setFormImageUrl(data.url);
        setSuccess('Banner subido y cargado con éxito.');
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

  const openAddModal = () => {
    setEditingBanner(null);
    setFormId('b_' + Math.random().toString(36).substr(2, 9));
    setFormImageUrl('');
    setFormHref('/productos?filter=promo');
    setError(null);
    setSuccess(null);
    setModalOpen(true);
  };

  const openEditModal = (banner: Banner) => {
    setEditingBanner(banner);
    setFormId(banner.id);
    setFormImageUrl(banner.image_url);
    setFormHref(banner.href || '');
    setError(null);
    setSuccess(null);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSaving(true);

    const payload = {
      id: formId,
      image_url: formImageUrl.trim(),
      href: formHref.trim()
    };

    if (!payload.image_url) {
      setError('Por favor define la URL de la imagen del banner.');
      setSaving(false);
      return;
    }

    try {
      await saveBannerToStore(payload);
      setSuccess(editingBanner ? 'Banner actualizado correctamente.' : 'Banner agregado con éxito.');
      setModalOpen(false);
      refetch();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      console.error('Error saving banner:', err);
      setError('No se pudo guardar el banner: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este banner promocional?')) return;
    setError(null);
    setSuccess(null);

    try {
      await deleteBannerFromStore(id);
      setSuccess('Banner eliminado con éxito.');
      refetch();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      console.error('Error deleting banner:', err);
      setError('No se pudo eliminar el banner: ' + err.message);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide">Banners Promocionales</h2>
          <p className="text-xs text-slate-400 mt-1">Sube y gestiona las imágenes promocionales que se muestran en el slider principal.</p>
        </div>
        
        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 px-5 py-3 bg-amber-500 hover:bg-amber-400 text-slate-900 font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Agregar Banner</span>
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

      {/* Banners List */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-4">
            <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Cargando banners...</p>
          </div>
        ) : banners.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {banners.map((b) => (
              <div 
                key={b.id} 
                className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-colors"
              >
                {/* Image Preview */}
                <div className="relative aspect-[21/9] w-full rounded-xl overflow-hidden bg-slate-900 border border-slate-850">
                  <img 
                    src={b.image_url} 
                    alt="Promo Preview" 
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute top-2 left-2 bg-slate-950/80 backdrop-blur-md px-2 py-0.5 rounded text-[9px] font-mono text-slate-400 border border-white/5">
                    {b.id}
                  </div>
                </div>

                {/* Info & Actions */}
                <div className="flex items-center justify-between gap-4 pt-2">
                  <div className="flex items-center space-x-2 text-xs text-slate-400 truncate">
                    <LinkIcon className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span className="font-medium truncate">{b.href || 'Sin enlace'}</span>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      onClick={() => openEditModal(b)}
                      className="p-2 bg-slate-800 hover:bg-slate-750 border border-slate-700/60 rounded-lg text-slate-300 hover:text-white transition-colors cursor-pointer"
                      title="Editar"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(b.id)}
                      className="p-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                      title="Eliminar"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center space-y-2">
            <ImageIcon className="w-12 h-12 text-slate-600 mx-auto" />
            <p className="text-sm font-bold text-white">No hay banners promocionales agregados</p>
            <p className="text-xs text-slate-400">Agrega una imagen de promoción para mostrarla en el slider de inicio.</p>
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
          <div className="relative w-full max-w-lg bg-slate-900 border-l border-slate-800 h-full flex flex-col p-6 overflow-y-auto space-y-6 shadow-2xl z-101">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-black text-white">{editingBanner ? 'Editar Banner' : 'Agregar Banner'}</h3>
                <p className="text-[10px] text-slate-400 font-medium">Sube una imagen promocional limpia (sin textos superpuestos en código).</p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 rounded-lg bg-slate-850 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSave} className="flex-grow space-y-6 pb-6 flex flex-col justify-between">
              <div className="space-y-4">
                
                {/* Banner ID */}
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">ID del Banner</label>
                  <input
                    type="text"
                    value={formId}
                    disabled
                    className="w-full bg-slate-950 border border-slate-800 text-slate-500 rounded-xl py-2.5 px-4 text-xs font-mono disabled:opacity-70 focus:outline-none"
                  />
                </div>

                {/* Image URL & Upload */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Imagen del Banner (Proporción recomendada: 21:9) *</label>
                  
                  <div className="flex items-center gap-2">
                    <div className="relative flex-grow">
                      <input
                        type="text"
                        value={formImageUrl}
                        onChange={(e) => setFormImageUrl(e.target.value)}
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

                {/* Redirection Link */}
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Enlace de Redirección (Ej: /productos?filter=promo) *</label>
                  <input
                    type="text"
                    value={formHref}
                    onChange={(e) => setFormHref(e.target.value)}
                    placeholder="/productos?filter=promo o https://wa.me/..."
                    className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl py-2.5 px-4 text-xs focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>

                {/* Banner Live Preview Box */}
                {formImageUrl && (
                  <div className="space-y-2 pt-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Vista Previa del Banner</label>
                    <div className="relative aspect-[21/9] w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800">
                      <img 
                        src={formImageUrl} 
                        alt="Live Preview" 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                  </div>
                )}

              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 py-3 bg-slate-800 hover:bg-slate-750 text-slate-300 font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-3 bg-amber-500 hover:bg-amber-400 text-slate-900 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg cursor-pointer flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 animate-spin text-slate-900" />
                  ) : (
                    <span>Guardar Cambios</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
