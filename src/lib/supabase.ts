import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Initialize client only if variables are provided
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
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
