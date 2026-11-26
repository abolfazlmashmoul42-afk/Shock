import test from 'node:test';
import assert from 'node:assert/strict';
import {
  addOrIncrementCartItem,
  calculateAdvancedCartTotals,
  calculateCartTotals,
  evaluatePromoCode,
  filterAndSortCatalog,
  filterBlogArticles,
  filterProducts,
  formatToman,
  getAdjacentBlogArticles,
  getBlogTags,
  getCategoryCounts,
  getProductGallery,
  getProductSku,
  getRelatedProducts,
  getSizeMeasurements,
  stepSlideIndex,
  toPersianDigits,
  updateCartItemQty,
  validateAppointmentRequest,
  validateCheckoutForm,
  validateContactMessage,
  validateLoginForm,
  validateSignupForm,
  validateVipContact,
  generateDeterministicOtp,
  verifyOtpCode,
  type BlogArticleSummary,
  type Product,
} from './store';

const sampleProduct: Product = {
  id: 'p1',
  title: 'مانتو کتی ژاکارد طلاکوب',
  category: 'مانتوهای لوکس',
  categorySlug: 'manteau',
  description: 'دوخت آستردار تمام ابریشم',
  fullDescription: 'توضیحات کامل محصول',
  material: 'ژاکارد ابریشم طبیعی',
  price: 3850000,
  inStock: true,
  image: '/test.jpg',
  colors: [{ name: 'مشکی طلایی', hex: '#241A14' }],
  sizes: ['۳۶', '۳۸', '۴۰'],
  section: 'new',
};

const sampleScarf: Product = {
  ...sampleProduct,
  id: 'p2',
  title: 'شال کشمیر طرح هرمس اصیل',
  category: 'شال و روسری',
  categorySlug: 'shawl',
  price: 1650000,
  originalPrice: 2100000,
  discountPercent: 20,
  rating: 4.9,
  sizes: ['قواره ۷۰×۲۰۰'],
  section: 'vip',
};

const sampleManteauTwo: Product = {
  ...sampleProduct,
  id: 'p3',
  title: 'مانتو کلوش سوزن‌دوزی',
  categorySlug: 'manteau',
  price: 5200000,
  rating: 5.0,
  sizes: ['فری سایز (۳۶ تا ۴۴)'],
  section: 'popular',
};

test('toPersianDigits converts numbers properly', () => {
  assert.equal(toPersianDigits('3,850,000'), '۳,۸۵۰,۰۰۰');
  assert.equal(toPersianDigits(48), '۴۸');
});

test('formatToman formats currency in Persian with unit', () => {
  assert.equal(formatToman(3850000), '۳,۸۵۰,۰۰۰ تومان');
  assert.equal(formatToman(0), '۰ تومان');
});

test('addOrIncrementCartItem adds new items with quantity and increments matching variants', () => {
  let cart = addOrIncrementCartItem([], sampleProduct, 'مشکی طلایی', '۳۸', 2);
  assert.equal(cart.length, 1);
  assert.equal(cart[0].quantity, 2);

  cart = addOrIncrementCartItem(cart, sampleProduct, 'مشکی طلایی', '۳۸');
  assert.equal(cart.length, 1);
  assert.equal(cart[0].quantity, 3);

  cart = addOrIncrementCartItem(cart, sampleProduct, 'مشکی طلایی', '۴۰');
  assert.equal(cart.length, 2);
});

test('updateCartItemQty decrements and removes items reaching zero', () => {
  let cart = addOrIncrementCartItem([], sampleProduct, 'مشکی طلایی', '۳۸');
  cart = addOrIncrementCartItem(cart, sampleProduct, 'مشکی طلایی', '۳۸');
  const key = cart[0].key;
  cart = updateCartItemQty(cart, key, -1);
  assert.equal(cart[0].quantity, 1);
  cart = updateCartItemQty(cart, key, -1);
  assert.equal(cart.length, 0);
});

test('calculateCartTotals computes VIP 10% discount and free shipping threshold', () => {
  const scarfCart = addOrIncrementCartItem([], sampleScarf, 'آجری', 'فری سایز');
  const standardTotals = calculateCartTotals(scarfCart, false);
  assert.equal(standardTotals.subtotal, 1650000);
  assert.equal(standardTotals.shipping, 120000);
  assert.equal(standardTotals.total, 1770000);

  const coatCart = addOrIncrementCartItem([], sampleProduct, 'مشکی طلایی', '۳۸');
  const vipTotals = calculateCartTotals(coatCart, true);
  assert.equal(vipTotals.discount, 385000);
  assert.equal(vipTotals.shipping, 0);
  assert.equal(vipTotals.total, 3465000);
});

