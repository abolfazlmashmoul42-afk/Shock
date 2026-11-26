import React from 'react';
import { motion } from 'motion/react';
import { Scissors, ArrowLeft, Gem } from 'lucide-react';
import { IMAGES } from '../data/catalog';
import { EditorialReveal, SafeImage } from './MotionPrimitives';

interface AtelierBannerProps {
  onOpenStory: () => void;
  onExploreWoolCollection: () => void;
}

export function AtelierBanner({
  onOpenStory,
  onExploreWoolCollection,
}: AtelierBannerProps) {
  return (
    <section id="atelier" className="py-10 sm:py-14 bg-[#FBF7F3]">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        <EditorialReveal>
          <div className="relative rounded-[28px] overflow-hidden bg-[#221914] atelier-dots shadow-[0_24px_60px_rgba(25,16,11,0.2)] grid grid-cols-1 lg:grid-cols-12">
            {/* Subtle crisp radial corner glow */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-24 -left-24 w-80 h-80 rounded-full bg-[radial-gradient(circle,rgba(138,80,38,0.22)_0%,transparent_70%)]"
            />

            {/* Right Column in RTL (Editorial Copy & Stats) */}
            <div className="lg:col-span-7 p-7 sm:p-10 lg:p-12 flex flex-col justify-between relative z-10 text-right">
              {/* Top Kicker Row */}
              <div>
                <div className="flex flex-wrap items-center gap-3 mb-6">
                  <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-[#F2DFCF] text-[11px] font-medium">
                    <Scissors className="w-3.5 h-3.5 text-[#D7A274]" />
                    <span>هنر معماری دوخت · نسخه محدود</span>
                  </span>
                  <span className="text-[11px] text-[#9E8B7E]">پاییز و زمستان ۱۴۰۳</span>
                </div>

                {/* Headline */}
                <h2 className="text-2xl sm:text-4xl font-extrabold text-white leading-[1.4] mb-4">
                  لمس جاودانگی با
                  <br />
                  <span className="text-[#E0B185]">فوتر ایتالیایی و ابریشم یزد</span>
                </h2>

                {/* Prose */}
                <p className="text-xs sm:text-sm text-[#CFC0B5] leading-8 max-w-2xl mb-8">
                  ما در شوک باور داریم لباس مجلل پیش از آنکه دیده شود، باید حس شود. هر تار و پود به
                  کار رفته در پالتوها و مانتوهای این فصل، از مزارع الیاف زیست‌پذیر و کارگاه‌های
                  بافندگی منتخب بیه‌لا و اردکان تهیه شده تا کمال راحتی و تنفس‌پذیری را به اندام
                  شما هدیه کند.
                </p>
              </div>

              <div>
                {/* 3 Metric Boxes */}
                <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-8">
                  <div className="rounded-2xl bg-white/[0.04] border border-white/10 p-4 text-center sm:text-right">
                    <p className="text-lg sm:text-2xl font-extrabold text-white tabular-nums-fa">
                      ۱۰۰٪
                    </p>
                    <p className="text-[10px] sm:text-xs text-[#A8968A] mt-1">
                      بدون الیاف پلاستیکی
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white/[0.04] border border-white/10 p-4 text-center sm:text-right">
                    <p className="text-lg sm:text-2xl font-extrabold text-white tabular-nums-fa">
                      ۴۸ ساعت
                    </p>
                    <p className="text-[10px] sm:text-xs text-[#A8968A] mt-1">
                      دوخت اختصاصی هر ردا
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white/[0.04] border border-white/10 p-4 text-center sm:text-right">
                    <p className="text-lg sm:text-2xl font-extrabold text-white tabular-nums-fa">
                      ۳ سال
                    </p>
                    <p className="text-[10px] sm:text-xs text-[#A8968A] mt-1">
                      گارانتی عدم پرزدهی
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-3.5">
                  <motion.button
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={onOpenStory}
                    className="h-11 px-6 rounded-full bg-gradient-to-l from-[#8A4F24] to-[#A66332] hover:from-[#77421D] hover:to-[#915429] text-white text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-lg shadow-black/25 cursor-pointer"
                  >
                    <span>داستان شکل‌گیری شوک و آتلیه</span>
                    <ArrowLeft className="w-4 h-4" />
                  </motion.button>

                  <motion.button
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={onExploreWoolCollection}
                    className="h-11 px-5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-[#F1DFCE] text-xs sm:text-sm font-medium flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <Gem className="w-4 h-4 text-[#D7A274]" />
                    <span>مشاهده کالکشن فوتر</span>
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Left Column in RTL (Tailor Photo & Signature Overlay) */}
            <div className="lg:col-span-5 relative min-h-[340px] lg:min-h-[460px] overflow-hidden">
              <SafeImage
                src={IMAGES.atelierHands}
                alt="دوخت دست‌ساز در آتلیه شوک"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#19110D]/90 via-transparent to-black/25" />

              {/* Top-left subtle pill */}
              <div className="absolute top-4 left-4 px-3.5 py-1.5 rounded-full bg-[#1C1410]/85 backdrop-blur-md border border-white/15 text-[#F0DEC9] text-[11px] flex items-center gap-1.5">
                <Scissors className="w-3.5 h-3.5 text-[#D7A274]" />
                <span>۴۸ ساعت دوخت اختصاصی</span>
              </div>

              {/* Bottom Glass Signature Card */}
              <div className="absolute bottom-5 inset-x-5 rounded-2xl bg-[#271C16]/85 backdrop-blur-md border border-white/15 p-4 flex items-center justify-between gap-3 text-right">
                <div>
                  <p className="text-[10px] text-[#C9B3A2] mb-0.5">امضای آتلیه</p>
                  <p className="text-xs sm:text-sm font-bold text-white">
                    فوتر ایتالیایی + ابریشم یزد
                  </p>
                  <p className="text-[11px] text-[#B8A496] mt-1">
                    تک‌دوزی سفارشی با شناسنامه پارچه و گواهی اصالت.
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-white/10 border border-white/15 flex items-center justify-center shrink-0 text-[#E5B88E]">
                  <Scissors className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        </EditorialReveal>
      </div>
    </section>
  );
}
