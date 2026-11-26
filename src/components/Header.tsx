import React, { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Search,
  Heart,
  ShoppingBag,
  User,
  LayoutGrid,
  ChevronDown,
  Menu,
  X,
  ArrowLeft,
} from 'lucide-react';
import { ALL_CATALOG_PRODUCTS, CATEGORIES, NAV_LINKS } from '../data/catalog';
import { formatToman, toPersianDigits, type Product } from '../utils/store';
import { SafeImage } from './MotionPrimitives';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSearchSubmit?: () => void;
  onSelectCategory: (slug: string) => void;
  onGoHome?: () => void;
  onOpenProduct: (product: Product) => void;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenAccount: () => void;
  userName?: string | null;
  cartCount: number;
  wishlistCount: number;
  activeCategory: string;
  isHomeActive?: boolean;
  onNavigateAnchor?: (anchor: string) => void;
}

export function Header({
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  onSelectCategory,
  onGoHome,
  onOpenProduct,
  onOpenCart,
  onOpenWishlist,
  onOpenAccount,
  userName,
  cartCount,
  wishlistCount,
  activeCategory,
  isHomeActive = activeCategory === 'all',
  onNavigateAnchor,
}: HeaderProps) {
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const megaRef = useRef<HTMLDivElement>(null);
  const primarySearchRef = useRef<HTMLDivElement>(null);
  const floatingSearchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let rafId = 0;

    const updateScrollState = () => {
      rafId = 0;
      const y = window.scrollY;
      setIsScrolled((prev) => {
        if (!prev && y > 64) {
          setMegaMenuOpen(false);
          setSearchFocused(false);
          return true;
        }
        if (prev && y < 20) {
          setMegaMenuOpen(false);
          setSearchFocused(false);
          return false;
        }
        return prev;
      });
    };

    const handleScroll = () => {
      if (!rafId) {
        rafId = window.requestAnimationFrame(updateScrollState);
      }
    };

    updateScrollState();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, []);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (megaRef.current && !megaRef.current.contains(target)) {
        setMegaMenuOpen(false);
      }
      const inPrimary = primarySearchRef.current?.contains(target);
      const inFloating = floatingSearchRef.current?.contains(target);
      if (!inPrimary && !inFloating) {
        setSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const searchResults =
    searchQuery.trim().length > 0
      ? ALL_CATALOG_PRODUCTS.filter(
          (p) =>
            p.title.includes(searchQuery.trim()) ||
            p.category.includes(searchQuery.trim()) ||
            p.material.includes(searchQuery.trim()),
        ).slice(0, 5)
      : [];

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim().length > 0) {
      e.preventDefault();
      setSearchFocused(false);
      setMobileMenuOpen(false);
      onSearchSubmit?.();
    }
  };

  const handleBrandHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setMegaMenuOpen(false);
    setMobileMenuOpen(false);
    setSearchFocused(false);
    if (onGoHome) {
      onGoHome();
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      onSelectCategory('all');
    }
  };

  const handleNavClick = (item: (typeof NAV_LINKS)[number]) => {
    setMegaMenuOpen(false);
    setMobileMenuOpen(false);
    if (item.anchor) {
      if (onNavigateAnchor) {
        onNavigateAnchor(item.anchor);
      } else {
        const target = document.querySelector(item.anchor);
        target?.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }
    onSelectCategory(item.slug);
  };

  const renderSearchDropdown = (visible: boolean) => (
    <AnimatePresence>
      {visible && searchFocused && searchQuery.trim().length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 6 }}
          transition={{ duration: 0.16 }}
          className="absolute top-12 inset-x-0 bg-white rounded-2xl border border-[#EADCD0] shadow-xl p-2 z-50"
        >
          {searchResults.length > 0 ? (
            <div className="divide-y divide-[#F4EAE2]">
              {searchResults.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onOpenProduct(item);
                    setSearchFocused(false);
                  }}
                  className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-[#FAF4EE] text-right transition-colors"
                >
                  <SafeImage
                    src={item.image}
                    alt={item.title}
                    className="w-11 h-12 rounded-lg object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-[#241A14] truncate">
                      {item.title}
                    </p>
                    <p className="text-[11px] text-[#8D7B70]">
                      {item.category} · {formatToman(item.price)}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <p className="text-xs text-[#8D7B70] text-center py-4">
              محصولی با این عنوان یافت نشد.
            </p>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );

  const renderActionButtons = (compact: boolean) => (
    <div className={`flex items-center shrink-0 ${compact ? 'gap-1 sm:gap-2' : 'gap-1 sm:gap-2.5'}`}>
      <button
        type="button"
        onClick={onOpenWishlist}
        aria-label="لیست علاقه‌مندی‌ها"
        className={`relative rounded-full flex items-center justify-center text-[#49372C] hover:bg-[#F3E7DC]/80 transition-colors cursor-pointer ${
          compact ? 'w-8 h-8 sm:w-9 sm:h-9' : 'w-9 h-9 sm:w-10 sm:h-10'
        }`}
      >
        <Heart className="w-[17px] h-[17px] sm:w-[18px] sm:h-[18px]" />
        {wishlistCount > 0 && (
          <motion.span
            key={wishlistCount}
            initial={{ scale: 0.6 }}
            animate={{ scale: 1 }}
            className="absolute -top-0.5 -left-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#B53D34] text-white text-[10px] font-bold flex items-center justify-center tabular-nums-fa"
          >
            {toPersianDigits(wishlistCount)}
          </motion.span>
        )}
      </button>

      <button
        type="button"
        onClick={onOpenCart}
        aria-label="سبد خرید"
        className={`relative rounded-full flex items-center justify-center text-[#49372C] hover:bg-[#F3E7DC]/80 transition-colors cursor-pointer ${
          compact ? 'w-8 h-8 sm:w-9 sm:h-9' : 'w-9 h-9 sm:w-10 sm:h-10'
        }`}
      >
        <ShoppingBag className="w-[17px] h-[17px] sm:w-[18px] sm:h-[18px]" />
        {cartCount > 0 && (
          <motion.span
            key={cartCount}
            initial={{ scale: 0.6 }}
            animate={{ scale: 1 }}
            className="absolute -top-0.5 -left-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#8A5026] text-white text-[10px] font-bold flex items-center justify-center tabular-nums-fa"
          >
            {toPersianDigits(cartCount)}
          </motion.span>
        )}
      </button>

      <button
        type="button"
        onClick={onOpenAccount}
        aria-label={userName ? `حساب کاربری ${userName}` : 'ورود و ثبت‌نام'}
        className={`flex items-center justify-center gap-1.5 rounded-full text-[#5B3D2A] text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
          compact
            ? 'w-8 h-8 sm:w-auto sm:h-8 sm:px-3.5 bg-[#EFE2D7]/85 hover:bg-[#E7D4C3]'
            : 'w-9 h-9 sm:w-auto sm:h-9 sm:px-4 bg-[#F5EAE1] hover:bg-[#EAD8C9]'
        }`}
      >
        <User className="w-4 h-4 sm:w-3.5 sm:h-3.5 shrink-0" />
        <span className="hidden sm:inline max-w-[115px] truncate">
          {userName ? userName : 'ورود | ثبت‌نام'}
        </span>
      </button>
    </div>
  );

  const renderMobileDrawer = (glassy: boolean) => (
    <AnimatePresence>
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          className={`lg:hidden border-t border-[#EAE0D7]/80 overflow-hidden ${
            glassy ? 'bg-[#FDF9F6]/90 backdrop-blur-md rounded-b-[26px]' : 'bg-[#FDF9F6]'
          }`}
        >
          <div className="p-4 space-y-3">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-[#9B897E] absolute right-3.5 pointer-events-none" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                placeholder="جستجو در محصولات شوک..."
                className="w-full h-10 pr-10 pl-4 rounded-full bg-white border border-[#EAE0D7] text-xs"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              {NAV_LINKS.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => handleNavClick(item)}
                  className="text-right px-3 py-2.5 rounded-xl bg-white border border-[#EFE4DB] text-xs font-medium text-[#3D2D24] hover:bg-[#F5EBE2]"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      {/* Constant-height spacer prevents any page jump or layout reflow on scroll */}
      <div aria-hidden="true" className="h-[65px] sm:h-[73px] lg:h-[122px] w-full shrink-0" />

      <header className="fixed top-0 inset-x-0 z-40 pointer-events-none">
        {/* State 1: Full Unscrolled Top Header (crisp solid surface, nav visible) */}
        <div
          data-header-mode="full"
          aria-hidden={isScrolled}
          className={`w-full bg-[#FDF9F6] border-b border-[#EBDED3] transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform ${
            isScrolled
              ? 'opacity-0 -translate-y-3 pointer-events-none'
              : 'opacity-100 translate-y-0 pointer-events-auto'
          }`}
        >
          <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-2 sm:gap-4 h-16 sm:h-[72px]">
              {/* Brand Logo */}
              <div className="flex items-center gap-2 sm:gap-3 shrink-0 min-w-0">
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen((prev) => !prev)}
                  className="lg:hidden w-9 h-9 rounded-full flex items-center justify-center text-[#4C392E] hover:bg-[#F3E7DC] transition-colors shrink-0"
                  aria-label="منوی موبایل"
                >
                  {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>

                <a
                  href="#top"
                  onClick={handleBrandHomeClick}
                  className="flex items-center gap-2 sm:gap-3 group shrink-0"
                >
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-[#8F552B] to-[#6B3C1A] flex items-center justify-center shadow-sm text-white font-serif-brand text-lg sm:text-xl font-bold tracking-tight transition-transform duration-200 group-hover:scale-105">
                    S&apos;
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right leading-none">
                      <div className="font-serif-brand text-[17px] sm:text-[21px] font-bold tracking-[0.14em] sm:tracking-[0.16em] text-[#241A14]">
                        SHOCK
                      </div>
                      <div className="text-[7px] sm:text-[8px] tracking-[0.18em] sm:tracking-[0.22em] text-[#9A8577] font-medium mt-0.5">
                        HOUSE OF FASHION
                      </div>
                    </div>
                    <span className="hidden sm:inline-block h-6 w-px bg-[#E5D6C9]" />
                    <span className="hidden sm:inline-block text-xs text-[#8D7B70] font-normal whitespace-nowrap">
                      شوک، مد اصیل
                    </span>
                  </div>
                </a>
              </div>

              {/* Search Input */}
              <div ref={primarySearchRef} className="hidden md:block flex-1 max-w-[440px] relative">
                <div className="relative flex items-center">
                  <Search className="w-4 h-4 text-[#9B897E] absolute right-4 pointer-events-none" />
                  <input
                    type="search"
                    value={searchQuery}
                    onFocus={() => setSearchFocused(true)}
                    onChange={(e) => {
                      onSearchChange(e.target.value);
                      setSearchFocused(true);
                    }}
                    onKeyDown={handleSearchKeyDown}
                    placeholder="جستجو در پالتوها، شال و کیف‌های دست‌دوز..."
                    aria-label="جستجو در محصولات"
                    className="w-full h-10 pr-10 pl-4 rounded-full bg-[#F5ECE4]/85 border border-[#EAE0D7] text-xs text-[#241A14] placeholder:text-[#9D8D83] focus:outline-none focus:bg-white focus:border-[#8A5026]/50 transition-colors"
                  />
                </div>
                {renderSearchDropdown(!isScrolled)}
              </div>

              {renderActionButtons(false)}
            </div>

            {/* Second Navigation Row (Desktop — Direct Navigation Links Only) */}
            <nav
              aria-label="ناوبری اصلی فروشگاه"
              className="hidden lg:flex items-center gap-3 py-2.5 border-t border-[#F0E5DB]"
            >

              <div className="flex items-center gap-1.5 xl:gap-2.5 overflow-x-auto no-scrollbar">
                <button
                  type="button"
                  onClick={() => {
                    if (onGoHome) {
                      onGoHome();
                    } else {
                      onSelectCategory('all');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    isHomeActive
                      ? 'bg-[#EFE4DA] text-[#3E2A1E] font-semibold'
                      : 'text-[#6A594F] hover:text-[#241A14]'
                  }`}
                >
                  صفحه اصلی
                </button>

                {NAV_LINKS.map((item) => {
                  const isActive = activeCategory === item.slug;
                  return (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => handleNavClick(item)}
                      className={`px-2 py-1.5 text-xs transition-colors whitespace-nowrap shrink-0 relative cursor-pointer ${
                        isActive
                          ? 'text-[#8A5026] font-semibold'
                          : 'text-[#6A594F] hover:text-[#241A14]'
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </nav>
          </div>

          {!isScrolled && renderMobileDrawer(false)}
        </div>

        {/* State 2: Compact Scrolled Glass Floating Capsule (nav hidden, Mega Menu beside Search, narrower width, rounded) */}
        <div className="fixed top-2.5 sm:top-3.5 inset-x-0 px-3 sm:px-6 pointer-events-none">
          <div
            data-header-mode="compact"
            data-scrolled={isScrolled ? 'true' : 'false'}
            aria-hidden={!isScrolled}
            className={`relative max-w-[920px] mx-auto bg-[#FDF9F6]/75 backdrop-blur-md border border-white/80 ring-1 ring-[#8A5026]/10 shadow-[0_12px_32px_rgba(36,26,20,0.10)] transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform ${
              mobileMenuOpen ? 'rounded-[26px]' : 'rounded-full'
            } ${
              isScrolled
                ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
                : 'opacity-0 -translate-y-4 scale-[0.97] pointer-events-none'
            }`}
          >
            <div className="px-3.5 sm:px-5 flex items-center justify-between gap-2 sm:gap-3 h-12 sm:h-[54px]">
              {/* Compact Brand Logo */}
              <div className="flex items-center gap-2 sm:gap-2.5 shrink-0 min-w-0">
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen((prev) => !prev)}
                  className="lg:hidden w-8 h-8 rounded-full flex items-center justify-center text-[#4C392E] hover:bg-[#F3E7DC] transition-colors shrink-0"
                  aria-label="منوی موبایل"
                >
                  {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>

                <a
                  href="#top"
                  onClick={handleBrandHomeClick}
                  className="flex items-center gap-2 sm:gap-2.5 group shrink-0"
                >
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-[#8F552B] to-[#6B3C1A] flex items-center justify-center shadow-sm text-white font-serif-brand text-base sm:text-lg font-bold tracking-tight transition-transform duration-200 group-hover:scale-105">
                    S&apos;
                  </div>
                  <div className="font-serif-brand text-[15px] sm:text-[18px] font-bold tracking-[0.12em] sm:tracking-[0.14em] text-[#241A14] leading-none">
                    SHOCK
                  </div>
                </a>
              </div>

              {/* Compact Mega Menu + Search Cluster */}
              <div className="hidden md:flex items-center gap-2 flex-1 max-w-[400px] min-w-0">
                {/* Scrolled Mega Menu Trigger & Dropdown */}
                <div ref={megaRef} className="shrink-0">
                  <button
                    type="button"
                    onClick={() => setMegaMenuOpen((prev) => !prev)}
                    aria-expanded={megaMenuOpen}
                    className="flex items-center gap-1.5 h-8 sm:h-9 px-3 sm:px-3.5 rounded-full bg-[#EFE3D8]/90 hover:bg-[#E7D5C6] border border-white/75 text-[#4C3426] text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <LayoutGrid className="w-3.5 h-3.5 text-[#8A5026]" />
                    <span>مگامنو</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        megaMenuOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {megaMenuOpen && isScrolled && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute top-[62px] left-1/2 -translate-x-1/2 w-[min(660px,calc(100vw-2rem))] bg-white/95 backdrop-blur-md rounded-3xl border border-[#EADCD0] shadow-2xl p-5 sm:p-6 z-50"
                      >
                        <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#F2E8DF]">
                          <div>
                            <p className="text-sm font-bold text-[#241A14]">
                              کالکشن‌های دسته‌بندی‌شده آتلیه شوک
                            </p>
                            <p className="text-[11px] text-[#8D7B70] mt-0.5">
                              انتخاب مستقیم از آثار پاییز و زمستان ۱۴۰۳
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setMegaMenuOpen(false);
                              onSelectCategory('all');
                            }}
                            className="text-xs font-medium text-[#8A5026] hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <span>مشاهده همه</span>
                            <ArrowLeft className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="grid grid-cols-4 gap-3">
                          {CATEGORIES.map((cat) => (
                            <button
                              key={cat.id}
                              type="button"
                              onClick={() => {
                                setMegaMenuOpen(false);
                                onSelectCategory(cat.slug);
                              }}
                              className="group flex flex-col items-center p-2.5 rounded-2xl bg-[#FAF5F0] hover:bg-[#F3E7DC] transition-colors text-center cursor-pointer"
                            >
                              <SafeImage
                                src={cat.image}
                                alt={cat.title}
                                className="w-full h-24 rounded-xl object-cover mb-2 group-hover:scale-[1.03] transition-transform duration-300"
                              />
                              <span className="text-xs font-bold text-[#241A14]">{cat.title}</span>
                              <span className="text-[10px] text-[#8D7B70]">{cat.subtitle}</span>
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Compact Search Input */}
                <div ref={floatingSearchRef} className="flex-1 min-w-0 relative">
                  <div className="relative flex items-center">
                    <Search className="w-4 h-4 text-[#9B897E] absolute right-3.5 pointer-events-none" />
                    <input
                      type="search"
                      value={searchQuery}
                      onFocus={() => setSearchFocused(true)}
                      onChange={(e) => {
                        onSearchChange(e.target.value);
                        setSearchFocused(true);
                      }}
                      onKeyDown={handleSearchKeyDown}
                      placeholder="جستجو در محصولات..."
                      aria-label="جستجو در محصولات"
                      className="w-full h-8 sm:h-9 pr-10 pl-4 rounded-full bg-white/65 border border-white/85 text-xs text-[#241A14] placeholder:text-[#9D8D83] focus:outline-none focus:bg-white focus:border-[#8A5026]/50 transition-colors"
                    />
                  </div>
                  {renderSearchDropdown(isScrolled)}
                </div>
              </div>

              {renderActionButtons(true)}
            </div>

            {isScrolled && renderMobileDrawer(true)}
          </div>
        </div>
      </header>
    </>
  );
}
