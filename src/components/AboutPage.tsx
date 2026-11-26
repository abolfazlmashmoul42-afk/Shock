import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  CalendarCheck,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  Scissors,
  Sparkles,
} from 'lucide-react';
import { IMAGES } from '../data/catalog';
import { toPersianDigits, validateAppointmentRequest } from '../utils/store';
import { SafeImage } from './MotionPrimitives';

interface AboutPageProps {
  onBackHome: () => void;
  onSelectCategory: (slug: string) => void;
  vipJoined: boolean;
  onVipJoined: () => void;
}

interface MaterialChapter {
  id: string;
  tabLabel: string;
  origin: string;
  spec: string;
  title: string;
  summary: string;
  craftPoints: string[];
  guarantee: string;
  image: string;
  imagePosition?: string;
  targetCategory: string;
  ctaLabel: string;
}

const MATERIAL_CHAPTERS: MaterialChapter[] = [
  {
    id: 'merino-wool',
    tabLabel: 'فوتر مرینوس بیه‌لا',
    origin: 'ناحیه بیه‌لا، ایتالیا',
    spec: 'تراکم ۵۲۰ گرم بر مترمربع · ۱۰۰٪ پشم خالص',
    title: 'گرم، ساختارمند و مقاوم در برابر پرزدهی',
    summary:
      'الیاف بلند پشم مرینوس با تاب‌دهی دوگانه بافته می‌شوند تا پالتوها و کت‌های شوک بدون نیاز به لایه‌های خشک مصنوعی، فرم شانه و ایستایی معماری خود را سال‌ها حفظ کنند.',
    craftPoints: [
      'برش دستی الگو با هم‌راستایی کامل راه پارچه',
      'دوخت دو رو و مغزی‌دوزی کامل درزهای داخلی',
      'آستردوزی تمام ابریشم جهت تنفس‌پذیری در فضای بسته',
    ],
    guarantee: '۳ سال ضمانت اصالت بافت و عدم پرزدهی',
    image: IMAGES.oatmealCoat,
    imagePosition: 'object-[50%_55%]',
    targetCategory: 'coat',
    ctaLabel: 'مشاهده پالتوهای فوتر',
  },
  {
    id: 'yazd-silk',
    tabLabel: 'ابریشم دست‌بافت یزد',
    origin: 'کارگاه‌های منتخب اردکان و یزد',
    spec: 'ابریشم خالص ۱۸ موم · رنگرزی گیاهی',
    title: 'درخشش آرام و لطافت اصیل ایرانی',
    summary:
      'ابریشم توییل و ژاکارد یزد پایه اصلی شال‌ها، روسری‌ها و آستر مانتوهای مجلسی شوک است. هر قواره با لبه‌دوزی رول‌شده دستی تکمیل می‌شود تا در طول سال‌ها نخ‌کش نشود.',
    craftPoints: [
      'بافت متراکم توییل با زیردست نرم و مات',
      'رنگرزی با ثبات نوری بالا و پالت رنگ گرم اختصاصی',
      'لبه‌دوزی دست‌ساز ظریف در کارگاه تخصصی شوک',
    ],
    guarantee: 'گواهی اصالت تار و پود همراه هر سفارش',
    image: IMAGES.twillScarf,
    imagePosition: 'object-center',
    targetCategory: 'shawl',
    ctaLabel: 'مشاهده شال و روسری ابریشم',
  },
  {
    id: 'mountain-cashmere',
    tabLabel: 'کشمیر لطیف کوهستان',
    origin: 'فلات‌های سرد آسیای مرکزی',
    spec: 'ظرافت ۱۵.۵ میکرون · گرمایش سبک‌وزن',
    title: 'بسیار سبک روی شانه با عایق حرارتی طبیعی',
    summary:
      'تنها ظریف‌ترین لایه زیرین الیاف طبیعی برای تولید شال‌ها و پالتوهای کشمیر شوک انتخاب می‌شود تا بیشترین گرما را با کمترین وزن ممکن و بدون هیچ حساسیت پوستی فراهم آورد.',
    craftPoints: [
      'شانه‌کشی و پالایش دستی پیش از ریسندگی نخ',
      'بافت متعادل بدون لیز خوردن روی سر یا مانتو',
      'بسته‌بندی همراه کیسه تنفس‌پذیر نگهداری فصل گرم',
    ],
    guarantee: 'تضمین ۱۰۰٪ بدون الیاف پلی‌استر و نایلون',
    image: IMAGES.cashmereMacro,
    imagePosition: 'object-center',
    targetCategory: 'shawl',
    ctaLabel: 'مشاهده آثار کشمیر',
  },
  {
    id: 'vegetable-leather',
    tabLabel: 'چرم دباغی گیاهی',
    origin: 'کارگاه چرم آتلیه شوک، تهران',
    spec: 'چرم تمام‌دانه گاوی · یراق برنج مات',
    title: 'اصالت ماندگار که با گذر زمان زیباتر می‌شود',
    summary:
      'کیف‌ها و کمربندهای چرمی شوک بدون پوشش‌های شیمیایی براق و با عصاره پوست درختان دباغی می‌شوند. پس از هر دوخت، لبه‌ها به صورت دستی پرداخت و موم‌کاری می‌گردند.',
    craftPoints: [
      'چرم تمام‌دانه طبیعی با بافت زنده و تنفس‌پذیر',
      'سگک‌ها و زنجیرهای ریخته‌گری‌شده از برنج آنتیک',
      'دوخت زینی مقاوم با نخ موم‌زده فرانسوی',
    ],
    guarantee: 'خدمات رایگان واکس و احیای چرم آتلیه',
    image: IMAGES.toranjBag,
    imagePosition: 'object-center',
    targetCategory: 'bag',
    ctaLabel: 'مشاهده کیف و چرم دست‌ساز',
  },
];

