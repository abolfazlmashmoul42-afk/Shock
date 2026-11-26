import type { Product } from '../utils/store';

export const IMAGES = {
  heroCourtyard: '/src/assets/images/hero_courtyard_coat_1795436764505.jpg',
  cashmereMacro: '/src/assets/images/fabric_cashmere_macro_1795436764318.jpg',
  atelierHands: '/src/assets/images/atelier_tailor_hands_1795436764845.jpg',
  jacquardManteau: '/src/assets/images/product_jacquard_manteau_1795436762673.jpg',
  trenchStaircase: '/src/assets/images/product_trench_staircase_1795436830511.jpg',
  hermesShawl: '/src/assets/images/product_hermes_shawl_1795436830672.jpg',
  royaJacket: '/src/assets/images/product_roya_jacket_1795436829977.jpg',
  diplomatForest: '/src/assets/images/product_diplomat_forest_1795436764930.jpg',
  toranjBag: '/src/assets/images/product_toranj_leather_bag_1795436765305.jpg',
  twillScarf: '/src/assets/images/product_twill_silk_scarf_1795436764279.jpg',
  emeraldCollection: '/src/assets/images/product_emerald_collection_1795436764740.jpg',
  linenTrousers: '/src/assets/images/product_linen_trousers_1795436763392.jpg',
  embroideredManteau: '/src/assets/images/product_embroidered_manteau_1795436765161.jpg',
  oatmealCoat: '/src/assets/images/product_oatmeal_maxi_coat_1795436764853.jpg',
  bronzeScarf: '/src/assets/images/product_bronze_jacquard_scarf_1795436764287.jpg',
  bannerBlackFriday: '/src/assets/images/banner_black_friday_atelier_1795699074027.jpg',
  bannerWinterSilk: '/src/assets/images/banner_winter_silk_showcase_1795699073726.jpg',
};

export interface CategoryItem {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  image: string;
}

export interface CampaignPoster {
  id: string;
  number: string;
  badge: string;
  badgeVariant: 'red' | 'dark' | 'copper';
  subtitle: string;
  title: string;
  image: string;
  categorySlug: string;
}

export interface PromiseStep {
  number: string;
  label: string;
  title: string;
  description: string;
  icon: 'truck' | 'shield' | 'refresh' | 'headphones';
}

export interface TestimonialItem {
  id: string;
  quote: string;
  author: string;
  initials: string;
  verifiedItem: string;
  rating: number;
}

export interface JournalArticle {
  id: string;
  title: string;
  excerpt: string;
  readTime: string;
  date: string;
  tag: string;
  featuredTag?: string;
  author?: string;
  authorRole?: string;
  image: string;
  featured?: boolean;
  takeaways?: string[];
  relatedProductIds?: string[];
  body: string[];
}

export const CATEGORIES: CategoryItem[] = [
  {
    id: 'cat-shawl',
    slug: 'shawl',
    title: 'شال',
    subtitle: '۴۲ مدل انحصاری',
    image: IMAGES.hermesShawl,
  },
  {
    id: 'cat-scarf',
    slug: 'shawl',
    title: 'روسری',
    subtitle: '۳۶ مدل قواره‌بزرگ',
    image: IMAGES.twillScarf,
  },
  {
    id: 'cat-coat',
    slug: 'coat',
    title: 'پالتو',
    subtitle: '۱۹ پالتوی فوتر',
    image: IMAGES.oatmealCoat,
  },
  {
    id: 'cat-bag',
    slug: 'bag',
    title: 'کیف',
    subtitle: '۲۴ دست‌ساز چرمی',
    image: IMAGES.toranjBag,
  },
  {
    id: 'cat-jacket',
    slug: 'jacket',
    title: 'کت',
    subtitle: '۲۸ مدل رسمی و کژوال',
    image: IMAGES.diplomatForest,
  },
  {
    id: 'cat-manteau',
    slug: 'manteau',
    title: 'مانتو',
    subtitle: '۵۴ مدل مجلسی',
    image: IMAGES.embroideredManteau,
  },
  {
    id: 'cat-trousers',
    slug: 'trousers',
    title: 'شلوار',
    subtitle: '۱۸ برش اختصاصی',
    image: IMAGES.linenTrousers,
  },
];

