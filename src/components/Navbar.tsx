'use client';

import { useState, useEffect, Suspense, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { Menu, X, Search, ChevronDown, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { useCategories } from '@/hooks/useCategories';
import { useProducts } from '@/hooks/useProducts';

interface NavItem {
  name: string;
  path: string;
}

const NAV_ITEMS: NavItem[] = [
  { name: 'Inicio', path: '/' },
  { name: 'Hielos', path: '/productos?category=hielos' },
  { name: 'Bebidas', path: '/productos?category=bebidas' },
  { name: 'Promociones', path: '/productos?filter=promo' },
  { name: 'Quiénes Somos', path: '/quienes-somos' },
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
  const { categories, subcategories } = useCategories();

  const drinkCategories = categories.filter(c => {
    const idLower = c.id.toLowerCase();
    return idLower !== 'hielos' && idLower !== 'hielo' && idLower !== 'bebidas';
  });

  const desiredOrder = ['licores', 'vinos', 'cigarros', 'espumantes', 'cervezas'];
  const sortedDrinkCategories = [...drinkCategories].sort((a, b) => {
    const aIndex = desiredOrder.indexOf(a.id.toLowerCase());
    const bIndex = desiredOrder.indexOf(b.id.toLowerCase());
    if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;
    return a.name.localeCompare(b.name);
  });

  const activeCategories = sortedDrinkCategories.length > 0 ? sortedDrinkCategories : [
    { id: 'licores', name: 'Licores' },
    { id: 'vinos', name: 'Vinos' },
    { id: 'cigarros', name: 'Cigarros' },
    { id: 'cervezas', name: 'Cervezas' }
  ];

  const dynamicCategories = activeCategories.map(cat => {
    const catIdLower = cat.id.toLowerCase();
    const catSubs = subcategories.filter(sub => sub.category_id.toLowerCase() === catIdLower);
    
    const items = catSubs.map(sub => {
      const subIdLower = sub.id.toLowerCase();
      let path = '';
      
      if (subIdLower === 'licor-del-mes') {
        path = `/productos?category=bebidas&subcategory=${catIdLower}&filter=mes`;
      } else if (subIdLower === 'bodega-del-mes') {
        path = `/productos?category=bebidas&subcategory=${catIdLower}&filter=bodega-mes`;
      } else if (subIdLower === 'alta-gama') {
        path = `/productos?category=bebidas&subcategory=${catIdLower}&filter=alta-gama`;
      } else if (subIdLower === 'listos-para-tomar') {
        path = `/productos?category=bebidas&subcategory=${catIdLower}&filter=rtd`;
      } else if (subIdLower === 'cervezas-nacionales') {
        path = `/productos?category=bebidas&subcategory=${catIdLower}&filter=nacionales`;
      } else if (subIdLower === 'cervezas-importadas') {
        path = `/productos?category=bebidas&subcategory=${catIdLower}&filter=importadas`;
      } else if (subIdLower === 'otros-licores') {
        path = `/productos?category=bebidas&subcategory=${catIdLower}&filter=otros`;
      } else if (subIdLower === 'complementos-de-licores') {
        path = `/productos?category=bebidas&subcategory=${catIdLower}&filter=complementos`;
      } else if (subIdLower === 'cervezas-artesanales') {
        path = `/productos?category=bebidas&subcategory=${catIdLower}&search=Artesanal`;
      } else {
        path = `/productos?category=bebidas&subcategory=${catIdLower}&search=${encodeURIComponent(sub.name)}`;
      }
      
      return {
        name: sub.name,
        path
      };
    });

    return {
      title: cat.name,
      items: items.length > 0 ? items : [
        { 
          name: `Ver todo ${cat.name}`, 
          path: catIdLower === 'cigarros' 
            ? '/productos?category=cigarros' 
            : `/productos?category=bebidas&subcategory=${catIdLower}` 
        }
      ]
    };
  });

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
                className={`btn-spotlight relative px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-colors drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)] flex items-center gap-1 ${isActive
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
                  <div className="grid gap-6" style={{ gridTemplateColumns: `repeat(${Math.max(1, dynamicCategories.length)}, minmax(0, 1fr))` }}>
                    {dynamicCategories.map((cat) => (
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
                  <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-end text-xs">
                    {BEBIDAS_MEGAMENU.footer.map((item) => (
                      <Link
                        key={item.name}
                        href={item.path}
                        className="font-extrabold text-brand-300 hover:text-amber-400 transition-colors bg-white/5 px-3 py-1 rounded-lg border border-white/5"
                      >
                        {item.name}
                      </Link>
                    ))}
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
            className={`btn-spotlight relative px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-colors drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)] ${isActive
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
            className={`relative px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-colors flex items-center gap-1 ${isActive
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
  const { categories, subcategories } = useCategories();
  const [bebidasOpen, setBebidasOpen] = useState(false);
  const [activeSubSection, setActiveSubSection] = useState<string | null>(null);

  const drinkCategories = categories.filter(c => {
    const idLower = c.id.toLowerCase();
    return idLower !== 'hielos' && idLower !== 'hielo' && idLower !== 'bebidas';
  });

  const desiredOrder = ['licores', 'vinos', 'cigarros', 'espumantes', 'cervezas'];
  const sortedDrinkCategories = [...drinkCategories].sort((a, b) => {
    const aIndex = desiredOrder.indexOf(a.id.toLowerCase());
    const bIndex = desiredOrder.indexOf(b.id.toLowerCase());
    if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;
    return a.name.localeCompare(b.name);
  });

  const activeCategories = sortedDrinkCategories.length > 0 ? sortedDrinkCategories : [
    { id: 'licores', name: 'Licores' },
    { id: 'vinos', name: 'Vinos' },
    { id: 'cigarros', name: 'Cigarros' },
    { id: 'cervezas', name: 'Cervezas' }
  ];

  const dynamicCategories = activeCategories.map(cat => {
    const catIdLower = cat.id.toLowerCase();
    const catSubs = subcategories.filter(sub => sub.category_id.toLowerCase() === catIdLower);
    
    const items = catSubs.map(sub => {
      const subIdLower = sub.id.toLowerCase();
      let path = '';
      
      if (subIdLower === 'licor-del-mes') {
        path = `/productos?category=bebidas&subcategory=${catIdLower}&filter=mes`;
      } else if (subIdLower === 'bodega-del-mes') {
        path = `/productos?category=bebidas&subcategory=${catIdLower}&filter=bodega-mes`;
      } else if (subIdLower === 'alta-gama') {
        path = `/productos?category=bebidas&subcategory=${catIdLower}&filter=alta-gama`;
      } else if (subIdLower === 'listos-para-tomar') {
        path = `/productos?category=bebidas&subcategory=${catIdLower}&filter=rtd`;
      } else if (subIdLower === 'cervezas-nacionales') {
        path = `/productos?category=bebidas&subcategory=${catIdLower}&filter=nacionales`;
      } else if (subIdLower === 'cervezas-importadas') {
        path = `/productos?category=bebidas&subcategory=${catIdLower}&filter=importadas`;
      } else if (subIdLower === 'otros-licores') {
        path = `/productos?category=bebidas&subcategory=${catIdLower}&filter=otros`;
      } else if (subIdLower === 'complementos-de-licores') {
        path = `/productos?category=bebidas&subcategory=${catIdLower}&filter=complementos`;
      } else if (subIdLower === 'cervezas-artesanales') {
        path = `/productos?category=bebidas&subcategory=${catIdLower}&search=Artesanal`;
      } else {
        path = `/productos?category=bebidas&subcategory=${catIdLower}&search=${encodeURIComponent(sub.name)}`;
      }
      
      return {
        name: sub.name,
        path
      };
    });

    return {
      title: cat.name,
      items: items.length > 0 ? items : [
        { 
          name: `Ver todo ${cat.name}`, 
          path: catIdLower === 'cigarros' 
            ? '/productos?category=cigarros' 
            : `/productos?category=bebidas&subcategory=${catIdLower}` 
        }
      ]
    };
  });

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
                    {dynamicCategories.map((cat) => (
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

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const [showSuggestions, setShowSuggestions] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const { products } = useProducts();
  const searchRef = useRef<HTMLDivElement>(null);

  // Filter matching products
  const matchingProducts = searchVal.trim()
    ? products.filter((p) =>
        p.name?.toLowerCase().includes(searchVal.toLowerCase()) ||
        p.brand?.toLowerCase().includes(searchVal.toLowerCase()) ||
        p.category?.toLowerCase().includes(searchVal.toLowerCase())
      ).slice(0, 5)
    : [];



  // Reset focus index when input changes
  useEffect(() => {
    setFocusedIndex(-1);
  }, [searchVal]);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const totalItems = 1 + matchingProducts.length;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedIndex((prev) => (prev + 1) % totalItems);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedIndex((prev) => (prev - 1 + totalItems) % totalItems);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    } else if (e.key === 'Enter') {
      if (focusedIndex >= 0) {
        e.preventDefault();
        if (focusedIndex === 0) {
          router.push(`/productos?search=${encodeURIComponent(searchVal.trim())}`);
        } else {
          const prod = matchingProducts[focusedIndex - 1];
          router.push(`/productos/${prod.id}`);
        }
        setShowSuggestions(false);
      }
    }
  };

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
          <div className="flex items-center space-x-3 sm:space-x-5 flex-grow md:flex-grow-0 shrink-0">
            <BrandLogo />
            
            {/* Desktop/Tablet Search Input Wrapper with Autocomplete */}
            <div ref={searchRef} className="relative hidden sm:block">
              <form
                onSubmit={handleSearchSubmit}
                className="flex items-center w-40 sm:w-48 md:w-52 lg:w-68 xl:w-80 bg-brand-950/60 hover:bg-brand-900/80 focus-within:bg-brand-950/95 backdrop-blur-md border border-amber-500/30 hover:border-amber-500/50 focus-within:border-amber-400 focus-within:ring-1 focus-within:ring-amber-400/50 rounded-full pl-4 pr-2 py-1.5 shadow-[0_2px_12px_rgba(0,0,0,0.4)] focus-within:shadow-[0_0_20px_rgba(245,158,11,0.25)] transition-all duration-300"
              >
                <input
                  type="text"
                  value={searchVal}
                  onChange={(e) => {
                    setSearchVal(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  onKeyDown={handleKeyDown}
                  placeholder="Buscar licores, hielos..."
                  className="w-full bg-transparent text-white text-xs sm:text-sm font-medium focus:outline-none placeholder-brand-300/60 tracking-wide"
                />
                <button type="submit" className="text-amber-400 hover:text-amber-300 hover:scale-110 transition-all cursor-pointer p-1 shrink-0 ml-1 rounded-full hover:bg-amber-400/10 flex items-center justify-center" aria-label="Buscar">
                  <Search className="w-4 h-4" />
                </button>
              </form>

              {/* Suggestions Dropdown */}
              <AnimatePresence>
                {showSuggestions && searchVal.trim().length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 mt-2 w-full bg-brand-950/95 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 py-2 text-xs sm:text-sm"
                  >
                    {/* Option 0: General Text Search */}
                    <div
                      onClick={() => {
                        router.push(`/productos?search=${encodeURIComponent(searchVal.trim())}`);
                        setShowSuggestions(false);
                      }}
                      className={`flex items-center gap-2 px-4 py-2 cursor-pointer transition-colors ${
                        focusedIndex === 0 ? 'bg-white/10 text-amber-400' : 'text-brand-200 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <Search className="w-4 h-4 text-amber-500 shrink-0" />
                      <span>Buscar <span className="font-bold">"{searchVal}"</span></span>
                    </div>

                    {/* Suggested Products */}
                    {matchingProducts.length > 0 && (
                      <div className="mt-1 border-t border-white/5 pt-1">
                        <div className="px-4 py-1 text-[9px] font-black uppercase tracking-wider text-brand-400">
                          Productos
                        </div>
                        {matchingProducts.map((prod, idx) => {
                          const itemIndex = 1 + idx;
                          const isPromo = prod.isPromo && prod.promoPrice !== undefined;
                          return (
                            <div
                              key={prod.id}
                              onClick={() => {
                                router.push(`/productos/${prod.id}`);
                                setShowSuggestions(false);
                              }}
                              className={`flex items-center gap-3 px-4 py-2 cursor-pointer transition-colors ${
                                focusedIndex === itemIndex ? 'bg-white/10 text-amber-400' : 'text-brand-200 hover:bg-white/5 hover:text-white'
                              }`}
                            >
                              <img
                                src={prod.image}
                                alt={prod.name}
                                className="w-8 h-8 rounded object-cover bg-white/5 flex-shrink-0"
                              />
                              <div className="flex-grow min-w-0">
                                <div className="font-semibold truncate">{prod.name}</div>
                                <div className="text-[10px] text-brand-400 truncate">{prod.brand}</div>
                              </div>
                              <div className="text-right flex-shrink-0 font-extrabold text-[11px] sm:text-xs">
                                {isPromo ? (
                                  <div className="flex flex-col">
                                    <span className="text-amber-400">S/. {prod.promoPrice?.toFixed(2)}</span>
                                    <span className="text-[9px] text-brand-400 line-through">S/. {prod.price.toFixed(2)}</span>
                                  </div>
                                ) : (
                                  <span>S/. {prod.price.toFixed(2)}</span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* No matches */}
                    {matchingProducts.length === 0 && (
                      <div className="px-4 py-3 text-center text-xs text-brand-400 font-medium">
                        No se encontraron sugerencias
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right: Navigation menu & Mobile controls (with margin-left to prevent collision) */}
          <div className="flex items-center space-x-4 ml-6 md:ml-10 lg:ml-14 shrink-0">
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
              {isMounted && cartCount > 0 && (
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
                {isMounted && cartCount > 0 && (
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