const ATELIER_MILESTONES = [
  {
    number: '۰۱',
    year: '۱۳۹۸',
    title: 'شروع با یک کارگاه شش‌نفره در تهران',
    description:
      'خانه مد شوک با هدف احیای برش تمیز، الگوهای سازگار با اندام بانوان ایرانی و پرهیز از تولید انبوه با الیاف مصنوعی آغاز به کار کرد.',
  },
  {
    number: '۰۲',
    year: '۱۴۰۰',
    title: 'پیوند مستقیم با بافندگان یزد و تامین فوتر ایتالیا',
    description:
      'با حذف واسطه‌ها، خط تامین انحصاری ابریشم یزد و فوتر مرینوس راه‌اندازی شد تا هر قطعه با شناسنامه پارچه و شماره دوخت عرضه گردد.',
  },
  {
    number: '۰۳',
    year: '۱۴۰۳',
    title: 'گشایش شوروم فرشته و آتلیه تک‌دوزی VIP',
    description:
      'امروز شوک در کنار فروشگاه آنلاین، میزبان مراجعان حضوری برای پرو اختصاصی، مشاوره استایل فصلی و خدمات نگهداری چندساله پوشاک است.',
  },
];

const TOPIC_OPTIONS = [
  'پرو اختصاصی پالتو و مانتو',
  'مشاوره ست مجلسی و شال ابریشم',
  'سفارش دوخت سایز سفارشی',
];

