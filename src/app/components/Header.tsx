'use client';

import {
  Search,
  Phone,
  Heart,
  ShoppingCart,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  Youtube,
  Instagram,
  Facebook,
} from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { useCart } from "@/app/context/CartContext";
import { useFavorites } from "@/app/context/FavoritesContext";
import Image from "next/image";
import { getHeaderMenu, type ApiHeaderMenuItem } from '@/app/lib/api';

export function Header() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { totalItems, setIsCartOpen } = useCart();
  const { favoritesCount } = useFavorites();
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<number | null>(null);
  const [navItems, setNavItems] = useState<ApiHeaderMenuItem[]>([]);

  useEffect(() => {
    getHeaderMenu()
      .then((items) => setNavItems(items ?? []))
      .catch((e) => console.error('Header: failed to load menu', e));
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () =>
      window.removeEventListener("scroll", handleScroll);
  }, []);

  const isExternal = (item: ApiHeaderMenuItem) => item.link_type === 'external';
  const hasDropdown = (item: ApiHeaderMenuItem) => item.children && item.children.length > 0;

  const renderLink = (item: ApiHeaderMenuItem, className: string) => {
    if (isExternal(item)) {
      return (
        <a
          href={item.href || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className={className}
        >
          {item.label}
        </a>
      );
    }
    if (item.link_type === 'fragment') {
      return (
        <a
          href={item.href}
          onClick={(e) => {
            e.preventDefault();
            const [path, hash] = item.href.split('#');
            router.push(path || '/');
            setTimeout(() => {
              const el = hash ? document.getElementById(hash) : null;
              el?.scrollIntoView({ behavior: 'smooth' });
            }, 150);
          }}
          className={className}
        >
          {item.label}
        </a>
      );
    }
    return (
      <Link href={item.href || '/'} className={className}>
        {item.label}
      </Link>
    );
  };

  return (
    <>
      {/* Top bar */}
      <div className="bg-black text-white py-2 text-[11px] uppercase tracking-widest font-medium">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="opacity-80">
              Улаанбаатар хотод хүргэлттэй цэцэг
            </span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <a
              href="#"
              className="flex items-center gap-1.5 opacity-80 hover:opacity-100 hover:text-accent transition-all"
            >
              <Youtube className="size-3.5" />
              YouTube
            </a>
            <a
              href="https://www.instagram.com/eliteflower.mn/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 opacity-80 hover:opacity-100 hover:text-accent transition-all"
            >
              <Instagram className="size-3.5" />
              Instagram
            </a>
            <a
              href="https://www.facebook.com/EliteFlowerShop"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 opacity-80 hover:opacity-100 hover:text-accent transition-all"
            >
              <Facebook className="size-3.5" />
              Facebook
            </a>
          </div>
        </div>
      </div>

      <header
        className={`sticky top-0 z-50 transition-all duration-300 border-b ${
          isScrolled
            ? "bg-white/90 backdrop-blur-md shadow-md border-gray-200"
            : "bg-white border-gray-100 shadow-sm"
        }`}
      >
        {/* Main header */}
        <div className="py-4 md:py-5">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 flex items-center justify-between gap-8">
            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 hover:bg-secondary rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(true)}
            >
              <Menu className="size-6" />
            </button>

            {/* Logo */}
            <Link
              href="/"
              className="flex items-center group shrink-0"
            >
              <div className="relative h-8 md:h-12 w-auto overflow-hidden group-hover:scale-105 transition-transform duration-300">
                <Image
                  src="/logo.png"
                  alt="Elite Flower"
                  width={120}
                  height={48}
                  className="h-full w-auto object-contain"
                />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent skew-x-[-20deg]"
                  initial={{ x: "-150%" }}
                  animate={{ x: "150%" }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    repeatDelay: 3,
                    ease: "easeInOut",
                  }}
                />
              </div>
            </Link>

            {/* Navigation - Desktop */}
            <nav className="hidden md:flex flex-1 items-center justify-center gap-6 lg:gap-8">
              {navItems.map((item) => (
                <div
                  key={item.id}
                  className="relative group"
                  onMouseEnter={() => hasDropdown(item) && setActiveDropdown(item.id)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <span className="flex items-center gap-1.5 text-sm font-medium hover:text-accent transition-colors relative py-2">
                    {renderLink(item, 'inline-flex items-center gap-1.5 hover:text-accent transition-colors')}
                    {hasDropdown(item) && <ChevronDown className="size-3 opacity-50 group-hover:opacity-100 transition-opacity" />}
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out origin-left" />
                  </span>

                  {/* Dropdown Menu */}
                  {hasDropdown(item) && item.children && (
                    <div
                      className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-[220px] lg:w-[260px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top"
                    >
                      <div className="bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden p-2">
                        {item.children.map((child) => (
                          <div key={child.id} className="relative group/sub">
                            {isExternal(child) ? (
                              <a
                                href={child.href || '#'}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between px-3 py-2 text-sm text-gray-600 hover:text-accent hover:bg-gray-50 rounded-md transition-colors"
                              >
                                {child.label}
                                {child.children?.length ? <ChevronRight className="size-3.5 opacity-50" /> : null}
                              </a>
                            ) : child.link_type === 'fragment' ? (
                              <a
                                href={child.href}
                                onClick={(e) => {
                                  e.preventDefault();
                                  const [path, hash] = child.href.split('#');
                                  router.push(path || '/');
                                  setTimeout(() => document.getElementById(hash || '')?.scrollIntoView({ behavior: 'smooth' }), 150);
                                }}
                                className="flex items-center justify-between px-3 py-2 text-sm text-gray-600 hover:text-accent hover:bg-gray-50 rounded-md transition-colors"
                              >
                                {child.label}
                                {child.children?.length ? <ChevronRight className="size-3.5 opacity-50" /> : null}
                              </a>
                            ) : (
                              <Link
                                href={child.href || '/'}
                                className="flex items-center justify-between px-3 py-2 text-sm text-gray-600 hover:text-accent hover:bg-gray-50 rounded-md transition-colors"
                              >
                                {child.label}
                                {child.children?.length ? <ChevronRight className="size-3.5 opacity-50" /> : null}
                              </Link>
                            )}
                            {/* Level 2 Submenu (Flyout) */}
                            {child.children && child.children.length > 0 && (
                              <div className="absolute top-0 left-full ml-2 w-[200px] bg-white rounded-lg shadow-xl border border-gray-100 p-2 opacity-0 invisible group-hover/sub:opacity-100 group-hover/sub:visible transition-all duration-200">
                                {child.children.map((sub) => (
                                  <span key={sub.id}>
                                    {isExternal(sub) ? (
                                      <a href={sub.href || '#'} target="_blank" rel="noopener noreferrer" className="block px-3 py-2 text-sm text-gray-600 hover:text-accent hover:bg-gray-50 rounded-md transition-colors">{sub.label}</a>
                                    ) : sub.link_type === 'fragment' ? (
                                      <a href={sub.href} onClick={(e) => { e.preventDefault(); const [path, hash] = sub.href.split('#'); router.push(path || '/'); setTimeout(() => document.getElementById(hash || '')?.scrollIntoView({ behavior: 'smooth' }), 150); }} className="block px-3 py-2 text-sm text-gray-600 hover:text-accent hover:bg-gray-50 rounded-md transition-colors">{sub.label}</a>
                                    ) : (
                                      <Link href={sub.href || '/'} className="block px-3 py-2 text-sm text-gray-600 hover:text-accent hover:bg-gray-50 rounded-md transition-colors">{sub.label}</Link>
                                    )}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Action icons */}
            <div className="flex items-center gap-2 md:gap-4">
              <button
                className="p-2.5 hover:bg-[#F5F5F5] rounded-full transition-colors hidden md:block"
                title="Phone"
              >
                <Phone className="size-5" />
              </button>
              <button
                onClick={() => router.push('/favorites')}
                className="p-2.5 hover:bg-[#F5F5F5] rounded-full transition-colors relative group"
                title="Wishlist"
              >
                <Heart className="size-5 group-hover:text-destructive transition-colors" />
                {favoritesCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-destructive text-white text-[10px] font-bold size-4.5 flex items-center justify-center rounded-full border-2 border-white animate-in zoom-in duration-300">
                    {favoritesCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => setIsCartOpen(true)}
                className="p-2.5 hover:bg-[#F5F5F5] rounded-full transition-colors relative group"
                title="Cart"
              >
                <ShoppingCart className="size-5 group-hover:text-accent transition-colors" />
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-accent text-white text-[10px] font-bold size-4.5 flex items-center justify-center rounded-full border-2 border-white animate-in zoom-in duration-300">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 md:hidden backdrop-blur-sm"
              onClick={() => setIsMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 200,
              }}
              className="fixed inset-y-0 left-0 w-[85%] max-w-sm bg-white z-50 md:hidden shadow-2xl flex flex-col"
            >
              <div className="p-4 border-b flex items-center justify-between">
                <span className="font-serif text-xl font-bold">
                  Цэс
                </span>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 hover:bg-secondary rounded-full"
                >
                  <X className="size-5" />
                </button>
              </div>

              <div className="p-4 border-b">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Хайх..."
                    className="w-full pl-10 pr-4 py-2.5 bg-secondary rounded-lg text-sm focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto py-2">
                {navItems.map((item) => (
                  <div key={item.id}>
                    <div
                      className="flex items-center justify-between px-6 py-3 hover:bg-secondary transition-colors text-sm font-medium"
                      onClick={(e) => {
                        if (hasDropdown(item)) {
                          e.preventDefault();
                          setMobileExpanded(mobileExpanded === item.id ? null : item.id);
                        } else if (isExternal(item)) {
                          // external: allow default <a> or open in same tab
                        } else {
                          e.preventDefault();
                          if (item.link_type === 'fragment') {
                            const [path, hash] = item.href.split('#');
                            router.push(path || '/');
                            setIsMenuOpen(false);
                            setTimeout(() => document.getElementById(hash || '')?.scrollIntoView({ behavior: 'smooth' }), 150);
                          } else {
                            router.push(item.href || '/');
                            setIsMenuOpen(false);
                          }
                        }
                      }}
                    >
                      {isExternal(item) ? (
                        <a href={item.href || '#'} target="_blank" rel="noopener noreferrer" className="flex-1" onClick={() => setIsMenuOpen(false)}>
                          {item.label}
                        </a>
                      ) : (
                        <span className="flex-1">{item.label}</span>
                      )}
                      {hasDropdown(item) && (
                        <ChevronDown className={`size-4 opacity-50 transition-transform ${mobileExpanded === item.id ? 'rotate-180' : ''}`} />
                      )}
                    </div>

                    {/* Mobile Submenu */}
                    <AnimatePresence>
                      {hasDropdown(item) && mobileExpanded === item.id && item.children && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="bg-gray-50 overflow-hidden"
                        >
                          {item.children.map((child) => (
                            <div key={child.id} className="pl-6">
                              <div className="flex items-center justify-between pr-6 py-2.5 text-sm text-gray-600">
                                {isExternal(child) ? (
                                  <a href={child.href || '#'} target="_blank" rel="noopener noreferrer" onClick={() => setIsMenuOpen(false)}>{child.label}</a>
                                ) : child.link_type === 'fragment' ? (
                                  <a
                                    href={child.href}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      const [path, hash] = child.href.split('#');
                                      router.push(path || '/');
                                      setIsMenuOpen(false);
                                      setTimeout(() => document.getElementById(hash || '')?.scrollIntoView({ behavior: 'smooth' }), 150);
                                    }}
                                  >
                                    {child.label}
                                  </a>
                                ) : (
                                  <Link href={child.href || '/'} onClick={() => setIsMenuOpen(false)}>{child.label}</Link>
                                )}
                                {child.children && child.children.length > 0 && (
                                  <span className="text-[10px] text-gray-400 bg-white px-1.5 py-0.5 rounded border border-gray-200">
                                    {child.children.length}
                                  </span>
                                )}
                              </div>
                              {child.children && child.children.length > 0 && (
                                <div className="pl-4 border-l border-gray-200 mb-2">
                                  {child.children.map((sub) => (
                                    <span key={sub.id}>
                                      {isExternal(sub) ? (
                                        <a href={sub.href || '#'} target="_blank" rel="noopener noreferrer" onClick={() => setIsMenuOpen(false)} className="block py-2 text-sm text-gray-500 hover:text-accent">{sub.label}</a>
                                      ) : sub.link_type === 'fragment' ? (
                                        <a href={sub.href} onClick={(e) => { e.preventDefault(); const [path, hash] = sub.href.split('#'); router.push(path || '/'); setIsMenuOpen(false); setTimeout(() => document.getElementById(hash || '')?.scrollIntoView({ behavior: 'smooth' }), 150); }} className="block py-2 text-sm text-gray-500 hover:text-accent">{sub.label}</a>
                                      ) : (
                                        <Link href={sub.href || '/'} onClick={() => setIsMenuOpen(false)} className="block py-2 text-sm text-gray-500 hover:text-accent">{sub.label}</Link>
                                      )}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>

              <div className="p-6 bg-secondary/30 space-y-4">
                <div className="flex gap-4 justify-center">
                  <a
                    href="#"
                    className="p-3 bg-white rounded-full shadow-sm hover:text-accent"
                  >
                    <Phone className="size-5" />
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                        router.push('/favorites');
                        setIsMenuOpen(false);
                    }}
                    className="p-3 bg-white rounded-full shadow-sm hover:text-destructive relative"
                  >
                    <Heart className="size-5" />
                    {favoritesCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-destructive text-white text-[10px] font-bold size-4.5 flex items-center justify-center rounded-full border-2 border-white">
                        {favoritesCount}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