test('filterProducts filters by query and categorySlug', () => {
  const list = [sampleProduct, sampleScarf];
  assert.equal(filterProducts(list, 'کشمیر').length, 1);
  assert.equal(filterProducts(list, '', 'manteau').length, 1);
  assert.equal(filterProducts(list, '', 'all').length, 2);
});

test('validateVipContact accepts valid Iranian phone or email and rejects invalid', () => {
  assert.equal(validateVipContact('').valid, false);
  assert.equal(validateVipContact('abc').valid, false);
  assert.equal(validateVipContact('09123456789').valid, true);
  assert.equal(validateVipContact('۰۹۱۲۳۴۵۶۷۸۹').valid, true);
  assert.equal(validateVipContact('sara@shockfashion.ir').valid, true);
});

test('getProductSku builds deterministic uppercase atelier code', () => {
  assert.equal(getProductSku(sampleProduct), 'SHK-MAN-P1');
  assert.equal(getProductSku(sampleScarf), 'SHK-SHA-P2');
});

test('getProductGallery builds unique multi-angle gallery and skips duplicate editorial image', () => {
  const gallery = getProductGallery(sampleProduct, {
    fabric: '/fabric.jpg',
    tailor: '/tailor.jpg',
    editorial: '/look.jpg',
  });
  assert.equal(gallery.length, 4);
  assert.equal(gallery[0].src, sampleProduct.image);

  const deduped = getProductGallery(sampleProduct, {
    fabric: '/fabric.jpg',
    tailor: '/tailor.jpg',
    editorial: '/test.jpg',
  });
  assert.equal(deduped.length, 3);
});

test('getRelatedProducts prioritizes same category and excludes active product', () => {
  const related = getRelatedProducts(
    [sampleProduct, sampleScarf, sampleManteauTwo],
    sampleProduct,
    2,
  );
  assert.equal(related.length, 2);
  assert.equal(related[0].id, 'p3');
  assert.equal(related.some((p) => p.id === sampleProduct.id), false);
});

test('getSizeMeasurements returns category-specific chart rows', () => {
  const scarfChart = getSizeMeasurements('shawl');
  assert.equal(scarfChart.rows.length, 2);
  assert.equal(scarfChart.columns[0], 'مدل');

  const coatChart = getSizeMeasurements('coat');
  assert.equal(coatChart.rows.length, 4);
  assert.equal(coatChart.columns[0], 'سایز');
});

test('filterAndSortCatalog supports vip, priceTier, size, discounts, and sorting', () => {
  const list = [sampleProduct, sampleScarf, sampleManteauTwo];

  const vipOnly = filterAndSortCatalog(list, {
    categorySlug: 'vip',
    query: '',
    priceTier: 'all',
    size: 'all',
    onlyDiscounted: false,
    sortBy: 'featured',
  });
  assert.equal(vipOnly.length, 1);
  assert.equal(vipOnly[0].id, 'p2');

  const over4m = filterAndSortCatalog(list, {
    categorySlug: 'all',
    query: '',
    priceTier: 'over-4m',
    size: 'all',
    onlyDiscounted: false,
    sortBy: 'featured',
  });
  assert.equal(over4m.length, 1);
  assert.equal(over4m[0].id, 'p3');

  const freeSize = filterAndSortCatalog(list, {
    categorySlug: 'all',
    query: '',
    priceTier: 'all',
    size: 'free',
    onlyDiscounted: false,
    sortBy: 'price-asc',
  });
  assert.equal(freeSize.length, 2);
  assert.equal(freeSize[0].id, 'p2');
  assert.equal(freeSize[1].id, 'p3');

  const descSorted = filterAndSortCatalog(list, {
    categorySlug: 'all',
    query: '',
    priceTier: 'all',
    size: 'all',
    onlyDiscounted: false,
    sortBy: 'price-desc',
  });
  assert.deepEqual(
    descSorted.map((p) => p.id),
    ['p3', 'p1', 'p2'],
  );
});

