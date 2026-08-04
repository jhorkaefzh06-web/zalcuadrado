import { useState, useEffect, useCallback } from 'react';
import { Product, PRODUCTS as DEFAULT_PRODUCTS } from '@/lib/mockData';
import { fetchAllProducts, PRODUCTS_STORAGE_KEY, PRODUCTS_CHANGED_EVENT } from '@/lib/productsStore';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>(DEFAULT_PRODUCTS);
  const [loading, setLoading] = useState(true);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      } else {
        const data = await fetchAllProducts();
        setProducts(data);
      }
    } catch (err) {
      console.warn('API fetch error, using local fallback:', err);
      const data = await fetchAllProducts();
      setProducts(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();

    if (typeof window === 'undefined') return;

    // Listen to custom same-tab updates
    const handleCustomEvent = () => {
      loadProducts();
    };

    // Listen to cross-tab storage changes
    const handleStorageEvent = (e: StorageEvent) => {
      if (e.key === PRODUCTS_STORAGE_KEY) {
        loadProducts();
      }
    };

    // Listen to BroadcastChannel updates (instant cross-tab sync)
    let bc: BroadcastChannel | null = null;
    try {
      bc = new BroadcastChannel('z2_products_sync');
      bc.onmessage = (event) => {
        if (event.data === 'products_updated') {
          loadProducts();
        }
      };
    } catch (e) {
      console.warn('BroadcastChannel failed to initialize:', e);
    }

    window.addEventListener(PRODUCTS_CHANGED_EVENT, handleCustomEvent);
    window.addEventListener('storage', handleStorageEvent);

    // Listen to Supabase Realtime changes if configured
    let channel: any = null;
    if (isSupabaseConfigured && supabase) {
      channel = supabase
        .channel('public:products')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'products' },
          () => {
            loadProducts();
          }
        )
        .subscribe();
    }

    return () => {
      window.removeEventListener(PRODUCTS_CHANGED_EVENT, handleCustomEvent);
      window.removeEventListener('storage', handleStorageEvent);
      if (bc) {
        bc.close();
      }
      if (channel) {
        supabase?.removeChannel(channel);
      }
    };
  }, [loadProducts]);

  return { products, loading, refetch: loadProducts };
}
