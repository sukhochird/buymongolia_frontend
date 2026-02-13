'use client';

import { motion } from 'motion/react';
import { ArrowUpRight, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getOccasions } from '@/app/lib/api';

interface OccasionItem {
  id: number;
  name: string;
  slug: string;
  image?: string;
}

export function OccasionsGrid() {
  const [occasions, setOccasions] = useState<OccasionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const list = await getOccasions(true);
        setOccasions(list.map(o => ({ id: o.id, name: o.title, slug: o.slug, image: o.image })));
      } catch (error) {
        console.error('Failed to fetch occasions', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

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

  if (isLoading) {
    return (
      <section className="pt-2 pb-6 md:pt-4 md:pb-10 bg-[#FBFBFB] relative z-10 min-h-[300px] flex items-center justify-center">
         <Loader2 className="size-8 animate-spin text-gray-400" />
      </section>
    );
  }

  return (
    <section className="pt-2 pb-6 md:pt-4 md:pb-10 bg-[#FBFBFB] relative z-10">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8">
        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="flex overflow-x-auto pb-4 -mx-4 px-4 md:mx-0 md:px-0 md:pb-0 md:grid md:grid-cols-4 lg:grid-cols-8 gap-3 md:gap-4 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {occasions.map((occasion) => (
            <Link key={occasion.id} href="/products">
              <motion.div
                variants={item}
                className="min-w-[140px] w-[40%] sm:w-[30%] md:w-auto md:min-w-0 flex-shrink-0 snap-start group relative overflow-hidden rounded-lg bg-white shadow-sm hover:shadow-lg transition-all duration-500 cursor-pointer"
                title={occasion.name}
              >
              <div className="aspect-[4/5] overflow-hidden relative">
                {occasion.image ? (
                  <img
                    src={occasion.image}
                    alt={occasion.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors" />

                {/* Title Overlay */}
                <div className="absolute inset-x-0 bottom-0 p-2 md:p-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent pt-6 md:pt-8 flex items-end justify-center">
                  <span className="text-white text-xs md:text-sm font-medium text-center truncate w-full group-hover:scale-105 transition-transform duration-300">
                    {occasion.name}
                  </span>
                </div>

                {/* Arrow Icon */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-white/20 backdrop-blur-md p-2 rounded-full text-white">
                    <ArrowUpRight className="size-4" />
                  </div>
                </div>
              </div>
            </motion.div>
            </Link>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