test('getCategoryCounts computes counts per slug, all, and vip', () => {
  const counts = getCategoryCounts([sampleProduct, sampleScarf, sampleManteauTwo]);
  assert.equal(counts.all, 3);
  assert.equal(counts.manteau, 2);
  assert.equal(counts.shawl, 1);
  assert.equal(counts.vip, 1);
});

test('stepSlideIndex wraps cleanly forward and backward across slides', () => {
  assert.equal(stepSlideIndex(0, 4, 1), 1);
  assert.equal(stepSlideIndex(3, 4, 1), 0);
  assert.equal(stepSlideIndex(0, 4, -1), 3);
  assert.equal(stepSlideIndex(2, 4, -1), 1);
  assert.equal(stepSlideIndex(0, 0, 1), 0);
});

test('validateAppointmentRequest enforces valid name and phone/email contact', () => {
  assert.equal(validateAppointmentRequest({ name: '', contact: '09123456789' }).valid, false);
  assert.equal(validateAppointmentRequest({ name: 'سارا', contact: '123' }).valid, false);
  assert.equal(
    validateAppointmentRequest({ name: 'سارا طاهری', contact: '۰۹۱۲۳۴۵۶۷۸۹' }).valid,
    true,
  );
  assert.equal(
    validateAppointmentRequest({ name: 'مهسا فرهادی', contact: 'mahsa@shock.ir' }).valid,
    true,
  );
});

test('validateContactMessage checks name, contact, and minimum message length', () => {
  assert.equal(
    validateContactMessage({
      name: 'سارا',
      contact: '09123456789',
      message: 'سلام',
    }).valid,
    false,
  );
  assert.equal(
    validateContactMessage({
      name: 'سارا طاهری',
      contact: 'invalid',
      message: 'در مورد سایزبندی پالتو الیزا سوال داشتم.',
    }).valid,
    false,
  );
  assert.equal(
    validateContactMessage({
      name: 'سارا طاهری',
      contact: '۰۹۱۲۳۴۵۶۷۸۹',
      message: 'در مورد سایزبندی پالتو الیزا سوال داشتم.',
    }).valid,
    true,
  );
});

test('validateLoginForm checks contact format and password length', () => {
  assert.equal(
    validateLoginForm({ contact: 'bad', password: 'secret123' }).valid,
    false,
  );
  assert.equal(
    validateLoginForm({ contact: '۰۹۱۲۳۴۵۶۷۸۹', password: '123' }).valid,
    false,
  );
  assert.equal(
    validateLoginForm({ contact: '۰۹۱۲۳۴۵۶۷۸۹', password: 'shock1403' }).valid,
    true,
  );
});

test('validateSignupForm enforces name, contact, password, and terms', () => {
  assert.equal(
    validateSignupForm({
      fullName: 'س',
      contact: '09123456789',
      password: 'shock1403',
      acceptedTerms: true,
    }).valid,
    false,
  );
  assert.equal(
    validateSignupForm({
      fullName: 'نگار صدیقی',
      contact: '۰۹۱۲۳۴۵۶۷۸۹',
      password: 'shock1403',
      acceptedTerms: false,
    }).valid,
    false,
  );
  assert.equal(
    validateSignupForm({
      fullName: 'نگار صدیقی',
      contact: 'negar@shock.ir',
      password: 'shock1403',
      acceptedTerms: true,
    }).valid,
    true,
  );
});

test('OTP generation and Persian digit verification are deterministic', () => {
  const otp = generateDeterministicOtp('۰۹۱۲۳۴۵۶۷۸۹');
  assert.equal(otp.length, 4);
  assert.equal(otp, generateDeterministicOtp('09123456789'));
  assert.equal(verifyOtpCode(toPersianDigits(otp), otp), true);
  assert.equal(verifyOtpCode('0000', otp === '0000' ? '1111' : otp), false);
});

test('evaluatePromoCode validates SHOCK-VIP10, SHOCK15, and rejects invalid codes', () => {
  assert.equal(evaluatePromoCode('').valid, false);
  assert.equal(evaluatePromoCode('INVALID').valid, false);
  const vip = evaluatePromoCode(' shock-vip10 ');
  assert.equal(vip.valid, true);
  assert.equal(vip.discountRate, 0.1);
  const bf = evaluatePromoCode('SHOCK15');
  assert.equal(bf.valid, true);
  assert.equal(bf.discountRate, 0.15);
});

