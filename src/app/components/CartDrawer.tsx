'use client';

import { motion, AnimatePresence } from 'motion/react';
import { X, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/app/context/CartContext';

export function CartDrawer() {
  const router = useRouter();
  const { items, removeItem, updateQuantity, isCartOpen, setIsCartOpen, totalPrice } = useCart();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[60] backdrop-blur-sm"
            onClick={() => setIsCartOpen(false)}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full max-w-md bg-white z-[60] shadow-2xl flex flex-col"
          >
            <div className="p-4 border-b flex items-center justify-between bg-white">
              <div className="flex items-center gap-2">
                <ShoppingBag className="size-5" />
                <span className="font-serif text-xl font-bold">Таны сагс ({items.length})</span>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 space-y-4">
                  <ShoppingBag className="size-16 opacity-20" />
                  <p>Таны сагс хоосон байна</p>
                  <button 
                    onClick={() => setIsCartOpen(false)}
                    className="text-accent underline hover:text-accent/80"
                  >
                    Худалдан авалт хийх
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="flex gap-4 p-4 bg-gray-50 rounded-lg group">
                    <div className="size-20 bg-white rounded-md overflow-hidden shrink-0 border border-gray-200">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="font-medium text-sm line-clamp-2">{item.name}</h4>
                          <button 
                            onClick={() => removeItem(item.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors p-1"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                        <div className="text-accent font-bold mt-1">
                          {item.price.toLocaleString()}₮
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center border border-gray-200 rounded-md bg-white h-8">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="px-2 hover:bg-gray-50 h-full flex items-center justify-center transition-colors disabled:opacity-50"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="size-3" />
                          </button>
                          <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="px-2 hover:bg-gray-50 h-full flex items-center justify-center transition-colors"
                          >
                            <Plus className="size-3" />
                          </button>
                        </div>
                        <div className="text-xs text-gray-500 ml-auto">
                          Нийт: {(item.price * item.quantity).toLocaleString()}₮
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="p-4 border-t bg-white space-y-4">
                <div className="flex items-center justify-between text-lg font-bold">
                  <span>Нийт дүн:</span>
                  <span className="text-accent">{totalPrice.toLocaleString()}₮</span>
                </div>
                <button 
                  onClick={() => {
                    setIsCartOpen(false);
                    router.push('/checkout');
                  }}
                  className="w-full py-3.5 bg-accent text-white font-bold uppercase tracking-wider rounded hover:bg-accent/90 transition-colors shadow-lg shadow-accent/20">
                  Төлбөр төлөх
                </button>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="w-full py-3 border-2 border-gray-200 text-gray-600 font-bold uppercase tracking-wider rounded hover:bg-gray-50 transition-colors"
                >
                  Худалдан авалтаа үргэлжлүүлэх
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
