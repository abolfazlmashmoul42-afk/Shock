import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock,
  Copy,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Send,
} from 'lucide-react';
import { IMAGES } from '../data/catalog';
import { toPersianDigits, validateContactMessage } from '../utils/store';
import { SafeImage } from './MotionPrimitives';

interface ContactPageProps {
  onBackHome: () => void;
  onOpenAbout: () => void;
  onSelectCategory: (slug: string) => void;
  onOpenAccount: () => void;
}

const DEPARTMENTS = [
  'مشاوره سایز و خرید',
  'پیگیری سفارش و ارسال',
  'تک‌دوزی و سفارش VIP',
  'پیشنهاد و انتقاد',
];

const CONTACT_FAQS = [
  {
    id: 'faq-delivery',
    question: 'زمان و نحوه ارسال سفارش‌ها در تهران و سایر شهرها چگونه است؟',
    answer:
      'سفارش‌های شهر تهران در بازه ۲ تا ۴ ساعته با پیک اختصاصی و بیمه‌شده آتلیه تحویل می‌گردند. برای سایر استان‌ها، بسته‌ها طی ۲۴ تا ۴۸ ساعت کاری در باکس هاردباکس شوک ارسال می‌شوند.',
  },
  {
    id: 'faq-exchange',
    question: 'اگر سایز یا مدل انتخابی با استایل من هماهنگ نباشد، امکان تعویض وجود دارد؟',
    answer:
      'بله، تا ۷ روز پس از دریافت بسته می‌توانید بدون قید و شرط سایز یا مدل را با هماهنگی پشتیبانی آتلیه تعویض کنید. پیک شوک در تهران تعویض را درب منزل انجام می‌دهد.',
  },
  {
    id: 'faq-visit',
    question: 'آیا برای بازدید حضوری از شوروم فرشته نیاز به رزرو قبلی است؟',
    answer:
      'شنبه تا پنج‌شنبه از ساعت ۱۰ تا ۲۱ بازدید آزاد است؛ اما برای مشاوره اختصاصی سایزگیری، پرو مدل‌های تک‌دوز یا بازدید در روزهای جمعه، هماهنگی قبلی زمان کافی را برای شما تضمین می‌کند.',
  },
  {
    id: 'faq-custom',
    question: 'امکان تغییر قد آستین یا اصلاح جزئی سایز در آتلیه وجود دارد؟',
    answer:
      'بله، برای تمامی پالتوها، مانتوها و کت‌های فوتر شوک، خدمات تنظیم قد آستین و قد لباس توسط خیاطان آتلیه پیش از ارسال یا در شوروم به‌صورت رایگان انجام می‌شود.',
  },
];

