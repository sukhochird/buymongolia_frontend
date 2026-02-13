'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { Filter, ChevronDown, ChevronRight, LayoutGrid, List, Check, X, SlidersHorizontal, Heart, Loader2 } from 'lucide-react';
import { getCategories, getOccasions, getProducts } from '@/app/lib/api';
import type { ApiCategory, ApiProduct } from '@/app/lib/api';
import { useFavorites } from '@/app/context/FavoritesContext';
import { ProductGrid, Product } from '@/app/components/ProductGrid';

interface Category {
  id: number | string;
  name: string;
  slug: string;
  subcategories?: Category[];
}

/** API-ийн үнэ = анхны үнэ. Хямдралтай бол зарагдах үнийг тооцоолно. */
function toDisplayProduct(p: ApiProduct): ApiProduct & { originalPrice: number } {
  const rawPrice = Number(p.price) || 0;
  const discountPercent = p.discount != null && p.discount > 0 ? p.discount : null;
  const salePrice = discountPercent
    ? Math.round(rawPrice * (100 - discountPercent) / 100)
    : rawPrice;
  return {
    ...p,
    price: salePrice,
    originalPrice: rawPrice,
  };
}

function mapApiProductToGrid(p: ApiProduct): Product {
  const d = toDisplayProduct(p);
  return {
    id: d.id,
    name: d.name,
    price: d.price,
    image: d.image,
    discount: d.discount ?? undefined,
    isPreOrder: d.is_pre_order,
  };
}

function ProductsPageContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const categorySlug = searchParams.get('category');
  const occasionSlug = searchParams.get('occasion');
  const pageParam = searchParams.get('page');
  const currentPage = pageParam ? Math.max(1, parseInt(pageParam, 10) || 1) : 1;

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10_000_000]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const { toggleFavorite, isFavorite } = useFavorites();
  const [categories, setCategories] = useState<Category[]>([]);
  const [occasionCategory, setOccasionCategory] = useState<Category | null>(null);
  type ProductWithDisplayPrice = ApiProduct & { originalPrice: number };
  const [products, setProducts] = useState<ProductWithDisplayPrice[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [productsLoading, setProductsLoading] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  const PAGE_SIZE = 500;

  const setFilters = useCallback((params: { category?: string | null; occasion?: string | null; page?: number | null }) => {
    const next = new URLSearchParams(searchParams.toString());
    if (params.category !== undefined) {
      if (params.category) next.set('category', params.category);
      else next.delete('category');
    }
    if (params.occasion !== undefined) {
      if (params.occasion) next.set('occasion', params.occasion);
      else next.delete('occasion');
    }
    if (params.page !== undefined) {
      if (params.page != null && params.page > 1) next.set('page', String(params.page));
      else next.delete('page');
    }
    router.push(pathname + (next.toString() ? '?' + next.toString() : ''));
  }, [pathname, router, searchParams]);

  useEffect(() => {
    const load = async () => {
      try {
        const [cats, occasions] = await Promise.all([getCategories(), getOccasions(true)]);
        setCategories(cats as Category[]);
        setOccasionCategory({
          id: 'occasions',
          name: 'Баяр ёслол',
          slug: 'occasions',
          subcategories: occasions.map(o => ({ id: o.id, name: o.title, slug: o.slug, subcategories: [] })),
        });
        const firstSlug = cats[0]?.slug;
        if (firstSlug) setExpandedCategories(new Set([String(cats[0]?.id ?? 'flowers')]));
      } catch (e) {
        console.error('Products page: load categories', e);
      }
    };
    load();
  }, []);

  useEffect(() => {
    const load = async () => {
      setProductsLoading(true);
      try {
        const res = await getProducts({
          category: categorySlug || undefined,
          occasion: occasionSlug || undefined,
          page: currentPage,
          page_size: PAGE_SIZE,
        });
        setProducts((res.products || []).map(toDisplayProduct));
        setTotalCount(res.count);
        setTotalPages(res.total_pages);
      } catch (e) {
        console.error('Products page: load products', e);
      } finally {
        setProductsLoading(false);
      }
    };
    load();
  }, [categorySlug, occasionSlug, currentPage]);

  useEffect(() => {
    if (showMobileFilters) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [showMobileFilters]);

  const toggleCategory = (id: number | string) => {
    const key = String(id);
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(key)) newExpanded.delete(key);
    else newExpanded.add(key);
    setExpandedCategories(newExpanded);
  };

  const mainCategories = categories;
  const hasActiveFilter = Boolean(categorySlug || occasionSlug);

  const filteredProducts = products.filter(product =>
    product.price >= priceRange[0] && product.price <= priceRange[1]
  );

  const CategoryItem = ({ category, level = 0 }: { category: Category, level?: number }) => {
    const hasChildren = category.subcategories && category.subcategories.length > 0;
    const isExpanded = expandedCategories.has(String(category.id));
    const isSelected = categorySlug === category.slug;

    return (
      <div className="select-none">
        <div 
          className={`flex items-center justify-between py-1.5 cursor-pointer hover:text-accent transition-colors ${isSelected ? 'text-accent font-medium' : 'text-gray-600'}`}
          style={{ paddingLeft: `${level * 12}px` }}
        >
          <span onClick={() => { setFilters({ category: category.slug }); if (window.innerWidth < 1024) setShowMobileFilters(false); }}>
            {category.name}
          </span>
          
          {hasChildren && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                toggleCategory(category.id as number | string);
              }}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <ChevronDown className={`size-3.5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
            </button>
          )}
        </div>

        <AnimatePresence>
          {hasChildren && isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              {category.subcategories!.map(sub => (
                <CategoryItem key={sub.id} category={sub} level={level + 1} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="bg-white min-h-screen animate-in fade-in duration-500">
      {/* Header / Breadcrumb */}
      <div className="border-b border-gray-100 bg-gray-50/50">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-8">
          <nav className="text-sm text-gray-500 mb-4">
             <Link href="/" className="hover:text-black">Нүүр</Link>
             <span className="mx-2">/</span>
             <span className="text-black font-medium">Бүх бүтээгдэхүүн</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-serif font-medium">Бүтээгдэхүүний жагсаалт</h1>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <>
            {showMobileFilters && (
              <div 
                className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
                onClick={() => setShowMobileFilters(false)}
              />
            )}
            <aside className={`fixed inset-0 z-50 bg-white lg:bg-transparent lg:static lg:w-64 lg:block shrink-0 transition-transform duration-300 ${showMobileFilters ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
              <div className="h-full overflow-y-auto p-6 lg:p-0 safe-area-bottom">
                <div className="flex items-center justify-between lg:hidden mb-6">
                  <h2 className="text-xl font-bold font-serif">Шүүлтүүр</h2>
                  <button onClick={() => setShowMobileFilters(false)} className="p-2 -mr-2 text-gray-500 hover:bg-gray-100 rounded-full">
                      <X className="size-6" />
                  </button>
                </div>

                {/* Main Categories (Flowers, Gifts, Plants) */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                      Төрөл
                    </h3>
                    {hasActiveFilter && (
                      <button 
                        onClick={() => { setFilters({ category: null, occasion: null }); if (window.innerWidth < 1024) setShowMobileFilters(false); }}
                        className="text-xs text-muted-foreground hover:text-accent underline"
                      >
                        Арилгах
                      </button>
                    )}
                  </div>
                  
                  <div className="space-y-1">
                    {/* All Option */}
                    <div 
                      className={`cursor-pointer hover:text-accent transition-colors py-1.5 ${!categorySlug && !occasionSlug ? 'text-accent font-medium' : 'text-gray-600'}`}
                      onClick={() => { setFilters({ category: null, occasion: null }); if (window.innerWidth < 1024) setShowMobileFilters(false); }}
                    >
                      Бүгд
                    </div>

                    {/* Recursive Tree for Main Categories */}
                    {mainCategories.map(category => (
                      <CategoryItem key={category.id} category={category} />
                    ))}
                  </div>
                </div>

                {/* Occasions (Баяр ёслол) — slug-аар шүүлт */}
                {occasionCategory && (
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-lg flex items-center gap-2">
                        Баяр ёслол
                      </h3>
                      {occasionSlug && (
                        <button 
                          onClick={() => { setFilters({ occasion: null }); if (window.innerWidth < 1024) setShowMobileFilters(false); }}
                          className="text-xs text-muted-foreground hover:text-accent underline"
                        >
                          Арилгах
                        </button>
                      )}
                    </div>
                    <div className="space-y-1">
                      {occasionCategory.subcategories?.map(sub => (
                        <div
                          key={sub.id}
                          className={`cursor-pointer py-1.5 hover:text-accent transition-colors ${occasionSlug === sub.slug ? 'text-accent font-medium' : 'text-gray-600'}`}
                          onClick={() => { setFilters({ occasion: sub.slug }); if (window.innerWidth < 1024) setShowMobileFilters(false); }}
                        >
                          {sub.name}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Price Range (Simplified) */}
                <div className="pb-8 lg:pb-0">
                  <h3 className="font-bold text-lg mb-4">Үнэ</h3>
                  <div className="space-y-4">
                    <input 
                      type="range" 
                      min="0" 
                      max="10000000" 
                      step="1000"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                      className="w-full accent-accent"
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>0₮</span>
                      <span>{priceRange[1].toLocaleString()}₮</span>
                    </div>
                  </div>
                  
                  {/* Mobile Apply Button */}
                  <div className="mt-8 lg:hidden">
                    <button 
                        onClick={() => setShowMobileFilters(false)}
                        className="w-full bg-accent text-white py-3 rounded-lg font-bold uppercase tracking-wide"
                    >
                        Үр дүнг харах
                    </button>
                  </div>
                </div>
              </div>
            </aside>
          </>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm py-3 mb-6 border-b border-gray-100 -mx-4 px-4 md:mx-0 md:px-0 md:static md:bg-transparent md:border-none md:py-0 md:mb-8 transition-all">
              <div className="flex items-center justify-between gap-4">
                {/* Mobile Filter Trigger */}
                <button 
                    onClick={() => setShowMobileFilters(true)}
                    className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-black transition-colors shadow-sm"
                >
                    <SlidersHorizontal className="size-4" />
                    Шүүлтүүр
                </button>

                <p className="text-gray-600 hidden md:block">
                  Нийт <span className="font-bold text-black">{filteredProducts.length}</span> бүтээгдэхүүн олдлоо
                </p>
                
                <div className="flex items-center gap-2 ml-auto">
                  {/* View Mode */}
                  <div className="hidden sm:flex items-center border border-gray-200 rounded-md bg-white">
                    <button 
                      onClick={() => setViewMode('grid')}
                      className={`p-2 transition-colors ${viewMode === 'grid' ? 'bg-gray-100 text-black' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                      <LayoutGrid className="size-5" />
                    </button>
                    <div className="w-px h-6 bg-gray-200" />
                    <button 
                      onClick={() => setViewMode('list')}
                      className={`p-2 transition-colors ${viewMode === 'list' ? 'bg-gray-100 text-black' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                      <List className="size-5" />
                    </button>
                  </div>

                  {/* Sort */}
                  <div className="relative group">
                    <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg bg-white hover:border-gray-300 transition-colors text-sm font-medium whitespace-nowrap">
                      <span className="hidden sm:inline">Эрэмбэлэх</span>
                      <span className="sm:hidden">Эрэмбэ</span>
                      <ChevronDown className="size-4" />
                    </button>
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2 md:hidden">
                Нийт <span className="font-bold text-black">{filteredProducts.length}</span> бүтээгдэхүүн
              </p>
            </div>

            {/* Products Grid/List */}
            {productsLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="size-10 animate-spin text-gray-300" />
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className={`grid gap-x-6 gap-y-10 ${
                viewMode === 'grid' 
                  ? 'grid-cols-2 md:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {filteredProducts.map((product) => (
                  <Link key={product.id} href={`/products/${product.id}`}>
                  <motion.div
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={`group cursor-pointer ${viewMode === 'list' ? 'flex gap-6 items-center' : ''}`}
                  >
                    {/* Image */}
                    <div className={`relative overflow-hidden rounded-md bg-[#F5F5F5] ${viewMode === 'grid' ? 'aspect-[4/5] mb-4' : 'w-48 aspect-[4/5] shrink-0'}`}>
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                      />
                      
                      {/* Favorite Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(product.id);
                        }}
                        className={`absolute top-3 right-3 p-2 rounded-full transition-all z-10 ${
                          isFavorite(product.id) 
                            ? 'bg-destructive text-white' 
                            : 'bg-white/80 backdrop-blur text-gray-500 hover:text-destructive'
                        }`}
                        title={isFavorite(product.id) ? "Хүслийн жагсаалтаас хасах" : "Хүслийн жагсаалтад нэмэх"}
                      >
                        <Heart className={`size-5 ${isFavorite(product.id) ? 'fill-current' : ''}`} />
                      </button>

                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
                        {product.discount && (
                          <span className="bg-destructive text-white px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider">
                            -{product.discount}%
                          </span>
                        )}
                        {product.is_pre_order && (
                          <span className="bg-white/90 backdrop-blur text-foreground px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider">
                            Захиалгаар
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Info */}
                    <div className="space-y-2 flex-1">
                      <div className="text-xs text-gray-500 mb-1">{product.category}</div>
                      <h3 className={`font-medium leading-tight group-hover:text-accent transition-colors ${viewMode === 'grid' ? 'text-sm line-clamp-2 min-h-[2.5em]' : 'text-xl'}`}>
                        {product.name}
                      </h3>

                      <div className="flex flex-col">
                        <div className="flex items-baseline gap-2">
                          <span className="text-lg font-bold text-foreground">{product.price.toLocaleString()}₮</span>
                          {product.discount && product.originalPrice != null && (
                            <span className="text-sm text-muted-foreground line-through decoration-destructive/50">
                              {product.originalPrice.toLocaleString()}₮
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {viewMode === 'list' && (
                        <p className="text-gray-500 text-sm mt-4 line-clamp-2">
                          Энэхүү тансаг зэрэглэлийн баглаа нь таны сэтгэлийн үгийг илэрхийлэх төгс бэлэг юм. Шинэхэн, анхилуун үнэртэй цэцэгс.
                        </p>
                      )}
                    </div>
                  </motion.div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="py-20 text-center text-gray-500">
                <Filter className="size-12 mx-auto mb-4 opacity-20" />
                <p>Бүтээгдэхүүн олдсонгүй.</p>
                <button 
                  onClick={() => {
                    setFilters({ category: null, occasion: null });
                    setPriceRange([0, 10_000_000]);
                  }}
                  className="mt-4 text-accent underline hover:text-accent/80"
                >
                  Шүүлтүүрийг цэвэрлэх
                </button>
              </div>
            )}
            
            {/* Pagination — бүтээгдэхүүн байхгүй бол харагдахгүй */}
            {totalPages > 1 && totalCount > 0 && (
              <div className="mt-16 flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setFilters({ page: currentPage - 1 })}
                  disabled={currentPage <= 1}
                  className="size-10 flex items-center justify-center rounded border border-gray-200 hover:border-black disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Өмнөх
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(p => {
                    if (totalPages <= 7) return true;
                    if (p === 1 || p === totalPages) return true;
                    if (p >= currentPage - 2 && p <= currentPage + 2) return true;
                    return false;
                  })
                  .reduce<number[]>((acc, p, i, arr) => {
                    if (i > 0 && p - (arr[i - 1] ?? 0) > 1) acc.push(-1);
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((p, i) =>
                    p === -1 ? (
                      <span key={`ellipsis-${i}`} className="px-1 text-gray-400">…</span>
                    ) : (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setFilters({ page: p })}
                        className={`size-10 flex items-center justify-center rounded border transition-colors ${
                          currentPage === p ? 'bg-black text-white border-black' : 'border-gray-200 hover:border-black'
                        }`}
                      >
                        {p}
                      </button>
                    )
                  )}
                <button
                  type="button"
                  onClick={() => setFilters({ page: currentPage + 1 })}
                  disabled={currentPage >= totalPages}
                  className="size-10 flex items-center justify-center rounded border border-gray-200 hover:border-black disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Дараах
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center">
          <Loader2 className="size-10 animate-spin text-gray-300" />
        </div>
      }
    >
      <ProductsPageContent />
    </Suspense>
  );
}
