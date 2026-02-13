'use client';

import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { ArrowRight, ChevronLeft, ChevronRight, ArrowUpRight, Loader2 } from 'lucide-react';
import { useCallback, useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { getHeroSlides, getHeroBanners } from '@/app/lib/api';

type Slide = {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  button: string;
  link?: string;
  theme: string;
};

type Banner = {
  id: number;
  image: string;
  alt: string;
  link: string;
};

export function HeroSection() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 6000, stopOnInteraction: false }),
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  
  const [slides, setSlides] = useState<Slide[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [slidesData, bannersData] = await Promise.all([
          getHeroSlides(true),
          getHeroBanners(true),
        ]);
        setSlides(slidesData);
        setBanners(bannersData);
      } catch (error) {
        console.error('Failed to fetch hero data', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const onInit = useCallback((emblaApi: any) => {
    setScrollSnaps(emblaApi.scrollSnapList());
  }, []);

  const onSelect = useCallback((emblaApi: any) => {
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    onInit(emblaApi);
    onSelect(emblaApi);
    emblaApi.on('reInit', onInit);
    emblaApi.on('reInit', onSelect);
    emblaApi.on('select', onSelect);
  }, [emblaApi, onInit, onSelect]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  if (isLoading) {
    return (
      <section className="pt-6 pb-2 md:pt-8 md:pb-4 bg-white relative z-0 h-[450px]">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 h-full flex items-center justify-center">
          <Loader2 className="size-8 animate-spin text-gray-400" />
        </div>
      </section>
    );
  }

  return (
    <section className="pt-6 pb-2 md:pt-8 md:pb-4 bg-white relative z-0">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8">
        {/* Responsive Grid */}
        <div className="grid lg:grid-cols-3 gap-4 lg:gap-6">
          
          {/* Main Slider */}
          <div className="lg:col-span-2 relative rounded-2xl overflow-hidden group h-[300px] lg:h-[420px]">
            {slides.length > 0 && (
              <>
                <div className="absolute z-10 top-1/2 -translate-y-1/2 left-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={scrollPrev}
                    className="p-2 bg-white/20 hover:bg-white/40 backdrop-blur-md text-white rounded-full transition-colors"
                  >
                    <ChevronLeft className="size-6" />
                  </button>
                </div>
                <div className="absolute z-10 top-1/2 -translate-y-1/2 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={scrollNext}
                    className="p-2 bg-white/20 hover:bg-white/40 backdrop-blur-md text-white rounded-full transition-colors"
                  >
                    <ChevronRight className="size-6" />
                  </button>
                </div>

                <div className="overflow-hidden h-full" ref={emblaRef}>
                  <div className="flex h-full">
                    {slides.map((slide) => (
                      <div key={slide.id} className="relative flex-[0_0_100%] min-w-0 h-full">
                        <img
                          src={slide.image}
                          alt={slide.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
                        
                        <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-12 text-white">
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="max-w-xl"
                          >
                            <h2 className="text-2xl md:text-4xl lg:text-5xl font-serif font-medium leading-tight mb-3 whitespace-pre-line">
                              {slide.title}
                            </h2>
                            <p className="text-sm md:text-lg text-white/90 mb-5 md:mb-7 font-light">
                              {slide.subtitle}
                            </p>
                            {slide.link ? (
                              slide.link.startsWith('http://') || slide.link.startsWith('https://') ? (
                                <a href={slide.link} target="_blank" rel="noopener noreferrer" className="bg-white text-black px-5 py-2.5 md:px-7 md:py-3 rounded-full font-medium hover:bg-accent hover:text-white transition-colors inline-flex items-center gap-2 text-sm">
                                  {slide.button}
                                  <ArrowRight className="size-4" />
                                </a>
                              ) : (
                                <a href={slide.link} className="bg-white text-black px-5 py-2.5 md:px-7 md:py-3 rounded-full font-medium hover:bg-accent hover:text-white transition-colors inline-flex items-center gap-2 text-sm">
                                  {slide.button}
                                  <ArrowRight className="size-4" />
                                </a>
                              )
                            ) : (
                              <span className="bg-white text-black px-5 py-2.5 md:px-7 md:py-3 rounded-full font-medium inline-flex items-center gap-2 text-sm">
                                {slide.button}
                                <ArrowRight className="size-4" />
                              </span>
                            )}
                          </motion.div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Indicators */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                  {scrollSnaps.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => scrollTo(index)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        index === selectedIndex ? 'w-8 bg-white' : 'w-2 bg-white/50 hover:bg-white/80'
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Side Banners */}
          <div className="lg:col-span-1 grid grid-cols-2 lg:grid-cols-1 gap-4 lg:gap-6 h-auto">
            {banners.map((banner) => {
              const hasLink = Boolean(banner.link);
              const isExternal = hasLink && (banner.link!.startsWith('http://') || banner.link!.startsWith('https://'));
              const className = 'relative rounded-2xl overflow-hidden h-[160px] lg:h-[190px] group cursor-pointer block';
              const content = (
                <>
                  <img
                    src={banner.image}
                    alt={banner.alt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                  <div className="absolute bottom-4 right-4 z-10">
                    <div className="bg-white/30 backdrop-blur-md p-2.5 rounded-full text-white group-hover:bg-white group-hover:text-black transition-all shadow-lg">
                      <ArrowUpRight className="size-5" />
                    </div>
                  </div>
                </>
              );
              return hasLink ? (
                <a key={banner.id} href={banner.link!} className={className} {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                  {content}
                </a>
              ) : (
                <div key={banner.id} className={className}>{content}</div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
