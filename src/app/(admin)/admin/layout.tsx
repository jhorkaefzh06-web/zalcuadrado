'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { LayoutDashboard, Boxes, LogOut, Menu, User, Bell, ChevronDown, Loader2, Tags, Package, Warehouse, Truck, History, ShoppingBag, Image } from 'lucide-react';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userEmail, setUserEmail] = useState<string>('admin@z2.com');
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      // If we are on the login page, don't execute guard
      if (pathname === '/admin/login') {
        setCheckingAuth(false);
        return;
      }

      try {
        if (isSupabaseConfigured && supabase) {
          // Check Supabase session
          const { data: { session } } = await supabase.auth.getSession();
          if (!session) {
            router.push('/admin/login');
            return;
          }
          setUserEmail(session.user?.email || 'admin@z2.com');
        } else {
          // Check mock session in localStorage
          const stored = localStorage.getItem('z2_admin_session');
          if (!stored) {
            router.push('/admin/login');
            return;
          }
          
          const sessionObj = JSON.parse(stored);
          if (Date.now() > sessionObj.expires_at) {
            localStorage.removeItem('z2_admin_session');
            document.cookie = 'z2_admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
            router.push('/admin/login');
            return;
          }
          setUserEmail(sessionObj.user?.email || 'admin@z2.com');
        }
        setCheckingAuth(false);
      } catch (e) {
        console.error('Auth check error:', e);
        router.push('/admin/login');
      }
    };

    checkAuth();
  }, [pathname, router]);

  const handleLogout = async () => {
    try {
      if (isSupabaseConfigured && supabase) {
        await supabase.auth.signOut();
      }
      // Remove mock cookies/sessions
      localStorage.removeItem('z2_admin_session');
      document.cookie = 'z2_admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
      router.push('/admin/login');
    } catch (e) {
      console.error('Logout error:', e);
    }
  };

  // Skip rendering sidebar shell if we are on the login page
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-10 h-10 text-amber-500 animate-spin" />
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Verificando Credenciales...</p>
        </div>
      </div>
    );
  }

  const navLinks: { name: string; path: string; icon: any; disabled?: boolean }[] = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Pedidos', path: '/admin/pedidos', icon: ShoppingBag },
    { name: 'Productos', path: '/admin/productos', icon: Boxes },
    { name: 'Categorías', path: '/admin/categorias', icon: Tags },
    { name: 'Banners', path: '/admin/banners', icon: Image },
    { name: 'Inventario', path: '/admin/inventario', icon: Package },
    { name: 'Historial Stock', path: '/admin/historial-stock', icon: History },
    { name: 'Almacenes', path: '/admin/almacenes', icon: Warehouse },
    { name: 'Fletes', path: '/admin/fletes', icon: Truck },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      {/* Sidebar Panel */}
      <aside
        className={`bg-slate-900 border-r border-slate-800 w-64 z-[90] flex flex-col fixed inset-y-0 left-0 transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0 md:w-20'
        }`}
      >
        {/* Sidebar Header Logo */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <Link href="/admin" className="flex items-center space-x-3 truncate">
            <img
              src="/logo.webp"
              alt="Z² Logo"
              className="h-10 w-auto object-contain filter drop-shadow-[0_2px_10px_rgba(245,158,11,0.25)]"
            />
            {sidebarOpen && (
              <span className="text-sm font-black text-white uppercase tracking-wider truncate">
                Z² Admin
              </span>
            )}
          </Link>
        </div>

        {/* Sidebar Links */}
        <nav className="flex-grow p-4 space-y-1.5 overflow-y-auto">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = pathname === link.path;
            return (
              <Link
                key={link.name}
                href={link.disabled ? '#' : link.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-bold transition-all relative ${
                  link.disabled
                    ? 'opacity-40 cursor-not-allowed'
                    : active
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/10'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-5 h-5 shrink-0" />
                {sidebarOpen && <span>{link.name}</span>}
                {sidebarOpen && link.disabled && (
                  <span className="absolute right-3 bg-slate-800 border border-slate-700 text-[9px] font-black uppercase text-slate-400 px-1.5 py-0.5 rounded-md">
                    Pronto
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Logout Footer */}
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-bold text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors cursor-pointer"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {sidebarOpen && <span>Cerrar Sesión</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div
        className={`flex-grow flex flex-col min-h-screen transition-all duration-300 ${
          sidebarOpen ? 'pl-0 md:pl-64' : 'pl-0 md:pl-20'
        }`}
      >
        {/* Top Header Navbar */}
        <header className="bg-slate-900 border-b border-slate-800 py-4 px-6 flex items-center justify-between sticky top-0 z-80 shadow-md">
          {/* Header Left (Title & Toggle) */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors cursor-pointer"
              aria-label="Toggle Sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-base font-bold text-white tracking-wide capitalize hidden sm:block">
              {pathname === '/admin' ? 'Dashboard General' : pathname.split('/').pop()}
            </h1>
          </div>

          {/* Header Right Actions */}
          <div className="flex items-center space-x-4">
            {/* Notification Badge */}
            <button className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors relative cursor-pointer">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 bg-amber-500 w-2 h-2 rounded-full ring-2 ring-slate-900" />
            </button>

            {/* User Dropdown */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center space-x-3 p-1.5 rounded-xl hover:bg-slate-800/60 transition-colors cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-500">
                  <User className="w-4 h-4" />
                </div>
                <div className="text-left hidden md:block">
                  <p className="text-xs font-black text-white max-w-[120px] truncate">{userEmail.split('@')[0]}</p>
                  <p className="text-[10px] text-slate-400 font-extrabold uppercase">Administrator</p>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>

              {userMenuOpen && (
                <>
                  <div
                    onClick={() => setUserMenuOpen(false)}
                    className="fixed inset-0 z-100 cursor-default"
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-2xl p-2 shadow-2xl z-101 space-y-0.5">
                    <div className="px-3 py-2 border-b border-slate-800 mb-1">
                      <p className="text-[10px] text-slate-500 font-extrabold uppercase">Conectado como</p>
                      <p className="text-xs font-bold text-white truncate mt-0.5">{userEmail}</p>
                    </div>
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        handleLogout();
                      }}
                      className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-bold text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors text-left cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Cerrar Sesión</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Admin Content Wrapper */}
        <main className="flex-grow p-6 sm:p-8 max-w-7xl w-full mx-auto space-y-8">
          {children}
        </main>
      </div>
    </div>
  );
}