export const PRODUCTS: Product[] = [
  // New Arrivals (4 cards)
  {
    id: 'new-1',
    title: 'مانتو کتی ژاکارد طلاکوب',
    category: 'مانتوهای لوکس',
    categorySlug: 'manteau',
    description: 'دوخت آستردار تمام ابریشم، یقه انگلیسی بازطراحی‌شده با دکمه‌های فلزی قلم‌زده.',
    fullDescription:
      'این مانتو کتی از ژاکارد اختصاصی آتلیه شوک با الیاف ابریشم و ویسکوز طبیعی بافته شده و دارای آستر تنفس‌پذیر ساتن ابریشم یزد است. برش ساختارمند سرشانه و یقه انگلیسی ظریف، ایستایی بی‌نظیری در مجالس رسمی پاییز و زمستان ایجاد می‌کند.',
    material: 'ژاکارد ابریشم طبیعی با آستر ساتن یزد',
    price: 3850000,
    badge: 'جدید',
    inStock: true,
    image: IMAGES.jacquardManteau,
    colors: [
      { name: 'مشکی طلایی', hex: '#261E19' },
      { name: 'مسی آنتیک', hex: '#8A5026' },
      { name: 'شنی گرم', hex: '#CBB195' },
    ],
    sizes: ['۳۶', '۳۸', '۴۰', '۴۲'],
    section: 'new',
  },
  {
    id: 'new-2',
    title: 'بارانی کلاسیک کمردار بافته',
    category: 'پالتو و بارانی',
    categorySlug: 'coat',
    description: 'گاباردین ضدآب ترک با استایل اورسایز و آستر ساتن طرح شوک.',
    fullDescription:
      'بارانی چهارفصل شوک دوخته‌شده از پارچه گاباردین پنبه‌ای ضدآب با تراکم بالا. طراحی کمربند پهن با سگک دست‌دوز چرمی و آستر مونوگرام اختصاصی شوک، این قطعه را به همراه همیشگی روزهای بارانی پاییز تبدیل می‌کند.',
    material: 'گاباردین پنبه‌ای ضدآب با آستر ساتن',
    price: 4200000,
    badge: 'جدید',
    inStock: true,
    image: IMAGES.trenchStaircase,
    colors: [
      { name: 'بژ کلاسیک', hex: '#C7AE8F' },
      { name: 'قهوه‌ای اسپرسو', hex: '#3D2B22' },
    ],
    sizes: ['۳۶', '۳۸', '۴۰', '۴۲'],
    section: 'new',
  },
  {
    id: 'new-3',
    title: 'شال کشمیر طرح هرمس اصیل',
    category: 'شال و روسری',
    categorySlug: 'shawl',
    description: 'بافت لطیف چهارفصل کشمیر با چاپ دیجیتال و دوردوزی دست‌ساز.',
    fullDescription:
      'شال کشمیر طبیعی با نقش اصیل و لطافت ابریشمی که به نرمی روی سر قرار می‌گیرد و بدون سر خوردن، گرمای مطبوعی به استایل پاییزه شما می‌بخشد. لبه‌های این شال به صورت دستی ریشه‌دوزی شده است.',
    material: '۱۰۰٪ کشمیر لطیف دست‌بافت',
    price: 1650000,
    badge: 'جدید',
    inStock: true,
    image: IMAGES.hermesShawl,
    colors: [
      { name: 'آجری تراکوتا', hex: '#A44F2F' },
      { name: 'قهوه‌ای سوخته', hex: '#38251C' },
      { name: 'مشکی اصیل', hex: '#1F1B18' },
    ],
    sizes: ['قواره ۷۰×۲۰۰'],
    section: 'new',
  },
  {
    id: 'new-4',
    title: 'کت فوتر ابریشمی مدل رویا',
    category: 'کت و جلیقه',
    categorySlug: 'jacket',
    description: 'ترکیب فوتر پشم مرینوس و ابریشم خالص، گرم و سبک.',
    fullDescription:
      'کت کوتاه یقه گرد مدل رویا، ترکیبی از بافت فوتر بوکله مرینوس ایتالیایی و نخ ابریشم با دکمه‌های برنجی عتیقه است. مناسب برای ست کردن با شلوارهای لینن بگ یا دامن‌های پلیسه.',
    material: 'فوتر بوکله پشم مرینوس و ابریشم',
    price: 3450000,
    badge: 'جدید',
    inStock: true,
    image: IMAGES.royaJacket,
    colors: [
      { name: 'شکلاتی تیره', hex: '#3E2B23' },
      { name: 'شیری استخوانی', hex: '#E6DDD3' },
    ],
    sizes: ['۳۶', '۳۸', '۴۰', '۴۲'],
    section: 'new',
  },

  // VIP Limited Offers (3 wide cards)
  {
    id: 'vip-1',
    title: 'کت پاییزی دو رو طرح دیپلمات',
    category: 'کت و جلیقه',
    categorySlug: 'jacket',
    description: 'برش راسته آزاد، تهیه‌شده از الیاف پشم و پنبه مرغوب.',
    fullDescription:
      'کت دو رو پاییزه دیپلمات با برش دو ردیفه کلاسیک، دوخته‌شده با تکنیک دست‌دوز دولایه بدون آستر ضخیم که امکان استفاده در موقعیت‌های رسمی و روزمره را فراهم می‌سازد.',
    material: 'پشم شتر و پنبه ارگانیک ایتالیایی',
    price: 2550000,
    originalPrice: 3400000,
    discountPercent: 25,
    badge: '۲۵٪ تخفیف ویژه',
    inStock: true,
    image: IMAGES.diplomatForest,
    colors: [
      { name: 'تاپ خاکی', hex: '#9D846D' },
      { name: 'کرم صدفی', hex: '#DCD2C6' },
    ],
    sizes: ['۳۶', '۳۸', '۴۰', '۴۲'],
    section: 'vip',
  },
  {
    id: 'vip-2',
    title: 'کیف دوشی چرم طبیعی مدل ترنج',
    category: 'کیف و چرم دست‌ساز',
    categorySlug: 'bag',
    description: 'چرم طبیعی با یراق برنزی، سبک و مناسب استفاده روزمره.',
    fullDescription:
      'کیف دوشی مدل ترنج، تماماً با دست از چرم گاوی دباغی گیاهی در کارگاه چرم آتلیه شوک دوخته شده است. بند قابل تنظیم و سگک برنجی مات، دوام و اصالتی ماندگار به آن بخشیده است.',
    material: 'چرم طبیعی گاوی دباغی گیاهی با یراق برنجی',
    price: 1960000,
    originalPrice: 2800000,
    discountPercent: 30,
    badge: '۳۰٪ تخفیف ویژه',
    inStock: true,
    image: IMAGES.toranjBag,
    colors: [{ name: 'عسلی کنیاکی', hex: '#8F4D28' }],
    sizes: ['تک سایز (۲۴×۱۸)'],
    section: 'vip',
  },
  {
    id: 'vip-3',
    title: 'روسری ابریشم توییل ۱۴۰',
    category: 'شال و روسری',
    categorySlug: 'shawl',
    description: 'طراحی نقش‌برجسته دست‌نگار با ایستایی کامل روی سر.',
    fullDescription:
      'روسری قواره بزرگ ۱۴۰ سانتی‌متری بافته شده از ابریشم توییل یزد با لبه دست‌دوز رول‌شده. درخشش ملایم و لطافت بی‌رقیب ابریشم طبیعی در کنار نقوش بته‌جقه مدرن.',
    material: '۱۰۰٪ ابریشم توییل طبیعی یزد',
    price: 1200000,
    originalPrice: 1500000,
    discountPercent: 20,
    badge: '۲۰٪ تخفیف ویژه',
    inStock: true,
    image: IMAGES.twillScarf,
    colors: [
      { name: 'برنزی طلایی', hex: '#AD7B4F' },
      { name: 'قهوه‌ای فندقی', hex: '#5D3C28' },
    ],
    sizes: ['قواره ۱۴۰×۱۴۰'],
    section: 'vip',
  },

  // Most Popular (4 cards)
  {
    id: 'pop-1',
    title: 'شلوار بگ لینن پاییزه شوک',
    category: 'شلوار و دامن',
    categorySlug: 'trousers',
    description: 'شلوار کمر بلند پلیسه با تن‌خور آزاد و پارچه لینن سنگین‌وزن پاییزه.',
    fullDescription:
      'شلوار بگ لینن پاییزه شوک با پیلی‌های دقیق در قسمت کمر و خط اتوی ماندگار. بافت گرم و ضخیم لینن پنبه‌ای آن برای روزهای خنک پاییز طراحی شده است.',
    material: 'لینن پاییزه سنگین‌وزن و پنبه',
    price: 1390000,
    rating: 4.9,
    reviewCount: 118,
    inStock: true,
    image: IMAGES.linenTrousers,
    colors: [
      { name: 'کرم اوتمیل', hex: '#CBB89D' },
      { name: 'قهوه‌ای تیره', hex: '#493529' },
      { name: 'نخودی روشن', hex: '#E8E0D5' },
    ],
    sizes: ['۳۶', '۳۸', '۴۰', '۴۲'],
    section: 'popular',
  },
  {
    id: 'pop-2',
    title: 'مانتو کلوش سوزن‌دوزی',
    category: 'مانتوهای لوکس',
    categorySlug: 'manteau',
    description: 'طراحی الهام‌گرفته از نقوش اصیل ایرانی با سوزن‌دوزی ابریشمی دست‌دوز.',
    fullDescription:
      'ردای کلوش سوزن‌دوزی‌شده در آتلیه شوک، حاصل ۶ روز کار ظریف هنرمندان سوزن‌دوز روی پارچه پشمی لطیف با ترکیب رنگ آجری و زغالی.',
    material: 'پشم لطیف با سوزن‌دوزی ابریشم دست‌دوز',
    price: 5200000,
    rating: 5.0,
    reviewCount: 92,
    inStock: true,
    image: IMAGES.embroideredManteau,
    colors: [
      { name: 'آجری تیره', hex: '#9E4D2D' },
      { name: 'خردلی عسلی', hex: '#C68A43' },
    ],
    sizes: ['فری سایز (۳۶ تا ۴۴)'],
    section: 'popular',
  },
  {
    id: 'pop-3',
    title: 'پالتو ماکسی فوتر استخوانی',
    category: 'پالتو و بارانی',
    categorySlug: 'coat',
    description: 'پالتو قد بلند با فوتر ایتالیایی و کمربند پارچه‌ای هم‌رنگ.',
    fullDescription:
      'پالتوی ماکسی فوتر در رنگ استخوانی گرم با یقه انگلیسی کشیده و دوخت دست‌دوز لبه‌ها. سبک، گرم و بدون پرزدهی با ضمانت ۳ ساله آتلیه شوک.',
    material: 'فوتر پشم ایتالیایی بیه‌لا',
    price: 4600000,
    rating: 4.8,
    reviewCount: 164,
    inStock: true,
    image: IMAGES.oatmealCoat,
    colors: [
      { name: 'استخوانی گرم', hex: '#DDD3C5' },
      { name: 'کرم کاراملی', hex: '#C5A989' },
    ],
    sizes: ['۳۶', '۳۸', '۴۰', '۴۲'],
    section: 'popular',
  },
  {
    id: 'pop-4',
    title: 'شال ابریشم ژاکارد پاییزه',
    category: 'شال و روسری',
    categorySlug: 'shawl',
    description: 'شال مجلسی ابریشم ژاکارد با درخشش برنزی و بافت لطیف.',
    fullDescription:
      'شال ابریشم ژاکارد با بافت هندسی ظریف و طیف رنگی قهوه‌ای شکلاتی و برنز متالیک؛ انتخابی بی‌همتا برای تکمیل پالتوهای تیره و روشن.',
    material: 'ابریشم و ویسکوز ژاکارد',
    price: 1450000,
    rating: 4.9,
    reviewCount: 85,
    inStock: true,
    image: IMAGES.bronzeScarf,
    colors: [
      { name: 'شکلاتی برنزی', hex: '#3B2820' },
      { name: 'برنزی کاراملی', hex: '#9E6E46' },
    ],
    sizes: ['قواره ۷۵×۲۰۰'],
    section: 'popular',
  },
];

