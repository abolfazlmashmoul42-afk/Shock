import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  ArrowLeft,
  Crown,
  CheckCircle2,
  Palette,
  Truck,
  Star,
  Sparkles,
} from 'lucide-react';
import { IMAGES, SIGNATURE_ELIZA_PRODUCT } from '../data/catalog';
import { type Product } from '../utils/store';
import { SafeImage } from './MotionPrimitives';

interface HeroSectionProps {
  onExploreCollection: () => void;
  onExplorePopular: () => void;
  onOpenProduct: (product: Product) => void;
}

const TRUST_STRIP_ITEMS = [
  'ارسال اکسپرس و بیمه‌شده VIP',
  'تضمین اصالت الیاف طبیعی',
  '۷ روز ضمانت تعویض سایز',
  'مشاوره اختصاصی استایل',
  'بسته‌بندی هدیه هاردباکس',
];

export function HeroSection({
  onExploreCollection,
  onExplorePopular,
  onOpenProduct,
}: HeroSectionProps) {
  const prefersReduced = useReducedMotion();

  const renderTrustCards = (mobileLayout: boolean) => (
    <div
      className={
        mobileLayout
          ? 'lg:hidden grid grid-cols-3 gap-2 sm:gap-3 mt-6 sm:mt-7'
          : 'hidden lg:grid grid-cols-3 gap-3.5'
      }
    >
      <div
        className={
          mobileLayout
            ? 'flex flex-col sm:flex-row items-center text-center sm:text-right gap-1.5 sm:gap-2.5 px-2 sm:px-3.5 py-3 rounded-2xl bg-white border border-[#ECE0D6] shadow-[0_2px_10px_rgba(36,26,20,0.03)]'
            : 'flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-white border border-[#ECE0D6] shadow-[0_2px_12px_rgba(36,26,20,0.03)]'
        }
      >
        <div
          className={`${
            mobileLayout ? 'w-8 h-8 sm:w-9 sm:h-9' : 'w-9 h-9'
          } rounded-full bg-[#FAF1E8] flex items-center justify-center shrink-0 text-[#8A5026]`}
        >
          <CheckCircle2 className="w-4 h-4" />
        </div>
        <div>
          <p className={`${mobileLayout ? 'text-[11px] sm:text-xs' : 'text-xs'} font-bold text-[#241A14]`}>
            ۱۰۰٪ الیاف طبیعی
          </p>
          <p className={`${mobileLayout ? 'text-[10px] sm:text-[11px]' : 'text-[11px]'} text-[#8E7C70] mt-0.5`}>
            تضمین بافت اصیل
          </p>
        </div>
      </div>

      <div
        className={
          mobileLayout
            ? 'flex flex-col sm:flex-row items-center text-center sm:text-right gap-1.5 sm:gap-2.5 px-2 sm:px-3.5 py-3 rounded-2xl bg-white border border-[#ECE0D6] shadow-[0_2px_10px_rgba(36,26,20,0.03)]'
            : 'flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-white border border-[#ECE0D6] shadow-[0_2px_12px_rgba(36,26,20,0.03)]'
        }
      >
        <div
          className={`${
            mobileLayout ? 'w-8 h-8 sm:w-9 sm:h-9' : 'w-9 h-9'
          } rounded-full bg-[#FAF1E8] flex items-center justify-center shrink-0 text-[#8A5026]`}
        >
          <Palette className="w-4 h-4" />
        </div>
        <div>
          <p className={`${mobileLayout ? 'text-[11px] sm:text-xs' : 'text-xs'} font-bold text-[#241A14]`}>
            طراحی اختصاصی
          </p>
          <p className={`${mobileLayout ? 'text-[10px] sm:text-[11px]' : 'text-[11px]'} text-[#8E7C70] mt-0.5`}>
            تک‌دوز آتلیه شوک
          </p>
        </div>
      </div>

      <div
        className={
          mobileLayout
            ? 'flex flex-col sm:flex-row items-center text-center sm:text-right gap-1.5 sm:gap-2.5 px-2 sm:px-3.5 py-3 rounded-2xl bg-white border border-[#ECE0D6] shadow-[0_2px_10px_rgba(36,26,20,0.03)]'
            : 'flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-white border border-[#ECE0D6] shadow-[0_2px_12px_rgba(36,26,20,0.03)]'
        }
      >
        <div
          className={`${
            mobileLayout ? 'w-8 h-8 sm:w-9 sm:h-9' : 'w-9 h-9'
          } rounded-full bg-[#FAF1E8] flex items-center justify-center shrink-0 text-[#8A5026]`}
        >
          <Truck className="w-4 h-4" />
        </div>
        <div>
          <p className={`${mobileLayout ? 'text-[11px] sm:text-xs' : 'text-xs'} font-bold text-[#241A14]`}>
            ارسال اکسپرس
          </p>
          <p className={`${mobileLayout ? 'text-[10px] sm:text-[11px]' : 'text-[11px]'} text-[#8E7C70] mt-0.5`}>
            بسته‌بندی VIP هدیه
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <section
      id="top"
      className="relative overflow-hidden bg-gradient-to-b from-[#FFFDF9] via-[#FDF8F3] to-[#FAF5F0]"
    >
      {/* Subtle crisp radial highlight without CSS blur haze */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -right-24 w-[520px] h-[520px] rounded-full bg-[radial-gradient(circle,rgba(239,217,198,0.42)_0%,transparent_70%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-10 left-10 w-[380px] h-[380px] rounded-full bg-[radial-gradient(circle,rgba(243,223,206,0.35)_0%,transparent_70%)]"
      />

      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-8 sm:pt-7 sm:pb-10 lg:pt-10 lg:pb-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-7 md:gap-6 lg:gap-10 items-center">
          {/* Right Column (Text & CTAs in RTL) */}
          <motion.div
            initial={prefersReduced ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="md:col-span-7 lg:col-span-6 lg:pl-4 text-right"
          >
            {/* Kicker Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 md:px-3.5 md:py-1.5 lg:px-4 rounded-full bg-[#F2DFD1] border border-[#E7CEBC] text-[#875029] text-[11px] lg:text-xs font-medium mb-3.5 md:mb-4 lg:mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#9A5A2B]" />
              <span>رونمایی انحصاری کالکشن جدید پاییز و زمستان</span>
            </div>

            {/* Hero Headline */}
            <h1 className="text-[26px] sm:text-3xl md:text-[30px] lg:text-[44px] font-extrabold text-[#1E1510] leading-[1.35] tracking-tight mb-3 md:mb-4 lg:mb-5">
              اصالت در ظرافت؛
              <br />
              <span className="text-[#885027]">کالکشن جدید پوشاک شوک</span>
            </h1>

            {/* Subtitle */}
            <p className="text-[13px] md:text-[13.5px] lg:text-[15px] text-[#5F5047] leading-7 lg:leading-8 max-w-xl mb-5 md:mb-6 lg:mb-8">
              تلفیق خیره‌کننده هنر دست‌دوز ایرانی با خطوط مدرن مد بین‌المللی. تجربه لمس
              کشمیر طبیعی، فوتر اعلا و ابریشم‌های طراحی‌شده اختصاصی در خانه مد شوک.
            </p>

            {/* Primary & Secondary CTAs */}
            <div className="grid grid-cols-2 md:flex md:flex-wrap items-center gap-2.5 lg:gap-3.5 mb-1 lg:mb-9">
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={onExploreCollection}
                className="h-11 lg:h-12 px-4 md:px-5 lg:px-7 rounded-full bg-gradient-to-l from-[#7E4821] to-[#985A2D] hover:from-[#6D3D1A] hover:to-[#844C24] text-white text-xs lg:text-sm font-semibold shadow-md shadow-[#8A5026]/20 flex items-center justify-center gap-2 lg:gap-2.5 transition-all whitespace-nowrap cursor-pointer"
              >
                <span>مشاهده کالکشن جدید</span>
                <ArrowLeft className="w-3.5 h-3.5 lg:w-4 lg:h-4 shrink-0" />
              </motion.button>

              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={onExplorePopular}
                className="h-11 lg:h-12 px-3.5 md:px-4.5 lg:px-6 rounded-full bg-[#F5E7DC] hover:bg-[#ECD7C6] border border-[#E6D2C2] text-[#5C3D28] text-xs lg:text-sm font-medium flex items-center justify-center gap-1.5 lg:gap-2 transition-colors whitespace-nowrap cursor-pointer"
              >
                <Crown className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-[#9A5B2C] shrink-0" />
                <span>پرفروش‌ترین‌های فصل</span>
              </motion.button>
            </div>

            {/* Desktop Trust Feature Cards */}
            {renderTrustCards(false)}
          </motion.div>

          {/* Left Column (Enlarged Desktop Portrait Showcase + Layered Editorial Motion) */}
          <motion.div
            initial={prefersReduced ? false : { opacity: 0, x: -28, y: 14 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.65, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            data-testid="hero-visual-showcase"
            className="md:col-span-5 lg:col-span-6 relative flex justify-center md:justify-end py-2 md:py-0"
          >
            <div className="relative w-full max-w-[270px] sm:max-w-[245px] md:max-w-[250px] lg:max-w-[460px] xl:max-w-[495px]">
              {/* Layer 1: Secondary Hairline Parallax Frame (Golden Copper Depth) */}
              <motion.div
                aria-hidden="true"
                initial={prefersReduced ? false : { opacity: 0, x: 20, y: 14 }}
                animate={
                  prefersReduced
                    ? { opacity: 1, x: 0, y: 0 }
                    : { opacity: 1, x: [0, 5, 0], y: [0, 6, 0], rotate: [0, -0.9, 0] }
                }
                transition={{
                  opacity: { duration: 0.7, delay: 0.2 },
                  x: { duration: 8.5, repeat: Infinity, ease: 'easeInOut' },
                  y: { duration: 8.5, repeat: Infinity, ease: 'easeInOut' },
                  rotate: { duration: 9.5, repeat: Infinity, ease: 'easeInOut' },
                }}
                className="hidden lg:block absolute top-4 -left-4 w-full h-full rounded-[34px] border border-[#D7B698]/60 pointer-events-none"
              />

              {/* Layer 2: Animated Architectural Frame Offset */}
              <motion.div
                aria-hidden="true"
                initial={prefersReduced ? false : { opacity: 0, x: 14, y: 10 }}
                animate={
                  prefersReduced
                    ? { opacity: 1, x: 0, y: 0 }
                    : { opacity: 1, x: 0, y: [0, -7, 0], rotate: [0, 1.1, 0] }
                }
                transition={{
                  opacity: { duration: 0.6, delay: 0.15 },
                  x: { duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] },
                  y: { duration: 7, repeat: Infinity, ease: 'easeInOut' },
                  rotate: { duration: 7.5, repeat: Infinity, ease: 'easeInOut' },
                }}
                className="absolute -top-2.5 -right-2.5 lg:-top-3.5 lg:-right-3.5 w-full h-full rounded-[26px] lg:rounded-[34px] border border-[#E2CEBD] bg-white/85"
              />

              {/* Layer 3: Main Portrait Card (Larger on Desktop, Compact on Tablet, Ambient Float + Hover Tilt) */}
              <motion.div
                animate={prefersReduced ? undefined : { y: [0, -3, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                whileHover={prefersReduced ? undefined : { y: -7, rotate: -0.6 }}
                onClick={() => onOpenProduct(SIGNATURE_ELIZA_PRODUCT)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    onOpenProduct(SIGNATURE_ELIZA_PRODUCT);
                  }
                }}
                aria-label="مشاهده جزئیات قطعه شاخص لوک‌بوک SH-204"
                className="relative rounded-[24px] lg:rounded-[30px] overflow-hidden bg-white p-2 lg:p-3 shadow-[0_24px_60px_rgba(52,33,20,0.14)] border border-[#EDE0D5] cursor-pointer group"
              >
                <div className="relative aspect-[4/4.5] rounded-[18px] lg:rounded-[24px] overflow-hidden">
                  {/* Subtle Ken Burns Breathing Zoom */}
                  <motion.div
                    animate={prefersReduced ? undefined : { scale: [1, 1.045, 1] }}
                    transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
                    className="w-full h-full will-change-transform"
                  >
                    <SafeImage
                      src={IMAGES.heroCourtyard}
                      alt="کالکشن پاییز و زمستان خانه مد شوک"
                      eager
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                    />
                  </motion.div>

                  {/* Diagonal Champagne Lookbook Sheen Sweep */}
                  {!prefersReduced && (
                    <motion.div
                      aria-hidden="true"
                      initial={{ x: '-120%' }}
                      animate={{ x: ['-120%', '220%'] }}
                      transition={{
                        duration: 2.1,
                        repeat: Infinity,
                        repeatDelay: 4.8,
                        ease: 'easeInOut',
                      }}
                      className="pointer-events-none absolute inset-y-0 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-[#FFF7EC]/25 to-transparent"
                    />
                  )}

                  {/* Bottom Crisp Scrim */}
                  <div className="absolute inset-x-0 bottom-0 h-24 lg:h-32 bg-gradient-to-t from-[#1E140E]/80 via-[#1E140E]/25 to-transparent" />
                  <div className="absolute bottom-3 lg:bottom-5 right-3 lg:right-6 left-[78px] lg:left-36 text-right text-white">
                    <div className="inline-flex items-center gap-1.5 text-[9.5px] lg:text-xs text-[#F2DEC9] mb-0.5 lg:mb-1 whitespace-nowrap">
                      <motion.span
                        aria-hidden="true"
                        animate={prefersReduced ? undefined : { opacity: [0.45, 1, 0.45], scale: [0.9, 1.15, 0.9] }}
                        transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
                        className="w-1.5 h-1.5 rounded-full bg-[#E5B883] shrink-0"
                      />
                      <span>کد رفرنس لوک‌بوک: SH-204</span>
                    </div>
                    <p className="text-[11px] lg:text-base font-bold leading-snug">
                      پالتو دو رو کشمیر مدل الیزا
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Layer 4: Floating Top-Left Rating Badge (Animated Levitation + Star Sparkle) */}
              <motion.div
                initial={prefersReduced ? false : { opacity: 0, y: -14 }}
                animate={
                  prefersReduced
                    ? { opacity: 1, y: 0 }
                    : { opacity: 1, y: [0, -6, 0] }
                }
                transition={{
                  opacity: { duration: 0.45, delay: 0.25 },
                  y: { duration: 4.4, repeat: Infinity, ease: 'easeInOut', delay: 0.25 },
                }}
                whileHover={prefersReduced ? undefined : { scale: 1.04, y: -6 }}
                className="absolute -top-2.5 -left-2 md:-left-2 lg:-top-3.5 lg:left-5 bg-white rounded-full px-3 py-1.5 lg:px-4 lg:py-2.5 shadow-lg border border-[#EFE2D7] flex items-center gap-1.5 lg:gap-2 z-10 whitespace-nowrap"
              >
                <motion.span
                  animate={prefersReduced ? undefined : { rotate: [0, 12, -10, 0], scale: [1, 1.16, 1] }}
                  transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                  className="inline-flex"
                >
                  <Star className="w-3 h-3 lg:w-4 lg:h-4 fill-[#C78839] text-[#C78839]" />
                </motion.span>
                <span className="text-[11px] lg:text-xs font-bold text-[#241A14] tabular-nums-fa">
                  ۴.۹ از ۵
                </span>
                <span className="text-[10px] lg:text-[11px] text-[#8E7C70]">رضایت بانوان شوک</span>
              </motion.div>

              {/* Layer 5: Floating Bottom-Left Cashmere Fabric Swatch (Complementary Counter-Float + Hover Tilt) */}
              <motion.div
                initial={prefersReduced ? false : { opacity: 0, x: -14, y: 14 }}
                animate={
                  prefersReduced
                    ? { opacity: 1, x: 0, y: 0 }
                    : { opacity: 1, x: [0, -3, 0], y: [0, 6, 0] }
                }
                transition={{
                  opacity: { duration: 0.5, delay: 0.3 },
                  x: { duration: 5.2, repeat: Infinity, ease: 'easeInOut', delay: 0.4 },
                  y: { duration: 5.2, repeat: Infinity, ease: 'easeInOut', delay: 0.4 },
                }}
                whileHover={prefersReduced ? undefined : { y: -8, scale: 1.04, rotate: -2 }}
                className="absolute -bottom-3.5 -left-2.5 lg:-bottom-5 lg:-left-6 w-24 sm:w-[82px] md:w-[84px] lg:w-36 bg-white rounded-xl lg:rounded-2xl p-1 lg:p-1.5 shadow-xl border border-[#EDE0D5] z-10 cursor-pointer"
              >
                <div className="flex items-center justify-between px-1 pb-0.5 lg:pb-1">
                  <span className="text-[9px] lg:text-[11px] font-medium text-[#7B695D]">
                    بافت کشمیر اصل
                  </span>
                </div>
                <div className="aspect-square rounded-lg lg:rounded-xl overflow-hidden">
                  <SafeImage
                    src={IMAGES.cashmereMacro}
                    alt="نمای نزدیک بافت کشمیر طبیعی"
                    eager
                    className="w-full h-full object-cover"
                  />
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Mobile & Tablet Compact Trust Cards Below Hero Row */}
        {renderTrustCards(true)}
      </div>

      {/* Bottom Trust Ticker Strip */}
      <div className="border-y border-[#ECE0D6] bg-[#FCF8F4]/90">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <div className="flex flex-wrap items-center justify-center lg:justify-between gap-x-6 gap-y-2 text-[11px] sm:text-xs text-[#6B5A50]">
            {TRUST_STRIP_ITEMS.map((item, idx) => (
              <React.Fragment key={item}>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#B47A4B]" />
                  <span>{item}</span>
                </div>
                {idx < TRUST_STRIP_ITEMS.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="hidden lg:inline-block w-1 h-1 rounded-full bg-[#D8C5B6]"
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
