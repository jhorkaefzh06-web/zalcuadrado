'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Mail, Lock, AlertTriangle, Loader2 } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const emailTrim = email.trim();
    const passwordTrim = password.trim();

    if (!emailTrim || !passwordTrim) {
      setError('Por favor, ingresa correo y contraseña.');
      setLoading(false);
      return;
    }

    try {
      let loggedIn = false;

      // 1. Check mock credentials first for easy development bypass
      if (
        (emailTrim === 'admin@z2.com' && passwordTrim === 'admin') ||
        (emailTrim === 'jhorkaefzh06@gmail.com' && passwordTrim === 'admin')
      ) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        localStorage.setItem('z2_admin_session', JSON.stringify({
          user: { email: emailTrim, role: 'admin' },
          expires_at: Date.now() + 2 * 3600 * 1000 // 2 hours
        }));
        document.cookie = 'z2_admin_session=true; path=/; max-age=7200';
        router.push('/admin');
        loggedIn = true;
      }

      // 2. If not mock and Supabase is configured, check Supabase
      if (!loggedIn && isSupabaseConfigured && supabase) {
        try {
          const { error: authError } = await supabase.auth.signInWithPassword({
            email: emailTrim,
            password: passwordTrim,
          });

          if (authError) {
            throw authError;
          }

          document.cookie = 'z2_admin_session=true; path=/; max-age=7200';
          router.push('/admin');
          loggedIn = true;
        } catch (authErr: any) {
          const isNetworkError = 
            authErr.message?.includes('Failed to fetch') || 
            authErr.message?.includes('fetch failed') ||
            authErr.name === 'AuthRetryableFetchError';

          if (isNetworkError) {
            console.warn('Supabase offline. Intentando autenticación local mock...');
          } else {
            throw authErr;
          }
        }
      }

      if (!loggedIn) {
        setError('Credenciales incorrectas. Usa admin@z2.com o tu usuario configurado.');
      }
    } catch (err: any) {
      console.error('Error logging in:', err);
      setError(err.message || 'Error de autenticación.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-800 border border-slate-700/60 rounded-3xl p-8 shadow-2xl space-y-6">
        
        {/* Title */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <img
              src="/logo.webp"
              alt="Logo Z²"
              className="h-16 w-auto object-contain filter drop-shadow-[0_2px_10px_rgba(245,158,11,0.35)]"
            />
          </div>
          <h2 className="text-2xl font-black text-white tracking-wide mt-2">TailAdmin Panel</h2>
          <p className="text-xs text-slate-400 font-medium">
            {isSupabaseConfigured
              ? 'Inicia sesión con tus credenciales de Supabase'
              : 'Modo Simulado: Ingresa con jhorkaefzh06@gmail.com / admin'}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3.5 rounded-2xl flex items-start gap-2.5 text-xs">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email input */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider pl-1">
              Correo Electrónico
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ejemplo@z2.com"
                className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:border-amber-500 transition-colors"
                required
              />
              <Mail className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
            </div>
          </div>

          {/* Password input */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider pl-1">
              Contraseña
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:border-amber-500 transition-colors"
                required
              />
              <Lock className="absolute left-4 top-3.5 w-4 h-4 text-slate-500" />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold text-sm tracking-wide shadow-lg transition-all disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Autenticando...</span>
              </>
            ) : (
              <span>Entrar al Panel</span>
            )}
          </button>
        </form>

        {/* Local test alert if no supabase */}
        {!isSupabaseConfigured && (
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-[10px] text-amber-300 rounded-xl leading-normal text-center">
            ⚠️ Supabase no está configurado. Usando modo simulación local.
          </div>
        )}
      </div>
    </div>
  );
}