export const SIGNATURE_ELIZA_PRODUCT: Product = {
  id: 'sig-eliza',
  title: 'مانتو کتی فوتر لوکس شوک مدل الیزا',
  category: 'قطعه شاخص فصل',
  categorySlug: 'coat',
  description: 'مانتو کتی فوتر با برش معماری، یقه انگلیسی و آستر ابریشم یزد.',
  fullDescription:
    'قطعه شاخص فصل پاییز و زمستان شوک؛ مانتو کتی فوتر مدل الیزا با ۳۸ نظر تاییدشده و امتیاز ۴.۹ از ۵. ترکیب فوتر ایتالیایی کم‌وزن با برش سه‌بعدی سرشانه و دکمه‌های صدفی دست‌ساز.',
  material: 'فوتر پشم مرینوس ایتالیایی + آستر ابریشم یزد',
  price: 4450000,
  rating: 4.9,
  reviewCount: 38,
  badge: 'قطعه شاخص فصل',
  inStock: true,
  image: IMAGES.heroCourtyard,
  colors: [
    { name: 'کاراملی اصیل', hex: '#9E6E47' },
    { name: 'اسپرسو تیره', hex: '#2D211B' },
  ],
  sizes: ['۳۶', '۳۸', '۴۰', '۴۲'],
  section: 'new',
};

