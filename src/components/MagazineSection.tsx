import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, BookOpen, Clock, PenLine } from 'lucide-react';
import { JOURNAL_ARTICLES, type JournalArticle } from '../data/catalog';
import { EditorialReveal, SafeImage } from './MotionPrimitives';

interface MagazineSectionProps {
  onOpenArticle: (article: JournalArticle) => void;
  onOpenBlogPage?: () => void;
}

export function MagazineSection({ onOpenArticle, onOpenBlogPage }: MagazineSectionProps) {
  const previewArticles = JOURNAL_ARTICLES.slice(0, 3);
  const featured = previewArticles.find((a) => a.featured) ?? previewArticles[0];
  const secondary = previewArticles.filter((a) => a.id !== featured.id);

  return (
    <section id="journal" className="py-16 sm:py-20 bg-[#FAF4EE]">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        <EditorialReveal>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-9">
            <div className="text-right">
              <div className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#9B7960] mb-1.5">
                <PenLine className="w-3.5 h-3.5 text-[#B47A4B]" />
                <span>مجله شوک</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#241A14]">
                روایت‌هایی از جنس پارچه و استایل
              </h2>
              <p className="text-xs sm:text-sm text-[#7D6D63] mt-2 max-w-xl leading-7">
                راهنمای خرید، نکات نگهداری و پشت صحنه آتلیه؛ نوشته‌هایی کوتاه برای انتخاب
                آگاهانه‌تر و استایلی که سال‌ها همراه شما می‌ماند.
              </p>
            </div>

            <button
              type="button"
              onClick={() => (onOpenBlogPage ? onOpenBlogPage() : onOpenArticle(featured))}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-[#7C5236] hover:text-[#57341E] transition-colors self-start sm:self-auto whitespace-nowrap cursor-pointer"
            >
              <span>مشاهده همه مقالات</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        </EditorialReveal>

        {/* Asymmetric Editorial Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Right Featured Tall Article (RTL) */}
          <motion.article
            whileHover={{ y: -3 }}
            onClick={() => onOpenArticle(featured)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onOpenArticle(featured);
              }
            }}
            className="lg:col-span-6 relative rounded-[28px] overflow-hidden min-h-[380px] sm:min-h-[430px] bg-[#261B15] shadow-lg group cursor-pointer"
          >
            <SafeImage
              src={featured.image}
              alt={featured.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#19110D]/95 via-[#19110D]/40 to-black/20" />

            {/* Top Pills */}
            <div className="absolute top-5 inset-x-5 flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-[#8A5026] text-white text-[10px] font-semibold">
                {featured.featuredTag || 'مقاله ویژه'}
              </span>
              <span className="px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white text-[10px] font-medium">
                {featured.tag}
              </span>
            </div>

            {/* Bottom Content */}
            <div className="absolute bottom-6 inset-x-6 text-right text-white">
              <div className="flex items-center gap-2 text-[11px] text-[#DEC9B8] mb-2 tabular-nums-fa">
                <Clock className="w-3.5 h-3.5" />
                <span>{featured.readTime}</span>
                <span>·</span>
                <span>{featured.date}</span>
              </div>
              <h3 className="text-lg sm:text-2xl font-extrabold leading-snug mb-2">
                {featured.title}
              </h3>
              <p className="text-xs sm:text-sm text-[#DFCFC2] leading-7 line-clamp-2 mb-4">
                {featured.excerpt}
              </p>
              <span className="inline-flex items-center gap-2 text-xs font-semibold text-[#F4CFA9] group-hover:gap-3 transition-all">
                <span>خواندن مقاله</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </span>
            </div>
          </motion.article>

          {/* Left Stacked Secondary Cards + Archive Bar */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            {secondary.map((article) => (
              <motion.article
                key={article.id}
                whileHover={{ y: -3 }}
                onClick={() => onOpenArticle(article)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onOpenArticle(article);
                  }
                }}
                className="flex-1 bg-white rounded-[24px] border border-[#EFE3D8] overflow-hidden shadow-[0_6px_20px_rgba(36,26,20,0.03)] grid grid-cols-1 sm:grid-cols-12 group cursor-pointer"
              >
                {/* Text Content */}
                <div className="sm:col-span-7 p-5 sm:p-6 flex flex-col justify-between text-right order-2 sm:order-1">
                  <div>
                    <div className="flex items-center gap-2 text-[11px] text-[#9A8577] mb-2.5 tabular-nums-fa">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{article.readTime}</span>
                      <span>·</span>
                      <span>{article.date}</span>
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-[#241A14] group-hover:text-[#8A5026] transition-colors mb-2 leading-snug">
                      {article.title}
                    </h3>
                    <p className="text-xs text-[#7D6D63] leading-6 line-clamp-2">
                      {article.excerpt}
                    </p>
                  </div>

                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8A5026] mt-4">
                    <span>ادامه مطلب</span>
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </span>
                </div>

                {/* Photo */}
                <div className="sm:col-span-5 relative min-h-[170px] bg-[#F3E7DC] overflow-hidden order-1 sm:order-2">
                  <SafeImage
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-white/90 text-[#5D4332] text-[10px] font-medium shadow-sm">
                    {article.tag}
                  </span>
                </div>
              </motion.article>
            ))}

            {/* Archive Strip */}
            <button
              type="button"
              onClick={() =>
                onOpenBlogPage ? onOpenBlogPage() : onOpenArticle(secondary[0] ?? featured)
              }
              className="w-full rounded-2xl border border-dashed border-[#DEC9B8] bg-[#FAF2EA]/80 hover:bg-[#F3E5D8] px-5 py-3.5 flex items-center justify-between text-xs text-[#6B584C] transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#8A5026]" />
                <span>آرشیو مجله شامل راهنماهای خرید، متریال و پشت صحنه آتلیه است.</span>
              </span>
              <span className="font-semibold text-[#8A5026] shrink-0">مشاهده وبلاگ</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
