'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, FreeMode } from 'swiper/modules';
import * as Icons from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';

import { CATEGORIES, PRODUCTS, Product } from '@/lib/mockData';

// Dynamic Icon rendering helper
function CategoryIcon({ name, className = "w-5 h-5" }: { name: string; className?: string }) {
  const IconComponent = (Icons as any)[name] || Icons.HelpCircle;
  return <IconComponent className={className} />;
}

export default function ProductsClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<number>(600);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [onlyPromo, setOnlyPromo] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState<boolean>(false);

  // Extract unique brands for filter checklist
  const brands = Array.from(new Set(PRODUCTS.map((p) => p.brand)));

  // Sync state with URL params
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    const filterParam = searchParams.get('filter');
    const idParam = searchParams.get('id');

    if (categoryParam) {
      setSelectedCategory(categoryParam);
    } else {
      setSelectedCategory('todos');
    }

    if (filterParam === 'promo') {
      setOnlyPromo(true);
    } else {
      setOnlyPromo(false);
    }

    if (idParam) {
      // If landing directly on a specific product ID, search for it
      const prod = PRODUCTS.find((p) => p.id === idParam);
      if (prod) {
        setSearchQuery(prod.name);
      }
    }
  }, [searchParams]);

  // Handle toggling brand checkboxes
  const handleBrandChange = (brand: string) => {
    if (selectedBrands.includes(brand)) {
      setSelectedBrands(selectedBrands.filter((b) => b !== brand));
    } else {
      setSelectedBrands([...selectedBrands, brand]);
    }
  };

  // Reset all filters
  const resetFilters = () => {
    setSelectedCategory('todos');
    setSearchQuery('');
    setMaxPrice(600);
    setSelectedBrands([]);
    setOnlyPromo(false);
    setSortBy('featured');
    router.replace('/productos');
  };

  // Filter & Sort computation
  const filteredProducts = PRODUCTS.filter((product) => {
    // 1. Category Filter
    if (selectedCategory !== 'todos' && product.category !== selectedCategory) {
      return false;
    }
    // 2. Search query Filter
    if (
      searchQuery &&
      !product.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !product.brand.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    // 3. Price Filter (using promo price if available, otherwise regular price)
    const activePrice = product.isPromo && product.promoPrice ? product.promoPrice : product.price;
    if (activePrice > maxPrice) {
      return false;
    }
    // 4. Brand Filter
    if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand)) {
      return false;
    }
    // 5. Promo Filter
    if (onlyPromo && !product.isPromo) {
      return false;
    }

    return true;
  }).sort((a, b) => {
    const priceA = a.isPromo && a.promoPrice ? a.promoPrice : a.price;
    const priceB = b.isPromo && b.promoPrice ? b.promoPrice : b.price;

    if (sortBy === 'price-asc') {
      return priceA - priceB;
    }
    if (sortBy === 'price-desc') {
      return priceB - priceA;
    }
    if (sortBy === 'rating') {
      return b.rating - a.rating;
    }
    // Featured default
    return 0;
  });

  return (
    <div className="w-full pb-16">
      {/* 1. Sutil Header Banner (Not very tall) */}
      <section className="relative h-[20vh] bg-brand-900 flex items-center overflow-hidden border-b border-brand-850">
        <div className="absolute inset-0 bg-brand-950/60 z-10" />
        <img
          src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1600&auto=format&fit=crop"
          alt="Banner Productos"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 z-20 flex items-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-white">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Catálogo de Productos</h1>
            <p className="text-xs sm:text-sm text-brand-300 mt-1">Explora mobiliario y accesorios optimizados para tu espacio.</p>
          </div>
        </div>
      </section>

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* 2. Horizontal Categories Carousel (Swiper.js) */}
        <section id="categories-carousel" className="mb-10 w-full relative">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-brand-500 dark:text-brand-400">Categorías</h3>
            <span className="text-xs text-primary-600 dark:text-primary-400 font-semibold md:hidden">Desliza para ver más →</span>
          </div>

          <Swiper
            modules={[Navigation, FreeMode]}
            spaceBetween={12}
            slidesPerView={'auto'}
            freeMode={true}
            navigation={true}
            className="categories-swiper py-2"
          >
            {/* "Todos" Slide */}
            <SwiperSlide className="!w-auto">
              <button
                onClick={() => {
                  setSelectedCategory('todos');
                  router.push('/productos');
                }}
                className={`flex items-center space-x-2 px-5 py-3 rounded-2xl text-sm font-semibold transition-all border shadow-sm ${
                  selectedCategory === 'todos'
                    ? 'bg-gradient-to-r from-primary-600 to-accent-pink text-white border-transparent'
                    : 'bg-white dark:bg-brand-900 border-brand-200 dark:border-brand-800 text-brand-700 dark:text-brand-300 hover:bg-brand-50 dark:hover:bg-brand-850'
                }`}
              >
                <Icons.Grid className="w-4 h-4" />
                <span>Todos los Productos</span>
              </button>
            </SwiperSlide>

            {CATEGORIES.map((cat) => (
              <SwiperSlide key={cat.id} className="!w-auto">
                <button
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    router.push(`/productos?category=${cat.id}`);
                  }}
                  className={`flex items-center space-x-2 px-5 py-3 rounded-2xl text-sm font-semibold transition-all border shadow-sm ${
                    selectedCategory === cat.id
                      ? 'bg-gradient-to-r from-primary-600 to-accent-pink text-white border-transparent'
                      : 'bg-white dark:bg-brand-900 border-brand-200 dark:border-brand-800 text-brand-700 dark:text-brand-300 hover:bg-brand-50 dark:hover:bg-brand-850'
                  }`}
                >
                  <CategoryIcon name={cat.icon} className="w-4 h-4" />
                  <span>{cat.name}</span>
                </button>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>

        {/* 3. Columns Layout: Left Filters, Right Grid */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Mobile Filter Toggle Button */}
          <div className="w-full flex items-center justify-between lg:hidden mb-4">
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl border border-brand-200 dark:border-brand-800 bg-white dark:bg-brand-900 text-sm font-semibold text-brand-700 dark:text-brand-300 w-full justify-center"
            >
              <Icons.SlidersHorizontal className="w-4 h-4" />
              <span>Mostrar Filtros</span>
            </button>
          </div>

          {/* Left Column Filters (Desktop Panel / Mobile Overlay) */}
          <AnimatePresence>
            {/* Desktop filter list (always visible on lg) */}
            <aside id="desktop-filters" className="hidden lg:block w-64 shrink-0 glass p-6 rounded-3xl sticky top-24 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-brand-200/50 dark:border-brand-800/50">
                <h3 className="font-bold text-brand-900 dark:text-white flex items-center space-x-2">
                  <Icons.SlidersHorizontal className="w-4 h-4" />
                  <span>Filtros</span>
                </h3>
                <button
                  onClick={resetFilters}
                  className="text-xs text-brand-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  Limpiar Todo
                </button>
              </div>

              {/* Price Range */}
              <div className="space-y-3">
                <h4 className="text-xs uppercase font-bold text-brand-400 tracking-wider">Precio Máximo</h4>
                <div className="flex items-center justify-between text-sm font-bold text-brand-850 dark:text-brand-200">
                  <span>S/ 0</span>
                  <span>S/ {maxPrice}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="600"
                  step="10"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-primary-600 h-1.5 bg-brand-200 dark:bg-brand-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* Brands Checkbox list */}
              <div className="space-y-3">
                <h4 className="text-xs uppercase font-bold text-brand-400 tracking-wider">Marcas</h4>
                <div className="space-y-2">
                  {brands.map((brand) => (
                    <label key={brand} className="flex items-center space-x-2.5 text-sm cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brand)}
                        onChange={() => handleBrandChange(brand)}
                        className="rounded border-brand-300 text-primary-600 focus:ring-primary-500 w-4 h-4"
                      />
                      <span className="text-brand-700 dark:text-brand-300">{brand}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Special Options */}
              <div className="space-y-3">
                <h4 className="text-xs uppercase font-bold text-brand-400 tracking-wider">Ofertas</h4>
                <label className="flex items-center space-x-2.5 text-sm cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={onlyPromo}
                    onChange={(e) => setOnlyPromo(e.target.checked)}
                    className="rounded border-brand-300 text-primary-600 focus:ring-primary-500 w-4 h-4"
                  />
                  <span className="text-brand-700 dark:text-brand-300 font-semibold text-accent-rose">Solo Promociones</span>
                </label>
              </div>
            </aside>

            {/* Mobile Filters Drawer Overlay */}
            {mobileFiltersOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm lg:hidden flex justify-end"
              >
                <motion.div
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'tween', duration: 0.3 }}
                  className="w-full max-w-sm bg-white dark:bg-brand-950 h-full p-6 flex flex-col justify-between overflow-y-auto"
                >
                  <div className="space-y-6">
                    <div className="flex items-center justify-between pb-4 border-b border-brand-200/50 dark:border-brand-800/50">
                      <h3 className="font-bold text-lg flex items-center space-x-2">
                        <Icons.SlidersHorizontal className="w-5 h-5" />
                        <span>Filtros</span>
                      </h3>
                      <button
                        onClick={() => setMobileFiltersOpen(false)}
                        className="p-1 rounded-lg hover:bg-brand-100 dark:hover:bg-brand-900"
                      >
                        <Icons.X className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Price Range */}
                    <div className="space-y-3">
                      <h4 className="text-xs uppercase font-bold text-brand-400 tracking-wider">Precio Máximo</h4>
                      <div className="flex items-center justify-between text-sm font-bold">
                        <span>S/ 0</span>
                        <span>S/ {maxPrice}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="600"
                        step="10"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(Number(e.target.value))}
                        className="w-full accent-primary-600 h-1.5 bg-brand-200 dark:bg-brand-800 rounded-lg cursor-pointer"
                      />
                    </div>

                    {/* Brands Checkbox */}
                    <div className="space-y-3">
                      <h4 className="text-xs uppercase font-bold text-brand-400 tracking-wider">Marcas</h4>
                      <div className="space-y-2">
                        {brands.map((brand) => (
                          <label key={brand} className="flex items-center space-x-2.5 text-sm cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={selectedBrands.includes(brand)}
                              onChange={() => handleBrandChange(brand)}
                              className="rounded border-brand-300 text-primary-600 focus:ring-primary-500 w-4 h-4"
                            />
                            <span className="text-brand-700 dark:text-brand-300">{brand}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Promo */}
                    <div className="space-y-3">
                      <h4 className="text-xs uppercase font-bold text-brand-400 tracking-wider">Ofertas</h4>
                      <label className="flex items-center space-x-2.5 text-sm cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={onlyPromo}
                          onChange={(e) => setOnlyPromo(e.target.checked)}
                          className="rounded border-brand-300 text-primary-600 focus:ring-primary-500 w-4 h-4"
                        />
                        <span className="text-brand-700 dark:text-brand-300 font-semibold text-accent-rose">Solo Promociones</span>
                      </label>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-brand-200/50 dark:border-brand-800/50 flex space-x-4">
                    <button
                      onClick={() => {
                        resetFilters();
                        setMobileFiltersOpen(false);
                      }}
                      className="flex-1 py-3 border border-brand-200 dark:border-brand-800 rounded-xl text-sm font-semibold hover:bg-brand-50"
                    >
                      Limpiar
                    </button>
                    <button
                      onClick={() => setMobileFiltersOpen(false)}
                      className="flex-1 py-3 bg-primary-600 text-white rounded-xl text-sm font-semibold hover:bg-primary-700"
                    >
                      Aplicar
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Right Column: Grid and Search */}
          <main className="flex-1 w-full space-y-6">
            
            {/* Header control: Search bar and sort dropdown */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 glass rounded-2xl">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <Icons.Search className="absolute left-3 top-3 w-4 h-4 text-brand-400" />
                <input
                  type="text"
                  placeholder="Buscar producto o marca..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-brand-200 dark:border-brand-800 bg-white dark:bg-brand-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 text-brand-850 dark:text-brand-200"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-3 text-brand-400 hover:text-brand-600"
                  >
                    <Icons.X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Sort selector */}
              <div className="flex items-center space-x-3 shrink-0">
                <span className="text-xs text-brand-400 font-medium">Ordenar por:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-brand-200 dark:border-brand-800 bg-white dark:bg-brand-900 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500 text-brand-850 dark:text-brand-200"
                >
                  <option value="featured">Recomendado</option>
                  <option value="price-asc">Precio: Menor a Mayor</option>
                  <option value="price-desc">Precio: Mayor a Menor</option>
                  <option value="rating">Calificación de Clientes</option>
                </select>
              </div>
            </div>

            {/* Product Counter */}
            <div className="text-sm font-semibold text-brand-500 dark:text-brand-400">
              Se encontraron {filteredProducts.length} productos
            </div>

            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => {
                  const discount = product.isPromo && product.promoPrice
                    ? Math.round(((product.price - product.promoPrice) / product.price) * 100)
                    : 0;

                  return (
                    <motion.div
                      layout
                      key={product.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className="glass rounded-3xl overflow-hidden flex flex-col hover:shadow-lg transition-all border border-brand-200/50 dark:border-brand-800/50"
                    >
                      {/* Image header */}
                      <div className="relative aspect-square w-full bg-brand-100 dark:bg-brand-900/50 overflow-hidden">
                        {product.isPromo && (
                          <span className="absolute top-3 left-3 z-10 px-2.5 py-1 text-xs font-bold text-white bg-accent-rose rounded-lg shadow-sm">
                            -{discount}%
                          </span>
                        )}
                        {product.countInStock <= 5 && (
                          <span className="absolute top-3 right-3 z-10 px-2 py-0.5 text-[10px] font-bold text-white bg-accent-amber rounded-lg shadow-sm">
                            Solo {product.countInStock} disp.
                          </span>
                        )}
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      {/* Info details */}
                      <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                        <div className="space-y-1">
                          <span className="text-xs uppercase font-bold text-brand-400 tracking-wider">
                            {product.brand}
                          </span>
                          <h4 className="text-base font-bold text-brand-900 dark:text-white line-clamp-1">
                            {product.name}
                          </h4>
                          <p className="text-xs text-brand-500 dark:text-brand-400 line-clamp-2 pt-1 h-8">
                            {product.description}
                          </p>

                          {/* Star Rating */}
                          <div className="flex items-center space-x-1 pt-2">
                            <Icons.Star className="w-3.5 h-3.5 text-accent-amber fill-accent-amber" />
                            <span className="text-xs font-bold text-brand-700 dark:text-brand-300">{product.rating}</span>
                          </div>
                        </div>

                        {/* Price footer */}
                        <div className="pt-3 border-t border-brand-200/50 dark:border-brand-800/50 flex items-center justify-between">
                          <div>
                            {product.isPromo && product.promoPrice ? (
                              <>
                                <span className="text-xs line-through text-brand-400 block">
                                  S/ {product.price.toFixed(2)}
                                </span>
                                <span className="text-lg font-extrabold text-accent-rose">
                                  S/ {product.promoPrice.toFixed(2)}
                                </span>
                              </>
                            ) : (
                              <span className="text-lg font-extrabold text-brand-900 dark:text-white">
                                S/ {product.price.toFixed(2)}
                              </span>
                            )}
                          </div>
                          <button
                            onClick={() => alert(`Añadiste "${product.name}" al carrito (Demostración)`)}
                            className="p-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white transition-colors"
                            aria-label="Agregar al carrito"
                          >
                            <Icons.ShoppingCart className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              // Empty State
              <div className="text-center py-16 p-8 glass rounded-3xl flex flex-col items-center justify-center space-y-4">
                <div className="p-4 rounded-full bg-brand-100 dark:bg-brand-900 text-brand-400">
                  <Icons.FolderOpen className="w-10 h-10" />
                </div>
                <h3 className="text-lg font-bold text-brand-900 dark:text-white">No se encontraron productos</h3>
                <p className="text-xs text-brand-500 max-w-sm">
                  Prueba cambiando los valores de tus filtros o buscando con otro término.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-5 py-2.5 bg-primary-600 text-white rounded-xl text-xs font-bold shadow-sm"
                >
                  Restaurar Filtros
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