export const CAMPAIGN_POSTERS: CampaignPoster[] = [
  {
    id: 'camp-1',
    number: '01',
    badge: '۲۵٪ تخفیف',
    badgeVariant: 'red',
    subtitle: 'برش‌های ساختارمند با تخفیف محدود',
    title: 'حراج کت‌های پاییزی',
    image: IMAGES.diplomatForest,
    categorySlug: 'jacket',
  },
  {
    id: 'camp-2',
    number: '02',
    badge: 'کالکشن جدید',
    badgeVariant: 'copper',
    subtitle: 'پشم و کشمیر با رنگ‌بندی امسال',
    title: 'کالکشن زمرد',
    image: IMAGES.emeraldCollection,
    categorySlug: 'coat',
  },
  {
    id: 'camp-3',
    number: '03',
    badge: '۳۰٪ تخفیف',
    badgeVariant: 'red',
    subtitle: 'یراق برنزی و دوخت صنعتگران شوک',
    title: 'چرم دست‌ساز آتلیه',
    image: IMAGES.toranjBag,
    categorySlug: 'bag',
  },
  {
    id: 'camp-4',
    number: '04',
    badge: 'لیمیتد ادیشن',
    badgeVariant: 'dark',
    subtitle: 'تیراژ محدود با دوردوزی دستی',
    title: 'ابریشم شب یلدا',
    image: IMAGES.hermesShawl,
    categorySlug: 'shawl',
  },
  {
    id: 'camp-5',
    number: '05',
    badge: 'پرفروش فصل',
    badgeVariant: 'copper',
    subtitle: 'طراحی اختصاصی با سوزن‌دوزی دست‌دوز',
    title: 'رداهای فاخر آتلیه',
    image: IMAGES.embroideredManteau,
    categorySlug: 'manteau',
  },
];

export const PROMISE_STEPS: PromiseStep[] = [
  {
    number: '۰۱',
    label: 'قدم ۱',
    title: 'ارسال اکسپرس و بیمه‌شده',
    description:
      'تحویل اختصاصی ۲ ساعته در تهران و ۲۴ تا ۴۸ ساعته در سراسر ایران با کاور مجلل شوک.',
    icon: 'truck',
  },
  {
    number: '۰۲',
    label: 'قدم ۲',
    title: 'اصالت تار و پود',
    description:
      'شناسنامه معتبر پارچه و گواهی دوخت دست‌ساز آتلیه شوک ضمیمه هر بسته ارسالی.',
    icon: 'shield',
  },
  {
    number: '۰۳',
    label: 'قدم ۳',
    title: '۷ روز ضمانت تعویض سایز',
    description:
      'امکان تعویض سریع سایز یا مدل بدون هیچ قید و شرط با هماهنگی نماینده آتلیه.',
    icon: 'refresh',
  },
  {
    number: '۰۴',
    label: 'قدم ۴',
    title: 'مشاوره اختصاصی استایل',
    description:
      'مشاوره رایگان طراحان مد شوک جهت انتخاب مناسب‌ترین پالت رنگ بر اساس فرم اندام شما.',
    icon: 'headphones',
  },
];

export const TESTIMONIALS: TestimonialItem[] = [
  {
    id: 't-1',
    quote:
      '«پالتوی فوتر کارامل که سفارش دادم از نزدیک فراتر از عکس‌ها بود. تمیزی دوخت مغزی‌دوزی‌های داخل پالتو گواه احترام برند به مشتری است. واقعاً خسته نباشید.»',
    author: 'مریم ناصری',
    initials: 'م ن',
    verifiedItem: 'خریدار تاییدشده (پالتو فوتر)',
    rating: 5,
  },
  {
    id: 't-2',
    quote:
      '«شال کشمیر بسیار سبک و در عین حال گرمه، اصلاً روی سر لیز نمی‌خوره. بسته‌بندی هدیه و عطر ملایم همراه کار فوق‌العاده حس لوکسی بهم داد.»',
    author: 'دکتر سارا طاهری',
    initials: 'س ط',
    verifiedItem: 'خریدار تاییدشده (شال و روسری)',
    rating: 5,
  },
  {
    id: 't-3',
    quote:
      '«برای مهمانی رسمی کت ژاکارد شوک رو ست کردم و بی‌اغراق تمام نگاه‌ها جذب وقار مدلش شده بود. سایزبندی دقیقاً مطابق جدول سایت بود.»',
    author: 'نگین کریمی',
    initials: 'ن ک',
    verifiedItem: 'خریدار تاییدشده (کت ژاکارد)',
    rating: 5,
  },
];

