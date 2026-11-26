import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowRight,
  Check,
  Expand,
  Heart,
  Minus,
  Package,
  Plus,
  RefreshCw,
  Ruler,
  Scissors,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Truck,
  X,
} from 'lucide-react';
import {
  CARE_GUIDES,
  IMAGES,
  PRODUCTS,
  getDefaultReviewsForProduct,
  type ProductReview,
} from '../data/catalog';
import {
  formatToman,
  getProductGallery,
  getProductSku,
  getRelatedProducts,
  getSizeMeasurements,
  toPersianDigits,
  type Product,
} from '../utils/store';
import { SafeImage } from './MotionPrimitives';
import { ProductCard } from './ProductCard';

type DetailTab = 'specs' | 'sizing' | 'care' | 'reviews';

interface ProductPageProps {
  product: Product;
  isWishlisted: boolean;
  wishlistIds: string[];
  onBack: () => void;
  onSelectCategory: (slug: string) => void;
  onOpenProduct: (product: Product) => void;
  onToggleWishlist: (productId: string) => void;
  onAddToCart: (
    product: Product,
    colorName: string,
    sizeName: string,
    quantity?: number,
  ) => void;
  onQuickCheckout: (
    product: Product,
    colorName: string,
    sizeName: string,
    quantity: number,
  ) => void;
}

