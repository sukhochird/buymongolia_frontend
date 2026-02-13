'use client';

import { useState, useEffect } from 'react';
import { ProductGrid, Product } from '@/app/components/ProductGrid';
import { Loader2 } from 'lucide-react';
import { getProducts } from '@/app/lib/api';

function mapApiProductToGrid(p: { id: number; name: string; price: number; image: string; discount?: number | null; is_pre_order?: boolean; category?: string }): Product {
  const rawPrice = Number(p.price) || 0;
  const discountPercent = p.discount != null && p.discount > 0 ? p.discount : undefined;
  const salePrice = discountPercent
    ? Math.round(rawPrice * (100 - discountPercent) / 100)
    : rawPrice;
  return {
    id: p.id,
    name: p.name,
    price: salePrice,
    image: p.image,
    discount: discountPercent,
    isPreOrder: p.is_pre_order,
    originalPrice: discountPercent ? rawPrice : undefined,
  };
}

interface FeaturedProductsSectionProps {
  /** Ангилал (slug) — өгвөл тухайн ангиллын онцлох бүтээгдэхүүн л харуулна */
  categorySlug?: string;
}

export function FeaturedProductsSection({ categorySlug }: FeaturedProductsSectionProps = {}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await getProducts({
          featured: true,
          category: categorySlug || undefined,
          page_size: 48,
        });
        setProducts((res.products || []).map(mapApiProductToGrid));
      } catch (error) {
        console.error('Failed to fetch featured products', error);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [categorySlug]);

  if (isLoading) {
    return (
      <section className="py-6 md:py-12 bg-white min-h-[400px] flex items-center justify-center">
         <Loader2 className="size-10 animate-spin text-gray-300" />
      </section>
    );
  }

  return (
    <ProductGrid 
      title="Онцлох бүтээгдэхүүн"
      subtitle="Таны сонголтод"
      products={products}
    />
  );
}