export function ContactPage({
  onBackHome,
  onOpenAbout,
  onSelectCategory,
  onOpenAccount,
}: ContactPageProps) {
  const [selectedDepartment, setSelectedDepartment] = useState(DEPARTMENTS[0]);
  const [fullName, setFullName] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [orderRef, setOrderRef] = useState('');
  const [messageBody, setMessageBody] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [ticketReceipt, setTicketReceipt] = useState<{
    code: string;
    name: string;
    department: string;
  } | null>(null);
  const [copiedKey, setCopiedKey] = useState<'address' | 'phone' | 'email' | null>(
    null,
  );
  const [openFaqId, setOpenFaqId] = useState<string | null>(CONTACT_FAQS[0].id);

  const handleCopy = (key: 'address' | 'phone' | 'email', text: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text).catch(() => {});
    }
    setCopiedKey(key);
    window.setTimeout(() => {
      setCopiedKey((curr) => (curr === key ? null : curr));
    }, 2200);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const check = validateContactMessage({
      name: fullName,
      contact: contactInfo,
      message: messageBody,
    });
    if (!check.valid) {
      setFormError(check.error ?? 'اطلاعات فرم را بررسی فرمایید.');
      return;
    }
    setFormError(null);
    const num =
      6200 +
      ((fullName.trim().length * 53 + messageBody.trim().length * 17) % 900);
    setTicketReceipt({
      code: `TKT-${toPersianDigits(num)}`,
      name: fullName.trim(),
      department: selectedDepartment,
    });
    setFullName('');
    setContactInfo('');
    setOrderRef('');
    setMessageBody('');
  };

  return (
    <div data-testid="contact-page" className="bg-[#FAF5F0] text-[#241A14]">
      {/* Breadcrumb Strip */}
      <div className="border-b border-[#EBDED3] bg-[#FDF9F6]">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 h-12 flex items-center justify-between gap-4 text-xs">
          <nav aria-label="مسیر صفحه" className="flex items-center gap-2 text-[#8D7B70]">
            <button
              type="button"
              onClick={onBackHome}
              className="hover:text-[#241A14] transition-colors cursor-pointer"
            >
              صفحه اصلی
            </button>
            <span aria-hidden="true">/</span>
            <span className="font-semibold text-[#241A14]">تماس با خانه مد شوک</span>
          </nav>

          <button
            type="button"
            onClick={onBackHome}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#7C5236] hover:text-[#241A14] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <ArrowRight className="w-3.5 h-3.5" />
            <span>بازگشت به صفحه اصلی</span>
          </button>
        </div>
      </div>

      {/* Section 1: Concierge Header & 4-Channel Contact Directory */}
      <section className="py-10 sm:py-14">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl text-right mb-9 sm:mb-11">
            <p className="text-xs font-medium text-[#8A5026] mb-2.5">
              ارتباط مستقیم با تیم پشتیبانی و آتلیه شوک · پاسخگویی همه‌روزه
            </p>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#241A14] leading-[1.35] mb-3.5 text-balance">
              در کنار شما هستیم؛ تماس با خانه مد شوک
            </h1>
            <p className="text-sm text-[#66544A] leading-7">
              برای راهنمایی انتخاب سایز، پیگیری سفارش‌های ثبت‌شده یا هماهنگی بازدید حضوری از
              شوروم تهران، از راه‌های زیر با کارشناسان استایل ما در ارتباط باشید.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Address */}
            <div className="bg-[#FDF9F6] rounded-[24px] border border-[#E8DACD] p-6 flex flex-col justify-between text-right">
              <div>
                <div className="w-10 h-10 rounded-full bg-[#F3E7DC] text-[#8A5026] flex items-center justify-center mb-4">
                  <MapPin className="w-4 h-4" />
                </div>
                <h2 className="text-sm font-bold text-[#241A14] mb-1.5">
                  شوروم مرکزی تهران
                </h2>
                <p className="text-xs text-[#6B5A50] leading-6">
                  تهران، فرشته، خیابان آقابزرگی، پلاک ۲۴، عمارت شوک
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  handleCopy(
                    'address',
                    'تهران، فرشته، خیابان آقابزرگی، پلاک ۲۴، عمارت شوک',
                  )
                }
                className="mt-4 inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#8A5026] hover:text-[#5E3417] transition-colors self-start cursor-pointer"
              >
                {copiedKey === 'address' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#46704F]" />
                    <span className="text-[#46704F]">نشانی کپی شد</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>کپی نشانی شوروم</span>
                  </>
                )}
              </button>
            </div>

            {/* Phone */}
            <div className="bg-[#FDF9F6] rounded-[24px] border border-[#E8DACD] p-6 flex flex-col justify-between text-right">
              <div>
                <div className="w-10 h-10 rounded-full bg-[#F3E7DC] text-[#8A5026] flex items-center justify-center mb-4">
                  <Phone className="w-4 h-4" />
                </div>
                <h2 className="text-sm font-bold text-[#241A14] mb-1.5">
                  مشاوره استایل و تلفنی
                </h2>
                <p className="text-sm font-bold text-[#3F2E23] tabular-nums-fa" dir="ltr">
                  ۰۲۱ - ۲۶۲۰ ۴۸۱۰
                </p>
                <p className="text-[11px] text-[#8D7B70] mt-1 tabular-nums-fa">
                  داخلی ۱: فروش · داخلی ۲: پیگیری سفارش
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleCopy('phone', '02126204810')}
                className="mt-4 inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#8A5026] hover:text-[#5E3417] transition-colors self-start cursor-pointer"
              >
                {copiedKey === 'phone' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#46704F]" />
                    <span className="text-[#46704F]">شماره کپی شد</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>کپی شماره تماس</span>
                  </>
                )}
              </button>
            </div>

            {/* Email */}
            <div className="bg-[#FDF9F6] rounded-[24px] border border-[#E8DACD] p-6 flex flex-col justify-between text-right">
              <div>
                <div className="w-10 h-10 rounded-full bg-[#F3E7DC] text-[#8A5026] flex items-center justify-center mb-4">
                  <Mail className="w-4 h-4" />
                </div>
                <h2 className="text-sm font-bold text-[#241A14] mb-1.5">
                  پست الکترونیک آتلیه
                </h2>
                <p className="text-xs font-semibold text-[#3F2E23]" dir="ltr">
                  atelier@shockfashion.ir
                </p>
                <p className="text-[11px] text-[#8D7B70] mt-1">
                  مناسب همکاری‌ها و درخواست‌های رسمی
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleCopy('email', 'atelier@shockfashion.ir')}
                className="mt-4 inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#8A5026] hover:text-[#5E3417] transition-colors self-start cursor-pointer"
              >
                {copiedKey === 'email' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#46704F]" />
                    <span className="text-[#46704F]">ایمیل کپی شد</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>کپی نشانی ایمیل</span>
                  </>
                )}
              </button>
            </div>

            {/* Hours */}
            <div className="bg-[#FDF9F6] rounded-[24px] border border-[#E8DACD] p-6 flex flex-col justify-between text-right">
              <div>
                <div className="w-10 h-10 rounded-full bg-[#F3E7DC] text-[#8A5026] flex items-center justify-center mb-4">
                  <Clock className="w-4 h-4" />
                </div>
                <h2 className="text-sm font-bold text-[#241A14] mb-1.5">
                  ساعات پاسخگویی و بازدید
                </h2>
                <p className="text-xs text-[#6B5A50] leading-6 tabular-nums-fa">
                  شنبه تا پنج‌شنبه: ۱۰:۰۰ تا ۲۱:۰۰
                  <br />
                  جمعه‌ها: ۱۴:۰۰ تا ۲۰:۰۰ (با هماهنگی)
                </p>
              </div>
              <button
                type="button"
                onClick={onOpenAccount}
                className="mt-4 inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#8A5026] hover:text-[#5E3417] transition-colors self-start cursor-pointer"
              >
                <span>مشاهده وضعیت سفارش‌های من</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Interactive Message Form & Atelier Concierge Card */}
      <section className="py-6 sm:py-10">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Inquiry Form (7 cols) */}
            <div className="lg:col-span-7 bg-white rounded-[28px] border border-[#E8DACD] p-6 sm:p-9 text-right flex flex-col justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#241A14] mb-2">
                  ارسال پیام مستقیم به پشتیبانی شوک
                </h2>
                <p className="text-xs sm:text-sm text-[#7A685E] mb-6">
                  موضوع پیام را انتخاب کنید و پرسش خود را بنویسید؛ پاسخ کارشناسان ما در کمتر
                  از ۲ ساعت کاری برای شما ارسال خواهد شد.
                </p>

                {ticketReceipt ? (
                  <div
                    data-testid="contact-confirmation"
                    className="rounded-2xl bg-[#F4F9F4] border border-[#CBE0CC] p-6 space-y-3"
                  >
                    <div className="flex items-center gap-2.5 text-[#3B6642]">
                      <CheckCircle2 className="w-5 h-5 shrink-0" />
                      <h3 className="text-base font-extrabold">
                        پیام شما با موفقیت ثبت شد
                      </h3>
                    </div>
                    <p className="text-xs sm:text-sm text-[#4A5E4D] leading-7">
                      سرکار خانم/جناب <span className="font-bold">{ticketReceipt.name}</span>،
                      پیام شما برای بخش «{ticketReceipt.department}» با شماره پیگیری{' '}
                      <span className="font-bold tabular-nums-fa">{ticketReceipt.code}</span>{' '}
                      ثبت گردید. کارشناسان شوک در کوتاه‌ترین زمان با شما تماس خواهند گرفت.
                    </p>
                    <button
                      type="button"
                      onClick={() => setTicketReceipt(null)}
                      className="h-9 px-4 rounded-full bg-white border border-[#C6DBC7] text-xs font-semibold text-[#3B6642] hover:bg-[#EAF4EA] transition-colors cursor-pointer"
                    >
                      ارسال پیام دیگر
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} noValidate className="space-y-4">
                    <div>
                      <span className="block text-xs font-semibold text-[#3F2E23] mb-2">
                        واحد مربوطه
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {DEPARTMENTS.map((dept) => {
                          const active = selectedDepartment === dept;
                          return (
                            <button
                              key={dept}
                              type="button"
                              onClick={() => setSelectedDepartment(dept)}
                              aria-pressed={active}
                              className={`h-9 px-3.5 rounded-full text-xs font-medium border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                                active
                                  ? 'bg-[#241A14] border-[#241A14] text-white'
                                  : 'bg-[#FAF5F0] border-[#E5D6C8] text-[#4E3D33] hover:bg-[#F2E6DA]'
                              }`}
                            >
                              {dept}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="contact-full-name"
                          className="block text-xs font-semibold text-[#3F2E23] mb-1.5"
                        >
                          نام و نام خانوادگی
                        </label>
                        <input
                          id="contact-full-name"
                          type="text"
                          value={fullName}
                          onChange={(e) => {
                            setFullName(e.target.value);
                            if (formError) setFormError(null);
                          }}
                          placeholder="مثلاً: مهسا فرهادی"
                          className="w-full h-11 px-4 rounded-xl bg-[#FAF5F0] border border-[#E5D6C8] text-xs text-[#241A14] placeholder:text-[#A39287] focus:outline-none focus:bg-white focus:border-[#8A5026]"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="contact-phone-email"
                          className="block text-xs font-semibold text-[#3F2E23] mb-1.5"
                        >
                          شماره موبایل یا ایمیل
                        </label>
                        <input
                          id="contact-phone-email"
                          type="text"
                          value={contactInfo}
                          onChange={(e) => {
                            setContactInfo(e.target.value);
                            if (formError) setFormError(null);
                          }}
                          placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                          className="w-full h-11 px-4 rounded-xl bg-[#FAF5F0] border border-[#E5D6C8] text-xs text-[#241A14] placeholder:text-[#A39287] focus:outline-none focus:bg-white focus:border-[#8A5026]"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="contact-order-ref"
                        className="block text-xs font-semibold text-[#3F2E23] mb-1.5"
                      >
                        کد سفارش یا نام محصول (اختیاری)
                      </label>
                      <input
                        id="contact-order-ref"
                        type="text"
                        value={orderRef}
                        onChange={(e) => setOrderRef(e.target.value)}
                        placeholder="مثلاً: پالتو کشمیر الیزا یا کد سفارش SH-1042"
                        className="w-full h-11 px-4 rounded-xl bg-[#FAF5F0] border border-[#E5D6C8] text-xs text-[#241A14] placeholder:text-[#A39287] focus:outline-none focus:bg-white focus:border-[#8A5026]"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="contact-message-body"
                        className="block text-xs font-semibold text-[#3F2E23] mb-1.5"
                      >
                        متن پیام
                      </label>
                      <textarea
                        id="contact-message-body"
                        rows={4}
                        value={messageBody}
                        onChange={(e) => {
                          setMessageBody(e.target.value);
                          if (formError) setFormError(null);
                        }}
                        placeholder="پرسش یا توضیحات خود را بنویسید..."
                        className="w-full p-3.5 rounded-xl bg-[#FAF5F0] border border-[#E5D6C8] text-xs text-[#241A14] placeholder:text-[#A39287] focus:outline-none focus:bg-white focus:border-[#8A5026]"
                      />
                    </div>

                    {formError && (
                      <p
                        role="alert"
                        data-testid="contact-form-error"
                        className="text-xs font-semibold text-[#B53D34]"
                      >
                        {formError}
                      </p>
                    )}

                    <div className="pt-1 flex flex-wrap items-center justify-between gap-4">
                      <span className="text-[11px] text-[#8E7B70]">
                        اطلاعات تماس شما تنها برای پاسخگویی به همین درخواست استفاده می‌شود.
                      </span>

                      <button
                        type="submit"
                        className="h-11 px-7 rounded-full bg-gradient-to-l from-[#7E4821] to-[#985A2D] hover:from-[#6A3B19] hover:to-[#824B23] text-white text-xs sm:text-sm font-semibold shadow-md transition-transform hover:-translate-y-0.5 whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        ارسال پیام به آتلیه
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>

            {/* Dark Showroom Visual & Direct Social Card (5 cols) */}
            <div className="lg:col-span-5 bg-[#221914] text-white rounded-[28px] overflow-hidden border border-white/10 flex flex-col justify-between text-right">
              <div className="relative h-60 sm:h-64 overflow-hidden">
                <SafeImage
                  src={IMAGES.heroCourtyard}
                  alt="عمارت و شوروم خانه مد شوک"
                  eager
                  className="w-full h-full object-cover object-[50%_28%]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#221914] via-[#221914]/35 to-transparent" />
                <div className="absolute bottom-4 inset-x-6">
                  <p className="text-[11px] text-[#E0B185] mb-1">
                    عمارت شوک · الهیه و فرشته تهران
                  </p>
                  <p className="text-base font-extrabold text-white">
                    میزبان پرو حضوری و مشاوره اختصاصی
                  </p>
                </div>
              </div>

              <div className="p-6 sm:p-8 space-y-6 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <p className="text-xs sm:text-sm text-[#CFC0B5] leading-7">
                    در شوروم مرکزی شوک می‌توانید جنس پارچه‌های کشمیر، فوتر بیه‌لا و ابریشم
                    دست‌بافت یزد را پیش از سفارش لمس کنید و از راهنمایی طراحان ما برای ست کردن
                    پالت رنگی بهره‌مند شوید.
                  </p>

                  <div className="pt-2 space-y-2.5 text-xs">
                    <div className="flex items-center justify-between py-2 border-b border-white/10">
                      <span className="text-[#B8A496] flex items-center gap-2">
                        <Instagram className="w-4 h-4 text-[#E0B185]" />
                        <span>اینستاگرام رسمی</span>
                      </span>
                      <span className="font-semibold text-white" dir="ltr">
                        @shock.atelier
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-2 border-b border-white/10">
                      <span className="text-[#B8A496] flex items-center gap-2">
                        <Send className="w-4 h-4 text-[#E0B185]" />
                        <span>پشتیبانی تلگرام و واتس‌اپ</span>
                      </span>
                      <span className="font-semibold text-white" dir="ltr">
                        @shock_concierge
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => onSelectCategory('all')}
                    className="h-10 px-5 rounded-full bg-white text-[#221914] hover:bg-[#FAF1E8] text-xs font-bold inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <span>مشاهده کالکشن‌ها</span>
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={onOpenAbout}
                    className="h-10 px-5 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 text-[#F2E3D4] text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    داستان آتلیه شوک
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Concierge FAQ Accordion */}
      <section className="py-12 sm:py-16">
        <div className="max-w-[960px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <p className="text-xs font-medium text-[#9D8576] mb-1.5">
              راهنمای سریع مشتریان
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#241A14]">
              پرسش‌های متداول پیش از تماس
            </h2>
          </div>

          <div className="bg-[#FDF9F6] rounded-[24px] border border-[#E8DACD] divide-y divide-[#EADCD0] px-5 sm:px-7">
            {CONTACT_FAQS.map((faq) => {
              const isOpen = openFaqId === faq.id;
              return (
                <div key={faq.id} className="py-4 sm:py-5 text-right">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() =>
                      setOpenFaqId((curr) => (curr === faq.id ? null : faq.id))
                    }
                    className="w-full flex items-center justify-between gap-4 text-right cursor-pointer"
                  >
                    <span className="text-xs sm:text-sm font-bold text-[#241A14]">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#8A5026] shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <p className="mt-3 text-xs sm:text-sm text-[#66544A] leading-7 pl-6">
                      {faq.answer}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
