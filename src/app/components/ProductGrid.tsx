'use client';

import { ArrowRight, Heart } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { useFavorites } from '@/app/context/FavoritesContext';

export interface Product {
  id: number;
  name: string;
  /** Зарагдах үнэ (хямдрал байвал хямдруулсан) */
  price: number;
  installmentPrice?: number;
  image: string;
  discount?: number;
  /** Анхны үнэ (зурвастай харуулах, хямдралтай үед) */
  originalPrice?: number;
  isPreOrder?: boolean;
  deliveryDate?: string; // Added for Pre-order
  remainingStock?: number; // Added for Pre-order
}

interface ProductGridProps {
  title?: string; // Optional custom title
  subtitle?: string; // Optional subtitle
  products: Product[]; // Required data
  onProductClick?: (id: number) => void;
  onViewAll?: () => void;
  /** "Бүгдийг үзэх" товчны текст (жишээ: "Бүх бүтээгдэхүүн") */
  viewAllLabel?: string;
  /** Жагсаалтын доор "Бүгдийг үзэх" товч харуулах эсэх (desktop дээр ч) */
  showViewAllBelow?: boolean;
}

export function ProductGrid({ 
  title = "Онцлох бүтээгдэхүүн", 
  subtitle = "Таны сонголтод",
  products, 
  onProductClick, 
  onViewAll,
  viewAllLabel = "Бүгдийг үзэх",
  showViewAllBelow = false,
}: ProductGridProps) {
  const { toggleFavorite, isFavorite } = useFavorites();
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <section className="py-6 md:py-12 bg-white">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8">
        <div className="flex items-end justify-between mb-8 md:mb-10 pb-4 border-b border-border/50">
          <div>
            <span className="text-accent text-xs font-bold tracking-widest uppercase mb-2 block">{subtitle}</span>
            <h2 className="text-3xl md:text-4xl font-serif font-medium">{title}</h2>
          </div>
          <Link 
            href="/products"
            className="hidden md:flex items-center gap-2 text-sm font-medium hover:text-accent transition-colors group"
          >
            {viewAllLabel}
            <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10"
        >
          {products.map((product) => (
            <Link key={product.id} href={`/products/${product.id}`}>
            <motion.div
              variants={item}
              className="group cursor-pointer"
            >
              {/* Product Image */}
              <div className="relative aspect-[4/5] overflow-hidden rounded-md bg-[#F5F5F5] mb-4">
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
                  className={`absolute top-3 right-3 p-2 rounded-full transition-all z-20 ${
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
                  {product.isPreOrder && (
                    <span className="bg-white/90 backdrop-blur text-foreground px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider">
                      Захиалгаар
                    </span>
                  )}
                   {product.deliveryDate && (
                    <span className="bg-accent text-white px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider shadow-sm">
                      {product.deliveryDate}-нд ирнэ
                    </span>
                  )}
                </div>

                {/* Subtle Overlay on Hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
              </div>

              {/* Product Info */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium leading-tight line-clamp-2 group-hover:text-accent transition-colors min-h-[2.5em]">
                  {product.name}
                </h3>

                <div className="flex flex-col">
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-bold text-foreground">{product.price.toLocaleString()}₮</span>
                    {product.discount != null && product.discount > 0 && (
                      <span className="text-sm text-muted-foreground line-through decoration-destructive/50">
                        {(product.originalPrice ?? Math.round(product.price * 100 / (100 - product.discount))).toLocaleString()}₮
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
            </Link>
          ))}
        </motion.div>

        {/* View All Button — mobile дээр үргэлж, showViewAllBelow үед desktop дээр ч */}
        <div className={`mt-10 text-center ${showViewAllBelow ? '' : 'md:hidden'}`}>
          <Link 
            href="/products"
            className="inline-block px-8 py-3 border border-border rounded-full hover:border-black transition-colors font-medium text-sm"
          >
            {viewAllLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
