'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { Menu, X, Search, ChevronDown, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';

interface NavItem {
  name: string;
  path: string;
}

const NAV_ITEMS: NavItem[] = [
  { name: 'Inicio', path: '/' },
  { name: 'Hielos', path: '/productos?category=hielos' },
  { name: 'Bebidas', path: '/productos?category=bebidas' },
  { name: 'Promociones', path: '/productos?filter=promo' },
];

const BEBIDAS_MEGAMENU = {
  categories: [
    {
      title: 'Licores',
      items: [
        { name: 'Licor Del Mes', path: '/productos?category=bebidas&subcategory=licores&filter=mes' },
        { name: 'Whisky', path: '/productos?category=bebidas&subcategory=licores&search=Whisky' },
        { name: 'Ron', path: '/productos?category=bebidas&subcategory=licores&search=Ron' },
        { name: 'Pisco', path: '/productos?category=bebidas&subcategory=licores&search=Pisco' },
        { name: 'Gin', path: '/productos?category=bebidas&subcategory=licores&search=Gin' },
        { name: 'Vodka', path: '/productos?category=bebidas&subcategory=licores&search=Vodka' },
        { name: 'Tequila', path: '/productos?category=bebidas&subcategory=licores&search=Tequila' },
        { name: 'Licores De Crema', path: '/productos?category=bebidas&subcategory=licores&search=Baileys' },
        { name: 'Listos Para Tomar', path: '/productos?category=bebidas&subcategory=licores&filter=rtd' },
        { name: 'Otros Licores', path: '/productos?category=bebidas&subcategory=licores&filter=otros' },
        { name: 'Complementos De Licores', path: '/productos?category=bebidas&subcategory=licores&filter=complementos' },
      ]
    },
    {
      title: 'Vinos',
      items: [
        { name: 'Bodega Del Mes', path: '/productos?category=bebidas&subcategory=vinos&filter=bodega-mes' },
        { name: 'Alta Gama', path: '/productos?category=bebidas&subcategory=vinos&filter=alta-gama' },
        { name: 'Vino Tinto', path: '/productos?category=bebidas&subcategory=vinos&search=Tinto' },
        { name: 'Vino Rosé', path: '/productos?category=bebidas&subcategory=vinos&search=Rosé' },
        { name: 'Vino Blanco', path: '/productos?category=bebidas&subcategory=vinos&search=Blanco' },
        { name: 'Sangría', path: '/productos?category=bebidas&subcategory=vinos&search=Sangría' },
      ]
    },
    {
      title: 'Espumantes',
      items: [
        { name: 'Champagne', path: '/productos?category=bebidas&subcategory=vinos&search=Champagne' },
        { name: 'Cava', path: '/productos?category=bebidas&subcategory=vinos&search=Cava' },
        { name: 'Otros Espumantes', path: '/productos?category=bebidas&subcategory=vinos&search=Espumante' },
      ]
    },
    {
      title: 'Cervezas',
      items: [
        { name: 'Cervezas Nacionales', path: '/productos?category=bebidas&subcategory=cervezas&filter=nacionales' },
        { name: 'Cervezas Importadas', path: '/productos?category=bebidas&subcategory=cervezas&filter=importadas' },
        { name: 'Cervezas Artesanales', path: '/productos?category=bebidas&subcategory=cervezas&search=Artesanal' },
      ]
    }
  ],
  footer: [
    { name: 'Cigarros', path: '/productos?category=cigarros' },
    { name: 'Hielo', path: '/productos?category=hielos' },
    { name: 'Marcas', path: '/productos?filter=marcas' }
  ]
};

