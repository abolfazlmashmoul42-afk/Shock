export interface ColorOption {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  title: string;
  category: string;
  categorySlug: string;
  description: string;
  fullDescription: string;
  material: string;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  badge?: string;
  rating?: number;
  reviewCount?: number;
  inStock: boolean;
  image: string;
  colors: ColorOption[];
  sizes: string[];
  section: 'new' | 'vip' | 'popular';
}

export interface CartItem {
  key: string;
  product: Product;
  selectedColor: string;
  selectedSize: string;
  quantity: number;
}

export function toPersianDigits(input: number | string): string {
  const persianMap: Record<string, string> = {
    '0': '۰',
    '1': '۱',
    '2': '۲',
    '3': '۳',
    '4': '۴',
    '5': '۵',
    '6': '۶',
    '7': '۷',
    '8': '۸',
    '9': '۹',
  };
  return String(input).replace(/[0-9]/g, (d) => persianMap[d] ?? d);
}

export function formatToman(amount: number): string {
  const formatted = Math.max(0, Math.round(amount)).toLocaleString('en-US');
  return `${toPersianDigits(formatted)} تومان`;
}

export function addOrIncrementCartItem(
  items: CartItem[],
  product: Product,
  selectedColor: string,
  selectedSize: string,
  quantity = 1,
): CartItem[] {
  const safeQty = Math.max(1, Math.floor(quantity));
  const key = `${product.id}__${selectedColor}__${selectedSize}`;
  const existing = items.find((item) => item.key === key);
  if (existing) {
    return items.map((item) =>
      item.key === key ? { ...item, quantity: item.quantity + safeQty } : item,
    );
  }
  return [
    ...items,
    {
      key,
      product,
      selectedColor,
      selectedSize,
      quantity: safeQty,
    },
  ];
}

export function updateCartItemQty(
  items: CartItem[],
  key: string,
  delta: number,
): CartItem[] {
  return items
    .map((item) =>
      item.key === key ? { ...item, quantity: item.quantity + delta } : item,
    )
    .filter((item) => item.quantity > 0);
}

export function calculateCartTotals(
  items: CartItem[],
  vipDiscountApplied: boolean,
): {
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  itemCount: number;
} {
  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const discount = vipDiscountApplied ? Math.round(subtotal * 0.1) : 0;
  const afterDiscount = Math.max(0, subtotal - discount);
  const shipping = afterDiscount === 0 || afterDiscount >= 3000000 ? 0 : 120000;
  const total = afterDiscount + shipping;
  return { subtotal, discount, shipping, total, itemCount };
}

export function filterProducts(
  products: Product[],
  query: string,
  categorySlug?: string,
): Product[] {
  const normalizedQuery = query.trim().toLowerCase();
  return products.filter((p) => {
    const matchesCategory =
      !categorySlug || categorySlug === 'all' || p.categorySlug === categorySlug;
    if (!matchesCategory) return false;
    if (!normalizedQuery) return true;
    return (
      p.title.toLowerCase().includes(normalizedQuery) ||
      p.category.toLowerCase().includes(normalizedQuery) ||
      p.description.toLowerCase().includes(normalizedQuery) ||
      p.material.toLowerCase().includes(normalizedQuery)
    );
  });
}

