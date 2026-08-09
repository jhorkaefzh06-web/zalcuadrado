import { supabase, isSupabaseConfigured } from './supabase';

export interface Banner {
  id: string;
  image_url: string;
  href: string;
}

export const BANNERS_STORAGE_KEY = 'z2_mock_banners';
export const BANNERS_CHANGED_EVENT = 'z2_banners_changed';

export const DEFAULT_BANNERS: Banner[] = [
  {
    id: 'b1',
    image_url: '/whiskey_ice_banner.png',
    href: '/productos?filter=promo'
  }
];

export async function fetchAllBanners(): Promise<Banner[]> {
  try {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('banners')
        .select('*')
        .order('created_at', { ascending: true });
      if (!error && data && data.length > 0) {
        if (typeof window !== 'undefined') {
          localStorage.setItem(BANNERS_STORAGE_KEY, JSON.stringify(data));
        }
        return data;
      }
    }
  } catch (err) {
    console.warn('Error fetching banners from Supabase, using fallback:', err);
  }

  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(BANNERS_STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Failed to parse local stored banners:', e);
      }
    }
    localStorage.setItem(BANNERS_STORAGE_KEY, JSON.stringify(DEFAULT_BANNERS));
  }
  return DEFAULT_BANNERS;
}

export function notifyBannersChanged() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(BANNERS_CHANGED_EVENT));
    try {
      const channel = new BroadcastChannel('z2_banners_sync');
      channel.postMessage('banners_updated');
      channel.close();
    } catch (e) {
      console.warn('BroadcastChannel sync failed:', e);
    }
  }
}

export async function saveBannerToStore(banner: Banner): Promise<Banner> {
  try {
    if (isSupabaseConfigured && supabase) {
      const dbPayload = {
        id: banner.id,
        image_url: banner.image_url,
        href: banner.href
      };
      const { error } = await supabase
        .from('banners')
        .upsert([dbPayload]);
      if (error) throw error;
      notifyBannersChanged();
      return banner;
    }
  } catch (err) {
    console.warn('Error saving banner to Supabase, saving to local store instead:', err);
  }

  // Fallback to localStorage
  if (typeof window !== 'undefined') {
    const banners = await fetchAllBanners();
    const index = banners.findIndex(b => b.id === banner.id);
    if (index > -1) {
      banners[index] = banner;
    } else {
      banners.push(banner);
    }
    localStorage.setItem(BANNERS_STORAGE_KEY, JSON.stringify(banners));
    notifyBannersChanged();
  }
  return banner;
}

export async function deleteBannerFromStore(id: string): Promise<boolean> {
  try {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase
        .from('banners')
        .delete()
        .eq('id', id);
      if (error) throw error;
      notifyBannersChanged();
      return true;
    }
  } catch (err) {
    console.warn('Error deleting banner from Supabase, deleting from local store instead:', err);
  }

  // Fallback to localStorage
  if (typeof window !== 'undefined') {
    const banners = await fetchAllBanners();
    const updated = banners.filter(b => b.id !== id);
    localStorage.setItem(BANNERS_STORAGE_KEY, JSON.stringify(updated));
    notifyBannersChanged();
    return true;
  }
  return false;
}
