'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { Toaster } from 'sonner';
import { Header } from '@/app/components/Header';
import { Footer } from '@/app/components/Footer';
import { CartDrawer } from '@/app/components/CartDrawer';
import { CartProvider } from '@/app/context/CartContext';
import { FavoritesProvider } from '@/app/context/FavoritesContext';

interface ClientLayoutProps {
  children: ReactNode;
}

export function ClientLayout({ children }: ClientLayoutProps) {
  const pathname = usePathname();
  const hideFooterOnMobile =
    pathname === '/products' || (pathname?.startsWith('/products/') && pathname !== '/products');

  return (
    <CartProvider>
      <FavoritesProvider>
        <div className="min-h-screen flex flex-col">
          <Toaster position="top-center" expand={true} richColors />
          <Header />
          <CartDrawer />
          <main className="flex-1">{children}</main>
          <div className={hideFooterOnMobile ? 'hidden md:block' : ''}>
            <Footer />
          </div>
        </div>
      </FavoritesProvider>
    </CartProvider>
  );
}