export function validateVipContact(input: string): {
  valid: boolean;
  error?: string;
} {
  const trimmed = input.trim();
  if (!trimmed) {
    return { valid: false, error: 'لطفاً شماره موبایل یا ایمیل خود را وارد کنید.' };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^(09|\+989|۰۹)[0-9۰-۹]{9}$/;
  const cleanPhone = trimmed.replace(/[\s-]/g, '');
  if (emailRegex.test(trimmed) || phoneRegex.test(cleanPhone)) {
    return { valid: true };
  }
  return {
    valid: false,
    error: 'فرمت شماره موبایل (مثلاً ۰۹۱۲۳۴۵۶۷۸۹) یا ایمیل معتبر نیست.',
  };
}

export interface GalleryImageItem {
  id: string;
  src: string;
  alt: string;
  caption: string;
}

export interface SizeMeasurementRow {
  size: string;
  bust: string;
  waist: string;
  hip: string;
  length: string;
}

export function getProductSku(product: Product): string {
  const slugCode = product.categorySlug.slice(0, 3).toUpperCase();
  const idCode = product.id.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
  return `SHK-${slugCode}-${idCode}`;
}

export function getProductGallery(
  product: Product,
  atelierAssets: {
    fabric: string;
    tailor: string;
    editorial?: string;
  },
): GalleryImageItem[] {
  const gallery: GalleryImageItem[] = [
    {
      id: `${product.id}-main`,
      src: product.image,
      alt: product.title,
      caption: 'نمای اصلی',
    },
    {
      id: `${product.id}-fabric`,
      src: atelierAssets.fabric,
      alt: `نمای نزدیک بافت ${product.material}`,
      caption: 'بافت پارچه',
    },
    {
      id: `${product.id}-tailor`,
      src: atelierAssets.tailor,
      alt: `جزئیات دوخت آتلیه برای ${product.title}`,
      caption: 'دوخت آتلیه',
    },
  ];

  if (atelierAssets.editorial && atelierAssets.editorial !== product.image) {
    gallery.push({
      id: `${product.id}-editorial`,
      src: atelierAssets.editorial,
      alt: `ست پیشنهادی ${product.title}`,
      caption: 'نمای استایل',
    });
  }

  return gallery;
}

export function getRelatedProducts(
  allProducts: Product[],
  currentProduct: Product,
  limit = 4,
): Product[] {
  const others = allProducts.filter((p) => p.id !== currentProduct.id);
  const sameCategory = others.filter(
    (p) => p.categorySlug === currentProduct.categorySlug,
  );
  const differentCategory = others.filter(
    (p) => p.categorySlug !== currentProduct.categorySlug,
  );
  return [...sameCategory, ...differentCategory].slice(0, Math.max(0, limit));
}

export function getSizeMeasurements(
  categorySlug: string,
): {
  columns: [string, string, string, string, string];
  rows: SizeMeasurementRow[];
} {
  if (categorySlug === 'shawl') {
    return {
      columns: ['مدل', 'عرض (سانتی‌متر)', 'طول (سانتی‌متر)', 'وزن الیاف', 'ایستایی'],
      rows: [
        { size: 'قواره ۷۰×۲۰۰', bust: '۷۰', waist: '۲۰۰', hip: '۱۸۵ گرم', length: 'آزاد و سبک' },
        { size: 'قواره ۱۴۰×۱۴۰', bust: '۱۴۰', waist: '۱۴۰', hip: '۱۳۰ گرم', length: 'ابریشم توییل' },
      ],
    };
  }
  if (categorySlug === 'bag') {
    return {
      columns: ['مدل', 'طول (سانتی‌متر)', 'ارتفاع (سانتی‌متر)', 'عمق', 'بند دوشی'],
      rows: [
        { size: 'تک سایز', bust: '۲۴', waist: '۱۸', hip: '۹ سانتی‌متر', length: '۹۵ تا ۱۱۵ قابل تنظیم' },
      ],
    };
  }
  if (categorySlug === 'trousers') {
    return {
      columns: ['سایز', 'دور کمر', 'دور باسن', 'فاق', 'قد شلوار'],
      rows: [
        { size: '۳۶', bust: '۶۶ تا ۷۰', waist: '۹۲ تا ۹۶', hip: '۳۱', length: '۱۰۴' },
        { size: '۳۸', bust: '۷۱ تا ۷۵', waist: '۹۷ تا ۱۰۱', hip: '۳۲', length: '۱۰۵' },
        { size: '۴۰', bust: '۷۶ تا ۸۰', waist: '۱۰۲ تا ۱۰۶', hip: '۳۳', length: '۱۰۶' },
        { size: '۴۲', bust: '۸۱ تا ۸۶', waist: '۱۰۷ تا ۱۱۱', hip: '۳۴', length: '۱۰۷' },
      ],
    };
  }
  return {
    columns: ['سایز', 'دور سینه', 'دور کمر', 'دور باسن', 'قد لباس'],
    rows: [
      { size: '۳۶', bust: '۸۶ تا ۹۰', waist: '۶۸ تا ۷۲', hip: '۹۴ تا ۹۸', length: '۱۰۸' },
      { size: '۳۸', bust: '۹۱ تا ۹۵', waist: '۷۳ تا ۷۷', hip: '۹۹ تا ۱۰۳', length: '۱۱۰' },
      { size: '۴۰', bust: '۹۶ تا ۱۰۰', waist: '۷۸ تا ۸۳', hip: '۱۰۴ تا ۱۰۸', length: '۱۱۲' },
      { size: '۴۲', bust: '۱۰۱ تا ۱۰۶', waist: '۸۴ تا ۸۹', hip: '۱۰۹ تا ۱۱۴', length: '۱۱۴' },
    ],
  };
}

export type CatalogSortOption =
  | 'featured'
  | 'price-asc'
  | 'price-desc'
  | 'discount'
  | 'rating';

export type PriceTier = 'all' | 'under-2m' | '2m-to-4m' | 'over-4m';

export interface CategoryFilterCriteria {
  categorySlug: string;
  query: string;
  priceTier: PriceTier;
  size: string;
  onlyDiscounted: boolean;
  sortBy: CatalogSortOption;
}

export function filterAndSortCatalog(
  products: Product[],
  criteria: CategoryFilterCriteria,
): Product[] {
  const normalizedQuery = criteria.query.trim().toLowerCase();

  const filtered = products.filter((product) => {
    if (criteria.categorySlug === 'vip') {
      if (product.section !== 'vip' && !product.discountPercent) return false;
    } else if (
      criteria.categorySlug &&
      criteria.categorySlug !== 'all' &&
      product.categorySlug !== criteria.categorySlug
    ) {
      return false;
    }

    if (criteria.onlyDiscounted && !product.discountPercent && !product.originalPrice) {
      return false;
    }

    if (criteria.priceTier === 'under-2m' && product.price >= 2000000) {
      return false;
    }
    if (
      criteria.priceTier === '2m-to-4m' &&
      (product.price < 2000000 || product.price > 4000000)
    ) {
      return false;
    }
    if (criteria.priceTier === 'over-4m' && product.price <= 4000000) {
      return false;
    }

    if (criteria.size && criteria.size !== 'all') {
      if (criteria.size === 'free') {
        const isFreeOrDimension = product.sizes.some(
          (s) => s.includes('فری') || s.includes('قواره') || s.includes('تک سایز'),
        );
        if (!isFreeOrDimension) return false;
      } else {
        const matchesNumericSize = product.sizes.some(
          (s) => s === criteria.size || s.includes(criteria.size),
        );
        if (!matchesNumericSize) return false;
      }
    }

    if (normalizedQuery) {
      const hay = [
        product.title,
        product.category,
        product.description,
        product.material,
        ...product.colors.map((c) => c.name),
      ]
        .join(' ')
        .toLowerCase();
      if (!hay.includes(normalizedQuery)) return false;
    }

    return true;
  });

  const sorted = [...filtered];
  switch (criteria.sortBy) {
    case 'price-asc':
      sorted.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      sorted.sort((a, b) => b.price - a.price);
      break;
    case 'discount':
      sorted.sort(
        (a, b) => (b.discountPercent ?? 0) - (a.discountPercent ?? 0),
      );
      break;
    case 'rating':
      sorted.sort((a, b) => (b.rating ?? 4.7) - (a.rating ?? 4.7));
      break;
    case 'featured':
    default:
      break;
  }

  return sorted;
}

export function getCategoryCounts(products: Product[]): Record<string, number> {
  const counts: Record<string, number> = {
    all: products.length,
    vip: 0,
  };

  for (const product of products) {
    counts[product.categorySlug] = (counts[product.categorySlug] ?? 0) + 1;
    if (product.section === 'vip' || product.discountPercent) {
      counts.vip += 1;
    }
  }

  return counts;
}

export function stepSlideIndex(
  currentIndex: number,
  totalSlides: number,
  delta: number,
): number {
  if (totalSlides <= 0) return 0;
  const normalized = ((currentIndex + delta) % totalSlides + totalSlides) % totalSlides;
  return normalized;
}

export function validateAppointmentRequest(input: {
  name: string;
  contact: string;
}): { valid: boolean; error?: string } {
  if (input.name.trim().length < 2) {
    return {
      valid: false,
      error: 'لطفاً نام و نام خانوادگی خود را (حداقل ۲ حرف) وارد کنید.',
    };
  }
  const contactCheck = validateVipContact(input.contact);
  if (!contactCheck.valid) {
    return contactCheck;
  }
  return { valid: true };
}

export function validateContactMessage(input: {
  name: string;
  contact: string;
  message: string;
}): { valid: boolean; error?: string } {
  const baseCheck = validateAppointmentRequest({
    name: input.name,
    contact: input.contact,
  });
  if (!baseCheck.valid) {
    return baseCheck;
  }
  if (input.message.trim().length < 10) {
    return {
      valid: false,
      error: 'لطفاً متن پیام خود را (حداقل ۱۰ کاراکتر) با جزئیات بیشتر بنویسید.',
    };
  }
  return { valid: true };
}

export interface AuthUser {
  id: string;
  fullName: string;
  contact: string;
  vipMember: boolean;
  joinedAt: string;
}

export function normalizeDigitsToEnglish(input: string): string {
  const persian = '۰۱۲۳۴۵۶۷۸۹';
  const arabic = '٠١٢٣٤٥٦٧٨٩';
  return input
    .replace(/[۰-۹]/g, (ch) => String(persian.indexOf(ch)))
    .replace(/[٠-٩]/g, (ch) => String(arabic.indexOf(ch)));
}

export function validateLoginForm(input: {
  contact: string;
  password: string;
}): { valid: boolean; error?: string } {
  const contactCheck = validateVipContact(input.contact);
  if (!contactCheck.valid) {
    return contactCheck;
  }
  if (input.password.trim().length < 6) {
    return {
      valid: false,
      error: 'رمز عبور باید حداقل ۶ کاراکتر باشد.',
    };
  }
  return { valid: true };
}

export function validateSignupForm(input: {
  fullName: string;
  contact: string;
  password: string;
  acceptedTerms: boolean;
}): { valid: boolean; error?: string } {
  if (input.fullName.trim().length < 2) {
    return {
      valid: false,
      error: 'لطفاً نام و نام خانوادگی خود را (حداقل ۲ حرف) وارد کنید.',
    };
  }
  const contactCheck = validateVipContact(input.contact);
  if (!contactCheck.valid) {
    return contactCheck;
  }
  if (input.password.trim().length < 6) {
    return {
      valid: false,
      error: 'برای امنیت حساب، رمز عبور باید حداقل ۶ کاراکتر باشد.',
    };
  }
  if (!input.acceptedTerms) {
    return {
      valid: false,
      error: 'لطفاً قوانین خرید و حریم خصوصی خانه مد شوک را بپذیرید.',
    };
  }
  return { valid: true };
}

export function generateDeterministicOtp(contact: string): string {
  const normalized = normalizeDigitsToEnglish(contact.trim());
  let hash = 0;
  for (let i = 0; i < normalized.length; i += 1) {
    hash = (hash * 31 + normalized.charCodeAt(i)) % 9000;
  }
  return String(1000 + hash);
}

export function verifyOtpCode(inputCode: string, expectedCode: string): boolean {
  const cleanInput = normalizeDigitsToEnglish(inputCode).replace(/\s+/g, '');
  const cleanExpected = normalizeDigitsToEnglish(expectedCode).replace(/\s+/g, '');
  return cleanInput.length === 4 && cleanInput === cleanExpected;
}

export type ShippingMethod = 'standard' | 'express-tehran';

export const FREE_SHIPPING_THRESHOLD = 3000000;

export interface PromoCodeResult {
  valid: boolean;
  code: string;
  discountRate: number;
  label: string;
  error?: string;
}

export function evaluatePromoCode(rawCode: string): PromoCodeResult {
  const code = normalizeDigitsToEnglish(rawCode).trim().toUpperCase();
  if (!code) {
    return {
      valid: false,
      code: '',
      discountRate: 0,
      label: '',
      error: 'لطفاً کد تخفیف را وارد کنید.',
    };
  }
  if (code === 'SHOCK-VIP10' || code === 'VIP10') {
    return {
      valid: true,
      code: 'SHOCK-VIP10',
      discountRate: 0.1,
      label: 'کد باشگاه VIP (۱۰٪ تخفیف)',
    };
  }
  if (code === 'SHOCK15' || code === 'BLACKFRIDAY') {
    return {
      valid: true,
      code,
      discountRate: 0.15,
      label: `کد جشنواره ${code} (۱۵٪ تخفیف)`,
    };
  }
  return {
    valid: false,
    code,
    discountRate: 0,
    label: '',
    error: 'کد تخفیف واردشده معتبر نیست یا منقضی شده است.',
  };
}

export function calculateAdvancedCartTotals(input: {
  items: CartItem[];
  discountRate: number;
  shippingMethod: ShippingMethod;
}): {
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  itemCount: number;
  freeShippingRemaining: number;
} {
  const subtotal = input.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );
  const itemCount = input.items.reduce((sum, item) => sum + item.quantity, 0);
  const safeRate = Math.max(0, Math.min(0.5, input.discountRate));
  const discount = Math.round(subtotal * safeRate);
  const afterDiscount = Math.max(0, subtotal - discount);
  const freeShippingRemaining =
    afterDiscount === 0
      ? FREE_SHIPPING_THRESHOLD
      : Math.max(0, FREE_SHIPPING_THRESHOLD - afterDiscount);

  let shipping = 0;
  if (afterDiscount > 0) {
    if (input.shippingMethod === 'express-tehran') {
      shipping = afterDiscount >= 5000000 ? 0 : 180000;
    } else {
      shipping = afterDiscount >= FREE_SHIPPING_THRESHOLD ? 0 : 120000;
    }
  }

  return {
    subtotal,
    discount,
    shipping,
    total: afterDiscount + shipping,
    itemCount,
    freeShippingRemaining,
  };
}

