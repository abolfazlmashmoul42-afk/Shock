import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { CATEGORIES } from '../data/catalog';
import {
  EditorialReveal,
  SafeImage,
  StaggerGrid,
  StaggerItem,
} from './MotionPrimitives';

interface CategoriesSectionProps {
  activeCategory: string;
  onSelectCategory: (slug: string) => void;
}

export function CategoriesSection({
  activeCategory,
  onSelectCategory,
}: CategoriesSectionProps) {
  return (
    <section className="py-14 sm:py-16 bg-gradient-to-b from-[#FAF5F0] to-[#FBF7F3]">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        <EditorialReveal>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-9">
            <div className="text-right">
              <p className="text-[11px] font-medium text-[#9D8576] mb-1.5">
                دسته‌بندی‌های شوک
              </p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#241A14]">
                سبک برازنده خود را بیابید
              </h2>
              <p className="text-xs sm:text-sm text-[#7D6D63] mt-2">
                مجموعه‌ای سازمان‌یافته بر اساس نهایت ظرافت دوخت و دست‌چین دقیق مرغوب‌ترین متریال‌ها.
              </p>
            </div>

            <button
              type="button"
              onClick={() => onSelectCategory('all')}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-[#7C5236] hover:text-[#57341E] transition-colors self-start sm:self-auto whitespace-nowrap cursor-pointer"
            >
              <span>مشاهده همه کالکشن‌ها</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        </EditorialReveal>

        <StaggerGrid className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3.5 sm:gap-4">
          {CATEGORIES.map((cat) => {
            const isSelected = activeCategory === cat.slug;
            return (
              <StaggerItem key={cat.id}>
                <motion.button
                  type="button"
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onSelectCategory(cat.slug)}
                  className={`w-full group rounded-2xl bg-white p-2 border transition-all duration-200 text-center cursor-pointer ${
                    isSelected
                      ? 'border-[#8A5026] shadow-md shadow-[#8A5026]/10'
                      : 'border-[#EFE4DA] shadow-[0_4px_18px_rgba(36,26,20,0.03)] hover:border-[#D7BFA9] hover:shadow-md'
                  }`}
                >
                  <div className="aspect-[3/3.35] rounded-xl overflow-hidden bg-[#F4EBE3] mb-3">
                    <SafeImage
                      src={cat.image}
                      alt={cat.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="pb-1.5">
                    <p className="text-sm font-bold text-[#241A14]">{cat.title}</p>
                    <p className="text-[11px] text-[#8E7C70] mt-0.5 tabular-nums-fa">
                      {cat.subtitle}
                    </p>
                  </div>
                </motion.button>
              </StaggerItem>
            );
          })}
        </StaggerGrid>
      </div>
    </section>
  );
}