export function BrandLogo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center group shrink-0 ${className}`}>
      <img
        src="/logo.webp"
        alt="Hielos & Bebidas Z² - Delivery las 24 Horas"
        className="h-13 sm:h-16 md:h-18 w-auto object-contain transition-transform duration-300 group-hover:scale-105 filter drop-shadow-[0_2px_8px_rgba(245,158,11,0.3)]"
      />
    </Link>
  );
}

function checkIsActive(itemPath: string, pathname: string, searchParams: URLSearchParams | null) {
  if (itemPath.includes('?')) {
    const [basePath, searchString] = itemPath.split('?');
    if (pathname !== basePath) return false;

    if (!searchParams) return false;
    const itemParams = new URLSearchParams(searchString);
    for (const [key, value] of itemParams.entries()) {
      if (searchParams.get(key) !== value) {
        return false;
      }
    }
    return true;
  }
  return pathname === itemPath;
}

function DesktopNavLinks({ pathname }: { pathname: string }) {
  const searchParams = useSearchParams();

  return (
    <>
      {NAV_ITEMS.map((item) => {
        if (item.name === 'Bebidas') {
          const isActive = checkIsActive(item.path, pathname, searchParams) ||
                           pathname.startsWith('/productos') && searchParams.get('category') === 'bebidas';
          return (
            <div key={item.path} className="relative group py-2">
              <Link
                href={item.path}
                id={`nav-link-${item.name.toLowerCase().replace(' ', '-')}`}
                className={`btn-spotlight relative px-4 py-2 rounded-xl text-sm font-semibold transition-colors drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)] flex items-center gap-1 ${isActive
                  ? 'text-amber-600 dark:text-amber-400 bg-amber-500/15'
                  : 'text-brand-800 hover:text-brand-950 dark:text-brand-100 dark:hover:text-white hover:bg-white/5'
                  }`}
              >
                {item.name}
                <ChevronDown className="w-4 h-4 opacity-70 group-hover:rotate-180 transition-transform duration-300" />
                {isActive && (
                  <motion.span
                    layoutId="activeNavIndicator"
                    className="absolute bottom-0 left-4 right-8 h-0.5 bg-gradient-to-r from-amber-500 to-amber-700 rounded-full"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
              
              {/* Mega Dropdown Menu Wrapper (Bridges hover gap using padding-top) */}
              <div className="absolute top-full right-0 pt-2 w-[680px] lg:w-[800px] opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 z-50">
                {/* Visual dropdown content box */}
                <div className="bg-brand-950/95 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-2xl">
                  <div className="grid grid-cols-4 gap-6">
                    {BEBIDAS_MEGAMENU.categories.map((cat) => (
                      <div key={cat.title} className="space-y-3">
                        <h4 className="text-amber-400 font-extrabold text-xs uppercase tracking-wider border-b border-white/5 pb-1">
                          {cat.title}
                        </h4>
                        <ul className="space-y-1.5">
                          {cat.items.map((sub) => {
                            const isSubActive = checkIsActive(sub.path, pathname, searchParams);
                            return (
                              <li key={sub.name}>
                                <Link
                                  href={sub.path}
                                  className={`block text-[11px] font-bold transition-all duration-200 hover:text-amber-400 hover:translate-x-1 ${isSubActive
                                    ? 'text-amber-400 font-extrabold'
                                    : 'text-brand-300 hover:text-white'
                                    }`}
                                >
                                  {sub.name}
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    ))}
                  </div>
                  
                  {/* Mega Dropdown Footer */}
                  <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-6">
                      {BEBIDAS_MEGAMENU.footer.slice(0, 2).map((item) => (
                        <Link
                          key={item.name}
                          href={item.path}
                          className="font-extrabold text-brand-300 hover:text-amber-400 transition-colors"
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                    <div>
                      <Link
                        href={BEBIDAS_MEGAMENU.footer[2].path}
                        className="font-extrabold text-brand-300 hover:text-amber-400 transition-colors bg-white/5 px-3 py-1 rounded-lg border border-white/5"
                      >
                        {BEBIDAS_MEGAMENU.footer[2].name}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        }

        const isActive = checkIsActive(item.path, pathname, searchParams);
        return (
          <Link
            key={item.path}
            href={item.path}
            id={`nav-link-${item.name.toLowerCase().replace(' ', '-')}`}
            className={`btn-spotlight relative px-4 py-2 rounded-xl text-sm font-semibold transition-colors drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)] ${isActive
              ? 'text-amber-600 dark:text-amber-400 bg-amber-500/15'
              : 'text-brand-800 hover:text-brand-950 dark:text-brand-100 dark:hover:text-white hover:bg-white/5'
              }`}
          >
            {item.name}
            {isActive && (
              <motion.span
                layoutId="activeNavIndicator"
                className="absolute bottom-0 left-4 right-4 h-0.5 bg-gradient-to-r from-amber-500 to-amber-700 rounded-full"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
          </Link>
        );
      })}
    </>
  );
}

function DesktopNavFallback({ pathname }: { pathname: string }) {
  return (
    <>
      {NAV_ITEMS.map((item) => {
        const isActive = item.path === pathname;
        return (
          <div
            key={item.path}
            className={`relative px-4 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-1 ${isActive
              ? 'text-amber-600 dark:text-amber-400 bg-amber-500/10'
              : 'text-brand-600 dark:text-brand-300 opacity-50'
              }`}
          >
            {item.name}
            {item.name === 'Bebidas' && <ChevronDown className="w-4 h-4 opacity-50" />}
            {isActive && (
              <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-gradient-to-r from-amber-500 to-amber-700 rounded-full" />
            )}
          </div>
        );
      })}
    </>
  );
}

function MobileNavLinks({ pathname, setIsOpen }: { pathname: string; setIsOpen: (open: boolean) => void }) {
  const searchParams = useSearchParams();
  const [bebidasOpen, setBebidasOpen] = useState(false);
  const [activeSubSection, setActiveSubSection] = useState<string | null>(null);

  const toggleSubSection = (title: string) => {
    if (activeSubSection === title) {
      setActiveSubSection(null);
    } else {
      setActiveSubSection(title);
    }
  };

  return (
    <>
      {NAV_ITEMS.map((item) => {
        if (item.name === 'Bebidas') {
          const isActive = checkIsActive(item.path, pathname, searchParams) ||
                           pathname.startsWith('/productos') && searchParams.get('category') === 'bebidas';
          return (
            <div key={item.path} className="space-y-1">
              <button
                onClick={() => setBebidasOpen(!bebidasOpen)}
                className={`btn-spotlight w-full flex items-center justify-between px-4 py-3 rounded-xl text-base font-semibold transition-colors text-left cursor-pointer ${isActive
                  ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400'
                  : 'text-brand-800 dark:text-brand-200 hover:bg-brand-50 dark:hover:bg-brand-900/50'
                  }`}
              >
                <span>{item.name}</span>
                <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${bebidasOpen ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {bebidasOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="pl-3 py-1 space-y-2 border-l border-brand-200 dark:border-brand-800 ml-3"
                  >
                    {BEBIDAS_MEGAMENU.categories.map((cat) => (
                      <div key={cat.title} className="space-y-1">
                        <button
                          onClick={() => toggleSubSection(cat.title)}
                          className="w-full flex items-center justify-between py-2 px-3 text-sm font-bold text-brand-500 dark:text-brand-400 hover:text-amber-400 cursor-pointer"
                        >
                          <span>{cat.title}</span>
                          <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${activeSubSection === cat.title ? 'rotate-180' : ''}`} />
                        </button>

                        <AnimatePresence>
                          {activeSubSection === cat.title && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="pl-4 space-y-1 overflow-hidden"
                            >
                              {cat.items.map((sub) => {
                                const isSubActive = checkIsActive(sub.path, pathname, searchParams);
                                return (
                                  <Link
                                    key={sub.name}
                                    href={sub.path}
                                    onClick={() => setIsOpen(false)}
                                    className={`block px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${isSubActive
                                      ? 'text-amber-500 font-extrabold'
                                      : 'text-brand-500 dark:text-brand-400 hover:text-brand-200'
                                      }`}
                                  >
                                    {sub.name}
                                  </Link>
                                );
                              })}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                    
                    {/* Mobile Mega Dropdown Footer Items */}
                    <div className="pt-3 border-t border-brand-200 dark:border-brand-800 space-y-1">
                      {BEBIDAS_MEGAMENU.footer.map((item) => (
                        <Link
                          key={item.name}
                          href={item.path}
                          onClick={() => setIsOpen(false)}
                          className="block px-3 py-2 text-sm font-bold text-brand-500 dark:text-brand-400 hover:text-amber-400 transition-colors"
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        }

        const isActive = checkIsActive(item.path, pathname, searchParams);
        return (
          <Link
            key={item.path}
            href={item.path}
            onClick={() => setIsOpen(false)}
            className={`btn-spotlight block px-4 py-3 rounded-xl text-base font-semibold transition-colors ${isActive
              ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400'
              : 'text-brand-800 hover:bg-brand-50 dark:text-brand-200 dark:hover:bg-brand-900/50'
              }`}
          >
            {item.name}
          </Link>
        );
      })}
    </>
  );
}

