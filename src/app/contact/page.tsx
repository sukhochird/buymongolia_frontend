'use client';

import Link from 'next/link';
import { MapPin, Phone, Clock } from 'lucide-react';
import { motion } from 'motion/react';

export default function ContactPage() {
  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Header Banner */}
      <div className="bg-secondary/30 py-16 md:py-24">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-serif font-bold mb-4"
          >
            Холбоо барих
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="flex items-center justify-center gap-2 text-sm text-gray-500"
          >
            <Link href="/" className="hover:text-accent">Нүүр</Link>
            <span>/</span>
            <span>Холбоо барих</span>
          </motion.div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 md:px-8 mt-12 md:mt-20">
        
        {/* Office / Contact Card */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-2xl mx-auto mb-20"
        >
            <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-lg">
                <div className="p-8 md:p-10 space-y-6">
                    <h3 className="text-2xl font-serif font-bold">Seoul Business Center</h3>
                    <div className="space-y-4 text-gray-600">
                        <div className="flex items-start gap-3">
                            <MapPin className="size-5 text-accent shrink-0 mt-1" />
                            <p className="leading-relaxed">
                                Улаанбаатар хот, Сүхбаатар дүүрэг, 1-р хороо, Seoul Business Center, 6-р давхар, 605 тоот оффис, Ulaanbaatar, Mongolia, 14446
                            </p>
                        </div>
                        <div className="flex items-start gap-3">
                            <Phone className="size-5 text-accent shrink-0 mt-1" />
                            <a href="tel:76073333" className="hover:text-accent transition-colors font-medium">7607-3333</a>
                        </div>
                        <div className="flex items-start gap-3">
                            <Clock className="size-5 text-accent shrink-0 mt-1" />
                            <p>09:00 - 21:00 (Өдөр бүр)</p>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>

        {/* General Info */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gray-50 rounded-2xl p-8 mb-20 text-center"
        >
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-full text-accent shadow-sm">
                        <Phone className="size-5" />
                    </div>
                    <div className="text-left">
                        <p className="text-xs text-gray-500 uppercase font-bold tracking-wide">Утас</p>
                        <a href="tel:76073333" className="font-medium hover:text-accent transition-colors">7607-3333</a>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-full text-accent shadow-sm">
                        <MapPin className="size-5" />
                    </div>
                    <div className="text-left max-w-xs">
                        <p className="text-xs text-gray-500 uppercase font-bold tracking-wide">Хаяг</p>
                        <p className="text-sm text-gray-700">Сүхбаатар дүүрэг, 1-р хороо, Seoul Business Center, 6-р давхар, 605 тоот</p>
                    </div>
                </div>
            </div>
        </motion.div>
        
        {/* Map Section */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20"
        >
            <h2 className="text-2xl font-serif font-bold mb-4">Байршил</h2>
            <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-200 h-[400px] md:h-[480px] relative bg-gray-100">
                <iframe
                    title="Smart Buy Mongolia - Seoul Business Center"
                    src="https://www.openstreetmap.org/export/embed.html?bbox=106.864%2C47.911%2C106.896%2C47.918&layer=mapnik&marker=47.914473952210926%2C106.86918788997626"
                    className="w-full h-full border-0 block"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                />
                <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2">
                    <div className="bg-white/95 backdrop-blur-sm p-3 rounded-xl shadow-lg max-w-xs">
                        <p className="font-bold text-sm text-gray-900">Smart Buy Mongolia</p>
                        <p className="text-xs text-gray-600">Seoul Business Center, 6-р давхар, 605 тоот</p>
                    </div>
                    <a
                        href="https://www.google.com/maps/search/Seoul+Business+Center+Ulaanbaatar"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-white/95 backdrop-blur-sm px-4 py-2.5 rounded-xl shadow-lg text-sm font-medium text-gray-800 hover:bg-accent hover:text-white transition-colors"
                    >
                        <MapPin className="size-4" />
                        Google Maps дээр нээх
                    </a>
                </div>
            </div>
        </motion.div>
      </div>
    </div>
  );
}
