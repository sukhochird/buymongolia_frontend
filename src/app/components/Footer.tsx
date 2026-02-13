import { Facebook, Instagram, MapPin, Phone, Youtube } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-14 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Brand + tagline */}
          <div className="space-y-5">
            <Link href="/" className="inline-block">
              <Image
                src="/logo.png"
                alt="Elite Flower"
                width={140}
                height={44}
                className="h-11 w-auto object-contain brightness-0 invert opacity-95"
              />
            </Link>
            <p className="text-white/75 text-sm leading-relaxed max-w-sm">
              Таны сэтгэлийн үгсийг цэцгээр илэрхийлнэ. Хамгийн тансаг, шинэлэг цэцгийн баглааг бид бэлтгэнэ.
            </p>
            <div className="flex gap-3 pt-1">
              <a
                href="https://www.instagram.com/eliteflower.mn/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-white/10 rounded-full hover:bg-white hover:text-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="size-5" />
              </a>
              <a
                href="https://www.facebook.com/EliteFlowerShop"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-white/10 rounded-full hover:bg-white hover:text-primary transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="size-5" />
              </a>
              <a
                href="#"
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
                <div className="space-y-3">
                  <p>
                    <span className="font-medium text-white">Салбар 1:</span>
                    <br />
                    <span className="text-white/80">10-р хорооллын туслах зам дагуу Elite flower цэцэгсийн дэлгүүр</span>
                  </p>
                  <p>
                    <span className="font-medium text-white">Салбар 2:</span>
                    <br />
                    <span className="text-white/80">Grand Plaza Office, 1-р давхар Elite Premium Flower Shop</span>
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <Phone className="size-5 shrink-0 mt-0.5 text-accent" />
                <div className="flex flex-col gap-1">
                  <a href="tel:90915955" className="hover:text-accent transition-colors">9091-5955</a>
                  <a href="tel:90915595" className="hover:text-accent transition-colors">9091-5595</a>
                </div>
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
            © {new Date().getFullYear()} Elite Flower. Бүх эрх хуулиар хамгаалагдсан.
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
