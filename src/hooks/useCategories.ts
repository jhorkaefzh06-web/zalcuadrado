import { useState, useEffect, useCallback } from 'react';
import { Category } from '@/lib/mockData';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import {
  fetchAllCategories,
  fetchAllSubcategories,
  Subcategory,
  CATEGORIES_STORAGE_KEY,
  SUBCATEGORIES_STORAGE_KEY,
  CATEGORIES_CHANGED_EVENT,
} from '@/lib/categoriesStore';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [cats, subs] = await Promise.all([
        fetchAllCategories(),
        fetchAllSubcategories()
      ]);
      setCategories(cats);
      setSubcategories(subs);
    } catch (err) {
      console.error('Failed to load categories/subcategories:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();

    if (typeof window === 'undefined') return;

    const handleCustomEvent = () => {
      loadData();
    };

    const handleStorageEvent = (e: StorageEvent) => {
      if (e.key === CATEGORIES_STORAGE_KEY || e.key === SUBCATEGORIES_STORAGE_KEY) {
        loadData();
      }
    };

    let bc: BroadcastChannel | null = null;
    try {
      bc = new BroadcastChannel('z2_categories_sync');
      bc.onmessage = (event) => {
        if (event.data === 'categories_updated') {
          loadData();
        }
      };
    } catch (e) {
      console.warn('BroadcastChannel initialization failed:', e);
    }

    window.addEventListener(CATEGORIES_CHANGED_EVENT, handleCustomEvent);
    window.addEventListener('storage', handleStorageEvent);

    // Supabase Realtime subscription
    let catChannel: any = null;
    let subChannel: any = null;

    if (isSupabaseConfigured && supabase) {
      catChannel = supabase
        .channel('public:categories')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'categories' },
          () => {
            loadData();
          }
        )
        .subscribe();

      subChannel = supabase
        .channel('public:subcategories')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'subcategories' },
          () => {
            loadData();
          }
        )
        .subscribe();
    }

    return () => {
      window.removeEventListener(CATEGORIES_CHANGED_EVENT, handleCustomEvent);
      window.removeEventListener('storage', handleStorageEvent);
      if (bc) {
        bc.close();
      }
      if (catChannel) {
        supabase?.removeChannel(catChannel);
      }
      if (subChannel) {
        supabase?.removeChannel(subChannel);
      }
    };
  }, [loadData]);

  return { categories, subcategories, loading, refetch: loadData };
}
