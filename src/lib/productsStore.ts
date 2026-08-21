import { supabase, isSupabaseConfigured } from './supabase';
import { PRODUCTS as DEFAULT_PRODUCTS, Product } from './mockData';

export const PRODUCTS_STORAGE_KEY = 'z2_mock_products';
export const PRODUCTS_CHANGED_EVENT = 'z2_products_changed';

/**
 * Fetch products from Supabase if configured, or fall back to localStorage/mock.
 */
export async function fetchAllProducts(): Promise<Product[]> {
  try {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        const mapped: Product[] = data.map((p: any) => ({
          id: p.id,
          name: p.name,
          price: Number(p.price),
          description: p.description || '',
          category: p.category,
          image: p.image || '',
          images: p.images || [],
          rating: Number(p.rating || 5),
          brand: p.brand || '',
          features: p.features || [],
          isPromo: Boolean(p.is_promo),
          promoPrice: p.promo_price ? Number(p.promo_price) : undefined,
          countInStock: p.count_in_stock !== undefined ? Number(p.count_in_stock) : 10,
        }));
        
        // Cache to localStorage as well
        if (typeof window !== 'undefined') {
          localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(mapped));
        }
        return mapped;
      }
    }
  } catch (err) {
    console.warn('Error fetching from Supabase, falling back to local store:', err);
  }

  // Fallback to LocalStorage
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(PRODUCTS_STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Failed to parse local stored products:', e);
      }
    }
    // Initialize LocalStorage with default mock products
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(DEFAULT_PRODUCTS));
  }

  return DEFAULT_PRODUCTS;
}

/**
 * Save product to Supabase / LocalStorage and trigger realtime event.
 */
export async function saveProductToStore(productData: Partial<Product> & { name: string; price: number; category: string }): Promise<Product> {
  const isEditing = Boolean(productData.id);
  const id = productData.id || `prod-${Date.now()}`;

  const fullProduct: Product = {
    id,
    name: productData.name,
    price: Number(productData.price),
    description: productData.description || '',
    category: productData.category,
    image: productData.image || '/logo.png',
    images: productData.images || [],
    rating: productData.rating || 5,
    brand: productData.brand || 'Z2',
    features: productData.features || [],
    isPromo: Boolean(productData.isPromo),
    promoPrice: productData.promoPrice ? Number(productData.promoPrice) : undefined,
    countInStock: productData.countInStock !== undefined ? Number(productData.countInStock) : 10,
  };

  // 1. Save to Supabase if configured
  if (isSupabaseConfigured && supabase) {
    try {
      const payload: any = {
        id: fullProduct.id,
        name: fullProduct.name,
        price: fullProduct.price,
        description: fullProduct.description,
        category: fullProduct.category,
        image: fullProduct.image,
        images: fullProduct.images,
        rating: fullProduct.rating,
        brand: fullProduct.brand,
        features: fullProduct.features,
        is_promo: fullProduct.isPromo,
        promo_price: fullProduct.promoPrice || null,
        count_in_stock: fullProduct.countInStock || 10,
      };

      if (isEditing) {
        await supabase.from('products').update(payload).eq('id', id);
      } else {
        await supabase.from('products').insert([payload]);
      }
    } catch (err) {
      console.error('Supabase save product error:', err);
    }
  }

  // 2. Save to LocalStorage
  if (typeof window !== 'undefined') {
    const current = await fetchAllProducts();
    let updated: Product[];
    if (isEditing) {
      updated = current.map((p) => (p.id === id ? fullProduct : p));
    } else {
      updated = [fullProduct, ...current];
    }
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(updated));
    notifyProductsChanged();
  }

  return fullProduct;
}

/**
 * Delete product from Supabase / LocalStorage and trigger event.
 */
export async function deleteProductFromStore(id: string): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('products').delete().eq('id', id);
    } catch (err) {
      console.error('Supabase delete product error:', err);
    }
  }

  if (typeof window !== 'undefined') {
    const current = await fetchAllProducts();
    const updated = current.filter((p) => p.id !== id);
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(updated));
    notifyProductsChanged();
  }
}

export function notifyProductsChanged() {
  if (typeof window !== 'undefined') {
    // Dispatch event to components in the same tab
    window.dispatchEvent(new CustomEvent(PRODUCTS_CHANGED_EVENT));

    // Broadcast message to components in other tabs/windows
    try {
      const channel = new BroadcastChannel('z2_products_sync');
      channel.postMessage('products_updated');
      channel.close();
    } catch (e) {
      console.warn('BroadcastChannel not supported or failed:', e);
    }
  }
}
