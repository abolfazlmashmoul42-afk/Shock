import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight, ArrowLeft, Sparkles } from 'lucide-react';
import { CAMPAIGN_POSTERS } from '../data/catalog';
import { toPersianDigits } from '../utils/store';
import { EditorialReveal, SafeImage } from './MotionPrimitives';

interface CampaignPostersProps {
  onSelectCampaign: (categorySlug: string, title: string) => void;
}

export function CampaignPosters({ onSelectCampaign }: CampaignPostersProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(18);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    if (maxScroll <= 0) {
      setProgress(100);
      return;
    }
    const ratio = Math.min(1, Math.max(0, Math.abs(el.scrollLeft) / maxScroll));
    setProgress(Math.round(18 + ratio * 82));
  };

  const scrollByAmount = (direction: 'prev' | 'next') => {
    const el = scrollRef.current;
    if (!el) return;
    const step = 340;
    // In RTL, scrolling left is negative scrollLeft
    el.scrollBy({
      left: direction === 'next' ? -step : step,
      behavior: 'smooth',
    });
  };

  return (
    <section className="py-14 sm:py-16 bg-[#FBF6F1]">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        <EditorialReveal>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div className="text-right">
              <div className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#9B7960] mb-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#B47A4B]" />
                <span>لوک‌بوک اسکرولی</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#241A14]">
                پوسترهای تخفیف و کالکشن فصل
              </h2>
              <p className="text-xs sm:text-sm text-[#7D6D63] mt-2">
                کمپین‌های ویژه پاییز و زمستان را ورق بزنید؛ از حراج کت‌های ساختارمند تا ابریشم‌های لیمیتد شب یلدا.
              </p>
            </div>

            <div className="flex items-center gap-3 self-end sm:self-auto">
              <span className="text-[11px] text-[#9A8577] hidden md:inline">
                با کشیدن یا دکمه‌ها ورق بزنید
              </span>
              <button
                type="button"
                onClick={() => scrollByAmount('prev')}
                aria-label="پوستر قبلی"
                className="w-10 h-10 rounded-full bg-white border border-[#E7D8CB] hover:border-[#8A5026] text-[#4C392E] flex items-center justify-center transition-colors shadow-sm cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollByAmount('next')}
                aria-label="پوستر بعدی"
                className="w-10 h-10 rounded-full bg-white border border-[#E7D8CB] hover:border-[#8A5026] text-[#4C392E] flex items-center justify-center transition-colors shadow-sm cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        </EditorialReveal>

        {/* Horizontal Poster Track */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-5 overflow-x-auto no-scrollbar pb-4 snap-x snap-mandatory"
        >
          {CAMPAIGN_POSTERS.map((poster) => (
            <motion.div
              key={poster.id}
              whileHover={{ y: -4 }}
              onClick={() => onSelectCampaign(poster.categorySlug, poster.title)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectCampaign(poster.categorySlug, poster.title);
                }
              }}
              className="group relative flex-none w-[270px] sm:w-[300px] lg:w-[315px] aspect-[3/4] rounded-[26px] overflow-hidden bg-[#2A1E17] shadow-lg snap-start cursor-pointer"
            >
              <SafeImage
                src={poster.image}
                alt={poster.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A120D]/90 via-[#1A120D]/25 to-black/20" />

              {/* Top Badges */}
              <div className="absolute top-4 inset-x-4 flex items-center justify-between">
                <span
                  className={`px-3 py-1 rounded-full text-[10px] font-bold text-white shadow-sm ${
                    poster.badgeVariant === 'red'
                      ? 'bg-[#C1382F]'
                      : poster.badgeVariant === 'copper'
                        ? 'bg-[#8D5228]'
                        : 'bg-[#281E18]/90'
                  }`}
                >
                  {poster.badge}
                </span>
                <span className="w-7 h-7 rounded-full bg-black/40 backdrop-blur-sm border border-white/20 text-white text-[11px] font-medium flex items-center justify-center tabular-nums-fa">
                  {poster.number}
                </span>
              </div>

              {/* Bottom Caption + CTA */}
              <div className="absolute bottom-5 inset-x-5 text-right">
                <p className="text-[11px] text-[#E6CEBA] mb-1">{poster.subtitle}</p>
                <h3 className="text-lg font-extrabold text-white mb-3.5">
                  {poster.title}
                </h3>
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white text-xs font-medium group-hover:bg-[#8A5026] group-hover:border-[#8A5026] transition-colors">
                  <span>مشاهده کمپین</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Scroll Progress Bar */}
        <div className="mt-4 flex items-center gap-3">
          <div className="flex-1 h-1 rounded-full bg-[#EADFD5] overflow-hidden">
            <div
              className="h-full bg-[#8A5026] rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-[11px] text-[#9A8577] tabular-nums-fa">
            {toPersianDigits(progress)}٪
          </span>
        </div>
      </div>
    </section>
  );
}