export const JOURNAL_ARTICLES: JournalArticle[] = [
  {
    id: 'art-1',
    title: 'راهنمای کامل انتخاب پالتوی فوتر برای پاییز و زمستان',
    excerpt:
      'از وزن و تراکم فوتر تا فرم یقه و انتخاب رنگ؛ چطور پالتویی بخرید که سال‌ها همراه استایل شما بماند.',
    readTime: '۷ دقیقه',
    date: '۱۲ مهر ۱۴۰۳',
    tag: 'راهنمای خرید',
    featuredTag: 'مقاله ویژه',
    author: 'نگار سلطانی',
    authorRole: 'سردبیر مجله و طراح الگو در شوک',
    image: IMAGES.oatmealCoat,
    featured: true,
    takeaways: [
      'فوتر مرینوس بالای ۴۸۰ گرم در مترمربع بهترین ایستایی سرشانه و مقاومت در برابر پرزدهی را دارد.',
      'آستر ساتن ابریشم طبیعی از الکتریسیته ساکن و گرمای آزاردهنده در فضای بسته جلوگیری می‌کند.',
      'طیف‌های کاراملی، استخوانی گرم و اسپرسو با اغلب شال‌های پاییزی هماهنگی بی‌نقص دارند.',
    ],
    relatedProductIds: ['pop-3', 'sig-eliza', 'new-2'],
    body: [
      'انتخاب یک پالتوی فوتر اصیل، سرمایه‌گذاری برای چندین زمستان متوالی است. نخستین نشانه کیفیت در فوتر ایتالیایی، تراکم بافت و عدم وجود پرزهای سطحی مصنوعی است. هنگامی که پارچه را میان انگشتان خود لمس می‌کنید، باید نرمی پشم مرینوس همراه با ایستایی ساختارمند را هم‌زمان حس کنید.',
      'در آتلیه شوک، تمام پالتوها با آستر ساتن ابریشم تنفس‌پذیر دوخته می‌شوند تا در محیط‌های بسته نیز احساس گرمای آزاردهنده ایجاد نکنند. برای فرم‌های اندامی کشیده‌تر، برش‌های دو ردیفه و کمردار ماکسی جلوه‌ای مقتدرانه می‌سازند و برای استایل روزمره، کت‌های فوتر کوتاه با یقه انگلیسی بهترین انعطاف را در ست کردن با شال‌های ابریشمی دارند.',
      'پالت رنگ‌های شتری، کاراملی و استخوانی در کنار قهوه‌ای اسپرسو، طیفی جاودانه هستند که فارغ از ترندهای زودگذر فصلی، همواره با وقار به نظر می‌رسند. پیش از نهایی کردن خرید، طول آستین و آزادی سرشانه را روی یک ژاکت پاییزه متوسط امتحان کنید.',
    ],
  },
  {
    id: 'art-2',
    title: 'پنج روش ست کردن شال ابریشم با مانتو و پالتو',
    excerpt:
      'شال ابریشم تنها یک اکسسوری گرم نیست؛ نقطه تمرکز استایل شماست. پنج گره و فرم ساده را امتحان کنید.',
    readTime: '۵ دقیقه',
    date: '۲۸ مهر ۱۴۰۳',
    tag: 'ست و استایل',
    author: 'سپیده راد',
    authorRole: 'مشاور ارشد استایل و رنگ',
    image: IMAGES.bronzeScarf,
    takeaways: [
      'تضاد بافت مات پالتوی فوتر با درخشش ابریشم توییل یزد، جلوه‌ای اشرافی می‌آفریند.',
      'برای مانتوهای سوزن‌دوزی یا ژاکارد، از شال‌های تک‌رنگ یا حاشیه ظریف استفاده کنید.',
      'گره فرانسوی آزاد روی یقه انگلیسی، گردن را کشیده‌تر و قاب چهره را روشن‌تر نشان می‌دهد.',
    ],
    relatedProductIds: ['pop-4', 'vip-3', 'new-1'],
    body: [
      'درخشش طبیعی ابریشم توییل و ژاکارد یزد در کنار بافت مات پالتوهای فوتر یا گاباردین، تضادی چشم‌نواز می‌آفریند. برای روزهای رسمی، گره فرانسوی آزاد روی یقه انگلیسی پالتو، تعادل رنگی میان چهره و بالاتنه برقرار می‌کند.',
      'اگر مانتوی شما دارای نقوش ژاکارد یا سوزن‌دوزی است، شالی با حاشیه ساده و رنگ هم‌خانواده انتخاب کنید تا تمرکز بصری استایل از بین نرود. در مقابل، روی پالتوهای تک‌رنگ استخوانی یا مشکی، شال‌های کشمیر طرح‌دار نقش نقطه کانونی استایل را بر عهده می‌گیرند.',
      'برای استایل‌های نیمه‌رسمی، انداختن یک سر شال روی شانه مقابل و مهار آن زیر کمربند بارانی یا مانتو کتی، فرمی مدرن و منظم می‌سازد که در حرکت نیز به هم نمی‌ریزد.',
    ],
  },
  {
    id: 'art-3',
    title: 'چگونه کشمیر اصل را بشناسیم و سال‌ها نگه داریم؟',
    excerpt:
      'تفاوت کشمیر اصل با پشم معمولی در لمس، وزن و ایستایی است. راهنمای تشخیص و نگهداری آن را بخوانید.',
    readTime: '۶ دقیقه',
    date: '۵ آبان ۱۴۰۳',
    tag: 'متریال',
    author: 'دکتر مریم کاظمی',
    authorRole: 'پژوهشگر الیاف طبیعی و نساجی',
    image: IMAGES.cashmereMacro,
    takeaways: [
      'کشمیر اصیل با قطر زیر ۱۹ میکرون، سبک است و بلافاصله پس از فشردن به حالت نخست برمی‌گردد.',
      'هرگز شال یا بافت کشمیر را با چوب‌لباسی آویزان نکنید تا سرشانه‌ها دفرمه نشوند.',
      'شستشو فقط با آب سرد و شوینده ملایم یا خشکشویی تخصصی انجام شود.',
    ],
    relatedProductIds: ['new-3', 'vip-1'],
    body: [
      'الیاف کشمیر طبیعی برگرفته از ظریف‌ترین لایه زیرین پشم بزهای کوهستانی است و قطری کمتر از ۱۹ میکرون دارد. به همین دلیل، شال یا پالتوی کشمیر با وجود وزن بسیار سبک، عایق حرارتی فوق‌العاده‌ای محسوب می‌شود.',
      'برای تشخیص اصالت در نخستین لمس، کشمیر طبیعی هرگز زیر دست زبر نیست و حالتی پلاستیکی یا لغزنده ندارد؛ بلکه گرمایی خشک، مخملی و فوری منتقل می‌کند. اگر بخشی از شال را به آرامی بکشید و رها کنید، الیاف باکیفیت بلافاصله جمع می‌شوند.',
      'برای نگهداری صحیح، هرگز کشمیر را با آب داغ نشویید و آن را آویزان نکنید؛ شستشوی ملایم با آب سرد و خشک کردن به صورت پهن‌شده روی حوله، بافت لطیف آن را برای دهه‌ها حفظ می‌کند.',
    ],
  },
  {
    id: 'art-4',
    title: 'پشت صحنه آتلیه شوک: از الگوسازی تا مغزی‌دوزی ابریشمی',
    excerpt:
      'سفری به کارگاه دوخت شوک؛ جایی که یک مانتو یا پالتو با ۴۲ مرحله کنترل ظرافت و دوخت دستی شکل می‌گیرد.',
    readTime: '۸ دقیقه',
    date: '۱۴ آبان ۱۴۰۳',
    tag: 'آتلیه و دوخت',
    author: 'استاد بهرام یزدی',
    authorRole: 'سرپرست الگوسازی و دوخت آتلیه',
    image: IMAGES.atelierHands,
    takeaways: [
      'هم‌راستا کردن راه و طرح پارچه در برش تک‌دوزی، مهم‌ترین عامل ایستایی تمیز لباس است.',
      'مغزی‌دوزی تمام درزهای داخلی باعث می‌شود لباس حتی از پشت و داخل نیز زیبایی آتلیه‌ای داشته باشد.',
      'پیش از اتوکشی نهایی، هر قطعه روی مانکن استاندارد شوک برای بالانس یقه و سرشانه کنترل می‌شود.',
    ],
    relatedProductIds: ['pop-2', 'new-4', 'sig-eliza'],
    body: [
      'تفاوت پوشاک آتلیه‌ای با تولید صنعتی در دقایقی رقم می‌خورد که مشتری معمولاً تنها نتیجه نهایی آن را لمس می‌کند. در کارگاه فرشته شوک، برش هیچ پارچه‌ای به صورت لایه‌ای انجام نمی‌شود؛ هر تکه از مانتوهای ژاکارد یا پالتوهای فوتر به صورت تک‌لا برش می‌خورد تا طرح و راه پارچه در دو سوی لباس کاملاً قرینه بمانند.',
      'پس از کوک اولیه و دوخت بدنه، تمامی درزهای داخلی با نوار اریب ساتن ابریشم مغزی‌دوزی می‌شوند. این کار علاوه بر جلوگیری از ریش‌ریش شدن بافت در طول سال‌ها، حس ظرافتی ماندگار هنگام پوشیدن لباس ایجاد می‌کند.',
      'در مرحله پایانی، دکمه‌های صدفی و برنجی با نخ موم‌زده و پایه نخ‌پیچ دست‌دوز متصل می‌شوند تا در برابر کشش روزمره هرگز شل نشوند.',
    ],
  },
  {
    id: 'art-5',
    title: 'جدول جامع انتخاب سایز پالتو و مانتوهای برش آزاد',
    excerpt:
      'چطور با سه اندازه‌گیری ساده در منزل، دقیق‌ترین سایز را میان برش‌های اندامی و اورسایز شوک انتخاب کنیم؟',
    readTime: '۴ دقیقه',
    date: '۲۱ آبان ۱۴۰۳',
    tag: 'راهنمای خرید',
    author: 'نگار سلطانی',
    authorRole: 'سردبیر مجله و طراح الگو در شوک',
    image: IMAGES.heroCourtyard,
    takeaways: [
      'اندازه دور سینه و عرض سرشانه دو معیار اصلی برای انتخاب سایز پالتوهای فوتر هستند.',
      'در مدل‌های کمردار اورسایز (مانند بارانی کلاسیک)، یک سایز آزادتر جلوه شیک‌تری دارد.',
      'شوک ۷ روز ضمانت بی‌قید و شرط تعویض سایز برای تمام سفارش‌های آنلاین ارائه می‌دهد.',
    ],
    relatedProductIds: ['sig-eliza', 'new-2', 'pop-1'],
    body: [
      'بسیاری از خریداران هنگام سفارش اینترنتی پالتو یا مانتو تردید دارند که آیا برش لباس روی سرشانه‌ها تنگ نمی‌شود یا در قسمت باسن آزادی کافی دارد. در جدول سایزبندی شوک، تمامی ابعاد بر اساس استاندارد اندام بانوان ایرانی تنظیم شده‌اند.',
      'برای اندازه‌گیری دقیق، کافی است یک متر خیاطی را بدون کشیدن بیش از حد دور برجسته‌ترین بخش سینه و دور کمر قرار دهید. اگر بین دو سایز قرار دارید، برای پالتوهای زمستانی که روی بافت ضخیم می‌پوشید سایز بزرگ‌تر و برای مانتوهای مجلسی اندامی سایز دقیق خود را برگزینید.',
      'در صفحه هر محصول نیز بخش «جدول سایز» و مشاوره رایگان استایلیست آتلیه در دسترس است تا با اطمینان کامل انتخاب کنید.',
    ],
  },
  {
    id: 'art-6',
    title: 'نگهداری از کیف‌های چرم طبیعی دباغی گیاهی در فصول سرد',
    excerpt:
      'راز حفظ نرمی، براقیت ملایم و جلوگیری از ترک‌خوردگی کیف‌های چرم دست‌دوز در هوای سرد و بارانی.',
    readTime: '۵ دقیقه',
    date: '۱ آذر ۱۴۰۳',
    tag: 'متریال',
    author: 'آرشام فرهادی',
    authorRole: 'استادکار بخش چرم دست‌ساز شوک',
    image: IMAGES.toranjBag,
    takeaways: [
      'چرم دباغی گیاهی در گذر زمان پتینه طبیعی و رنگ عسلی عمیق‌تری پیدا می‌کند.',
      'در صورت خیس شدن در باران، کیف را دور از حرارت مستقیم بخاری و در دمای اتاق خشک کنید.',
      'هر فصل یک بار با موم طبیعی بدون سیلیکون سطح چرم را تغذیه کنید.',
    ],
    relatedProductIds: ['vip-2', 'pop-4'],
    body: [
      'چرم دباغی گیاهی بدون لایه‌های رنگ پلاستیکی و با عصاره طبیعی پوست درختان عمل‌آوری می‌شود؛ به همین دلیل بافت آن زنده است و در برابر رطوبت و خشکی هوا واکنش نشان می‌دهد. این ویژگی همان چیزی است که پس از چند ماه استفاده، درخششی مخملی و منحصر به فرد به کیف می‌بخشد.',
      'اگر در روزهای بارانی پاییز کیف چرمی شما مرطوب شد، رطوبت سطحی را به آرامی با دستمال نخی خشک و نرم بگیرید، داخل کیف را با کاغذ بدون جوهر پر کنید تا فرم آن حفظ شود و اجازه دهید دور از شوفاژ یا سشوار خشک شود.',
      'هنگام نگهداری در کمد، کیف را داخل کیسه نخی تنفس‌پذیر قرار دهید تا از گردوغبار و خط‌افتادگی یراق‌های برنزی آن محافظت شود.',
    ],
  },
  {
    id: 'art-7',
    title: 'هارمونی رنگ‌های خاکی، زمردی و مسی در کمد کپسولی پاییز',
    excerpt:
      'چگونه تنها با شش قطعه کلیدی در پالت رنگ طبیعی، ده‌ها ست رسمی و روزمره هماهنگ بسازیم؟',
    readTime: '۵ دقیقه',
    date: '۴ آذر ۱۴۰۳',
    tag: 'ست و استایل',
    author: 'سپیده راد',
    authorRole: 'مشاور ارشد استایل و رنگ',
    image: IMAGES.emeraldCollection,
    takeaways: [
      'پالت خنثی گرم (استخوانی، شتری، اسپرسو) بهترین بستر برای درخشش رنگ‌های زمردی و مسی است.',
      'شال ابریشم و کیف چرم عسلی، دو نقطه پیوند کلیدی میان تمام لایه‌های کمد کپسولی هستند.',
      'انتخاب دو مدل شلوار خوش‌فرم در رنگ‌های کرم و قهوه‌ای تیره، نیاز به تنوع بالا را بی‌نیاز می‌کند.',
    ],
    relatedProductIds: ['pop-1', 'vip-2', 'vip-1'],
    body: [
      'کمد کپسولی پاییزی بر پایه انتخاب هوشمندانه قطعات ماندگار با قابلیت ترکیب‌پذیری بالا شکل می‌گیرد. وقتی رنگ‌های پایه شما در طیف گرم استخوانی، شتری و قهوه‌ای اسپرسو انتخاب شوند، اضافه کردن تنها یک قطعه شاخص به رنگ سبز زمردی یا تراکوتا کل استایل را دگرگون می‌کند.',
      'در طراحی کالکشن پاییز و زمستان شوک، تمامی رنگ‌ها بر اساس یک چرخه هارمونیک واحد رنگرزی شده‌اند تا هر شال یا کیف چرمی از این فصل به سادگی کنار مانتوها و پالتوهای فوتر بنشیند.',
    ],
  },
];