function MobileNavFallback({ pathname }: { pathname: string }) {
  return (
    <>
      {NAV_ITEMS.map((item) => {
        const isActive = item.path === pathname;
        return (
          <div
            key={item.path}
            className={`block px-4 py-3 rounded-xl text-base font-semibold transition-colors ${isActive
              ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400'
              : 'text-brand-600 dark:text-brand-300 opacity-50'
              }`}
          >
            {item.name}
          </div>
        );
      })}
    </>
  );
}


export default function Navbar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const { cartCount, setIsCartOpen } = useCart();
  
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchVal, setSearchVal] = useState('');

  // Sync searchVal with URL search param on load
  useEffect(() => {
    const q = searchParams.get('search');
    if (q) setSearchVal(q);
  }, [searchParams]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) {
      router.push(`/productos?search=${encodeURIComponent(searchVal.trim())}`);
    } else {
      router.push('/productos');
    }
  };

  return (
    <header
      id="main-navbar"
      className={`top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled
        ? 'fixed shadow-md py-3 bg-white dark:bg-brand-950 border-b border-brand-200 dark:border-brand-800'
        : 'absolute py-3.5 border-b border-transparent shadow-sm'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between min-h-[64px]">
          {/* Left: Logo & Search Bar */}
          <div className="flex items-center space-x-4 sm:space-x-6 flex-grow md:flex-grow-0">
            <BrandLogo />
            
            {/* Desktop/Tablet Search Input */}
            <form onSubmit={handleSearchSubmit} className="hidden sm:flex items-center w-56 md:w-72 lg:w-80 bg-brand-950/60 hover:bg-brand-900/80 focus-within:bg-brand-950/95 backdrop-blur-md border border-amber-500/30 hover:border-amber-500/50 focus-within:border-amber-400 focus-within:ring-1 focus-within:ring-amber-400/50 rounded-full pl-4 pr-2 py-1.5 shadow-[0_2px_12px_rgba(0,0,0,0.4)] focus-within:shadow-[0_0_20px_rgba(245,158,11,0.25)] transition-all duration-300">
              <input
                type="text"
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                placeholder="Buscar licores, hielos..."
                className="w-full bg-transparent text-white text-xs sm:text-sm font-medium focus:outline-none placeholder-brand-300/60 tracking-wide"
              />
              <button type="submit" className="text-amber-400 hover:text-amber-300 hover:scale-110 transition-all cursor-pointer p-1 shrink-0 ml-1 rounded-full hover:bg-amber-400/10 flex items-center justify-center" aria-label="Buscar">
                <Search className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Right: Navigation menu & Mobile controls */}
          <div className="flex items-center space-x-4">
            {/* Desktop Horizontal Nav (Moved to the right) */}
            <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
              <Suspense fallback={<DesktopNavFallback pathname={pathname} />}>
                <DesktopNavLinks pathname={pathname} />
              </Suspense>
            </nav>

            {/* Desktop Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="hidden md:flex items-center relative btn-spotlight p-2.5 rounded-xl text-brand-800 hover:text-brand-950 dark:text-brand-100 dark:hover:text-white transition-all cursor-pointer"
              aria-label="Carrito de compras"
            >
              <ShoppingBag className="w-5 h-5 text-amber-500 hover:scale-105 transition-transform" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-brand-950 font-black text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center border border-brand-950 shadow-md">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Actions & Menu */}
            <div className="flex md:hidden items-center space-x-2">
              {/* Mobile Cart Button */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative btn-spotlight p-2.5 rounded-xl text-brand-600 dark:text-brand-300 hover:bg-brand-100 dark:hover:bg-brand-800 transition-colors cursor-pointer"
                aria-label="Carrito de compras"
              >
                <ShoppingBag className="w-5.5 h-5.5 text-amber-500" />
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 bg-amber-500 text-brand-950 font-black text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center border border-brand-950 shadow-md">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Mobile Quick Search (Expands mobile drawer + focus) */}
              <button
                onClick={() => {
                  setIsOpen(true);
                  setTimeout(() => {
                    document.getElementById('mobile-search-input')?.focus();
                  }, 120);
                }}
                className="btn-spotlight p-2.5 rounded-xl text-brand-600 dark:text-brand-300 hover:bg-brand-100 dark:hover:bg-brand-800 transition-colors cursor-pointer"
                aria-label="Buscar"
              >
                <Search className="w-6 h-6" />
              </button>

              <button
                id="mobile-menu-btn"
                onClick={() => setIsOpen(!isOpen)}
                className="btn-spotlight p-2.5 rounded-xl text-brand-600 dark:text-brand-300 hover:bg-brand-100 dark:hover:bg-brand-800 transition-colors"
                aria-label="Menu"
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-brand-200 dark:border-brand-800 bg-white dark:bg-brand-950 overflow-hidden"
          >
            <div className="px-4 pt-4 pb-6 space-y-4">
              {/* Mobile Search Bar inside Drawer */}
              <form
                onSubmit={(e) => {
                  handleSearchSubmit(e);
                  setIsOpen(false);
                }}
                className="flex items-center w-full bg-brand-950/70 border border-amber-500/30 focus-within:border-amber-400 rounded-full pl-4 pr-2 py-2 shadow-[0_2px_10px_rgba(0,0,0,0.3)]"
              >
                <input
                  id="mobile-search-input"
                  type="text"
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  placeholder="Buscar licores, hielos..."
                  className="w-full bg-transparent text-white text-sm font-medium focus:outline-none placeholder-brand-300/60"
                />
                <button type="submit" className="text-amber-400 hover:text-amber-300 transition-colors cursor-pointer p-1 shrink-0 ml-1.5 rounded-full hover:bg-amber-400/10 flex items-center justify-center" aria-label="Buscar">
                  <Search className="w-4 h-4" />
                </button>
              </form>

              <div className="space-y-1">
                <Suspense fallback={<MobileNavFallback pathname={pathname} />}>
                  <MobileNavLinks pathname={pathname} setIsOpen={setIsOpen} />
                </Suspense>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
