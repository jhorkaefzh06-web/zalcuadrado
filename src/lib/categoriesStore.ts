import { supabase, isSupabaseConfigured } from './supabase';
import { CATEGORIES as DEFAULT_CATEGORIES, Category } from './mockData';

export interface Subcategory {
  id: string;
  category_id: string;
  name: string;
}

export const CATEGORIES_STORAGE_KEY = 'z2_mock_categories';
export const SUBCATEGORIES_STORAGE_KEY = 'z2_mock_subcategories';
export const CATEGORIES_CHANGED_EVENT = 'z2_categories_changed';

export const DEFAULT_SUBCATEGORIES: Subcategory[] = [
  { id: 'licores', category_id: 'bebidas', name: 'Licores' },
  { id: 'vinos', category_id: 'bebidas', name: 'Vinos' },
  { id: 'espumantes', category_id: 'bebidas', name: 'Espumantes' },
  { id: 'cervezas', category_id: 'bebidas', name: 'Cervezas' },
];

/**
 * Fetch categories from Supabase or LocalStorage/Mock.
 */
export async function fetchAllCategories(): Promise<Category[]> {
  try {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      if (!error && data && data.length > 0) {
        if (typeof window !== 'undefined') {
          localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(data));
        }
        return data;
      }
    }
  } catch (err) {
    console.warn('Error fetching categories from Supabase, using fallback:', err);
  }

  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(CATEGORIES_STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Failed to parse local stored categories:', e);
      }
    }
    localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(DEFAULT_CATEGORIES));
  }
  return DEFAULT_CATEGORIES;
}

/**
 * Fetch subcategories from Supabase or LocalStorage/Mock.
 */
export async function fetchAllSubcategories(): Promise<Subcategory[]> {
  try {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('subcategories')
        .select('*')
        .order('name');
      if (!error && data && data.length > 0) {
        if (typeof window !== 'undefined') {
          localStorage.setItem(SUBCATEGORIES_STORAGE_KEY, JSON.stringify(data));
        }
        return data;
      }
    }
  } catch (err) {
    console.warn('Error fetching subcategories from Supabase, using fallback:', err);
  }

  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(SUBCATEGORIES_STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Failed to parse local stored subcategories:', e);
      }
    }
    localStorage.setItem(SUBCATEGORIES_STORAGE_KEY, JSON.stringify(DEFAULT_SUBCATEGORIES));
  }
  return DEFAULT_SUBCATEGORIES;
}

export function notifyCategoriesChanged() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(CATEGORIES_CHANGED_EVENT));
    try {
      const channel = new BroadcastChannel('z2_categories_sync');
      channel.postMessage('categories_updated');
      channel.close();
    } catch (e) {
      console.warn('BroadcastChannel sync failed:', e);
    }
  }
}
