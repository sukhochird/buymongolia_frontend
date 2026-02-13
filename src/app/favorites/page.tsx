'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import { Heart, ShoppingBag, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useFavorites } from '@/app/context/FavoritesContext';
import { products } from '@/app/data/products';

export default function FavoritesPage() {
  const { favorites, toggleFavorite } = useFavorites();
  
  const favoriteProducts = products.filter(product => favorites.includes(product.id));

  return (
    <div className="bg-white min-h-screen animate-in fade-in duration-500">
      {/* Header */}
      <div className="border-b border-gray-100 bg-gray-50/50">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-8">
            <Link 
                href="/"
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-black mb-4 transition-colors"
            >
                <ArrowLeft className="size-4" />
                Нүүр хуудас руу буцах
            </Link>
          <h1 className="text-3xl md:text-4xl font-serif font-medium">Хүслийн жагсаалт</h1>
          <p className="text-gray-500 mt-2">Таны хадгалсан бүтээгдэхүүнүүд ({favoriteProducts.length})</p>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-12">
        {favoriteProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
            {favoriteProducts.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="group relative"
              >
                {/* Image */}
                <Link 
                    href={`/products/${product.id}`}
                    className="relative overflow-hidden rounded-md bg-[#F5F5F5] aspect-[4/5] mb-4 cursor-pointer block"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                  />
                  
                  {/* Remove Button */}
                  <button
                    onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(product.id);
                    }}
                    className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur rounded-full text-destructive hover:bg-destructive hover:text-white transition-all z-10"
                    title="Хасах"
                  >
                    <Heart className="size-5 fill-current" />
                  </button>

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-2 pointer-events-none">
                    {product.discount && (
                      <span className="bg-destructive text-white px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider">
                        -{product.discount}%
                      </span>
                    )}
                  </div>
                </Link>

                {/* Info */}
                <div className="space-y-2">
                  <div className="text-xs text-gray-500 mb-1">{product.category}</div>
                  <Link 
                    href={`/products/${product.id}`}
                    className="font-medium leading-tight text-sm line-clamp-2 min-h-[2.5em] group-hover:text-accent transition-colors cursor-pointer block"
                  >
                    {product.name}
                  </Link>

                  <div className="flex items-center justify-between">
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-bold text-foreground">{product.price.toLocaleString()}₮</span>
                      {product.discount && (
                        <span className="text-sm text-muted-foreground line-through decoration-destructive/50">
                          {Math.round(product.price * (100 / (100 - product.discount))).toLocaleString()}₮
                        </span>
                      )}
                    </div>
                    
                    <button 
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            toast.success('Сагсанд нэмэгдлээ');
                        }}
                        className="p-2 bg-black text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0"
                    >
                        <ShoppingBag className="size-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="bg-gray-50 size-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="size-8 text-gray-300" />
            </div>
            <h3 className="text-xl font-medium mb-2">Хүслийн жагсаалт хоосон байна</h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">Та өөрт таалагдсан бүтээгдэхүүнээ зүрхэн дээр дарж хадгалаарай.</p>
            <Link 
                href="/products"
                className="inline-block bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-black/90 transition-colors"
            >
                Бүтээгдэхүүн үзэх
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
