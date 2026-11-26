import React, { useState } from 'react';
import {
  Instagram,
  Send,
  Camera,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  ChevronLeft,
} from 'lucide-react';
import { validateVipContact } from '../utils/store';

interface FooterProps {
  onSelectCategory: (slug: string) => void;
  onOpenAbout?: () => void;
  onOpenContact?: () => void;
  onOpenAuth?: () => void;
  onOpenCart?: () => void;
  onOpenBlog?: () => void;
  onNavigateAnchor?: (anchor: string) => void;
  onOpenWishlist: () => void;
  onOpenAccount: () => void;
  onVipJoined: () => void;
  vipJoined: boolean;
}

export function Footer({
  onSelectCategory,
  onOpenAbout,
  onOpenContact,
  onOpenAuth,
  onOpenCart,
  onOpenBlog,
  onNavigateAnchor,
  onOpenWishlist,
  onOpenAccount,
  onVipJoined,
  vipJoined,
}: FooterProps) {
  const [footerContact, setFooterContact] = useState('');
  const [footerError, setFooterError] = useState<string | null>(null);

  const handleFooterVip = (e: React.FormEvent) => {
    e.preventDefault();
    const res = validateVipContact(footerContact);
    if (!res.valid) {
      setFooterError(res.error ?? 'اطلاعات معتبر نیست.');
      return;
    }
    setFooterError(null);
    onVipJoined();
  };

  return (
    <footer id="footer" className="relative bg-[#F5EBE1] text-[#3F2E23] pt-14 pb-8">
      {/* Animated Multi-Layer Silk Wave Divider */}
      <div
        aria-hidden="true"
        dir="ltr"
        data-testid="footer-animated-wave"
        className="absolute top-0 inset-x-0 -translate-y-[97%] h-12 sm:h-16 overflow-hidden leading-none pointer-events-none select-none"
      >
        {/* Back Wave Layer (Reverse Slow Drift) */}
        <svg
          viewBox="0 0 2880 72"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute inset-y-0 left-0 w-[200%] h-full animate-footer-wave-slow"
          preserveAspectRatio="none"
        >
          <path
            d="M 0 12 C 360 12, 360 44, 720 44 C 1080 44, 1080 12, 1440 12 C 1800 12, 1800 44, 2160 44 C 2520 44, 2520 12, 2880 12 L 2880 72 L 0 72 Z"
            fill="#E8D2BE"
            fillOpacity="0.65"
          />
        </svg>

        {/* Middle Wave Layer (Double Frequency Forward Drift) */}
        <svg
          viewBox="0 0 2880 72"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute inset-y-0 left-0 w-[200%] h-full animate-footer-wave-mid"
          preserveAspectRatio="none"
        >
          <path
            d="M 0 22 C 180 22, 180 50, 360 50 C 540 50, 540 22, 720 22 C 900 22, 900 50, 1080 50 C 1260 50, 1260 22, 1440 22 C 1620 22, 1620 50, 1800 50 C 1980 50, 1980 22, 2160 22 C 2340 22, 2340 50, 2520 50 C 2700 50, 2700 22, 2880 22 L 2880 72 L 0 72 Z"
            fill="#DFC4AA"
            fillOpacity="0.5"
          />
        </svg>

        {/* Foreground Solid Wave (Seamless Match to Footer #F5EBE1 + Copper Rim) */}
        <svg
          viewBox="0 0 2880 72"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute inset-y-0 left-0 w-[200%] h-full animate-footer-wave-front"
          preserveAspectRatio="none"
        >
          <path
            d="M 0 46 C 360 46, 360 18, 720 18 C 1080 18, 1080 46, 1440 46 C 1800 46, 1800 18, 2160 18 C 2520 18, 2520 46, 2880 46 L 2880 72 L 0 72 Z"
            fill="#F5EBE1"
          />
          <path
            d="M 0 46 C 360 46, 360 18, 720 18 C 1080 18, 1080 46, 1440 46 C 1800 46, 1800 18, 2160 18 C 2520 18, 2520 46, 2880 46"
            stroke="#8A5026"
            strokeOpacity="0.22"
            strokeWidth="1.5"
          />
        </svg>
      </div>

      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-[#E5D4C4]">
          {/* Column 1: Brand Info (4 cols) */}
          <div className="lg:col-span-4 text-right">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#8F552B] to-[#6B3C1A] flex items-center justify-center text-white font-serif-brand text-xl font-bold">
                S&apos;
              </div>
              <div className="leading-none">
                <div className="font-serif-brand text-xl font-bold tracking-[0.16em] text-[#241A14]">
                  SHOCK
                </div>
                <div className="text-[9px] tracking-[0.22em] text-[#967E70] mt-0.5">
                  HOUSE OF FASHION
                </div>
              </div>
            </div>

            <p className="text-xs text-[#6B5A50] leading-7 max-w-sm mb-6">
              خانه طراحی و آتلیه مد شوک (SHOCK)، پیشگام در خلق پوشاک فاخر زنانه با پارچه‌های
              طبیعی و دوخت‌های دست‌دوز است؛ تجسم وقار، پایداری و لمس مسحورکننده ظرافت مدرن
              برای بانوان پیشرو.
            </p>

            <div className="flex items-center gap-2.5">
              <a
                href="#footer"
                aria-label="اینستاگرام شوک"
                className="w-9 h-9 rounded-full bg-white border border-[#E5D4C4] flex items-center justify-center text-[#6B503F] hover:bg-[#8A5026] hover:text-white hover:border-[#8A5026] transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#footer"
                aria-label="تلگرام شوک"
                className="w-9 h-9 rounded-full bg-white border border-[#E5D4C4] flex items-center justify-center text-[#6B503F] hover:bg-[#8A5026] hover:text-white hover:border-[#8A5026] transition-colors"
              >
                <Send className="w-4 h-4" />
              </a>
              <a
                href="#journal"
                aria-label="گالری لوک‌بوک"
                className="w-9 h-9 rounded-full bg-white border border-[#E5D4C4] flex items-center justify-center text-[#6B503F] hover:bg-[#8A5026] hover:text-white hover:border-[#8A5026] transition-colors"
              >
                <Camera className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Categories (2 cols) */}
          <div className="lg:col-span-2 text-right">
            <h4 className="text-sm font-bold text-[#241A14] mb-4">دسته‌بندی‌ها</h4>
            <ul className="space-y-2.5 text-xs text-[#6B5A50]">
              {[
                { label: 'شال و روسری ابریشم', slug: 'shawl' },
                { label: 'پالتوهای پشم و کشمیر', slug: 'coat' },
                { label: 'مانتو و ردای مجلسی', slug: 'manteau' },
                { label: 'کیف و اکسسوری چرمی', slug: 'bag' },
                { label: 'تخفیف‌های فصلی VIP', slug: 'vip' },
              ].map((link) => (
                <li key={link.label}>
                  <button
                    type="button"
                    onClick={() => onSelectCategory(link.slug)}
                    className="inline-flex items-center gap-1 hover:text-[#8A5026] transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-3 h-3 text-[#B69B87]" />
                    <span>{link.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Customer Guide (2 cols) */}
          <div className="lg:col-span-2 text-right">
            <h4 className="text-sm font-bold text-[#241A14] mb-4">راهنمای مشتریان</h4>
            <ul className="space-y-2.5 text-xs text-[#6B5A50]">
              <li>
                <button
                  type="button"
                  onClick={onOpenAccount}
                  className="inline-flex items-center gap-1 hover:text-[#8A5026] transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-3 h-3 text-[#B69B87]" />
                  <span>پیگیری سفارشات</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() =>
                    onNavigateAnchor
                      ? onNavigateAnchor('#journal')
                      : document.querySelector('#journal')?.scrollIntoView({ behavior: 'smooth' })
                  }
                  className="inline-flex items-center gap-1 hover:text-[#8A5026] transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-3 h-3 text-[#B69B87]" />
                  <span>راهنمای جامع سایزبندی</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    if (onOpenAbout) {
                      onOpenAbout();
                    } else if (onNavigateAnchor) {
                      onNavigateAnchor('#atelier');
                    } else {
                      document.querySelector('#atelier')?.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="inline-flex items-center gap-1 hover:text-[#8A5026] transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-3 h-3 text-[#B69B87]" />
                  <span>درباره آتلیه شوک</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    if (onOpenBlog) {
                      onOpenBlog();
                    } else if (onNavigateAnchor) {
                      onNavigateAnchor('#journal');
                    } else {
                      document.querySelector('#journal')?.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="inline-flex items-center gap-1 hover:text-[#8A5026] transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-3 h-3 text-[#B69B87]" />
                  <span>مجله و مقالات شوک</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenWishlist}
                  className="inline-flex items-center gap-1 hover:text-[#8A5026] transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-3 h-3 text-[#B69B87]" />
                  <span>علاقه‌مندی‌های من</span>
                </button>
              </li>
              {onOpenContact && (
                <li>
                  <button
                    type="button"
                    onClick={onOpenContact}
                    className="inline-flex items-center gap-1 hover:text-[#8A5026] transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-3 h-3 text-[#B69B87]" />
                    <span>تماس و پشتیبانی شوک</span>
                  </button>
                </li>
              )}
              {onOpenCart && (
                <li>
                  <button
                    type="button"
                    onClick={onOpenCart}
                    className="inline-flex items-center gap-1 hover:text-[#8A5026] transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-3 h-3 text-[#B69B87]" />
                    <span>سبد خرید من</span>
                  </button>
                </li>
              )}
              {onOpenAuth && (
                <li>
                  <button
                    type="button"
                    onClick={onOpenAuth}
                    className="inline-flex items-center gap-1 hover:text-[#8A5026] transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-3 h-3 text-[#B69B87]" />
                    <span>ورود و ثبت‌نام</span>
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Column 4: VIP Club & Trust Badges (4 cols) */}
          <div className="lg:col-span-4 text-right">
            <h4 className="text-sm font-bold text-[#241A14] mb-3">
              باشگاه اختصاصی VIP شوک
            </h4>
            <p className="text-xs text-[#6B5A50] leading-6 mb-4">
              با عضویت در باشگاه شوک، پیش از همگان به کالکشن‌های اختصاصی، پیش‌خریدها و
              ایونت‌های خصوصی دسترسی خواهید داشت.
            </p>

            {vipJoined ? (
              <div className="rounded-2xl bg-white/80 border border-[#DFC7B3] p-3 text-xs text-[#46704F] font-semibold flex items-center gap-2 mb-4">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>عضویت VIP شما فعال است (کد: SHOCK-VIP10)</span>
              </div>
            ) : (
              <form onSubmit={handleFooterVip} noValidate className="mb-4">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={footerContact}
                    onChange={(e) => {
                      setFooterContact(e.target.value);
                      if (footerError) setFooterError(null);
                    }}
                    placeholder="شماره تماس یا ایمیل شما"
                    aria-label="شماره تماس یا ایمیل برای عضویت VIP"
                    className="flex-1 h-10 px-4 rounded-full bg-white border border-[#E2D0C0] text-xs text-[#241A14] placeholder:text-[#A49388] focus:outline-none focus:border-[#8A5026]"
                  />
                  <button
                    type="submit"
                    className="h-10 px-4 rounded-full bg-[#7E4821] hover:bg-[#663918] text-white text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>عضویت VIP</span>
                  </button>
                </div>
                {footerError && (
                  <p className="text-[11px] text-[#B53D34] mt-1.5">{footerError}</p>
                )}
              </form>
            )}

            <div className="flex flex-wrap items-center gap-2.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/85 border border-[#E5D4C4] text-[11px] text-[#5B473B]">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#8A5026]" />
                <span>نماد اصالت کالا</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/85 border border-[#E5D4C4] text-[11px] text-[#5B473B]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#8A5026]" />
                <span>ضمانت بازگشت</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#8E7A6E]">
          <p>© ۲۰۲۴ خانه مد و پوشاک فاخر شوک (SHOCK). تمامی حقوق مادی و معنوی محفوظ است.</p>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="hover:text-[#5B4436] transition-colors cursor-pointer"
          >
            طراحی اختصاصی با هارمونی متریال گرم مسی ↑
          </button>
        </div>
      </div>
    </footer>
  );
}
