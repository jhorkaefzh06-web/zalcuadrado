import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const disableSupabase = process.env.NEXT_PUBLIC_DISABLE_SUPABASE === 'true';

// Initialize client only if variables are provided and not explicitly disabled
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey) && !disableSupabase;

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
      },
      global: {
        fetch: (url, options) => fetch(url, { ...options, cache: 'no-store' }),
      },
    })
  : null;

/**
 * Helper to submit a contact message.
 * Falls back to local storage / memory simulation if Supabase is not configured.
 */
export async function submitContactMessage(messageData: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  console.log('Enviando mensaje de contacto:', messageData);
  
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('contact_messages')
      .insert([messageData])
      .select();
      
    if (error) {
      throw error;
    }
    return data;
  } else {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    // Save to LocalStorage for mock persistence
    try {
      const existing = JSON.parse(localStorage.getItem('mock_contact_messages') || '[]');
      existing.push({ ...messageData, id: crypto.randomUUID(), created_at: new Date().toISOString() });
      localStorage.setItem('mock_contact_messages', JSON.stringify(existing));
    } catch (e) {
      console.warn('Error guardando en LocalStorage:', e);
    }
    
    return { success: true, mock: true };
  }
}
