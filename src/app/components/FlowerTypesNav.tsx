'use client';

import { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, SlidersHorizontal, Loader2 } from 'lucide-react';
import { getCategories } from '@/app/lib/api';

interface Category {
  id: number;
  name: string;
  slug: string;
  subcategories?: Category[];
}

interface FlowerTypesNavProps {
  /** Сонгосон ангиллын slug — 'all' эсвэл категорийн slug */
  activeType?: string;
  /** Ангилал солиход дуудагдана */
  onActiveTypeChange?: (slug: string) => void;
}

export function FlowerTypesNav({ activeType: controlledActive, onActiveTypeChange }: FlowerTypesNavProps = {}) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [internalActive, setInternalActive] = useState('all');
  const [flowerTypes, setFlowerTypes] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const activeType = controlledActive ?? internalActive;
  const setActiveType = (slug: string) => {
    if (onActiveTypeChange) onActiveTypeChange(slug);
    else setInternalActive(slug);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categories = await getCategories();
        const flowersCategory = categories.find(c => c.slug === 'flowers' || c.name.toLowerCase().includes('цэцэг'));
        if (flowersCategory?.subcategories?.length) {
          setFlowerTypes(flowersCategory.subcategories as Category[]);
        }
      } catch (error) {
        console.error('Failed to fetch categories', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 5);
    }
  };

  useEffect(() => {
    if (!isLoading) {
      checkScroll();
      window.addEventListener('resize', checkScroll);
      return () => window.removeEventListener('resize', checkScroll);
    }
  }, [isLoading]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (isLoading) {
    return (
      <section className="bg-white/80 backdrop-blur-xl border-y border-border/40 sticky top-[73px] md:top-[80px] z-40 h-[60px] flex items-center justify-center">
        <Loader2 className="size-5 animate-spin text-gray-400" />
      </section>
    );
  }

  return (
    <section className="bg-white/80 backdrop-blur-xl border-y border-border/40 sticky top-[73px] md:top-[80px] z-40 transition-all duration-300">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8">
        <div className="flex items-center gap-4 py-3">
          
          {/* Filter Icon */}
          <button className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-md hover:bg-secondary/50 shrink-0">
            <SlidersHorizontal className="size-4" />
            <span className="hidden md:inline">Шүүлтүүр</span>
          </button>

          <div className="h-6 w-px bg-border/60 shrink-0 mx-2" />

          {/* Navigation Wrapper */}
          <div className="relative flex-1 min-w-0">
             {/* Left Arrow */}
            <button 
              onClick={() => scroll('left')}
              className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 p-1.5 bg-white shadow-sm rounded-full border border-border transition-all ${
                showLeftArrow ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 pointer-events-none'
              }`}
            >
              <ChevronLeft className="size-3 text-muted-foreground" />
            </button>

            <div 
              ref={scrollContainerRef}
              onScroll={checkScroll}
              className="flex items-center gap-2 overflow-x-auto scrollbar-hide w-full px-1"
            >
              <button
                onClick={() => setActiveType('all')}
                className={`px-4 py-1.5 rounded-full whitespace-nowrap text-sm font-medium transition-all duration-200 border ${
                  activeType === 'all'
                    ? 'bg-primary text-white border-primary shadow-sm'
                    : 'bg-transparent text-muted-foreground border-transparent hover:bg-secondary hover:text-foreground'
                }`}
              >
                Бүгд
              </button>
              
              {flowerTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setActiveType(type.slug)}
                  className={`px-4 py-1.5 rounded-full whitespace-nowrap text-sm font-medium transition-all duration-200 border ${
                    activeType === type.slug
                      ? 'bg-primary text-white border-primary shadow-sm'
                      : 'bg-transparent text-muted-foreground border-transparent hover:bg-secondary hover:text-foreground'
                  }`}
                >
                  {type.name}
                </button>
              ))}
            </div>

            {/* Right Arrow */}
            <button 
              onClick={() => scroll('right')}
              className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 p-1.5 bg-white shadow-sm rounded-full border border-border transition-all ${
                showRightArrow ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 pointer-events-none'
              }`}
            >
              <ChevronRight className="size-3 text-muted-foreground" />
            </button>

            {/* Gradient Masks */}
            <div className={`absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white via-white/80 to-transparent pointer-events-none transition-opacity ${showLeftArrow ? 'opacity-100' : 'opacity-0'}`} />
            <div className={`absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white via-white/80 to-transparent pointer-events-none transition-opacity ${showRightArrow ? 'opacity-100' : 'opacity-0'}`} />
          </div>
        </div>
      </div>
    </section>
  );
}
