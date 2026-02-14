import { Facebook, Instagram, MapPin, Phone, Youtube } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-14 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Brand + tagline */}
          <div className="space-y-5">
            <Link href="/" className="logo-text inline-block text-xl md:text-2xl text-white hover:opacity-90 transition-opacity tracking-tight">
              Buymongolia.vip
            </Link>
            <p className="text-white/75 text-sm leading-relaxed max-w-sm">
              Дижитал бүтээгдэхүүн, үйлчилгээг Монголдоо хамгийн хямд, хамгийн найдвартай сонголт болгохын төлөө бид зогсолтгүй хөдөлмөрлөж байна. 🚀
            </p>
            <div className="flex gap-3 pt-1">
              <a
                href="https://www.instagram.com/technestmongolia"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-white/10 rounded-full hover:bg-white hover:text-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="size-5" />
              </a>
              <a
                href="https://www.facebook.com/SmartBuyInMongolia"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-white/10 rounded-full hover:bg-white hover:text-primary transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="size-5" />
              </a>
              <a
                href="https://www.youtube.com/@kinotovchhon"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-white/10 rounded-full hover:bg-white hover:text-primary transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="size-5" />
              </a>
            </div>
          </div>

          {/* Contact */}
          <div className="border-t lg:border-t-0 lg:border-l border-white/15 pt-8 lg:pt-0 lg:pl-12">
            <h4 className="font-semibold text-white mb-5 text-sm uppercase tracking-wider">Холбоо барих</h4>
            <ul className="space-y-5 text-sm text-white/80">
              <li className="flex gap-3">
                <MapPin className="size-5 shrink-0 mt-0.5 text-accent" />
                <p className="text-white/80 leading-relaxed">
                  Улаанбаатар хот, Сүхбаатар дүүрэг, 1-р хороо, Seoul Business Center, 6-р давхар, 605 тоот оффис, Ulaanbaatar, Mongolia, 14446
                </p>
              </li>
              <li className="flex gap-3">
                <Phone className="size-5 shrink-0 mt-0.5 text-accent" />
                <a href="tel:76073333" className="hover:text-accent transition-colors">7607-3333</a>
              </li>
            </ul>
            <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
              <p className="text-xs text-accent font-semibold uppercase tracking-wider mb-1">Цагийн хуваарь</p>
              <p className="text-sm font-medium text-white/90">Өдөр бүр 09:00 – 21:00</p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-8 border-t border-white/15 flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-sm text-white/60 order-2 sm:order-1">
            © {new Date().getFullYear()} Smart Buy Mongolia. Бүх эрх хуулиар хамгаалагдсан.
          </p>
          <div className="flex items-center gap-3 order-1 sm:order-2">
            <span className="text-xs text-white/50 uppercase tracking-wider">Төлбөр:</span>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 bg-white/10 rounded-md text-xs font-medium text-white/90">QPay</span>
              <span className="px-3 py-1.5 bg-white/10 rounded-md text-xs font-medium text-white/90">SocialPay</span>
              <span className="px-3 py-1.5 bg-white/10 rounded-md text-xs font-medium text-white/90">Card</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
