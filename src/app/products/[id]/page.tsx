'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { Minus, Plus, ShoppingCart, Heart, Share2, Truck, ShieldCheck, Clock, ArrowLeft, RefreshCw, MapPin, HelpCircle, X, Phone, Loader2, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { useCart } from '@/app/context/CartContext';
import { useFavorites } from '@/app/context/FavoritesContext';
import { DirectCheckoutModal } from '@/app/components/DirectCheckoutModal';
import { getProduct, getProducts } from '@/app/lib/api';

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice: number;
  discount?: number;
  description: string;
  images: string[];
  sku: string;
  category: string;
  availability: string;
  supplier: string;
  details: {
    type?: string;
    count?: string;
    packaging?: string;
    height?: string;
  };
  stock?: number;
  isSoldOut?: boolean;
}

interface SimilarProduct {
  id: number;
  name: string;
  price: number;
  image: string;
  discount?: number;
  category: string;
}

export default function ProductDetailPage() {
  const params = useParams();
  const id = params?.id as string | undefined;
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [selectedImage, setSelectedImage] = useState(0);
  const [isStoreInfoOpen, setIsStoreInfoOpen] = useState(false);
  const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [isFullscreenGalleryOpen, setIsFullscreenGalleryOpen] = useState(false);
  const { addItem } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const [product, setProduct] = useState<Product | null>(null);
  const [similarProducts, setSimilarProducts] = useState<SimilarProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [shareCopied, setShareCopied] = useState(false);

  useEffect(() => {
    if (!isFullscreenGalleryOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsFullscreenGalleryOpen(false);
      if (!product) return;
      if (e.key === 'ArrowLeft') setSelectedImage((i) => (i <= 0 ? product.images.length - 1 : i - 1));
      if (e.key === 'ArrowRight') setSelectedImage((i) => (i >= product.images.length - 1 ? 0 : i + 1));
    };
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [isFullscreenGalleryOpen, product]);

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      try {
        const p = await getProduct(Number(id));
        const discountPercent = p.discount != null && p.discount > 0 ? p.discount : undefined;
        const originalPrice = p.old_price ?? p.price;
        const salePrice = discountPercent
          ? Math.round(p.price * (100 - discountPercent) / 100)
          : p.price;
        setProduct({
          id: p.id,
          name: p.name,
          price: salePrice,
          originalPrice: discountPercent ? p.price : originalPrice,
          discount: discountPercent,
          description: p.description,
          images: p.images?.length ? p.images : (p.image ? [p.image] : []),
          sku: p.sku,
          category: p.category,
          availability: p.availability,
          supplier: p.supplier,
          details: (p.details as Product['details']) ?? {},
          stock: p.stock,
          isSoldOut: p.is_sold_out ?? (typeof p.stock === 'number' && p.stock <= 0),
        });
        const sameCategoryRes = await getProducts({ category: p.category });
        const others = sameCategoryRes.products.filter(x => x.id !== p.id).slice(0, 4);
        setSimilarProducts(others.map(o => ({
          id: o.id,
          name: o.name,
          price: o.price,
          image: o.image,
          discount: o.discount ?? undefined,
          category: o.category,
        })));
      } catch (error) {
        console.error('Failed to fetch product detail', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => prev > 1 ? prev - 1 : 1);

  const handleShare = async () => {
    if (!product || typeof window === 'undefined') return;
    const url = window.location.href;
    const title = product.name;
    try {
      if (navigator.share) {
        await navigator.share({ title, url, text: title });
      } else {
        await navigator.clipboard.writeText(url);
        setShareCopied(true);
        setTimeout(() => setShareCopied(false), 2000);
      }
    } catch (err) {
      if ((err as Error).name === 'AbortError') return;
      try {
        await navigator.clipboard.writeText(url);
        setShareCopied(true);
        setTimeout(() => setShareCopied(false), 2000);
      } catch {
        console.error('Share failed', err);
      }
    }
  };

  const soldOut = product ? (product.isSoldOut ?? (typeof product.stock === 'number' && product.stock <= 0)) : false;

  const handleAddToCart = () => {
    if (!product || soldOut) return;
    addItem({
      id: product.sku,
      name: product.name,
      price: product.price,
      image: product.images?.[0] ?? '',
      quantity: quantity
    });
  };

  const handleBuyNow = () => {
    if (soldOut) return;
    setIsCheckoutModalOpen(true);
  };

  if (isLoading || !product) {
    return (
        <div className="bg-background min-h-screen flex items-center justify-center">
             <Loader2 className="size-10 animate-spin text-muted-foreground" />
        </div>
    );
  }

  return (
    <div className="bg-background min-h-screen pb-32 md:pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <DirectCheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        product={{
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.images?.[0] ?? '',
          quantity,
        }}
      />
      {/* Store Info Modal */}
      <AnimatePresence>
        {isStoreInfoOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-[70] backdrop-blur-sm"
              onClick={() => setIsStoreInfoOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-card border border-border z-[70] rounded-xl shadow-2xl overflow-hidden p-6"
            >
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-serif font-bold">Дэлгүүрийн хаяг</h3>
                    <button onClick={() => setIsStoreInfoOpen(false)} className="p-2 hover:bg-secondary rounded-full transition-colors">
                        <X className="size-5" />
                    </button>
                </div>
                
                <div className="space-y-6">
                    <div className="flex gap-4">
                        <div className="size-10 bg-accent/10 rounded-full flex items-center justify-center shrink-0">
                            <MapPin className="size-5 text-accent" />
                        </div>
                        <div>
                            <h4 className="font-medium mb-2">Хаяг</h4>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                              Улаанбаатар хот, Сүхбаатар дүүрэг, 1-р хороо, Seoul Business Center, 6-р давхар, 605 тоот оффис, Ulaanbaatar, Mongolia, 14446
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="size-10 bg-accent/10 rounded-full flex items-center justify-center shrink-0">
                            <Clock className="size-5 text-accent" />
                        </div>
                        <div>
                            <h4 className="font-medium mb-1">Цагийн хуваарь</h4>
                            <p className="text-muted-foreground text-sm">Өдөр бүр: 09:00 - 21:00</p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="size-10 bg-accent/10 rounded-full flex items-center justify-center shrink-0">
                            <Phone className="size-5 text-accent" />
                        </div>
                        <div>
                            <h4 className="font-medium mb-1">Холбоо барих</h4>
                            <a href="tel:76073333" className="text-muted-foreground text-sm hover:text-accent transition-colors">7607-3333</a>
                        </div>
                    </div>
                </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Хүргэлт & Буцаалт Modal */}
      <AnimatePresence>
        {isDeliveryModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-[70] backdrop-blur-sm"
              onClick={() => setIsDeliveryModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg max-h-[85vh] bg-card border border-border z-[70] rounded-xl shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b border-border shrink-0">
                <h3 className="text-xl font-serif font-bold flex items-center gap-2">
                  <Truck className="size-5 text-accent" />
                  Илгээлт & Буцаалт
                </h3>
                <button
                  onClick={() => setIsDeliveryModalOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Хаах"
                >
                  <X className="size-5" />
                </button>
              </div>
              <div className="p-6 overflow-y-auto text-muted-foreground text-sm space-y-6">
                <section>
                  <h4 className="font-semibold text-foreground mb-2">Хүргэлтийн нөхцөл</h4>
                  <p className="mb-3">Дижитал бүтээгдэхүүн тул бүх захиалга <strong>имэйлээр</strong> илгээгдэнэ. Төлбөр баталгаажсаны дараа захиалга өгөхдөө таны оруулсан имэйл хаяг руу лиценз/код илгээгдэнэ. Нэмэлт хүргэлтийн төлбөр байхгүй.</p>
                </section>
                <section>
                  <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <RefreshCw className="size-4 text-accent" />
                    Буцаалтын нөхцөл
                  </h4>
                  <p>
                    Дижитал бүтээгдэхүүний буцаалтын нөхцөл бүтээгдэхүүн бүрээс хамаарна. Асуудал гарвал бидэнтэй холбогдоно уу.
                  </p>
                </section>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Navigation Bar for Detail Page */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border px-4 py-4 md:px-8">
        <div className="max-w-[1440px] mx-auto flex items-center gap-4">
          <Link 
            href="/"
            className="flex items-center gap-2 text-sm font-medium hover:text-accent transition-colors"
          >
            <ArrowLeft className="size-4" />
            Буцах
          </Link>
          <div className="h-4 w-px bg-border" />
          <nav className="text-sm text-muted-foreground hidden md:block">
            <Link href="/" className="hover:text-black">Нүүр</Link>
            <span className="mx-2">/</span>
            <Link href="/products" className="hover:text-black">Бүтээгдэхүүн</Link>
            <span className="mx-2">/</span>
            <span className="text-black font-medium truncate">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Left Column - Images */}
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Thumbnails */}
            <div className="flex lg:flex-col gap-4 order-2 lg:order-1 lg:w-24 shrink-0 overflow-x-auto scrollbar-hide py-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative aspect-square lg:w-full w-20 shrink-0 rounded-md overflow-hidden border-2 transition-all ${
                    selectedImage === idx ? 'border-accent ring-2 ring-accent/20' : 'border-transparent hover:border-border'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Main Image — дарж fullscreen слайдер нээнэ */}
            <div
              className="flex-1 aspect-[4/5] max-h-[70vh] min-h-[280px] bg-muted rounded-lg overflow-hidden relative group order-1 lg:order-2 cursor-zoom-in"
              onClick={() => setIsFullscreenGalleryOpen(true)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && setIsFullscreenGalleryOpen(true)}
              aria-label="Зургийг томруулж үзэх"
            >
              <motion.img
                key={selectedImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                src={product.images[selectedImage] ?? product.images?.[0]}
                alt={product.name}
                className="w-full h-full object-cover pointer-events-none"
              />
              <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setIsFullscreenGalleryOpen(true); }}
                  className="p-2 bg-card rounded-full shadow-md hover:bg-secondary transition-colors border border-border"
                  title="Томруулж үзэх"
                >
                  <Maximize2 className="size-4 text-muted-foreground" />
                </button>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); handleShare(); }}
                  className="p-2 bg-card rounded-full shadow-md hover:bg-secondary transition-colors border border-border"
                  title="Хуваалцах"
                >
                  <Share2 className="size-4 text-muted-foreground" />
                </button>
                <button 
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(product.id);
                  }}
                  className={`p-2 rounded-full shadow-md transition-colors ${
                    isFavorite(product.id) 
                        ? 'bg-destructive text-white' 
                        : 'bg-card hover:bg-secondary text-muted-foreground border border-border'
                  }`}
                  title={isFavorite(product.id) ? "Хүслийн жагсаалтаас хасах" : "Хүслийн жагсаалтад нэмэх"}
                >
                  <Heart className={`size-4 ${isFavorite(product.id) ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>

            {/* Fullscreen зургийн слайдер — гадна талд дархад хаагдана */}
            <AnimatePresence>
              {isFullscreenGalleryOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="fixed inset-0 z-50 flex flex-col bg-black/95"
                  onClick={() => setIsFullscreenGalleryOpen(false)}
                >
                  <div className="flex-1 flex items-center justify-center min-h-0 p-4 md:p-12">
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setSelectedImage((i) => (i <= 0 ? product.images.length - 1 : i - 1)); }}
                      className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                      aria-label="Өмнөх"
                    >
                      <ChevronLeft className="size-8" />
                    </button>
                    <motion.img
                      key={selectedImage}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      src={product.images[selectedImage] ?? product.images?.[0]}
                      alt={product.name}
                      className="max-w-full max-h-[85vh] w-auto h-auto object-contain select-none cursor-default"
                      draggable={false}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setSelectedImage((i) => (i >= product.images.length - 1 ? 0 : i + 1)); }}
                      className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                      aria-label="Дараах"
                    >
                      <ChevronRight className="size-8" />
                    </button>
                  </div>
                  <div className="flex justify-center gap-2 py-4 pb-safe" onClick={(e) => e.stopPropagation()}>
                    {product.images.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedImage(idx)}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          selectedImage === idx ? 'bg-background' : 'bg-background/40 hover:bg-background/60'
                        }`}
                        aria-label={`Зураг ${idx + 1}`}
                      />
                    ))}
                  </div>
                  <p className="text-center text-white/70 text-sm pb-2" onClick={(e) => e.stopPropagation()}>
                    {selectedImage + 1} / {product.images.length}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Column - Product Info */}
          <div className="flex flex-col h-full">
            <div className="mb-6">
              <h1 className="text-2xl md:text-3xl font-sans font-medium leading-tight mb-2">
                {product.name}
              </h1>
              
              <div className="flex items-end gap-3 mb-6 flex-wrap">
                {(product.isSoldOut ?? (typeof product.stock === 'number' && product.stock <= 0)) && (
                  <span className="bg-muted-foreground text-background px-3 py-1 rounded text-sm font-bold uppercase tracking-wider">
                    Дууссан
                  </span>
                )}
                <span className="text-3xl font-bold text-accent">{product.price.toLocaleString()}₮</span>
                {(product.discount != null && product.discount > 0) && (
                  <>
                    <span className="text-lg text-muted-foreground line-through mb-1">{product.originalPrice.toLocaleString()}₮</span>
                    <span className="mb-1 text-xs font-bold text-white bg-destructive px-2 py-0.5 rounded">-{product.discount}%</span>
                  </>
                )}
              </div>

              <div
                className="text-muted-foreground leading-relaxed mb-8 [&_p]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_h2]:font-semibold [&_h2]:mt-4 [&_h3]:font-medium [&_a]:text-accent [&_a]:underline [&_strong]:font-semibold"
                dangerouslySetInnerHTML={{ __html: product.description || '' }}
              />

              {/* Actions */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-border rounded-md bg-input-background">
                    <button 
                      onClick={decrementQuantity}
                      disabled={soldOut}
                      className="p-3 hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Minus className="size-4" />
                    </button>
                    <span className="w-12 text-center font-medium">{quantity}</span>
                    <button 
                      onClick={incrementQuantity}
                      disabled={soldOut}
                      className="p-3 hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="size-4" />
                    </button>
                  </div>
                  <div className="text-sm font-medium text-foreground">
                    Нийт дүн: <span className="text-accent text-lg ml-1">{(product.price * quantity).toLocaleString()}₮</span>
                  </div>
                </div>

                <div className="hidden md:grid grid-cols-2 gap-4">
                  <button 
                    onClick={handleAddToCart}
                    disabled={soldOut}
                    className="flex items-center justify-center gap-2 px-8 py-3.5 border-2 border-accent text-accent font-bold uppercase tracking-wider rounded hover:bg-accent hover:text-accent-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:border-muted-foreground disabled:text-muted-foreground disabled:hover:bg-transparent disabled:hover:text-muted-foreground"
                  >
                    <ShoppingCart className="size-4" />
                    Сагсанд хийх
                  </button>
                  <button 
                    onClick={handleBuyNow}
                    disabled={soldOut}
                    className="flex items-center justify-center gap-2 px-8 py-3.5 bg-accent text-accent-foreground font-bold uppercase tracking-wider rounded hover:bg-accent/90 transition-colors shadow-lg shadow-accent/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-muted"
                  >
                    Худалдаж авах
                  </button>
                </div>
                {soldOut && (
                  <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2">
                    Энэ бүтээгдэхүүн одоогоор дууссан тул захиалах боломжгүй.
                  </p>
                )}
              </div>

              {/* Additional Info Block */}
              <div className="border-t border-border pt-6 space-y-6">
                {/* Top Links */}
                <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm text-muted-foreground">
                   <button
                     type="button"
                     onClick={() => setIsDeliveryModalOpen(true)}
                     className="flex items-center gap-2 hover:text-accent transition-colors"
                   >
                     <Truck className="size-4" /> <span>Илгээлт & Буцаалт</span>
                   </button>
                   <div className="h-4 w-px bg-border hidden sm:block"></div>
                   <button className="flex items-center gap-2 hover:text-accent transition-colors">
                     <HelpCircle className="size-4" /> <span>Асуулт асуух</span>
                   </button>
                   <div className="h-4 w-px bg-border hidden sm:block"></div>
                   <button
                     type="button"
                     onClick={handleShare}
                     className="flex items-center gap-2 hover:text-accent transition-colors"
                   >
                     <Share2 className="size-4" /> <span>{shareCopied ? 'Холбоос хуулсан!' : 'Хуваалцах'}</span>
                   </button>
                </div>

                {/* Delivery Details */}
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-start gap-3">
                    <Clock className="size-4 mt-0.5" />
                    <span><span className="font-medium text-foreground">Илгээлт:</span> Имэйлээр илгээгдэнэ (нэмэлт төлбөргүй). Захиалга өгөхдөө оруулсан имэйл руу код очно.</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <RefreshCw className="size-4 mt-0.5" />
                     <span><span className="font-medium text-foreground">Буцаалт:</span> Дижитал бүтээгдэхүүний буцаалтын нөхцөл бүтээгдэхүүнээс хамаарна.</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="size-4 mt-0.5" />
                    <button onClick={() => setIsStoreInfoOpen(true)} className="underline hover:text-accent">Дэлгүүрийн мэдээлэл харах</button>
                  </div>
                </div>

                {/* Meta Info */}
                <div className="border-t border-gray-200 pt-6 space-y-2 text-sm">
                  <div className="grid grid-cols-[120px_1fr] gap-2">
                    <span className="text-muted-foreground">Бүтээгдэхүүний код:</span>
                    <span className="font-medium text-foreground">{product.sku || '—'}</span>
                  </div>
                  <div className="grid grid-cols-[120px_1fr] gap-2">
                    <span className="text-muted-foreground">Ангилал:</span>
                    <span className="font-medium text-foreground">{product.category || '—'}</span>
                  </div>
                  <div className="grid grid-cols-[120px_1fr] gap-2">
                    <span className="text-muted-foreground">Тоо ширхэг:</span>
                    <span className="font-medium text-foreground">{product.details?.count || '—'}</span>
                  </div>
                  <div className="grid grid-cols-[120px_1fr] gap-2">
                    <span className="text-muted-foreground">Баглаа боодол:</span>
                    <span className="font-medium text-foreground">{product.details?.packaging || '—'}</span>
                  </div>
                  <div className="grid grid-cols-[120px_1fr] gap-2">
                    <span className="text-muted-foreground">Өндөр:</span>
                    <span className="font-medium text-foreground">{product.details?.height || '—'}</span>
                  </div>
                </div>

                {/* Safe Checkout */}
                <div className="border-t border-border pt-6">
                  <h4 className="font-medium text-sm mb-3">Төлбөрийн найдвартай байдал:</h4>
                  <div className="flex flex-wrap gap-2">
                    {['Visa', 'Mastercard', 'QPay', 'SocialPay', 'MonPay'].map(method => (
                      <div key={method} className="h-8 px-3 border border-border rounded bg-muted text-xs font-bold text-muted-foreground flex items-center justify-center select-none">
                        {method}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-16 md:mt-24 mb-20">
          <div className="flex items-center gap-8 border-b border-border mb-8 overflow-x-auto">
            {['description', 'delivery'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 text-sm font-bold uppercase tracking-wider transition-colors whitespace-nowrap ${
                  activeTab === tab
                    ? 'text-accent border-b-2 border-accent'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab === 'description' && 'Дэлгэрэнгүй'}
                {tab === 'delivery' && 'Илгээлтийн нөхцөл'}
              </button>
            ))}
          </div>

          <div className="min-h-[200px] text-muted-foreground leading-relaxed max-w-3xl">
            {activeTab === 'description' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div
                  className="mb-4 [&_p]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_h2]:font-semibold [&_h2]:mt-4 [&_h3]:font-medium [&_h3]:mt-3 [&_a]:text-accent [&_a]:underline [&_strong]:font-semibold"
                  dangerouslySetInnerHTML={{ __html: product.description || '' }}
                />
                {(product.details?.count || product.details?.packaging || product.details?.height) && (
                  <ul className="list-disc pl-5 space-y-2 mt-4">
                    {product.details?.count && <li>Тоо ширхэг: {product.details.count}</li>}
                    {product.details?.packaging && <li>Баглаа боодол: {product.details.packaging}</li>}
                    {product.details?.height && <li>Өндөр: {product.details.height}</li>}
                  </ul>
                )}
              </motion.div>
            )}
            {activeTab === 'delivery' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <p className="mb-4">Дижитал бүтээгдэхүүн тул бүх захиалга <strong>имэйлээр</strong> илгээгдэнэ. Төлбөр баталгаажсаны дараа захиалга өгөхдөө таны оруулсан имэйл хаяг руу лиценз/код илгээгдэнэ. Нэмэлт хүргэлтийн төлбөр байхгүй.</p>
              </motion.div>
            )}
            </div>
        </div>

        {/* Similar Products Section */}
        <div className="border-t border-border pt-20">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl md:text-3xl font-serif font-bold">Төстэй бүтээгдэхүүнүүд</h2>
            <Link 
                href="/products"
                className="text-sm font-medium border-b border-black pb-0.5 hover:text-accent hover:border-accent transition-colors"
            >
                Бүгдийг үзэх
            </Link>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {similarProducts.map((item) => (
              <Link 
                key={item.id} 
                href={`/products/${item.id}`}
                className="group cursor-pointer block"
              >
                <div className="aspect-[4/5] bg-[#F5F5F5] rounded-lg overflow-hidden relative mb-4">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  {item.discount && (
                    <span className="absolute top-2 left-2 bg-destructive text-white px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider">
                      -{item.discount}%
                    </span>
                  )}
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">{item.category}</div>
                  <h3 className="font-medium text-sm leading-tight mb-2 line-clamp-2 group-hover:text-accent transition-colors min-h-[2.5em]">
                    {item.name}
                  </h3>
                  <div className="flex items-baseline gap-2">
                    <span className="font-bold">{item.price.toLocaleString()}₮</span>
                    {item.discount && (
                      <span className="text-xs text-muted-foreground line-through">
                        {Math.round(item.price * (100 / (100 - item.discount))).toLocaleString()}₮
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
      
      {/* Mobile Sticky Action Bar */}
      <div className="fixed bottom-0 inset-x-0 z-50 bg-background border-t border-border p-4 md:hidden safe-area-bottom shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div className="flex gap-3">
          <button 
            onClick={handleAddToCart}
            disabled={soldOut}
            className="flex-1 flex items-center justify-center gap-2 h-12 border border-accent text-accent font-bold rounded-lg hover:bg-accent/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:border-muted disabled:text-muted-foreground"
          >
            <ShoppingCart className="size-5" />
          </button>
          <button 
            onClick={handleBuyNow}
            disabled={soldOut}
            className="flex-[3] h-12 bg-accent text-accent-foreground font-bold rounded-lg shadow-lg shadow-accent/20 hover:bg-accent/90 transition-colors uppercase tracking-wide text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-muted"
          >
            Худалдаж авах
          </button>
        </div>
      </div>
    </div>
  );
}