export const NAV_LINKS = [
  { label: 'شال و روسری', slug: 'shawl' },
  { label: 'پالتو و بارانی', slug: 'coat' },
  { label: 'کت و جلیقه', slug: 'jacket' },
  { label: 'مانتوهای لوکس', slug: 'manteau' },
  { label: 'شلوار و دامن', slug: 'trousers' },
  { label: 'کیف و چرم دست‌ساز', slug: 'bag' },
  { label: 'تخفیف‌های فصلی VIP', slug: 'vip', anchor: '#vip-offers' },
  { label: 'مجله شوک', slug: 'blog' },
  { label: 'درباره ما', slug: 'about' },
  { label: 'تماس با ما', slug: 'contact' },
];

export interface ProductReview {
  id: string;
  author: string;
  date: string;
  rating: number;
  verifiedColor: string;
  verifiedSize: string;
  comment: string;
}

export const ALL_CATALOG_PRODUCTS: Product[] = [
  ...PRODUCTS,
  SIGNATURE_ELIZA_PRODUCT,
];

export function findProductById(id: string | null | undefined): Product | null {
  if (!id) return null;
  return ALL_CATALOG_PRODUCTS.find((item) => item.id === id) ?? null;
}

export const CARE_GUIDES: { title: string; detail: string }[] = [
  {
    title: 'خشکشویی تخصصی الیاف طبیعی',
    detail:
      'جهت حفظ ساختار، لطافت پشم و درخشش ابریشم، شستشو فقط به روش خشکشویی ملایم توصیه می‌شود.',
  },
  {
    title: 'بخاردهی غیرمستقیم با دمای پایین',
    detail:
      'برای باز کردن چروک‌ها از بخارگر دستی با فاصله ۱۰ سانتی‌متری یا اتو با پارچه محافظ نخی استفاده کنید.',
  },
  {
    title: 'نگهداری در کاور تنفس‌پذیر شوک',
    detail:
      'پس از هر بار استفاده، لباس را روی چوب‌لباسی پهن و داخل کاور پارچه‌ای اختصاصی آتلیه بیاویزید.',
  },
  {
    title: 'دور از رطوبت مستقیم و عطر',
    detail:
      'از اسپری مستقیم عطر یا مواد شوینده حاوی کلر روی بافت پارچه و یراق‌آلات فلزی پرهیز فرمایید.',
  },
];