export function ProductPage({
  product,
  isWishlisted,
  wishlistIds,
  onBack,
  onSelectCategory,
  onOpenProduct,
  onToggleWishlist,
  onAddToCart,
  onQuickCheckout,
}: ProductPageProps) {
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [colorIdx, setColorIdx] = useState(0);
  const [sizeIdx, setSizeIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<DetailTab>('specs');
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const [reviewsByProduct, setReviewsByProduct] = useState<
    Record<string, ProductReview[]>
  >({});
  const [reviewAuthor, setReviewAuthor] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const detailsRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setSelectedImageIdx(0);
    setColorIdx(0);
    setSizeIdx(0);
    setQuantity(1);
    setActiveTab('specs');
    setSizeGuideOpen(false);
    setZoomOpen(false);
    setJustAdded(false);
    setReviewError(null);
    setReviewSuccess(false);
  }, [product.id]);

  const gallery = useMemo(
    () =>
      getProductGallery(product, {
        fabric: IMAGES.cashmereMacro,
        tailor: IMAGES.atelierHands,
        editorial:
          product.categorySlug === 'shawl'
            ? IMAGES.bronzeScarf
            : IMAGES.heroCourtyard,
      }),
    [product],
  );

  const activeGalleryItem = gallery[selectedImageIdx] ?? gallery[0];
  const sku = useMemo(() => getProductSku(product), [product]);
  const sizeChart = useMemo(
    () => getSizeMeasurements(product.categorySlug),
    [product.categorySlug],
  );
  const relatedProducts = useMemo(
    () => getRelatedProducts(PRODUCTS, product, 4),
    [product],
  );

  const reviews = useMemo(
    () => reviewsByProduct[product.id] ?? getDefaultReviewsForProduct(product),
    [reviewsByProduct, product],
  );

  const averageRating = useMemo(() => {
    if (product.rating && !reviewsByProduct[product.id]) {
      return product.rating;
    }
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return reviews.length > 0 ? Number((sum / reviews.length).toFixed(1)) : 4.9;
  }, [product.rating, reviews, reviewsByProduct]);

  const totalReviewDisplayCount =
    (product.reviewCount ?? 24) +
    (reviewsByProduct[product.id]
      ? reviewsByProduct[product.id].length -
        getDefaultReviewsForProduct(product).length
      : 0);

  const chosenColor =
    product.colors[colorIdx]?.name ?? product.colors[0]?.name ?? 'اصلی';
  const chosenSize =
    product.sizes[sizeIdx] ?? product.sizes[0] ?? 'فری سایز';

  const handlePrimaryAdd = () => {
    onAddToCart(product, chosenColor, chosenSize, quantity);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1600);
  };

  const handleJumpToReviews = () => {
    setActiveTab('reviews');
    detailsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewAuthor.trim() || reviewComment.trim().length < 8) {
      setReviewError(
        'لطفاً نام خود و دیدگاهی حداقل ۸ کاراکتری درباره کیفیت یا تن‌خور بنویسید.',
      );
      return;
    }
    setReviewError(null);
    const newEntry: ProductReview = {
      id: `${product.id}-rev-${Date.now()}`,
      author: reviewAuthor.trim(),
      date: 'هم‌اکنون',
      rating: reviewRating,
      verifiedColor: chosenColor,
      verifiedSize: chosenSize,
      comment: reviewComment.trim(),
    };
    setReviewsByProduct((prev) => ({
      ...prev,
      [product.id]: [newEntry, ...(prev[product.id] ?? getDefaultReviewsForProduct(product))],
    }));
    setReviewAuthor('');
    setReviewComment('');
    setReviewRating(5);
    setReviewSuccess(true);
    setTimeout(() => setReviewSuccess(false), 3000);
  };

  const savingsAmount =
    product.originalPrice && product.originalPrice > product.price
      ? product.originalPrice - product.price
      : 0;

  return (
    <div
      data-testid="product-page"
      data-product-id={product.id}
      className="bg-[#FAF5F0] pb-24 lg:pb-16"
    >
      {/* Breadcrumb & Back Bar */}
      <div className="border-b border-[#EDE0D4] bg-[#FBF7F3]">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3">
          <nav
            aria-label="مسیر راهنما"
            className="flex items-center flex-wrap gap-2 text-xs text-[#8D7B70]"
          >
            <button
              type="button"
              onClick={onBack}
              className="hover:text-[#8A5026] transition-colors cursor-pointer"
            >
              خانه مد شوک
            </button>
            <span aria-hidden="true">/</span>
            <button
              type="button"
              onClick={() => onSelectCategory(product.categorySlug)}
              className="hover:text-[#8A5026] transition-colors cursor-pointer"
            >
              {product.category}
            </button>
            <span aria-hidden="true">/</span>
            <span className="text-[#241A14] font-semibold truncate max-w-[220px] sm:max-w-none">
              {product.title}
            </span>
          </nav>

          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5C3D28] hover:text-[#8A5026] transition-colors cursor-pointer"
          >
            <ArrowRight className="w-4 h-4" />
            <span>بازگشت به فروشگاه</span>
          </button>
        </div>
      </div>

      {/* Main Two-Column Contiguous PDP Hero */}
      <section className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10 pb-12 sm:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Gallery Column */}
          <div className="lg:col-span-6 xl:col-span-7 lg:sticky lg:top-24 space-y-3.5">
            <div className="relative rounded-[28px] overflow-hidden bg-[#EFE4DA] border border-[#E6D7C9] shadow-[0_14px_40px_rgba(36,26,20,0.07)] aspect-[4/4.35] sm:aspect-[4/4] lg:aspect-auto lg:h-[520px] xl:h-[565px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeGalleryItem.id}
                  initial={{ opacity: 0.35, scale: 1.015 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0.35 }}
                  transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full h-full"
                >
                  <SafeImage
                    src={activeGalleryItem.src}
                    alt={activeGalleryItem.alt}
                    className="w-full h-full object-cover object-top"
                  />
                </motion.div>
              </AnimatePresence>

              {/* Corner Badge */}
              {product.discountPercent ? (
                <span className="pointer-events-none absolute top-4 right-4 px-3.5 py-1.5 rounded-full bg-[#C1382F] text-white text-xs font-bold shadow-sm tabular-nums-fa">
                  {toPersianDigits(product.discountPercent)}٪ تخفیف ویژه
                </span>
              ) : product.badge ? (
                <span className="pointer-events-none absolute top-4 right-4 px-3.5 py-1.5 rounded-full bg-[#241A14]/90 text-[#F8EBDD] text-xs font-semibold shadow-sm">
                  {product.badge}
                </span>
              ) : null}

              {/* Top-left Wishlist Button */}
              <button
                type="button"
                onClick={() => onToggleWishlist(product.id)}
                aria-label={
                  isWishlisted
                    ? `حذف ${product.title} از علاقه‌مندی‌ها`
                    : `افزودن ${product.title} به علاقه‌مندی‌ها`
                }
                className="absolute top-4 left-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm border border-[#EADCD0] flex items-center justify-center text-[#49372C] hover:scale-105 transition-transform shadow-sm cursor-pointer"
              >
                <Heart
                  className={`w-4.5 h-4.5 ${
                    isWishlisted ? 'fill-[#C1382F] text-[#C1382F]' : ''
                  }`}
                />
              </button>

              {/* Bottom-left Lightbox Expand Trigger */}
              <button
                type="button"
                onClick={() => setZoomOpen(true)}
                aria-label="بزرگ‌نمایی تصویر محصول"
                className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white/92 backdrop-blur-sm border border-[#EADCD0] text-[11px] font-semibold text-[#241A14] hover:bg-white shadow-sm cursor-pointer"
              >
                <Expand className="w-3.5 h-3.5 text-[#8A5026]" />
                <span>بزرگ‌نمایی</span>
              </button>

              {/* Bottom-right Active Caption */}
              <span className="pointer-events-none absolute bottom-4 right-4 px-3 py-1.5 rounded-full bg-[#241A14]/75 backdrop-blur-sm text-white text-[11px] font-medium">
                {activeGalleryItem.caption}
              </span>
            </div>

            {/* Thumbnail Strip */}
            <div className="grid grid-cols-4 gap-2 sm:gap-3.5">
              {gallery.map((item, idx) => {
                const isSelected = idx === selectedImageIdx;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedImageIdx(idx)}
                    aria-label={`نمایش ${item.caption}`}
                    aria-pressed={isSelected}
                    className={`group rounded-2xl overflow-hidden border text-right transition-all cursor-pointer bg-white ${
                      isSelected
                        ? 'border-[#8A5026] ring-2 ring-[#8A5026]/25 shadow-sm'
                        : 'border-[#EAE0D7] opacity-80 hover:opacity-100'
                    }`}
                  >
                    <div className="aspect-[4/3.6] overflow-hidden bg-[#F5ECE3]">
                      <SafeImage
                        src={item.src}
                        alt={item.alt}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <p
                      className={`px-1.5 py-1.5 text-[10px] sm:text-[11px] whitespace-nowrap text-center ${
                        isSelected
                          ? 'text-[#8A5026] font-bold'
                          : 'text-[#7C6E66] font-medium'
                      }`}
                    >
                      {item.caption}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sticky Purchase & Configurator Column */}
          <div className="lg:col-span-6 xl:col-span-5 lg:sticky lg:top-24 bg-white rounded-[28px] border border-[#EFE3D8] shadow-[0_12px_34px_rgba(36,26,20,0.045)] p-6 sm:p-8 text-right space-y-6">
            {/* Zero-Pill Unboxed Metadata Line */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#8D7B70]">
              <span className="font-semibold text-[#8A5026]">
                {product.category}
              </span>
              <span aria-hidden="true">·</span>
              <span className="font-mono text-[11px] tracking-wider text-[#7A685E]">
                کد: {sku}
              </span>
              <span aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-1.5 text-[#497353] font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-[#52895F]" />
                <span>آماده ارسال از آتلیه</span>
              </span>
            </div>

            {/* Product Title + Rating */}
            <div className="space-y-2.5">
              <h1 className="text-2xl sm:text-[28px] font-extrabold text-[#241A14] leading-snug">
                {product.title}
              </h1>

              <div className="flex flex-wrap items-center gap-3 text-xs">
                <button
                  type="button"
                  onClick={handleJumpToReviews}
                  className="inline-flex items-center gap-1.5 text-[#4C392E] hover:text-[#8A5026] transition-colors cursor-pointer tabular-nums-fa"
                >
                  <div className="flex items-center gap-0.5 text-[#C78839]">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className="w-3.5 h-3.5 fill-[#C78839] text-[#C78839]"
                      />
                    ))}
                  </div>
                  <span className="font-bold text-[#241A14]">
                    {toPersianDigits(averageRating.toFixed(1))}
                  </span>
                  <span className="text-[#8D7B70] underline decoration-[#D8C5B4] underline-offset-4">
                    ({toPersianDigits(totalReviewDisplayCount)} دیدگاه خریداران)
                  </span>
                </button>
              </div>
            </div>

            {/* Pricing Block */}
            <div className="pt-4 border-t border-[#F4EAE1] flex flex-wrap items-baseline justify-between gap-3">
              <div>
                {product.originalPrice && (
                  <p className="text-xs text-[#A39287] line-through tabular-nums-fa mb-0.5">
                    {formatToman(product.originalPrice)}
                  </p>
                )}
                <p
                  data-testid="pdp-price"
                  className="text-2xl sm:text-[26px] font-extrabold text-[#241A14] tabular-nums-fa"
                >
                  {formatToman(product.price)}
                </p>
              </div>

              <div className="text-left sm:text-right text-[11px] space-y-0.5">
                {savingsAmount > 0 && (
                  <p className="text-[#B53D34] font-bold tabular-nums-fa">
                    سود شما: {formatToman(savingsAmount)}
                  </p>
                )}
                <p className="text-[#46704F] font-medium">
                  {product.price * quantity >= 3000000
                    ? 'ارسال VIP رایگان شامل این سفارش است ✓'
                    : 'ارسال رایگان برای خرید بالای ۳ میلیون تومان'}
                </p>
              </div>
            </div>

            {/* Editorial Narrative & Fabric */}
            <div className="space-y-3">
              <p className="text-xs sm:text-sm text-[#5F4F45] leading-7">
                {product.fullDescription}
              </p>
              <div className="flex items-center gap-2 text-xs text-[#4C392E] pt-1">
                <Scissors className="w-4 h-4 text-[#8A5026] shrink-0" />
                <span>
                  <strong className="font-bold">جنس و الیاف:</strong>{' '}
                  {product.material}
                </span>
              </div>
            </div>

            {/* Color Swatches */}
            <div className="space-y-2.5 pt-2 border-t border-[#F4EAE1]">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#241A14]">
                  انتخاب رنگ:{' '}
                  <span className="text-[#8A5026] font-semibold">
                    {chosenColor}
                  </span>
                </span>
                <span className="text-[11px] text-[#8D7B70] tabular-nums-fa">
                  {toPersianDigits(product.colors.length)} طیف رنگی
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {product.colors.map((c, idx) => {
                  const active = colorIdx === idx;
                  return (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => setColorIdx(idx)}
                      aria-label={`انتخاب رنگ ${c.name}`}
                      aria-pressed={active}
                      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs transition-all cursor-pointer ${
                        active
                          ? 'border-[#8A5026] bg-[#FAF3EC] text-[#241A14] font-semibold shadow-xs'
                          : 'border-[#E7D9CC] bg-white text-[#6A594F] hover:border-[#C7AC95]'
                      }`}
                    >
                      <span
                        className="w-4 h-4 rounded-full border border-black/15 shrink-0"
                        style={{ backgroundColor: c.hex }}
                      />
                      <span>{c.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Size Selection + Size Guide Trigger */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#241A14]">
                  انتخاب سایز:{' '}
                  <span className="text-[#8A5026] font-semibold tabular-nums-fa">
                    {chosenSize}
                  </span>
                </span>
                <button
                  type="button"
                  onClick={() => setSizeGuideOpen(true)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#8A5026] hover:underline cursor-pointer"
                >
                  <Ruler className="w-3.5 h-3.5" />
                  <span>راهنمای سایزبندی</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size, idx) => {
                  const active = sizeIdx === idx;
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSizeIdx(idx)}
                      aria-pressed={active}
                      className={`min-w-[56px] px-4 py-2 rounded-full text-xs font-semibold border transition-colors cursor-pointer tabular-nums-fa ${
                        active
                          ? 'bg-[#241A14] text-white border-[#241A14]'
                          : 'bg-white text-[#4C392E] border-[#E4D4C5] hover:border-[#8A5026]'
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity & Primary Purchase CTAs */}
            <div className="pt-3 space-y-3">
              <div className="flex items-center gap-3">
                {/* Quantity Stepper */}
                <div className="h-12 px-2 rounded-full bg-[#FAF4EE] border border-[#E6D6C7] flex items-center gap-2.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    aria-label="افزایش تعداد سفارش"
                    className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#241A14] hover:bg-[#F3E6DA] transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                  <span
                    data-testid="pdp-quantity"
                    className="w-5 text-center text-sm font-bold text-[#241A14] tabular-nums-fa"
                  >
                    {toPersianDigits(quantity)}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    aria-label="کاهش تعداد سفارش"
                    className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#241A14] hover:bg-[#F3E6DA] transition-colors cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Primary CTA */}
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={handlePrimaryAdd}
                  className={`flex-1 h-12 rounded-full text-white text-sm font-semibold shadow-md flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                    justAdded
                      ? 'bg-[#46704F]'
                      : 'bg-gradient-to-l from-[#7E4821] to-[#985A2D] hover:from-[#6A3B19] hover:to-[#824B23]'
                  }`}
                >
                  {justAdded ? (
                    <>
                      <Check className="w-4.5 h-4.5" />
                      <span>به سبد خرید اضافه شد</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4.5 h-4.5" />
                      <span>افزودن به سبد خرید</span>
                    </>
                  )}
                </motion.button>
              </div>

              {/* Secondary Quick Checkout + Wishlist Row */}
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() =>
                    onQuickCheckout(product, chosenColor, chosenSize, quantity)
                  }
                  className="flex-1 h-11 rounded-full bg-[#FAF4EE] hover:bg-[#F2E5D8] border border-[#E5D3C2] text-[#5C3A23] text-xs font-bold transition-colors cursor-pointer"
                >
                  خرید فوری و مشاهده سبد
                </button>

                <button
                  type="button"
                  onClick={() => onToggleWishlist(product.id)}
                  aria-label="نشان کردن در علاقه‌مندی‌ها"
                  className={`h-11 px-4 rounded-full border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    isWishlisted
                      ? 'bg-[#FBEAE8] border-[#F0C8C3] text-[#B53D34]'
                      : 'bg-white border-[#E5D4C4] text-[#4C392E] hover:border-[#8A5026]'
                  }`}
                >
                  <Heart
                    className={`w-4 h-4 ${
                      isWishlisted ? 'fill-[#C1382F] text-[#C1382F]' : ''
                    }`}
                  />
                  <span>{isWishlisted ? 'نشان‌شده' : 'نشان کردن'}</span>
                </button>
              </div>
            </div>

            {/* Compact Atelier Guarantees Grid */}
            <div className="grid grid-cols-2 gap-2.5 pt-4 border-t border-[#F4EAE1] text-[11px]">
              <div className="rounded-2xl bg-[#FAF6F2] border border-[#EFE3D8] p-3 flex items-start gap-2">
                <Truck className="w-4 h-4 text-[#8A5026] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-[#241A14]">ارسال اکسپرس</p>
                  <p className="text-[#8D7B70] mt-0.5">۲ ساعته تهران، ۴۸ ساعته ایران</p>
                </div>
              </div>
              <div className="rounded-2xl bg-[#FAF6F2] border border-[#EFE3D8] p-3 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-[#8A5026] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-[#241A14]">شناسنامه اصالت</p>
                  <p className="text-[#8D7B70] mt-0.5">گارانتی ۳ ساله عدم پرزدهی</p>
                </div>
              </div>
              <div className="rounded-2xl bg-[#FAF6F2] border border-[#EFE3D8] p-3 flex items-start gap-2">
                <RefreshCw className="w-4 h-4 text-[#8A5026] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-[#241A14]">۷ روز تعویض سایز</p>
                  <p className="text-[#8D7B70] mt-0.5">بدون قید و شرط با پیک آتلیه</p>
                </div>
              </div>
              <div className="rounded-2xl bg-[#FAF6F2] border border-[#EFE3D8] p-3 flex items-start gap-2">
                <Package className="w-4 h-4 text-[#8A5026] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-[#241A14]">بسته‌بندی VIP</p>
                  <p className="text-[#8D7B70] mt-0.5">باکس اختصاصی و کاور تنفس‌پذیر</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Editorial Tabs Section (Specs / Size Chart / Care / Reviews) */}
      <section
        id="pdp-details"
        ref={detailsRef}
        className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 pb-14 sm:pb-16"
      >
        <div className="bg-white rounded-[28px] border border-[#EFE3D8] shadow-[0_10px_30px_rgba(36,26,20,0.035)] overflow-hidden">
          {/* Tab Header */}
          <div
            role="tablist"
            aria-label="جزئیات تکمیلی محصول"
            className="flex items-center gap-2 overflow-x-auto no-scrollbar border-b border-[#EFE3D8] px-4 sm:px-8 pt-4"
          >
            {(
              [
                { id: 'specs', label: 'مشخصات و متریال' },
                { id: 'sizing', label: 'جدول سایزبندی' },
                { id: 'care', label: 'نگهداری و شستشو' },
                {
                  id: 'reviews',
                  label: `دیدگاه مشتریان (${toPersianDigits(reviews.length)})`,
                },
              ] as { id: DetailTab; label: string }[]
            ).map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative px-4 sm:px-5 pb-3.5 pt-2 text-xs sm:text-sm font-bold whitespace-nowrap transition-colors cursor-pointer ${
                    active
                      ? 'text-[#8A5026]'
                      : 'text-[#8D7B70] hover:text-[#241A14]'
                  }`}
                >
                  {tab.label}
                  {active && (
                    <motion.span
                      layoutId="pdp-tab-indicator"
                      className="absolute bottom-0 inset-x-3 h-[2.5px] rounded-full bg-[#8A5026]"
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Tab Panel Content */}
          <div className="p-6 sm:p-8 lg:p-10 text-right">
            {activeTab === 'specs' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7 space-y-4">
                  <h2 className="text-lg sm:text-xl font-extrabold text-[#241A14]">
                    شناسنامه فنی و اصالت بافت آتلیه شوک
                  </h2>
                  <p className="text-xs sm:text-sm text-[#6B5A50] leading-7">
                    هر قطعه از کالکشن شوک پیش از عرضه در ویترین، زیر نظر استادکاران الگوساز از نظر ایستایی سرشانه، تقارن نقوش و استحکام مغزی‌دوزی‌های داخلی بازبینی می‌شود.
                  </p>

                  <dl className="divide-y divide-[#F2E8DF] border border-[#EFE3D8] rounded-2xl overflow-hidden text-xs sm:text-sm">
                    <div className="grid grid-cols-3 bg-[#FAF6F2] px-4 py-3">
                      <dt className="font-semibold text-[#7A685E]">جنس و الیاف</dt>
                      <dd className="col-span-2 font-bold text-[#241A14]">{product.material}</dd>
                    </div>
                    <div className="grid grid-cols-3 bg-white px-4 py-3">
                      <dt className="font-semibold text-[#7A685E]">دسته‌بندی کالکشن</dt>
                      <dd className="col-span-2 text-[#241A14]">{product.category}</dd>
                    </div>
                    <div className="grid grid-cols-3 bg-[#FAF6F2] px-4 py-3">
                      <dt className="font-semibold text-[#7A685E]">طیف رنگ موجود</dt>
                      <dd className="col-span-2 text-[#241A14]">
                        {product.colors.map((c) => c.name).join('، ')}
                      </dd>
                    </div>
                    <div className="grid grid-cols-3 bg-white px-4 py-3">
                      <dt className="font-semibold text-[#7A685E]">دوخت و پرداخت</dt>
                      <dd className="col-span-2 text-[#241A14]">
                        دست‌دوز آتلیه با مغزی‌دوزی ابریشمی داخلی
                      </dd>
                    </div>
                    <div className="grid grid-cols-3 bg-[#FAF6F2] px-4 py-3">
                      <dt className="font-semibold text-[#7A685E]">کد شناسنامه اثر</dt>
                      <dd className="col-span-2 font-mono text-[#8A5026]">{sku}</dd>
                    </div>
                  </dl>
                </div>

                <div className="lg:col-span-5">
                  <div className="rounded-3xl overflow-hidden border border-[#EAE0D7] bg-[#221914] text-white">
                    <div className="aspect-[16/10] overflow-hidden">
                      <SafeImage
                        src={IMAGES.atelierHands}
                        alt="جزئیات دوخت دستی آتلیه شوک"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-5 space-y-2">
                      <div className="flex items-center gap-2 text-xs text-[#E2B284]">
                        <Sparkles className="w-4 h-4" />
                        <span>دوخت سفارشی ۴۸ ساعته</span>
                      </div>
                      <p className="text-xs text-[#D3C5BB] leading-6">
                        در صورت نیاز به اصلاح جزئی قد آستین یا قد کار، همکاران خیاط‌خانه شوک پس از ثبت سفارش با شما هماهنگ می‌کنند.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'sizing' && (
              <div className="space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg sm:text-xl font-extrabold text-[#241A14]">
                      جدول دقیق ابعاد ({product.category})
                    </h2>
                    <p className="text-xs text-[#7D6D63] mt-1">
                      تمام اندازه‌ها بر حسب سانتی‌متر روی الگوی واقعی لباس اندازه‌گیری شده‌اند.
                    </p>
                  </div>
                  <span className="text-xs text-[#8A5026] font-semibold">
                    تلرانس استاندارد دوخت: ۱± سانتی‌متر
                  </span>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-[#EFE3D8]">
                  <table className="w-full text-right text-xs sm:text-sm tabular-nums-fa">
                    <thead className="bg-[#FAF4EE] text-[#4C392E]">
                      <tr>
                        {sizeChart.columns.map((col) => (
                          <th key={col} className="px-4 py-3.5 font-bold whitespace-nowrap">
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F2E8DF] bg-white">
                      {sizeChart.rows.map((row) => (
                        <tr key={row.size} className="hover:bg-[#FDF9F6]">
                          <td className="px-4 py-3 font-extrabold text-[#8A5026]">
                            {row.size}
                          </td>
                          <td className="px-4 py-3 text-[#241A14]">{row.bust}</td>
                          <td className="px-4 py-3 text-[#241A14]">{row.waist}</td>
                          <td className="px-4 py-3 text-[#241A14]">{row.hip}</td>
                          <td className="px-4 py-3 text-[#241A14]">{row.length}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'care' && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-lg sm:text-xl font-extrabold text-[#241A14]">
                    اصول نگهداری برای ماندگاری سال‌ها زیبایی
                  </h2>
                  <p className="text-xs sm:text-sm text-[#7D6D63] mt-1">
                    رعایت این چهار نکته ساده، درخشش بافت {product.material} را برای سالیان طولانی حفظ می‌کند.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {CARE_GUIDES.map((guide, index) => (
                    <div
                      key={guide.title}
                      className="rounded-2xl bg-[#FAF6F2] border border-[#EFE3D8] p-5 flex items-start gap-3.5"
                    >
                      <span className="w-8 h-8 rounded-full bg-[#8A5026] text-white text-xs font-bold flex items-center justify-center shrink-0 tabular-nums-fa">
                        {toPersianDigits(index + 1)}
                      </span>
                      <div>
                        <h3 className="text-sm font-bold text-[#241A14] mb-1">
                          {guide.title}
                        </h3>
                        <p className="text-xs text-[#6B5A50] leading-6">
                          {guide.detail}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Reviews List */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#F2E8DF]">
                    <div>
                      <h2 className="text-lg sm:text-xl font-extrabold text-[#241A14]">
                        تجربه خریداران تاییدشده
                      </h2>
                      <p className="text-xs text-[#8D7B70] mt-0.5 tabular-nums-fa">
                        میانگین امتیاز {toPersianDigits(averageRating.toFixed(1))} از ۵
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-[#C78839]">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 fill-[#C78839] text-[#C78839]"
                        />
                      ))}
                    </div>
                  </div>

                  {reviews.map((rev) => (
                    <article
                      key={rev.id}
                      className="rounded-2xl bg-[#FAF6F2] border border-[#EFE3D8] p-5 space-y-2.5"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <span className="w-8 h-8 rounded-full bg-[#EFE0D2] text-[#7A4723] text-xs font-bold flex items-center justify-center">
                            {rev.author.slice(0, 1)}
                          </span>
                          <div>
                            <p className="text-xs font-bold text-[#241A14]">
                              {rev.author}
                            </p>
                            <p className="text-[11px] text-[#8D7B70]">
                              رنگ: {rev.verifiedColor} · سایز: {rev.verifiedSize}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-0.5 text-[#C78839]">
                            {Array.from({ length: rev.rating }).map((_, idx) => (
                              <Star
                                key={idx}
                                className="w-3 h-3 fill-[#C78839] text-[#C78839]"
                              />
                            ))}
                          </div>
                          <span className="text-[11px] text-[#8D7B70]">{rev.date}</span>
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm text-[#4C392E] leading-7">
                        {rev.comment}
                      </p>
                    </article>
                  ))}
                </div>

                {/* Add Review Form */}
                <form
                  onSubmit={handleSubmitReview}
                  className="lg:col-span-5 rounded-3xl bg-[#FAF6F2] border border-[#E8D8C9] p-5 sm:p-6 space-y-4"
                >
                  <div>
                    <h3 className="text-sm sm:text-base font-extrabold text-[#241A14]">
                      ثبت دیدگاه شما درباره این اثر
                    </h3>
                    <p className="text-[11px] text-[#8D7B70] mt-0.5">
                      تجربه خود از کیفیت دوخت و سایز را با سایر همراهان شوک به اشتراک بگذارید.
                    </p>
                  </div>

                  <div>
                    <label
                      htmlFor="pdp-review-author"
                      className="block text-xs font-semibold text-[#4C392E] mb-1.5"
                    >
                      نام شما
                    </label>
                    <input
                      id="pdp-review-author"
                      type="text"
                      value={reviewAuthor}
                      onChange={(e) => setReviewAuthor(e.target.value)}
                      placeholder="مثلاً مینا راد"
                      className="w-full h-10 px-3.5 rounded-xl bg-white border border-[#E2D1C1] text-xs focus:outline-none focus:border-[#8A5026]"
                    />
                  </div>

                  <div>
                    <span className="block text-xs font-semibold text-[#4C392E] mb-1.5">
                      امتیاز شما
                    </span>
                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewRating(star)}
                          aria-label={`امتیاز ${toPersianDigits(star)} ستاره`}
                          className="p-1 cursor-pointer"
                        >
                          <Star
                            className={`w-5 h-5 transition-colors ${
                              star <= reviewRating
                                ? 'fill-[#C78839] text-[#C78839]'
                                : 'text-[#D6C6B8]'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="pdp-review-comment"
                      className="block text-xs font-semibold text-[#4C392E] mb-1.5"
                    >
                      دیدگاه شما
                    </label>
                    <textarea
                      id="pdp-review-comment"
                      rows={3}
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="درباره ایستایی، کیفیت پارچه یا دقت سایز بنویسید..."
                      className="w-full p-3.5 rounded-xl bg-white border border-[#E2D1C1] text-xs focus:outline-none focus:border-[#8A5026]"
                    />
                  </div>

                  {reviewError && (
                    <p role="alert" className="text-xs text-[#B53D34] font-medium">
                      {reviewError}
                    </p>
                  )}

                  {reviewSuccess && (
                    <p role="status" className="text-xs text-[#46704F] font-semibold">
                      دیدگاه ارزشمند شما با موفقیت ثبت شد ✓
                    </p>
                  )}

                  <button
                    type="submit"
                    className="w-full h-11 rounded-full bg-[#241A14] hover:bg-[#3A2B22] text-white text-xs font-semibold transition-colors cursor-pointer"
                  >
                    ارسال دیدگاه
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Related Products Grid */}
      <section className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="flex items-end justify-between gap-4 mb-7">
          <div className="text-right">
            <p className="text-[11px] font-medium text-[#9D8576] mb-1">
              پیشنهاد استایلیست‌های شوک
            </p>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#241A14]">
              آثار هم‌نشین و پیشنهادی آتلیه
            </h2>
          </div>

          <button
            type="button"
            onClick={() => onSelectCategory(product.categorySlug)}
            className="text-xs font-semibold text-[#8A5026] hover:underline cursor-pointer whitespace-nowrap"
          >
            مشاهده همه در {product.category}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {relatedProducts.map((rel) => (
            <ProductCard
              key={rel.id}
              product={rel}
              variant={rel.section}
              isWishlisted={wishlistIds.includes(rel.id)}
              onToggleWishlist={onToggleWishlist}
              onOpenProduct={onOpenProduct}
              onQuickAdd={(p, c) => onAddToCart(p, c, p.sizes[0] ?? 'فری سایز', 1)}
            />
          ))}
        </div>
      </section>

      {/* Mobile Sticky Bottom Buy Bar (<= 15% viewport height) */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-[#FDF9F6]/95 backdrop-blur-md border-t border-[#EADCD0] px-4 py-2.5 shadow-[0_-8px_24px_rgba(36,26,20,0.08)]">
        <div className="max-w-lg mx-auto flex items-center justify-between gap-3">
          <div className="text-right">
            <p className="text-[11px] text-[#8D7B70] truncate max-w-[150px]">
              {chosenColor} · سایز {chosenSize}
            </p>
            <p className="text-sm font-extrabold text-[#241A14] tabular-nums-fa">
              {formatToman(product.price * quantity)}
            </p>
          </div>
          <button
            type="button"
            onClick={handlePrimaryAdd}
            className={`h-10 px-5 rounded-full text-white text-xs font-semibold shadow-sm flex items-center gap-1.5 shrink-0 cursor-pointer ${
              justAdded
                ? 'bg-[#46704F]'
                : 'bg-gradient-to-l from-[#7E4821] to-[#985A2D]'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{justAdded ? 'اضافه شد ✓' : 'افزودن به سبد'}</span>
          </button>
        </div>
      </div>

      {/* Size Guide Modal */}
      <AnimatePresence>
        {sizeGuideOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSizeGuideOpen(false)}
              className="fixed inset-0 bg-[#1B120C]/55 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              role="dialog"
              aria-modal="true"
              aria-label="راهنمای سایزبندی"
              className="relative z-10 w-full max-w-xl bg-[#FDF9F6] rounded-[28px] border border-[#EADCD0] shadow-2xl p-6 sm:p-7 text-right space-y-4"
            >
              <div className="flex items-center justify-between border-b border-[#EFE3D8] pb-3.5">
                <div className="flex items-center gap-2">
                  <Ruler className="w-4.5 h-4.5 text-[#8A5026]" />
                  <h3 className="text-base font-extrabold text-[#241A14]">
                    راهنمای سایزبندی — {product.category}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSizeGuideOpen(false)}
                  aria-label="بستن راهنمای سایزبندی"
                  className="w-8 h-8 rounded-full hover:bg-[#EFE4DA] flex items-center justify-center text-[#4C392E] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-[#EFE3D8] bg-white">
                <table className="w-full text-right text-xs tabular-nums-fa">
                  <thead className="bg-[#FAF4EE] text-[#4C392E]">
                    <tr>
                      {sizeChart.columns.map((col) => (
                        <th key={col} className="px-3.5 py-3 font-bold whitespace-nowrap">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F2E8DF]">
                    {sizeChart.rows.map((row) => (
                      <tr key={row.size}>
                        <td className="px-3.5 py-2.5 font-extrabold text-[#8A5026]">
                          {row.size}
                        </td>
                        <td className="px-3.5 py-2.5 text-[#241A14]">{row.bust}</td>
                        <td className="px-3.5 py-2.5 text-[#241A14]">{row.waist}</td>
                        <td className="px-3.5 py-2.5 text-[#241A14]">{row.hip}</td>
                        <td className="px-3.5 py-2.5 text-[#241A14]">{row.length}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p className="text-xs text-[#6E5E54] leading-6">
                اگر میان دو سایز تردید دارید یا قصد پوشیدن لباس زیرپالتو ضخیم را دارید، سایز بزرگ‌تر را انتخاب کنید. تعویض سایز تا ۷ روز رایگان است.
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Gallery Lightbox Modal */}
      <AnimatePresence>
        {zoomOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setZoomOpen(false)}
              className="fixed inset-0 bg-[#140D09]/85 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              role="dialog"
              aria-modal="true"
              aria-label={`بزرگ‌نمایی ${product.title}`}
              className="relative z-10 w-full max-w-2xl bg-[#1F1611] rounded-[28px] overflow-hidden border border-white/15 shadow-2xl"
            >
              <button
                type="button"
                onClick={() => setZoomOpen(false)}
                aria-label="بستن بزرگ‌نمایی"
                className="absolute top-4 left-4 z-20 w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="aspect-[4/4.4] max-h-[80vh] w-full bg-[#241A14]">
                <SafeImage
                  src={activeGalleryItem.src}
                  alt={activeGalleryItem.alt}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="px-6 py-3.5 flex items-center justify-between text-xs text-[#E8DACB] border-t border-white/10">
                <span className="font-semibold">{product.title}</span>
                <span className="text-[#C79C75]">{activeGalleryItem.caption}</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