export function validateCheckoutForm(input: {
  customerName: string;
  phone: string;
  address: string;
}): { valid: boolean; error?: string } {
  if (input.customerName.trim().length < 2) {
    return {
      valid: false,
      error: 'لطفاً نام و نام خانوادگی گیرنده را وارد نمایید.',
    };
  }
  const phoneCheck = validateVipContact(input.phone);
  if (!phoneCheck.valid) {
    return {
      valid: false,
      error: 'لطفاً شماره موبایل معتبر (مثلاً ۰۹۱۲۳۴۵۶۷۸۹) وارد کنید.',
    };
  }
  if (input.address.trim().length < 8) {
    return {
      valid: false,
      error: 'لطفاً نشانی کامل ارسال (حداقل ۸ کاراکتر) را وارد نمایید.',
    };
  }
  return { valid: true };
}

export interface BlogArticleSummary {
  id: string;
  title: string;
  excerpt: string;
  readTime: string;
  date: string;
  tag: string;
  author?: string;
  body: string[];
}

export function filterBlogArticles<T extends BlogArticleSummary>(
  articles: T[],
  options: {
    tag: string;
    query: string;
  },
): T[] {
  const normalizedTag = options.tag.trim();
  const normalizedQuery = normalizeDigitsToEnglish(options.query).trim().toLowerCase();

  return articles.filter((article) => {
    if (normalizedTag && normalizedTag !== 'همه' && article.tag !== normalizedTag) {
      return false;
    }
    if (!normalizedQuery) return true;
    const haystack = [
      article.title,
      article.excerpt,
      article.tag,
      article.author ?? '',
      ...article.body,
    ]
      .join(' ')
      .toLowerCase();
    return haystack.includes(normalizedQuery);
  });
}

export function getBlogTags<T extends Pick<BlogArticleSummary, 'tag'>>(
  articles: T[],
): string[] {
  const seen = new Set<string>();
  const tags: string[] = ['همه'];
  for (const article of articles) {
    const clean = article.tag.trim();
    if (clean && !seen.has(clean)) {
      seen.add(clean);
      tags.push(clean);
    }
  }
  return tags;
}

export function getAdjacentBlogArticles<T extends Pick<BlogArticleSummary, 'id'>>(
  articles: T[],
  currentId: string,
): { previous: T | null; next: T | null } {
  const index = articles.findIndex((item) => item.id === currentId);
  if (index === -1) {
    return { previous: null, next: null };
  }
  return {
    previous: index > 0 ? articles[index - 1] : null,
    next: index < articles.length - 1 ? articles[index + 1] : null,
  };
}