export function AboutPage({
  onBackHome,
  onSelectCategory,
  vipJoined,
  onVipJoined,
}: AboutPageProps) {
  const [activeMaterialId, setActiveMaterialId] = useState(MATERIAL_CHAPTERS[0].id);
  const [guestName, setGuestName] = useState('');
  const [guestContact, setGuestContact] = useState('');
  const [selectedTopic, setSelectedTopic] = useState(TOPIC_OPTIONS[0]);
  const [guestNote, setGuestNote] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [confirmedReceipt, setConfirmedReceipt] = useState<{
    code: string;
    name: string;
    topic: string;
  } | null>(null);

  const activeMaterial =
    MATERIAL_CHAPTERS.find((m) => m.id === activeMaterialId) ?? MATERIAL_CHAPTERS[0];

  const handleAppointmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const check = validateAppointmentRequest({
      name: guestName,
      contact: guestContact,
    });
    if (!check.valid) {
      setFormError(check.error ?? 'اطلاعات واردشده معتبر نیست.');
      return;
    }
    setFormError(null);
    const codeNum = 4100 + ((guestName.trim().length * 73 + guestContact.trim().length * 19) % 800);
    setConfirmedReceipt({
      code: `SHK-${toPersianDigits(codeNum)}`,
      name: guestName.trim(),
      topic: selectedTopic,
    });
    setGuestName('');
    setGuestContact('');
    setGuestNote('');
  };

  return (
    <div data-testid="about-page" className="bg-[#FAF5F0] text-[#241A14]">
      {/* Breadcrumb & Page Return Strip */}
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
            <span className="font-semibold text-[#241A14]">درباره خانه مد شوک</span>
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

      {/* Section 1: Editorial Hero Split */}
      <section className="py-10 sm:py-14 lg:py-16">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
            {/* Right Editorial Narrative (7 cols) */}
            <div className="lg:col-span-7 flex flex-col justify-between text-right py-2">
              <div>
                <p className="text-xs font-medium text-[#8A5026] mb-3">
                  آتلیه طراحی و تک‌دوزی شوک · تاسیس ۱۳۹۸
                </p>

                <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-[#241A14] leading-[1.35] mb-5 text-balance max-w-2xl">
                  اصالت در تار و پود؛ روایت خانه مد شوک
                </h1>

                <p className="text-sm sm:text-[15px] text-[#5D4C42] leading-8 max-w-2xl mb-6">
                  شوک با یک باور ساده شکل گرفت: لباس فاخر پیش از آنکه به چشم بیاید، باید هنگام
                  لمس و پوشیدن آرامش ببخشد. در آتلیه تهران، طراحان و استادکاران ما پارچه‌های
                  تنفس‌پذیر پشم مرینوس، کشمیر و ابریشم دست‌بافت یزد را با الگوهای دقیق و
                  مغزی‌دوزی‌های تمیز ترکیب می‌کنند تا آثاری فراتر از فصل‌ها خلق شود.
                </p>

                <p className="text-xs sm:text-sm text-[#7A685E] leading-7 max-w-xl mb-8">
                  ما به جای تولید انبوه و الیاف مصنوعی، بر تیراژ محدود، ماندگاری چندساله و احترام
                  به جزئیاتی تکیه می‌کنیم که فقط در دوخت دست‌ساز آتلیه دیده می‌شود.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3.5">
                <button
                  type="button"
                  onClick={() => onSelectCategory('all')}
                  className="h-11 px-6 rounded-full bg-gradient-to-l from-[#7E4821] to-[#985A2D] hover:from-[#6A3B19] hover:to-[#824B23] text-white text-xs sm:text-sm font-semibold inline-flex items-center gap-2 shadow-md transition-transform hover:-translate-y-0.5 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <span>مشاهده کالکشن‌های شوک</span>
                  <ArrowLeft className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() =>
                    document
                      .querySelector('#atelier-visit')
                      ?.scrollIntoView({ behavior: 'smooth' })
                  }
                  className="h-11 px-6 rounded-full bg-white hover:bg-[#F4EAE0] border border-[#E2D1C2] text-[#3E2C22] text-xs sm:text-sm font-medium inline-flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <CalendarCheck className="w-4 h-4 text-[#8A5026]" />
                  <span>رزرو بازدید و مشاوره حضوری</span>
                </button>
              </div>
            </div>

            {/* Left Editorial Visual Frame (5 cols) */}
            <div className="lg:col-span-5">
              <div className="relative h-[320px] sm:h-[380px] lg:h-full min-h-[360px] rounded-[28px] overflow-hidden border border-[#E7D8CA] shadow-[0_18px_46px_rgba(36,26,20,0.08)]">
                <SafeImage
                  src={IMAGES.bannerWinterSilk}
                  alt="شوروم و کالکشن زمستانه خانه مد شوک"
                  eager
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A110C]/80 via-transparent to-transparent" />
                <div className="absolute bottom-5 inset-x-5 text-right text-white">
                  <p className="text-[11px] text-[#E6CEBA] mb-1">
                    شوروم و آتلیه طراحی · خیابان فرشته تهران
                  </p>
                  <p className="text-sm font-bold">
                    مجموعه پاییز و زمستان ۱۴۰۳ با الیاف طبیعی
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 4-Column Quantitative Proof Strip */}
          <div className="mt-10 sm:mt-12 grid grid-cols-2 lg:grid-cols-4 gap-4 bg-[#FDF9F6] rounded-[24px] border border-[#E9DBD0] p-5 sm:p-7">
            <div className="text-right lg:border-l lg:border-[#EDE0D5] lg:pl-6">
              <p className="text-2xl sm:text-3xl font-extrabold text-[#241A14] tabular-nums-fa">
                ۷ سال
              </p>
              <p className="text-xs font-semibold text-[#5E4C42] mt-1">سابقه طراحی و تک‌دوزی</p>
              <p className="text-[11px] text-[#8E7B70] mt-0.5">از ۱۳۹۸ در آتلیه تهران</p>
            </div>

            <div className="text-right lg:border-l lg:border-[#EDE0D5] lg:pl-6">
              <p className="text-2xl sm:text-3xl font-extrabold text-[#241A14] tabular-nums-fa">
                ۴۸ ساعت
              </p>
              <p className="text-xs font-semibold text-[#5E4C42] mt-1">زمان دوخت هر ردا و پالتو</p>
              <p className="text-[11px] text-[#8E7B70] mt-0.5">با کنترل کیفیت چندمرحله‌ای</p>
            </div>

            <div className="text-right lg:border-l lg:border-[#EDE0D5] lg:pl-6">
              <p className="text-2xl sm:text-3xl font-extrabold text-[#241A14] tabular-nums-fa">
                ۱۰۰٪
              </p>
              <p className="text-xs font-semibold text-[#5E4C42] mt-1">الیاف طبیعی و تنفس‌پذیر</p>
              <p className="text-[11px] text-[#8E7B70] mt-0.5">بدون پلی‌استر در بافت اصلی</p>
            </div>

            <div className="text-right">
              <p className="text-2xl sm:text-3xl font-extrabold text-[#8A5026] tabular-nums-fa">
                ۳ سال
              </p>
              <p className="text-xs font-semibold text-[#5E4C42] mt-1">ضمانت عدم پرزدهی فوتر</p>
              <p className="text-[11px] text-[#8E7B70] mt-0.5">همراه شناسنامه اصالت کالا</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Interactive Material & Craft Explorer */}
      <section className="py-12 sm:py-16 bg-[#221914] text-white">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-9">
            <div className="text-right">
              <p className="text-xs font-medium text-[#E0B185] mb-2">
                شناسنامه متریال و هنر دوخت
              </p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white text-balance">
                پارچه‌هایی که به زیبایی سال‌ها عمر می‌کنند
              </h2>
            </div>

            {/* Interactive Segmented Material Selector */}
            <div
              role="tablist"
              aria-label="انتخاب متریال آتلیه شوک"
              className="flex flex-wrap items-center gap-2 bg-white/[0.06] p-1.5 rounded-2xl border border-white/10"
            >
              {MATERIAL_CHAPTERS.map((mat) => {
                const isActive = mat.id === activeMaterial.id;
                return (
                  <button
                    key={mat.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActiveMaterialId(mat.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      isActive
                        ? 'bg-[#8A5026] text-white shadow-sm'
                        : 'text-[#CFC0B5] hover:text-white hover:bg-white/[0.06]'
                    }`}
                  >
                    {mat.tabLabel}
                  </button>
                );
              })}
            </div>
          </div>

          <motion.div
            key={activeMaterial.id}
            initial={{ opacity: 0.7, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch bg-white/[0.04] border border-white/10 rounded-[28px] overflow-hidden p-5 sm:p-8"
          >
            {/* Material Copy & Details */}
            <div className="lg:col-span-7 flex flex-col justify-between text-right">
              <div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-[#DFB288] mb-3">
                  <span>{activeMaterial.origin}</span>
                  <span aria-hidden="true">·</span>
                  <span className="tabular-nums-fa">{activeMaterial.spec}</span>
                </div>

                <h3 className="text-xl sm:text-2xl font-extrabold text-white mb-4 leading-snug">
                  {activeMaterial.title}
                </h3>

                <p className="text-xs sm:text-sm text-[#CFC0B5] leading-8 mb-6 max-w-2xl">
                  {activeMaterial.summary}
                </p>

                <ul className="space-y-3 mb-7">
                  {activeMaterial.craftPoints.map((point, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2.5 text-xs sm:text-sm text-[#EAE0D7]"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#D7A274] shrink-0 mt-1" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-5 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <p className="text-xs text-[#E0B185] font-medium">
                  {activeMaterial.guarantee}
                </p>

                <button
                  type="button"
                  onClick={() => onSelectCategory(activeMaterial.targetCategory)}
                  className="h-10 px-5 rounded-full bg-white text-[#221914] hover:bg-[#FAF1E8] text-xs font-bold inline-flex items-center justify-center gap-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <span>{activeMaterial.ctaLabel}</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Material Image */}
            <div className="lg:col-span-5">
              <div className="h-[260px] sm:h-[320px] lg:h-full min-h-[280px] rounded-2xl overflow-hidden border border-white/10">
                <SafeImage
                  src={activeMaterial.image}
                  alt={activeMaterial.tabLabel}
                  eager
                  className={`w-full h-full object-cover ${
                    activeMaterial.imagePosition ?? 'object-center'
                  }`}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section 3: Milestones & Craftsmanship Gallery */}
      <section className="py-14 sm:py-16 bg-[#FDF9F6]">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Timeline Chapters (7 cols) */}
            <div className="lg:col-span-7 text-right">
              <p className="text-xs font-medium text-[#9D8576] mb-2">
                مسیر شکل‌گیری تا امروز
              </p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#241A14] mb-8">
                از یک میز برش تا خانه مد شوک
              </h2>

              <div className="divide-y divide-[#EADCD0] border-y border-[#EADCD0]">
                {ATELIER_MILESTONES.map((step) => (
                  <div
                    key={step.number}
                    className="py-6 flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-7"
                  >
                    <div className="flex items-center gap-2.5 sm:w-28 shrink-0">
                      <span className="text-xl font-extrabold text-[#8A5026] tabular-nums-fa">
                        {step.number}
                      </span>
                      <span aria-hidden="true" className="text-[#C7B3A5]">
                        /
                      </span>
                      <span className="text-xs font-bold text-[#6E5C52] tabular-nums-fa">
                        {step.year}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-[#241A14] mb-2">
                        {step.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#6C5B50] leading-7">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dual Visual Craftsmanship Frame (5 cols) */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-4">
              <div className="rounded-[22px] overflow-hidden border border-[#E7D8CA] h-64 sm:h-80">
                <SafeImage
                  src={IMAGES.atelierHands}
                  alt="دوخت دستی و پرداخت جزئیات در کارگاه شوک"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="rounded-[22px] overflow-hidden border border-[#E7D8CA] h-64 sm:h-80 sm:mt-8">
                <SafeImage
                  src={IMAGES.heroCourtyard}
                  alt="عکاسی کالکشن پاییزه خانه مد شوک"
                  className="w-full h-full object-cover object-[50%_20%]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Flagship Showroom & Private Consultation Booking */}
      <section id="atelier-visit" className="py-14 sm:py-16 bg-[#FAF5F0]">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Showroom Visit Info (5 cols) */}
            <div className="lg:col-span-5 bg-[#FDF9F6] rounded-[28px] border border-[#E8DACD] p-7 sm:p-9 flex flex-col justify-between text-right">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-[#8A5026] mb-3">
                  <Scissors className="w-4 h-4" />
                  <span>بازدید حضوری از آتلیه و شوروم</span>
                </div>

                <h2 className="text-xl sm:text-2xl font-extrabold text-[#241A14] mb-4">
                  مهمان خانه مد شوک در تهران باشید
                </h2>

                <p className="text-xs sm:text-sm text-[#6B5A50] leading-7 mb-7">
                  اگر پیش از خرید تمایل دارید لطافت پارچه‌ها را از نزدیک لمس کنید یا برای دوخت
                  سایز اختصاصی راهنمایی بگیرید، مشاوران استایل آتلیه میزبان شما هستند.
                </p>

                <div className="space-y-4 text-xs sm:text-sm text-[#3F2E23]">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-[#8A5026] shrink-0 mt-1" />
                    <div>
                      <p className="font-bold">نشانی شوروم مرکزی</p>
                      <p className="text-[#6F5E53] mt-0.5">
                        تهران، فرشته، خیابان آقابزرگی، پلاک ۲۴، عمارت شوک
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="w-4 h-4 text-[#8A5026] shrink-0 mt-1" />
                    <div>
                      <p className="font-bold">ساعات میزبانی آتلیه</p>
                      <p className="text-[#6F5E53] mt-0.5 tabular-nums-fa">
                        شنبه تا پنج‌شنبه · ۱۰:۰۰ تا ۲۱:۰۰ (جمعه با تعیین وقت قبلی)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="w-4 h-4 text-[#8A5026] shrink-0 mt-1" />
                    <div>
                      <p className="font-bold">خط مستقیم مشاوره استایل</p>
                      <p className="text-[#6F5E53] mt-0.5 tabular-nums-fa" dir="ltr">
                        ۰۲۱-۲۶۲۰۴۸۱۰ · atelier@shockfashion.ir
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-[#ECE0D5] flex items-center justify-between gap-3">
                {vipJoined ? (
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#46704F]">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>عضویت باشگاه VIP شوک برای شما فعال است</span>
                  </div>
                ) : (
                  <>
                    <span className="text-xs text-[#6F5E53]">
                      مزایای عضویت VIP (۱۰٪ تخفیف خرید اول)
                    </span>
                    <button
                      type="button"
                      onClick={onVipJoined}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8A5026] hover:text-[#663918] whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>فعال‌سازی عضویت VIP</span>
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Interactive Private Consultation Form (7 cols) */}
            <div className="lg:col-span-7 bg-white rounded-[28px] border border-[#E8DACD] p-7 sm:p-9 text-right">
              <h3 className="text-lg sm:text-xl font-extrabold text-[#241A14] mb-2">
                درخواست نوبت مشاوره خصوصی و پرو
              </h3>
              <p className="text-xs sm:text-sm text-[#7A685E] mb-6">
                مشخصات خود را ثبت کنید تا هماهنگی ساعت بازدید یا تماس تصویری با طراح ارشد شوک
                در کمتر از دو ساعت برای شما ارسال شود.
              </p>

              {confirmedReceipt ? (
                <div
                  data-testid="about-appointment-confirmation"
                  className="rounded-2xl bg-[#F4F9F4] border border-[#CBE0CC] p-6 space-y-3"
                >
                  <div className="flex items-center gap-2.5 text-[#3B6642]">
                    <CheckCircle2 className="w-5 h-5 shrink-0" />
                    <h4 className="text-base font-extrabold">
                      درخواست مشاوره شما ثبت شد
                    </h4>
                  </div>
                  <p className="text-xs sm:text-sm text-[#4A5E4D] leading-7">
                    سرکار خانم/جناب <span className="font-bold">{confirmedReceipt.name}</span>،
                    درخواست شما برای موضوع «{confirmedReceipt.topic}» با کد پیگیری{' '}
                    <span className="font-bold tabular-nums-fa">{confirmedReceipt.code}</span>{' '}
                    در دفتر آتلیه ثبت گردید و کارشناسان ما به‌زودی با شما تماس می‌گیرند.
                  </p>
                  <button
                    type="button"
                    onClick={() => setConfirmedReceipt(null)}
                    className="h-9 px-4 rounded-full bg-white border border-[#C6DBC7] text-xs font-semibold text-[#3B6642] hover:bg-[#EAF4EA] transition-colors cursor-pointer"
                  >
                    ثبت درخواست جدید
                  </button>
                </div>
              ) : (
                <form onSubmit={handleAppointmentSubmit} noValidate className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="about-guest-name"
                        className="block text-xs font-semibold text-[#3F2E23] mb-1.5"
                      >
                        نام و نام خانوادگی
                      </label>
                      <input
                        id="about-guest-name"
                        type="text"
                        value={guestName}
                        onChange={(e) => {
                          setGuestName(e.target.value);
                          if (formError) setFormError(null);
                        }}
                        placeholder="مثلاً: سارا طاهری"
                        className="w-full h-11 px-4 rounded-xl bg-[#FAF5F0] border border-[#E5D6C8] text-xs text-[#241A14] placeholder:text-[#A39287] focus:outline-none focus:bg-white focus:border-[#8A5026]"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="about-guest-contact"
                        className="block text-xs font-semibold text-[#3F2E23] mb-1.5"
                      >
                        شماره موبایل یا ایمیل
                      </label>
                      <input
                        id="about-guest-contact"
                        type="text"
                        value={guestContact}
                        onChange={(e) => {
                          setGuestContact(e.target.value);
                          if (formError) setFormError(null);
                        }}
                        placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                        className="w-full h-11 px-4 rounded-xl bg-[#FAF5F0] border border-[#E5D6C8] text-xs text-[#241A14] placeholder:text-[#A39287] focus:outline-none focus:bg-white focus:border-[#8A5026]"
                      />
                    </div>
                  </div>

                  <div>
                    <span className="block text-xs font-semibold text-[#3F2E23] mb-2">
                      موضوع مشاوره
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {TOPIC_OPTIONS.map((topic) => {
                        const selected = selectedTopic === topic;
                        return (
                          <button
                            key={topic}
                            type="button"
                            onClick={() => setSelectedTopic(topic)}
                            aria-pressed={selected}
                            className={`h-9 px-3.5 rounded-full text-xs font-medium border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                              selected
                                ? 'bg-[#241A14] border-[#241A14] text-white'
                                : 'bg-[#FAF5F0] border-[#E5D6C8] text-[#4E3D33] hover:bg-[#F2E6DA]'
                            }`}
                          >
                            {topic}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="about-guest-note"
                      className="block text-xs font-semibold text-[#3F2E23] mb-1.5"
                    >
                      توضیح کوتاه یا کد مدل مورد نظر (اختیاری)
                    </label>
                    <textarea
                      id="about-guest-note"
                      rows={3}
                      value={guestNote}
                      onChange={(e) => setGuestNote(e.target.value)}
                      placeholder="مثلاً: تمایل به پرو پالتو دو رو کشمیر مدل الیزا در رنگ کاراملی..."
                      className="w-full p-3.5 rounded-xl bg-[#FAF5F0] border border-[#E5D6C8] text-xs text-[#241A14] placeholder:text-[#A39287] focus:outline-none focus:bg-white focus:border-[#8A5026]"
                    />
                  </div>

                  {formError && (
                    <p
                      role="alert"
                      data-testid="about-form-error"
                      className="text-xs font-semibold text-[#B53D34]"
                    >
                      {formError}
                    </p>
                  )}

                  <div className="pt-1 flex flex-wrap items-center justify-between gap-4">
                    <span className="text-[11px] text-[#8E7B70]">
                      مشاوره و پرو حضوری برای مهمانان شوک رایگان است.
                    </span>

                    <button
                      type="submit"
                      className="h-11 px-7 rounded-full bg-gradient-to-l from-[#7E4821] to-[#985A2D] hover:from-[#6A3B19] hover:to-[#824B23] text-white text-xs sm:text-sm font-semibold shadow-md transition-transform hover:-translate-y-0.5 whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      ثبت نوبت مشاوره آتلیه
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