export function getDefaultReviewsForProduct(product: Product): ProductReview[] {
  const primaryColor = product.colors[0]?.name ?? 'اصلی';
  const secondaryColor = product.colors[1]?.name ?? primaryColor;
  const primarySize = product.sizes[1] ?? product.sizes[0] ?? 'فری سایز';

  return [
    {
      id: `${product.id}-rev-1`,
      author: 'مهسا فرهادی',
      date: '۱۸ آبان ۱۴۰۳',
      rating: 5,
      verifiedColor: primaryColor,
      verifiedSize: primarySize,
      comment: `کیفیت بافت ${product.material} واقعاً بی‌نظیره. تن‌خور کار دقیقاً مطابق جدول سایزبندی بود و مغزی‌دوزی داخلش بسیار تمیز انجام شده.`,
    },
    {
      id: `${product.id}-rev-2`,
      author: 'نگار صدیقی',
      date: '۹ آبان ۱۴۰۳',
      rating: 5,
      verifiedColor: secondaryColor,
      verifiedSize: product.sizes[0] ?? 'فری سایز',
      comment:
        'بسته‌بندی باکس VIP شوک و ارسال ۲ ساعته در تهران تجربه خرید خیلی شیکی ساخت. رنگ محصول در نور طبیعی دقیقاً مثل عکس‌هاست.',
    },
  ];
}

export interface CategoryEditorialMeta {
  slug: string;
  title: string;
  kicker: string;
  description: string;
  image: string;
  imagePosition?: string;
}

