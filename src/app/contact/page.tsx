'use client';

import Link from 'next/link';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
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
        
        {/* Branches Split Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-20">
            {/* Branch 1 */}
            <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300"
            >
                <div className="h-64 overflow-hidden relative">
                    <img 
                        src="https://shopo.sgp1.cdn.digitaloceanspaces.com/eliteflower/hero_slides/c04b84cf-c42d-4743-ac33-6c07fad05b52_4.jpeg" 
                        alt="Branch 1 Exterior" 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-bold shadow-sm">
                        Салбар 1
                    </div>
                </div>
                <div className="p-8 space-y-6">
                    <h3 className="text-2xl font-serif font-bold">10-р хороолол</h3>
                    
                    <div className="space-y-4 text-gray-600">
                        <div className="flex items-start gap-3">
                            <MapPin className="size-5 text-accent shrink-0 mt-1" />
                            <p className="leading-relaxed">
                                10-р хорооллын туслах зам дагуу Elite flower цэцэгсийн дэлгүүр
                            </p>
                        </div>
                        
                        <div className="flex items-start gap-3">
                            <Phone className="size-5 text-accent shrink-0 mt-1" />
                            <div className="flex flex-col">
                                <a href="tel:90915955" className="hover:text-accent transition-colors">9091-5955</a>
                                <a href="tel:90915595" className="hover:text-accent transition-colors">9091-5595</a>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <Clock className="size-5 text-accent shrink-0 mt-1" />
                            <p>09:00 - 21:00 (Өдөр бүр)</p>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Branch 2 */}
            <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300"
            >
                <div className="h-64 overflow-hidden relative">
                    <img 
                        src="https://shopo.sgp1.cdn.digitaloceanspaces.com/eliteflower/products/204/f16f61fd-3f2d-40df-bad9-ce73b67cc0a3.jpeg" 
                        alt="Branch 2 Interior" 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-bold shadow-sm">
                        Салбар 2
                    </div>
                </div>
                <div className="p-8 space-y-6">
                    <h3 className="text-2xl font-serif font-bold">Grand Plaza</h3>
                    
                    <div className="space-y-4 text-gray-600">
                        <div className="flex items-start gap-3">
                            <MapPin className="size-5 text-accent shrink-0 mt-1" />
                            <p className="leading-relaxed">
                                Grand Plaza Office, 1-р давхар Elite Premium Flower Shop
                            </p>
                        </div>
                        
                        <div className="flex items-start gap-3">
                            <Phone className="size-5 text-accent shrink-0 mt-1" />
                            <div className="flex flex-col">
                                <a href="tel:90915955" className="hover:text-accent transition-colors">9091-5955</a>
                                <a href="tel:90915595" className="hover:text-accent transition-colors">9091-5595</a>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <Clock className="size-5 text-accent shrink-0 mt-1" />
                            <p>09:00 - 21:00 (Өдөр бүр)</p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>

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
                        <Mail className="size-5" />
                    </div>
                    <div className="text-left">
                        <p className="text-xs text-gray-500 uppercase font-bold tracking-wide">И-мэйл хаяг</p>
                        <a href="mailto:info@eliteflower.mn" className="font-medium hover:text-accent transition-colors">info@eliteflower.mn</a>
                    </div>
                </div>
                
                <div className="w-px h-10 bg-gray-200 hidden md:block" />

                <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-full text-accent shadow-sm">
                        <Phone className="size-5" />
                    </div>
                    <div className="text-left">
                        <p className="text-xs text-gray-500 uppercase font-bold tracking-wide">Холбоо барих</p>
                        <p className="font-medium">9091-5955, 9091-5595</p>
                    </div>
                </div>

                <div className="w-px h-10 bg-gray-200 hidden md:block" />

                <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-full text-accent shadow-sm">
                        <Phone className="size-5" />
                    </div>
                    <div className="text-left">
                        <p className="text-xs text-gray-500 uppercase font-bold tracking-wide">Байгууллага болон Хуримын захиалага</p>
                        <a href="tel:90914444" className="font-medium hover:text-accent transition-colors">9091-4444</a>
                    </div>
                </div>
            </div>
        </motion.div>
        
        {/* Map Section - Улаанбаатар хот дахь салбарууд */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20"
        >
            <h2 className="text-2xl font-serif font-bold mb-4">Улаанбаатар хот дахь салбарууд</h2>
            <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-200 h-[400px] md:h-[480px] relative bg-gray-100">
                <iframe
                    title="Улаанбаатар хот дахь Elite Flower салбарууд"
                    src="https://www.openstreetmap.org/export/embed.html?bbox=106.864%2C47.911%2C106.896%2C47.918&layer=mapnik&marker=47.914473952210926%2C106.86918788997626&marker=47.91420800697665%2C106.89127486356195"
                    className="w-full h-full border-0 block"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                />
                <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2">
                    <div className="bg-white/95 backdrop-blur-sm p-3 rounded-xl shadow-lg max-w-xs">
                        <p className="font-bold text-sm text-gray-900">Elite Flower</p>
                        <p className="text-xs text-gray-600">Салбар 1: 10-р хороолол · Салбар 2: Grand Plaza</p>
                    </div>
                    <a
                        href="https://www.google.com/maps/search/Elite+Flower+Ulaanbaatar"
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
