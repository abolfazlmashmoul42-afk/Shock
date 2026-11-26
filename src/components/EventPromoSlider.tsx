import React, { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { EVENT_PROMO_BANNERS, type PromoSlideTheme } from '../data/catalog';
import { stepSlideIndex, toPersianDigits } from '../utils/store';
import { SafeImage } from './MotionPrimitives';

interface EventPromoSliderProps {
  onOpenCategory: (categorySlug: string) => void;
}

const THEME_ACCENTS: Record<
  PromoSlideTheme,
  {
    scrim: string;
    tagColor: string;
    chevronsColor: string;
    ctaClass: string;
  }
> = {
  'black-friday': {
    scrim:
      'bg-gradient-to-l from-[#0F0A08]/95 via-[#0F0A08]/55 to-transparent',
    tagColor: 'text-[#F5B0AA]',
    chevronsColor: 'text-[#E13C35]',
    ctaClass: 'bg-white hover:bg-[#FFF0EE] text-[#1A120E]',
  },
  'winter-atelier': {
    scrim:
      'bg-gradient-to-l from-[#1E140F]/92 via-[#1E140F]/50 to-transparent',
    tagColor: 'text-[#F1CEAA]',
    chevronsColor: 'text-[#DF9C52]',
    ctaClass: 'bg-white hover:bg-[#FAF1E8] text-[#1E1510]',
  },
  'leather-silk': {
    scrim:
      'bg-gradient-to-l from-[#1C120D]/92 via-[#1C120D]/48 to-transparent',
    tagColor: 'text-[#EFCAA5]',
    chevronsColor: 'text-[#D48A45]',
    ctaClass: 'bg-white hover:bg-[#FAF1E8] text-[#1E1510]',
  },
  'atelier-craft': {
    scrim:
      'bg-gradient-to-l from-[#18110E]/94 via-[#18110E]/50 to-transparent',
    tagColor: 'text-[#F0CBB0]',
    chevronsColor: 'text-[#C87D44]',
    ctaClass: 'bg-white hover:bg-[#FAF1E8] text-[#1E1510]',
  },
};

export function EventPromoSlider({ onOpenCategory }: EventPromoSliderProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [isHovering, setIsHovering] = useState(false);
  const prefersReduced = useReducedMotion();

  const totalSlides = EVENT_PROMO_BANNERS.length;
  const activeSlide = EVENT_PROMO_BANNERS[activeIndex] ?? EVENT_PROMO_BANNERS[0];
  const accent = THEME_ACCENTS[activeSlide.theme];

  const goToSlide = useCallback((nextIdx: number, dir: 1 | -1) => {
    setDirection(dir);
    setActiveIndex(nextIdx);
  }, []);

  const handleStep = useCallback(
    (delta: 1 | -1) => {
      setDirection(delta);
      setActiveIndex((prev) => stepSlideIndex(prev, totalSlides, delta));
    },
    [totalSlides],
  );

  useEffect(() => {
    if (prefersReduced || isHovering || totalSlides <= 1) return;
    const timer = window.setInterval(() => {
      setDirection(1);
      setActiveIndex((prev) => stepSlideIndex(prev, totalSlides, 1));
    }, 5500);
    return () => window.clearInterval(timer);
  }, [prefersReduced, isHovering, totalSlides]);

  return (
    <section
      id="events-slider"
      aria-roledescription="carousel"
      aria-label="بنر رویدادهای تخفیفی و کالکشن‌های جدید"
      data-testid="event-promo-slider"
      data-active-slide={activeSlide.id}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onKeyDown={(e) => {
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          handleStep(1);
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          handleStep(-1);
        }
      }}
      className="py-6 sm:py-8 bg-[#FAF5F0]"
    >
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative h-[220px] sm:h-[300px] lg:h-[350px] rounded-[22px] sm:rounded-[26px] overflow-hidden bg-[#140E0B] shadow-[0_18px_44px_rgba(24,16,12,0.12)]">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={activeSlide.id}
              initial={
                prefersReduced
                  ? { opacity: 1 }
                  : { opacity: 0, x: direction > 0 ? -24 : 24 }
              }
              animate={{ opacity: 1, x: 0 }}
              exit={
                prefersReduced
                  ? { opacity: 0 }
                  : { opacity: 0, x: direction > 0 ? 24 : -24 }
              }
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              drag={prefersReduced ? false : 'x'}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.16}
              onDragEnd={(_, info) => {
                if (info.offset.x > 55) {
                  handleStep(1);
                } else if (info.offset.x < -55) {
                  handleStep(-1);
                }
              }}
              className="absolute inset-0 w-full h-full"
            >
              <button
                type="button"
                onClick={() => onOpenCategory(activeSlide.targetCategory)}
                aria-label={`${activeSlide.title} — ${activeSlide.ctaLabel}`}
                className="group relative w-full h-full block text-right cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
              >
                <SafeImage
                  src={activeSlide.image}
                  alt={activeSlide.title}
                  eager
                  className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02] ${
                    activeSlide.imagePosition ?? 'object-center'
                  }`}
                />

                {/* Smooth Directional Contrast Gradient */}
                <div className={`absolute inset-0 ${accent.scrim}`} />

                {/* Clean Concise Campaign Copy Overlay */}
                <div className="absolute inset-y-0 right-0 flex flex-col justify-center px-6 sm:px-10 lg:px-14 max-w-[82%] sm:max-w-[60%] lg:max-w-[52%] z-10">
                  <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
                    <span
                      className={`text-xs sm:text-sm font-bold ${accent.tagColor}`}
                    >
                      {activeSlide.highlightTag}
                    </span>
                    <span
                      aria-hidden="true"
                      dir="ltr"
                      className={`text-sm sm:text-base font-black tracking-tighter ${accent.chevronsColor}`}
                    >
                      &lt;&lt;&lt;
                    </span>
                  </div>

                  <h2 className="text-lg sm:text-2xl lg:text-[32px] font-extrabold text-white leading-snug mb-1.5 sm:mb-2.5 drop-shadow-sm">
                    {activeSlide.title}
                  </h2>

                  <p className="text-[11px] sm:text-sm text-white/85 font-medium mb-3.5 sm:mb-5">
                    {activeSlide.subtitle}
                  </p>

                  <div>
                    <span
                      className={`inline-flex items-center justify-center h-8 sm:h-10 px-4 sm:px-6 rounded-full text-[11px] sm:text-xs font-bold shadow-md transition-transform duration-200 group-hover:-translate-y-0.5 ${accent.ctaClass}`}
                    >
                      {activeSlide.ctaLabel}
                    </span>
                  </div>
                </div>
              </button>
            </motion.div>
          </AnimatePresence>

          {/* Minimal Center Dot Indicators */}
          <div
            role="tablist"
            aria-label="انتخاب بنر رویداد"
            className="absolute bottom-3.5 sm:bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5"
          >
            {EVENT_PROMO_BANNERS.map((slide, idx) => {
              const isActive = idx === activeIndex;
              return (
                <button
                  key={slide.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-label={`بنر ${toPersianDigits(idx + 1)}: ${slide.title}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    goToSlide(idx, idx >= activeIndex ? 1 : -1);
                  }}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    isActive
                      ? 'w-5 bg-white shadow-xs'
                      : 'w-1.5 bg-white/45 hover:bg-white/80'
                  }`}
                />
              );
            })}
          </div>

          {/* Crisp Circular Corner Arrows (Bottom Left in RTL) */}
          <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-5 z-20 flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleStep(-1);
              }}
              aria-label="بنر قبلی"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/95 hover:bg-white text-[#241A14] shadow-md flex items-center justify-center transition-transform hover:scale-105 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleStep(1);
              }}
              aria-label="بنر بعدی"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/95 hover:bg-white text-[#241A14] shadow-md flex items-center justify-center transition-transform hover:scale-105 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