export const CATEGORY_TABS: CategoryEditorialMeta[] = [
  {
    slug: 'all',
    title: 'همه کالکشن‌ها',
    kicker: 'ویترین جامع آتلیه شوک',
    description:
      'تمامی پوشاک فاخر، پالتوهای فوتر ایتالیایی، مانتوهای مجلسی و اکسسوری‌های دست‌ساز شوک در یک نگاه.',
    image: IMAGES.heroCourtyard,
    imagePosition: 'object-[50%_62%]',
  },
  {
    slug: 'manteau',
    title: 'مانتوهای لوکس',
    kicker: 'برش‌های معماری و مجلسی',
    description:
      'مانتوهای کتی ژاکارد و رداهای سوزن‌دوزی با آستر ابریشم طبیعی یزد و یقه انگلیسی ساختارمند.',
    image: IMAGES.jacquardManteau,
    imagePosition: 'object-[50%_22%]',
  },
  {
    slug: 'coat',
    title: 'پالتو و بارانی',
    kicker: 'گرم‌ترین بافت‌های پاییز و زمستان',
    description:
      'پالتوهای فوتر پشم مرینوس بیه‌لا و بارانی‌های گاباردین ضدآب با ضمانت ۳ ساله عدم پرزدهی.',
    image: IMAGES.oatmealCoat,
    imagePosition: 'object-[50%_62%]',
  },
  {
    slug: 'jacket',
    title: 'کت و جلیقه',
    kicker: 'استایل رسمی و کژوال نیم‌فصل',
    description:
      'کت‌های فوتر بوکله و دو رو با دکمه‌های برنجی عتیقه، مناسب ست کردن با شال ابریشم و شلوار بگ.',
    image: IMAGES.diplomatForest,
    imagePosition: 'object-[50%_22%]',
  },
  {
    slug: 'shawl',
    title: 'شال و روسری',
    kicker: 'ابریشم توییل یزد و کشمیر اصل',
    description:
      'شال‌های کشمیر دست‌بافت و روسری‌های ابریشم قواره‌بزرگ با لبه‌های دست‌دوز رول‌شده.',
    image: IMAGES.hermesShawl,
    imagePosition: 'object-center',
  },
  {
    slug: 'trousers',
    title: 'شلوار و دامن',
    kicker: 'الگوهای خوش‌فرم آتلیه',
    description:
      'شلوارهای بگ کمر بلند با پیلی‌های دقیق و پارچه‌های لینن و پشمی سنگین‌وزن پاییزه.',
    image: IMAGES.linenTrousers,
    imagePosition: 'object-[50%_25%]',
  },
  {
    slug: 'bag',
    title: 'کیف و چرم دست‌ساز',
    kicker: 'دباغی گیاهی و دوخت دست‌دوز',
    description:
      'کیف‌های دوشی چرم طبیعی با یراق برنزی مات و پرداخت لبه‌های دست‌ساز صنعتگران شوک.',
    image: IMAGES.toranjBag,
    imagePosition: 'object-center',
  },
  {
    slug: 'vip',
    title: 'تخفیف‌های فصلی VIP',
    kicker: 'تیراژ محدود با مزایای ویژه',
    description:
      'منتخب آثار محبوب فصل با تخفیف ویژه تا ۳۰٪ و ارسال بیمه‌شده رایگان آتلیه.',
    image: IMAGES.emeraldCollection,
    imagePosition: 'object-center',
  },
];

export function getCategoryMeta(slug: string): CategoryEditorialMeta {
  return (
    CATEGORY_TABS.find((tab) => tab.slug === slug) ?? CATEGORY_TABS[0]
  );
}

export type PromoSlideTheme = 'black-friday' | 'winter-atelier' | 'leather-silk' | 'atelier-craft';

export interface PromoBannerSlide {
  id: string;
  title: string;
  subtitle: string;
  highlightTag: string;
  ctaLabel: string;
  targetCategory: string;
  theme: PromoSlideTheme;
  image: string;
  imagePosition?: string;
}

export const EVENT_PROMO_BANNERS: PromoBannerSlide[] = [
  {
    id: 'promo-black-friday',
    highlightTag: 'حراج بلک فرایدی',
    title: 'تخفیف‌های استثنایی خانه مد شوک',
    subtitle: 'تا ۴۰٪ تخفیف روی منتخب آثار فاخر',
    ctaLabel: 'از دست نده',
    targetCategory: 'vip',
    theme: 'black-friday',
    image: IMAGES.bannerBlackFriday,
    imagePosition: 'object-[35%_40%]',
  },
  {
    id: 'promo-winter-collection',
    highlightTag: 'کالکشن زمستان ۱۴۰۳',
    title: 'گرم‌ترین سیلوت‌های پاییز و زمستان',
    subtitle: 'پالتوهای فوتر اعلا و کشمیر دو رو',
    ctaLabel: 'مشاهده کالکشن',
    targetCategory: 'coat',
    theme: 'winter-atelier',
    image: IMAGES.bannerWinterSilk,
    imagePosition: 'object-[35%_50%]',
  },
  {
    id: 'promo-leather-silk',
    highlightTag: 'سری محدود آتلیه',
    title: 'کیف‌های چرم طبیعی دست‌دوز شوک',
    subtitle: 'چرم دباغی گیاهی با یراق برنزی مات',
    ctaLabel: 'خرید کیف چرم',
    targetCategory: 'bag',
    theme: 'leather-silk',
    image: IMAGES.toranjBag,
    imagePosition: 'object-[35%_50%]',
  },
  {
    id: 'promo-atelier-craft',
    highlightTag: 'هنر تک‌دوزی شوک',
    title: 'مانتو و رداهای مجلسی شب یلدا',
    subtitle: 'فوتر ایتالیایی همراه با ابریشم دست‌بافت',
    ctaLabel: 'مشاهده مانتوها',
    targetCategory: 'manteau',
    theme: 'atelier-craft',
    image: IMAGES.atelierHands,
    imagePosition: 'object-[35%_45%]',
  },
];