test('calculateAdvancedCartTotals handles discount rates, free shipping threshold, and express shipping', () => {
  const scarfCart = addOrIncrementCartItem([], sampleScarf, 'آجری', 'فری سایز');
  const stdTotals = calculateAdvancedCartTotals({
    items: scarfCart,
    discountRate: 0,
    shippingMethod: 'standard',
  });
  assert.equal(stdTotals.shipping, 120000);
  assert.equal(stdTotals.freeShippingRemaining, 1350000);

  const expressTotals = calculateAdvancedCartTotals({
    items: scarfCart,
    discountRate: 0.1,
    shippingMethod: 'express-tehran',
  });
  assert.equal(expressTotals.discount, 165000);
  assert.equal(expressTotals.shipping, 180000);
  assert.equal(expressTotals.total, 1665000);
});

test('validateCheckoutForm requires valid name, phone, and address', () => {
  assert.equal(
    validateCheckoutForm({
      customerName: 'م',
      phone: '09123456789',
      address: 'تهران، فرشته، پلاک ۲۴',
    }).valid,
    false,
  );
  assert.equal(
    validateCheckoutForm({
      customerName: 'مریم ناصری',
      phone: '1234',
      address: 'تهران، فرشته، پلاک ۲۴',
    }).valid,
    false,
  );
  assert.equal(
    validateCheckoutForm({
      customerName: 'مریم ناصری',
      phone: '۰۹۱۲۳۴۵۶۷۸۹',
      address: 'تهران، فرشته',
    }).valid,
    true,
  );
});

const sampleArticles: BlogArticleSummary[] = [
  {
    id: 'a1',
    title: 'راهنمای پالتوی فوتر',
    excerpt: 'انتخاب پالتو زمستانی',
    readTime: '۷ دقیقه',
    date: '۱۲ مهر ۱۴۰۳',
    tag: 'راهنمای خرید',
    author: 'نگار سلطانی',
    body: ['فوتر مرینوس بیه‌لا کیفیت بالایی دارد.'],
  },
  {
    id: 'a2',
    title: 'شناخت کشمیر اصل',
    excerpt: 'نگهداری الیاف لطیف',
    readTime: '۵ دقیقه',
    date: '۵ آبان ۱۴۰۳',
    tag: 'متریال',
    author: 'مریم کاظمی',
    body: ['کشمیر طبیعی سبک و گرم است.'],
  },
  {
    id: 'a3',
    title: 'ست شال ابریشم',
    excerpt: 'استایل رسمی پاییز',
    readTime: '۴ دقیقه',
    date: '۲۸ مهر ۱۴۰۳',
    tag: 'ست و استایل',
    author: 'سپیده راد',
    body: ['ابریشم یزد جلوه‌ای خاص می‌سازد.'],
  },
];

test('getBlogTags returns unique article tags prefixed with همه', () => {
  assert.deepEqual(getBlogTags(sampleArticles), ['همه', 'راهنمای خرید', 'متریال', 'ست و استایل']);
});

test('filterBlogArticles filters by tag and search query accurately', () => {
  assert.equal(filterBlogArticles(sampleArticles, { tag: 'همه', query: '' }).length, 3);
  const byTag = filterBlogArticles(sampleArticles, { tag: 'متریال', query: '' });
  assert.equal(byTag.length, 1);
  assert.equal(byTag[0].id, 'a2');

  const byBodyQuery = filterBlogArticles(sampleArticles, { tag: 'همه', query: 'مرینوس' });
  assert.equal(byBodyQuery.length, 1);
  assert.equal(byBodyQuery[0].id, 'a1');

  assert.equal(filterBlogArticles(sampleArticles, { tag: 'متریال', query: 'ابریشم' }).length, 0);
});

test('getAdjacentBlogArticles returns previous and next articles safely', () => {
  const first = getAdjacentBlogArticles(sampleArticles, 'a1');
  assert.equal(first.previous, null);
  assert.equal(first.next?.id, 'a2');

  const middle = getAdjacentBlogArticles(sampleArticles, 'a2');
  assert.equal(middle.previous?.id, 'a1');
  assert.equal(middle.next?.id, 'a3');

  const last = getAdjacentBlogArticles(sampleArticles, 'a3');
  assert.equal(last.previous?.id, 'a2');
  assert.equal(last.next, null);
});


