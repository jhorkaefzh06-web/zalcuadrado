import { useState, useEffect, useCallback } from 'react';
import { Banner, fetchAllBanners, BANNERS_STORAGE_KEY, BANNERS_CHANGED_EVENT } from '@/lib/bannersStore';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export function useBanners() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);

  const loadBanners = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchAllBanners();
      setBanners(data);
    } catch (err) {
      console.error('Failed to load banners:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBanners();

    if (typeof window === 'undefined') return;

    const handleCustomEvent = () => {
      loadBanners();
    };

    const handleStorageEvent = (e: StorageEvent) => {
      if (e.key === BANNERS_STORAGE_KEY) {
        loadBanners();
      }
    };

    let bc: BroadcastChannel | null = null;
    try {
      bc = new BroadcastChannel('z2_banners_sync');
      bc.onmessage = (event) => {
        if (event.data === 'banners_updated') {
          loadBanners();
        }
      };
    } catch (e) {
      console.warn('BroadcastChannel failed to initialize:', e);
    }

    window.addEventListener(BANNERS_CHANGED_EVENT, handleCustomEvent);
    window.addEventListener('storage', handleStorageEvent);

    let channel: any = null;
    if (isSupabaseConfigured && supabase) {
      const channelId = Math.random().toString(36).substring(2, 10);
      channel = supabase
        .channel(`public:banners:${channelId}`)
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'banners' },
          () => {
            loadBanners();
          }
        )
        .subscribe();
    }

    return () => {
      window.removeEventListener(BANNERS_CHANGED_EVENT, handleCustomEvent);
      window.removeEventListener('storage', handleStorageEvent);
      if (bc) {
        bc.close();
      }
      if (channel) {
        supabase?.removeChannel(channel);
      }
    };
  }, [loadBanners]);

  return { banners, loading, refetch: loadBanners };
}
