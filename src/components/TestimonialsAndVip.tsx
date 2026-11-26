import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Star,
  Gift,
  Heart,
  Sparkles,
  ArrowDown,
  CheckCircle2,
  Quote,
} from 'lucide-react';
import { SIGNATURE_ELIZA_PRODUCT, TESTIMONIALS } from '../data/catalog';
import { validateVipContact, type Product } from '../utils/store';
import { EditorialReveal, StaggerGrid, StaggerItem } from './MotionPrimitives';

interface TestimonialsAndVipProps {
  onVipJoined: () => void;
  vipJoined: boolean;
  onOpenSignaturePiece: (product: Product) => void;
}

export function TestimonialsAndVip({
  onVipJoined,
  vipJoined,
  onOpenSignaturePiece,
}: TestimonialsAndVipProps) {
  const [contact, setContact] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleVipSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = validateVipContact(contact);
    if (!res.valid) {
      setErrorMsg(res.error ?? 'اطلاعات واردشده معتبر نیست.');
      return;
    }
    setErrorMsg(null);
    onVipJoined();
  };

  return (
    <section className="py-16 sm:py-20 bg-[#FDF9F6]">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Testimonials Heading */}
        <EditorialReveal>
          <div className="text-center max-w-xl mx-auto mb-10">
            <p className="text-[11px] font-medium text-[#9D8576] mb-2">
              تجربه اصالت
            </p>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#241A14]">
              روایت خریداران ارجمند ما
            </h2>
          </div>
        </EditorialReveal>

        {/* 3 Testimonial Cards */}
        <StaggerGrid className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-16">
          {TESTIMONIALS.map((item) => (
            <StaggerItem key={item.id}>
              <article className="h-full bg-white rounded-[24px] border border-[#EFE3D8] p-6 sm:p-7 shadow-[0_6px_22px_rgba(36,26,20,0.03)] flex flex-col justify-between text-right">
                <div>
                  {/* Top stars + quote icon */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-1 text-[#C78839]">
                      {Array.from({ length: item.rating }).map((_, idx) => (
                        <Star
                          key={idx}
                          className="w-3.5 h-3.5 fill-[#C78839] text-[#C78839]"
                        />
                      ))}
                    </div>
                    <Quote className="w-5 h-5 text-[#E8D8CA]" />
                  </div>

                  {/* Review Text */}
                  <p className="text-xs sm:text-[13px] text-[#4B3A30] leading-7 mb-6">
                    {item.quote}
                  </p>
                </div>

                {/* Author Footer */}
                <div className="flex items-center gap-3 pt-4 border-t border-[#F4EAE1]">
                  <div className="w-10 h-10 rounded-full bg-[#F5E4D6] text-[#8A5026] text-xs font-bold flex items-center justify-center shrink-0">
                    {item.initials}
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-[#241A14]">
                      {item.author}
                    </p>
                    <p className="text-[11px] text-[#8E7C70] mt-0.5">
                      {item.verifiedItem}
                    </p>
                  </div>
                </div>
              </article>
            </StaggerItem>
          ))}
        </StaggerGrid>

        {/* VIP Club Signup Card */}
        <EditorialReveal>
          <div className="max-w-3xl mx-auto rounded-[32px] bg-gradient-to-br from-[#F9EDE3] via-[#FDF5EE] to-[#F6E6D9] border border-[#EAD6C6] px-6 py-10 sm:px-12 sm:py-12 text-center shadow-[0_16px_44px_rgba(92,55,28,0.06)] mb-12">
            <div className="w-12 h-12 rounded-2xl bg-[#EED5C2] text-[#8A5026] flex items-center justify-center mx-auto mb-5">
              <Gift className="w-5 h-5" />
            </div>

            <h3 className="text-xl sm:text-2xl font-extrabold text-[#241A14] mb-3">
              باشگاه اعضای برگزیده شوک
            </h3>
            <p className="text-xs sm:text-sm text-[#6E5D53] leading-7 max-w-lg mx-auto mb-7">
              با ثبت شماره یا ایمیل خود، علاوه بر ۱۰٪ تخفیف خرید اول، دعوت‌نامه مراسم خصوصی
              رونمایی فصلی را دریافت کنید.
            </p>

            {vipJoined ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md mx-auto bg-white rounded-2xl p-4 border border-[#DFC7B3] shadow-sm flex flex-col items-center gap-2"
              >
                <div className="flex items-center gap-2 text-[#46704F] text-sm font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>عضویت شما در باشگاه VIP شوک تایید شد</span>
                </div>
                <p className="text-xs text-[#6E5D53]">
                  کد تخفیف ۱۰٪ خرید اول شما:{' '}
                  <strong className="px-2 py-0.5 rounded bg-[#FAF1E8] text-[#8A5026] font-mono">
                    SHOCK-VIP10
                  </strong>{' '}
                  (در سبد خرید به‌صورت خودکار اعمال شد)
                </p>
              </motion.div>
            ) : (
              <form
                onSubmit={handleVipSubmit}
                noValidate
                className="max-w-lg mx-auto"
              >
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 bg-white/80 p-1.5 rounded-3xl sm:rounded-full border border-[#E5D2C2] shadow-sm">
                  <input
                    type="text"
                    value={contact}
                    onChange={(e) => {
                      setContact(e.target.value);
                      if (errorMsg) setErrorMsg(null);
                    }}
                    placeholder="شماره موبایل یا ایمیل شما..."
                    aria-label="شماره موبایل یا ایمیل جهت عضویت در باشگاه شوک"
                    className="flex-1 h-11 px-4 bg-transparent text-xs sm:text-sm text-[#241A14] placeholder:text-[#A39287] focus:outline-none text-right"
                  />
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    type="submit"
                    className="h-11 px-6 rounded-full bg-gradient-to-l from-[#7E4821] to-[#985A2D] hover:from-[#6A3B19] hover:to-[#824B23] text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shrink-0 cursor-pointer"
                  >
                    <span>دریافت هدیه</span>
                    <Heart className="w-4 h-4" />
                  </motion.button>
                </div>

                {errorMsg && (
                  <p role="alert" className="text-xs text-[#B53D34] mt-2.5 font-medium">
                    {errorMsg}
                  </p>
                )}
              </form>
            )}

            <p className="text-[11px] text-[#9A877B] mt-4">
              حفظ حریم خصوصی شما اولویت قطعی خانه مد شوک است.
            </p>
          </div>
        </EditorialReveal>

        {/* Signature Piece Horizontal Ribbon */}
        <div className="border-y border-[#ECE0D6] py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-right">
            <div className="w-10 h-10 rounded-full bg-[#F5E7DC] text-[#8A5026] flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-[#241A14]">
                قطعه شاخص این فصل: مانتو کتی فوتر لوکس شوک مدل الیزا
              </p>
              <p className="text-[11px] text-[#8E7C70] mt-0.5 tabular-nums-fa">
                ۳۸ نظر تاییدشده · امتیاز ۴.۹
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onOpenSignaturePiece(SIGNATURE_ELIZA_PRODUCT)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#7C5236] hover:text-[#57341E] transition-colors cursor-pointer"
          >
            <span>مشاهده جزئیات قطعه</span>
            <ArrowDown className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
}
