import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  CreditCard,
  Gift,
  Heart,
  Minus,
  PackageCheck,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Tag,
  Trash2,
  Truck,
} from 'lucide-react';
import { ALL_CATALOG_PRODUCTS } from '../data/catalog';
import {
  calculateAdvancedCartTotals,
  evaluatePromoCode,
  formatToman,
  FREE_SHIPPING_THRESHOLD,
  toPersianDigits,
  validateCheckoutForm,
  type AuthUser,
  type CartItem,
  type Product,
  type ShippingMethod,
} from '../utils/store';
import { SafeImage } from './MotionPrimitives';
import type { OrderReceipt } from './ModalsAndDrawers';

interface CartPageProps {
  items: CartItem[];
  wishlistIds: string[];
  vipApplied: boolean;
  authUser: AuthUser | null;
  onUpdateQty: (key: string, delta: number) => void;
  onClearCart: () => void;
  onAddToCart: (product: Product, color?: string, size?: string, quantity?: number) => void;
  onMoveToWishlist: (item: CartItem) => void;
  onToggleVip: () => void;
  onOpenProduct: (product: Product) => void;
  onSelectCategory: (slug: string) => void;
  onBackHome: () => void;
  onOpenAuthPage: () => void;
  onOrderComplete: (receipt: OrderReceipt) => void;
}

export function CartPage({
  items,
  wishlistIds,
  vipApplied,
  authUser,
  onUpdateQty,
  onClearCart,
  onAddToCart,
  onMoveToWishlist,
  onToggleVip,
  onOpenProduct,
  onSelectCategory,
  onBackHome,
  onOpenAuthPage,
  onOrderComplete,
}: CartPageProps) {
  const [step, setStep] = useState<'cart' | 'checkout'>('cart');
  const [shippingMethod, setShippingMethod] = useState<ShippingMethod>('standard');
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<{
    code: string;
    rate: number;
    label: string;
  } | null>(null);
  const [promoFeedback, setPromoFeedback] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const [giftWrap, setGiftWrap] = useState(false);
  const [atelierNote, setAtelierNote] = useState('');

  // Checkout fields
  const [customerName, setCustomerName] = useState(authUser?.fullName ?? '');
  const [phone, setPhone] = useState(authUser?.contact ?? '');
  const [city, setCity] = useState('تهران');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'cod'>('online');
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [orderReceipt, setOrderReceipt] = useState<OrderReceipt | null>(null);

  useEffect(() => {
    if (authUser) {
      setCustomerName((prev) => prev || authUser.fullName);
      setPhone((prev) => prev || authUser.contact);
    }
  }, [authUser]);

  useEffect(() => {
    if (items.length === 0 && step === 'checkout') {
      setStep('cart');
    }
  }, [items.length, step]);

  const effectiveDiscountRate = appliedPromo
    ? appliedPromo.rate
    : vipApplied
      ? 0.1
      : 0;

  const totals = useMemo(
    () =>
      calculateAdvancedCartTotals({
        items,
        discountRate: effectiveDiscountRate,
        shippingMethod,
      }),
    [items, effectiveDiscountRate, shippingMethod],
  );

  const freeShippingProgress = Math.min(
    100,
    Math.round(
      ((FREE_SHIPPING_THRESHOLD - totals.freeShippingRemaining) /
        FREE_SHIPPING_THRESHOLD) *
        100,
    ),
  );

  const crossSellProducts = useMemo(() => {
    const inCartIds = new Set(items.map((item) => item.product.id));
    const candidates = ALL_CATALOG_PRODUCTS.filter((p) => !inCartIds.has(p.id));
    // Prefer shawls, bags, and popular items to complement orders
    const prioritized = [
      ...candidates.filter((p) => p.categorySlug === 'shawl' || p.categorySlug === 'bag'),
      ...candidates.filter((p) => p.categorySlug !== 'shawl' && p.categorySlug !== 'bag'),
    ];
    return prioritized.slice(0, items.length === 0 ? 4 : 3);
  }, [items]);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const res = evaluatePromoCode(promoInput);
    if (!res.valid) {
      setPromoFeedback({
        type: 'error',
        text: res.error ?? 'کد تخفیف معتبر نیست.',
      });
      return;
    }
    setAppliedPromo({
      code: res.code,
      rate: res.discountRate,
      label: res.label,
    });
    setPromoFeedback({
      type: 'success',
      text: `${res.label} با موفقیت روی سبد شما اعمال شد.`,
    });
    setPromoInput('');
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateCheckoutForm({
      customerName,
      phone,
      address,
    });
    if (!validation.valid) {
      setCheckoutError(validation.error ?? 'لطفاً اطلاعات ارسال را تکمیل کنید.');
      return;
    }
    setCheckoutError(null);
    const num =
      1040 +
      ((customerName.trim().length * 37 + address.trim().length * 19 + totals.itemCount * 11) %
        890);
    const receipt: OrderReceipt = {
      orderNumber: `SH-${num}`,
      customerName: customerName.trim(),
      phone: phone.trim(),
      city,
      total: totals.total,
      itemCount: totals.itemCount,
      date: 'هم‌اکنون',
    };
    setOrderReceipt(receipt);
    setStep('cart');
    onOrderComplete(receipt);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  return (
    <div data-testid="cart-page" className="bg-[#FAF5F0] text-[#241A14]">
      {/* Breadcrumb Strip */}
      <div className="border-b border-[#EBDED3] bg-[#FDF9F6]">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 h-12 flex items-center justify-between gap-4 text-xs">
          <nav
            aria-label="مسیر صفحه"
            className="flex items-center gap-2 text-[#8D7B70] min-w-0"
          >
            <button
              type="button"
              onClick={onBackHome}
              className="hover:text-[#241A14] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              صفحه اصلی
            </button>
            <span aria-hidden="true">/</span>
            <span className="font-semibold text-[#241A14] truncate">
              سبد خرید و تسویه حساب
            </span>
          </nav>

          <button
            type="button"
            onClick={onBackHome}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#7C5236] hover:text-[#241A14] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <ArrowRight className="w-3.5 h-3.5" />
            <span>بازگشت به فروشگاه</span>
          </button>
        </div>
      </div>

      <section className="py-10 sm:py-14">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          {orderReceipt ? (
            /* State A: Completed Order Confirmation */
            <div
              data-testid="cart-order-confirmation"
              className="max-w-2xl mx-auto bg-white rounded-[28px] border border-[#CBE0CC] p-7 sm:p-10 text-center space-y-6"
            >
              <div className="w-16 h-16 rounded-full bg-[#EAF3EC] text-[#3B6642] flex items-center justify-center mx-auto">
                <PackageCheck className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <p className="text-xs font-semibold text-[#3B6642]">
                  سفارش شما با موفقیت در آتلیه شوک ثبت شد
                </p>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#241A14]">
                  سپاس از انتخاب شما، {orderReceipt.customerName}
                </h1>
                <p className="text-xs sm:text-sm text-[#66544A] leading-7">
                  سفارش شما با کد پیگیری{' '}
                  <strong className="text-[#8A5026] font-mono">
                    {orderReceipt.orderNumber}
                  </strong>{' '}
                  در صف آماده‌سازی و بسته‌بندی بیمه‌شده برای ارسال به {orderReceipt.city}{' '}
                  قرار گرفت.
                </p>
              </div>

              <div className="rounded-2xl bg-[#FAF5F0] border border-[#EAE0D7] p-5 text-xs space-y-2.5 text-right">
                <div className="flex justify-between">
                  <span className="text-[#7A685E]">شماره پیگیری سفارش:</span>
                  <span className="font-bold font-mono text-[#241A14]">
                    {orderReceipt.orderNumber}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7A685E]">تعداد اقلام:</span>
                  <span className="font-bold tabular-nums-fa">
                    {toPersianDigits(orderReceipt.itemCount)} کالا
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7A685E]">نحوه ارسال:</span>
                  <span className="font-semibold">
                    {shippingMethod === 'express-tehran'
                      ? 'ارسال فوری ۲ ساعته تهران'
                      : 'ارسال استاندارد بیمه‌شده آتلیه'}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-[#E6D8CB]">
                  <span className="font-bold text-[#241A14]">مبلغ نهایی پرداختی:</span>
                  <span className="font-extrabold text-[#8A5026] tabular-nums-fa">
                    {formatToman(orderReceipt.total)}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setOrderReceipt(null);
                    onOpenAuthPage();
                  }}
                  className="h-11 px-6 rounded-full bg-[#241A14] text-white hover:bg-[#3A2A21] text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  مشاهده در حساب کاربری
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setOrderReceipt(null);
                    onBackHome();
                  }}
                  className="h-11 px-6 rounded-full bg-[#FAF5F0] border border-[#E5D6C8] text-[#5B3D2A] hover:bg-[#F2E6DA] text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  بازگشت به صفحه اصلی
                </button>
              </div>
            </div>
          ) : items.length === 0 ? (
            /* State B: Empty Cart + Curated Starter Suggestions */
            <div className="space-y-12">
              <div
                data-testid="cart-empty-state"
                className="bg-white rounded-[28px] border border-[#E8DACD] p-8 sm:p-12 text-center max-w-3xl mx-auto"
              >
                <div className="w-16 h-16 rounded-full bg-[#F5EAE0] text-[#8A5026] flex items-center justify-center mx-auto mb-5">
                  <ShoppingBag className="w-7 h-7" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#241A14] mb-2.5">
                  سبد خرید شما در حال حاضر خالی است
                </h1>
                <p className="text-xs sm:text-sm text-[#7A685E] max-w-md mx-auto leading-7 mb-6">
                  آثار دست‌دوز پاییز و زمستان شوک را مرور کنید و پالتو، مانتو یا اکسسوری‌های
                  چرم طبیعی مورد علاقه خود را به سبد بیفزایید.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => onSelectCategory('all')}
                    className="h-11 px-7 rounded-full bg-gradient-to-l from-[#7E4821] to-[#985A2D] hover:from-[#6A3B19] hover:to-[#824B23] text-white text-xs sm:text-sm font-semibold shadow-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    مشاهده همه کالکشن‌ها
                  </button>
                  <button
                    type="button"
                    onClick={() => onSelectCategory('vip')}
                    className="h-11 px-6 rounded-full bg-[#FAF5F0] border border-[#E5D6C8] text-[#5B3D2A] hover:bg-[#F2E6DA] text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    تخفیف‌های فصلی VIP
                  </button>
                </div>
              </div>

              {/* Starter Cross-Sell Grid */}
              <div>
                <div className="flex items-end justify-between mb-6 text-right">
                  <div>
                    <p className="text-xs font-medium text-[#9D8576] mb-1">
                      انتخاب‌های محبوب آتلیه
                    </p>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-[#241A14]">
                      پیشنهادهایی برای آغاز خرید شما
                    </h2>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {crossSellProducts.map((product) => (
                    <article
                      key={product.id}
                      className="bg-white rounded-[24px] border border-[#E8DACD] overflow-hidden flex flex-col justify-between text-right"
                    >
                      <button
                        type="button"
                        onClick={() => onOpenProduct(product)}
                        className="block w-full h-56 overflow-hidden bg-[#F4EAE0] cursor-pointer"
                      >
                        <SafeImage
                          src={product.image}
                          alt={product.title}
                          eager
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </button>

                      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                        <div>
                          <p className="text-[11px] text-[#8D7B70] mb-1">
                            {product.category}
                          </p>
                          <button
                            type="button"
                            onClick={() => onOpenProduct(product)}
                            className="text-sm font-bold text-[#241A14] hover:text-[#8A5026] text-right transition-colors cursor-pointer"
                          >
                            {product.title}
                          </button>
                        </div>

                        <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#F4EAE2]">
                          <span className="text-xs font-extrabold text-[#8A5026] tabular-nums-fa">
                            {formatToman(product.price)}
                          </span>
                          <button
                            type="button"
                            onClick={() => onAddToCart(product)}
                            className="h-9 px-3.5 rounded-full bg-[#241A14] hover:bg-[#8A5026] text-white text-[11px] font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                          >
                            + افزودن به سبد
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* State C: Populated Cart + Summary & Inline Checkout */
            <div className="space-y-8">
              {/* Top Heading + Free Shipping Progress */}
              <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                <div className="text-right">
                  <p className="text-xs font-medium text-[#8A5026] mb-1.5">
                    مرور اقلام انتخابی و تکمیل خرید
                  </p>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-[#241A14] tabular-nums-fa">
                    سبد خرید شما ({toPersianDigits(totals.itemCount)} کالا)
                  </h1>
                </div>

                {/* Free Shipping Bar */}
                <div className="bg-white rounded-2xl border border-[#E8DACD] px-5 py-3.5 min-w-0 lg:w-[430px] text-right">
                  <div className="flex items-center justify-between gap-2 text-xs mb-2">
                    <span className="inline-flex items-center gap-1.5 font-semibold text-[#241A14]">
                      <Truck className="w-4 h-4 text-[#8A5026] shrink-0" />
                      {totals.freeShippingRemaining === 0 ? (
                        <span className="text-[#3B6642]">
                          ارسال استاندارد بیمه‌شده برای شما رایگان است
                        </span>
                      ) : (
                        <span className="tabular-nums-fa">
                          تا ارسال رایگان:{' '}
                          <strong className="text-[#8A5026]">
                            {formatToman(totals.freeShippingRemaining)}
                          </strong>
                        </span>
                      )}
                    </span>
                    <span className="text-[11px] text-[#8D7B70] tabular-nums-fa">
                      {toPersianDigits(freeShippingProgress)}٪
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#E5D7C9] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-l from-[#7E4821] to-[#A66538] transition-all duration-300"
                      style={{ width: `${freeShippingProgress}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Main 2-Column Cart Split */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Right Column (8 cols): Items & Options OR Checkout Form */}
                <div className="lg:col-span-8 space-y-5">
                  {step === 'cart' ? (
                    <>
                      {/* Toolbar */}
                      <div className="flex items-center justify-between px-1">
                        <span className="text-xs font-semibold text-[#6B5A50]">
                          اقلام آماده ارسال از آتلیه شوک
                        </span>
                        <button
                          type="button"
                          onClick={onClearCart}
                          className="inline-flex items-center gap-1 text-xs font-medium text-[#8D7B70] hover:text-[#B53D34] transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>پاک کردن سبد</span>
                        </button>
                      </div>

                      {/* Item List */}
                      <div className="space-y-4">
                        {items.map((item) => {
                          const isSaved = wishlistIds.includes(item.product.id);
                          return (
                            <article
                              key={item.key}
                              data-testid={`cart-item-${item.product.id}`}
                              className="bg-white rounded-[24px] border border-[#E8DACD] p-4 sm:p-5 flex flex-col sm:flex-row gap-4 sm:gap-5 text-right"
                            >
                              <button
                                type="button"
                                onClick={() => onOpenProduct(item.product)}
                                className="w-full sm:w-28 h-52 sm:h-34 rounded-2xl overflow-hidden bg-[#F4EAE0] shrink-0 cursor-pointer"
                              >
                                <SafeImage
                                  src={item.product.image}
                                  alt={item.product.title}
                                  eager
                                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                />
                              </button>

                              <div className="flex-1 min-w-0 flex flex-col justify-between gap-4">
                                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                                  <div>
                                    <p className="text-[11px] text-[#8D7B70] mb-1">
                                      {item.product.category}
                                    </p>
                                    <button
                                      type="button"
                                      onClick={() => onOpenProduct(item.product)}
                                      className="text-sm sm:text-base font-extrabold text-[#241A14] hover:text-[#8A5026] text-right transition-colors cursor-pointer"
                                    >
                                      {item.product.title}
                                    </button>
                                    <div className="flex flex-wrap items-center gap-2 text-xs text-[#6B5A50] mt-1.5">
                                      <span>رنگ: {item.selectedColor}</span>
                                      <span aria-hidden="true">·</span>
                                      <span>سایز: {item.selectedSize}</span>
                                      <span aria-hidden="true">·</span>
                                      <span className="tabular-nums-fa">
                                        فی: {formatToman(item.product.price)}
                                      </span>
                                    </div>
                                  </div>

                                  <div className="text-right sm:text-left shrink-0">
                                    <p className="text-sm sm:text-base font-extrabold text-[#8A5026] tabular-nums-fa">
                                      {formatToman(item.product.price * item.quantity)}
                                    </p>
                                    {item.product.originalPrice && (
                                      <p className="text-[11px] text-[#A39287] line-through tabular-nums-fa">
                                        {formatToman(
                                          item.product.originalPrice * item.quantity,
                                        )}
                                      </p>
                                    )}
                                  </div>
                                </div>

                                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#F4EAE2]">
                                  {/* Stepper */}
                                  <div className="inline-flex items-center gap-2.5 bg-[#FAF4EE] rounded-full px-2.5 py-1 border border-[#EADCD0]">
                                    <button
                                      type="button"
                                      onClick={() => onUpdateQty(item.key, 1)}
                                      aria-label={`افزایش تعداد ${item.product.title}`}
                                      className="w-7 h-7 rounded-full bg-white hover:bg-[#F2E6DA] flex items-center justify-center text-[#241A14] transition-colors cursor-pointer"
                                    >
                                      <Plus className="w-3.5 h-3.5" />
                                    </button>
                                    <span
                                      data-testid={`cart-item-qty-${item.product.id}`}
                                      className="text-xs font-bold min-w-[20px] text-center tabular-nums-fa"
                                    >
                                      {toPersianDigits(item.quantity)}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => onUpdateQty(item.key, -1)}
                                      aria-label={`کاهش تعداد ${item.product.title}`}
                                      className="w-7 h-7 rounded-full bg-white hover:bg-[#F2E6DA] flex items-center justify-center text-[#241A14] transition-colors cursor-pointer"
                                    >
                                      <Minus className="w-3.5 h-3.5" />
                                    </button>
                                  </div>

                                  <div className="flex items-center gap-3 text-xs">
                                    <button
                                      type="button"
                                      onClick={() => onMoveToWishlist(item)}
                                      className="inline-flex items-center gap-1 text-[#6B5A50] hover:text-[#8A5026] transition-colors whitespace-nowrap cursor-pointer"
                                    >
                                      <Heart
                                        className={`w-3.5 h-3.5 ${
                                          isSaved ? 'fill-[#C1382F] text-[#C1382F]' : ''
                                        }`}
                                      />
                                      <span>انتقال به علاقه‌مندی‌ها</span>
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() =>
                                        onUpdateQty(item.key, -item.quantity)
                                      }
                                      aria-label={`حذف ${item.product.title}`}
                                      className="inline-flex items-center gap-1 text-[#8D7B70] hover:text-[#B53D34] transition-colors whitespace-nowrap cursor-pointer"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                      <span>حذف</span>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </article>
                          );
                        })}
                      </div>

                      {/* Gift Wrap & Atelier Note */}
                      <div className="bg-[#FDF9F6] rounded-[24px] border border-[#E8DACD] p-5 sm:p-6 space-y-4 text-right">
                        <label className="flex items-start gap-3 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={giftWrap}
                            onChange={(e) => setGiftWrap(e.target.checked)}
                            className="w-4 h-4 mt-0.5 rounded accent-[#8A5026] cursor-pointer"
                          />
                          <div className="flex-1">
                            <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#241A14]">
                              <Gift className="w-4 h-4 text-[#8A5026]" />
                              <span>
                                بسته‌بندی هدیه هاردباکس شوک + کارت تبریک دست‌نویس (رایگان)
                              </span>
                            </span>
                            <p className="text-[11px] text-[#7A685E] mt-1">
                              تمام سفارش‌ها با باکس اختصاصی شوک و کاغذ ابریشمی معطر آماده
                              می‌شوند.
                            </p>
                          </div>
                        </label>

                        <div>
                          <label
                            htmlFor="cart-atelier-note"
                            className="block text-xs font-semibold text-[#3F2E23] mb-1.5"
                          >
                            یادداشت برای خیاط آتلیه یا پیام کارت هدیه (اختیاری)
                          </label>
                          <input
                            id="cart-atelier-note"
                            type="text"
                            value={atelierNote}
                            onChange={(e) => setAtelierNote(e.target.value)}
                            placeholder="مثلاً: قد آستین ۲ سانتی‌متر کوتاه‌تر شود یا متن کارت تبریک..."
                            className="w-full h-10 px-4 rounded-xl bg-white border border-[#E5D6C8] text-xs text-[#241A14] placeholder:text-[#A39287] focus:outline-none focus:border-[#8A5026]"
                          />
                        </div>
                      </div>

                      {/* Cross-Sell Complements */}
                      {crossSellProducts.length > 0 && (
                        <div className="pt-2">
                          <h2 className="text-base sm:text-lg font-extrabold text-[#241A14] mb-4 text-right">
                            تکمیل‌کننده استایل انتخابی شما
                          </h2>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {crossSellProducts.map((product) => (
                              <div
                                key={product.id}
                                className="bg-white rounded-[20px] border border-[#E8DACD] p-3 flex items-center gap-3 text-right"
                              >
                                <button
                                  type="button"
                                  onClick={() => onOpenProduct(product)}
                                  className="w-16 h-20 rounded-xl overflow-hidden bg-[#F4EAE0] shrink-0 cursor-pointer"
                                >
                                  <SafeImage
                                    src={product.image}
                                    alt={product.title}
                                    eager
                                    className="w-full h-full object-cover"
                                  />
                                </button>
                                <div className="flex-1 min-w-0">
                                  <button
                                    type="button"
                                    onClick={() => onOpenProduct(product)}
                                    className="text-xs font-bold text-[#241A14] hover:text-[#8A5026] truncate block w-full text-right cursor-pointer"
                                  >
                                    {product.title}
                                  </button>
                                  <p className="text-[11px] font-bold text-[#8A5026] mt-0.5 tabular-nums-fa">
                                    {formatToman(product.price)}
                                  </p>
                                  <button
                                    type="button"
                                    onClick={() => onAddToCart(product)}
                                    className="mt-2 h-7 px-3 rounded-full bg-[#FAF5F0] hover:bg-[#241A14] hover:text-white border border-[#E5D6C8] text-[11px] font-semibold text-[#5B3D2A] transition-colors whitespace-nowrap cursor-pointer"
                                  >
                                    + افزودن
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    /* Step 2: Delivery & Payment Form */
                    <form
                      id="cart-checkout-form"
                      onSubmit={handleCheckoutSubmit}
                      noValidate
                      className="bg-white rounded-[28px] border border-[#E8DACD] p-6 sm:p-8 space-y-5 text-right"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#EFE3D8]">
                        <div>
                          <h2 className="text-lg sm:text-xl font-extrabold text-[#241A14]">
                            مشخصات گیرنده و نشانی ارسال
                          </h2>
                          <p className="text-xs text-[#7A685E] mt-1">
                            تمامی مرسوله‌های شوک با پوشش بیمه کامل و ضمانت تحویل سالم ارسال
                            می‌شوند.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setStep('cart');
                            setCheckoutError(null);
                          }}
                          className="text-xs font-semibold text-[#8A5026] hover:underline whitespace-nowrap cursor-pointer"
                        >
                          بازگشت به ویرایش اقلام سبد
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label
                            htmlFor="cart-checkout-name"
                            className="block text-xs font-semibold text-[#3F2E23] mb-1.5"
                          >
                            نام و نام خانوادگی گیرنده *
                          </label>
                          <input
                            id="cart-checkout-name"
                            type="text"
                            value={customerName}
                            onChange={(e) => {
                              setCustomerName(e.target.value);
                              if (checkoutError) setCheckoutError(null);
                            }}
                            placeholder="مثلاً: مریم ناصری"
                            className="w-full h-11 px-4 rounded-xl bg-[#FAF5F0] border border-[#E5D6C8] text-xs text-[#241A14] placeholder:text-[#A39287] focus:outline-none focus:bg-white focus:border-[#8A5026]"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="cart-checkout-phone"
                            className="block text-xs font-semibold text-[#3F2E23] mb-1.5"
                          >
                            شماره موبایل *
                          </label>
                          <input
                            id="cart-checkout-phone"
                            type="tel"
                            value={phone}
                            onChange={(e) => {
                              setPhone(e.target.value);
                              if (checkoutError) setCheckoutError(null);
                            }}
                            placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                            className="w-full h-11 px-4 rounded-xl bg-[#FAF5F0] border border-[#E5D6C8] text-xs text-[#241A14] placeholder:text-[#A39287] focus:outline-none focus:bg-white focus:border-[#8A5026]"
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="cart-checkout-city"
                          className="block text-xs font-semibold text-[#3F2E23] mb-1.5"
                        >
                          شهر تحویل
                        </label>
                        <select
                          id="cart-checkout-city"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="w-full h-11 px-4 rounded-xl bg-[#FAF5F0] border border-[#E5D6C8] text-xs text-[#241A14] focus:outline-none focus:bg-white focus:border-[#8A5026]"
                        >
                          <option value="تهران">تهران (تحویل اختصاصی ۲ تا ۴ ساعته)</option>
                          <option value="شیراز">شیراز (ارسال هوایی ۲۴ ساعته)</option>
                          <option value="اصفهان">اصفهان (ارسال ۲۴ ساعته)</option>
                          <option value="مشهد">مشهد (ارسال ۴۸ ساعته)</option>
                          <option value="تبریز">تبریز (ارسال ۴۸ ساعته)</option>
                        </select>
                      </div>

                      <div>
                        <label
                          htmlFor="cart-checkout-address"
                          className="block text-xs font-semibold text-[#3F2E23] mb-1.5"
                        >
                          نشانی کامل و کد پستی *
                        </label>
                        <textarea
                          id="cart-checkout-address"
                          rows={3}
                          value={address}
                          onChange={(e) => {
                            setAddress(e.target.value);
                            if (checkoutError) setCheckoutError(null);
                          }}
                          placeholder="خیابان، کوچه، پلاک، واحد و کد پستی..."
                          className="w-full p-3.5 rounded-xl bg-[#FAF5F0] border border-[#E5D6C8] text-xs text-[#241A14] placeholder:text-[#A39287] focus:outline-none focus:bg-white focus:border-[#8A5026]"
                        />
                      </div>

                      <div>
                        <span className="block text-xs font-semibold text-[#3F2E23] mb-2">
                          شیوه پرداخت
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <button
                            type="button"
                            onClick={() => setPaymentMethod('online')}
                            aria-pressed={paymentMethod === 'online'}
                            className={`p-3.5 rounded-2xl border text-right flex items-center gap-2.5 transition-colors cursor-pointer ${
                              paymentMethod === 'online'
                                ? 'bg-[#F8EDE4] border-[#8A5026] text-[#241A14]'
                                : 'bg-[#FAF5F0] border-[#E5D6C8] text-[#6B5A50]'
                            }`}
                          >
                            <CreditCard className="w-4 h-4 text-[#8A5026] shrink-0" />
                            <div>
                              <p className="text-xs font-bold">پرداخت آنلاین شتابی</p>
                              <p className="text-[11px] text-[#7A685E]">
                                درگاه امن با تمامی کارت‌های بانکی
                              </p>
                            </div>
                          </button>

                          <button
                            type="button"
                            onClick={() => setPaymentMethod('cod')}
                            aria-pressed={paymentMethod === 'cod'}
                            className={`p-3.5 rounded-2xl border text-right flex items-center gap-2.5 transition-colors cursor-pointer ${
                              paymentMethod === 'cod'
                                ? 'bg-[#F8EDE4] border-[#8A5026] text-[#241A14]'
                                : 'bg-[#FAF5F0] border-[#E5D6C8] text-[#6B5A50]'
                            }`}
                          >
                            <PackageCheck className="w-4 h-4 text-[#8A5026] shrink-0" />
                            <div>
                              <p className="text-xs font-bold">پرداخت در محل (تهران)</p>
                              <p className="text-[11px] text-[#7A685E]">
                                تسویه با دستگاه کارت‌خوان پیک شوک
                              </p>
                            </div>
                          </button>
                        </div>
                      </div>

                      {checkoutError && (
                        <p
                          role="alert"
                          data-testid="cart-checkout-error"
                          className="text-xs font-semibold text-[#B53D34]"
                        >
                          {checkoutError}
                        </p>
                      )}
                    </form>
                  )}
                </div>

                {/* Left Column (4 cols): Sticky Summary & Promo Box */}
                <aside className="lg:col-span-4 lg:sticky lg:top-20 bg-white rounded-[28px] border border-[#E8DACD] p-6 sm:p-7 space-y-5 text-right">
                  <h2 className="text-lg font-extrabold text-[#241A14] pb-3 border-b border-[#EFE3D8]">
                    خلاصه صورت‌حساب سفارش
                  </h2>

                  {/* Shipping Method Selector */}
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-[#3F2E23]">
                      شیوه ارسال مرسوله
                    </p>
                    <div className="space-y-2">
                      <button
                        type="button"
                        onClick={() => setShippingMethod('standard')}
                        aria-pressed={shippingMethod === 'standard'}
                        className={`w-full p-3 rounded-2xl border text-right flex items-center justify-between gap-2 text-xs transition-colors cursor-pointer ${
                          shippingMethod === 'standard'
                            ? 'bg-[#FAF3EC] border-[#8A5026] text-[#241A14]'
                            : 'bg-[#FAF5F0] border-[#E5D6C8] text-[#6B5A50]'
                        }`}
                      >
                        <span className="font-semibold">ارسال استاندارد بیمه‌شده</span>
                        <span className="text-[11px] text-[#8A5026] font-bold tabular-nums-fa">
                          {totals.subtotal - totals.discount >= FREE_SHIPPING_THRESHOLD
                            ? 'رایگان'
                            : formatToman(120000)}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setShippingMethod('express-tehran')}
                        aria-pressed={shippingMethod === 'express-tehran'}
                        className={`w-full p-3 rounded-2xl border text-right flex items-center justify-between gap-2 text-xs transition-colors cursor-pointer ${
                          shippingMethod === 'express-tehran'
                            ? 'bg-[#FAF3EC] border-[#8A5026] text-[#241A14]'
                            : 'bg-[#FAF5F0] border-[#E5D6C8] text-[#6B5A50]'
                        }`}
                      >
                        <span className="font-semibold">ارسال فوری ۲ ساعته تهران</span>
                        <span className="text-[11px] text-[#8A5026] font-bold tabular-nums-fa">
                          {totals.subtotal - totals.discount >= 5000000
                            ? 'رایگان'
                            : formatToman(180000)}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Promo Code Box */}
                  <div className="pt-2 border-t border-[#F4EAE2] space-y-2.5">
                    <form onSubmit={handleApplyPromo} className="space-y-2">
                      <label
                        htmlFor="cart-promo-input"
                        className="flex items-center gap-1.5 text-xs font-semibold text-[#3F2E23]"
                      >
                        <Tag className="w-3.5 h-3.5 text-[#8A5026]" />
                        <span>کد تخفیف (VIP یا جشنواره)</span>
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          id="cart-promo-input"
                          type="text"
                          value={promoInput}
                          onChange={(e) => {
                            setPromoInput(e.target.value);
                            if (promoFeedback?.type === 'error') setPromoFeedback(null);
                          }}
                          placeholder="مثلاً SHOCK15 یا SHOCK-VIP10"
                          className="flex-1 min-w-0 h-10 px-3.5 rounded-xl bg-[#FAF5F0] border border-[#E5D6C8] text-xs text-[#241A14] placeholder:text-[#A39287] focus:outline-none focus:bg-white focus:border-[#8A5026]"
                        />
                        <button
                          type="submit"
                          className="h-10 px-4 rounded-xl bg-[#241A14] hover:bg-[#3A2B22] text-white text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                        >
                          اعمال
                        </button>
                      </div>
                    </form>

                    {promoFeedback && (
                      <p
                        data-testid="cart-promo-feedback"
                        className={`text-[11px] font-medium ${
                          promoFeedback.type === 'success'
                            ? 'text-[#3B6642]'
                            : 'text-[#B53D34]'
                        }`}
                      >
                        {promoFeedback.text}
                      </p>
                    )}

                    {(appliedPromo || vipApplied) && (
                      <div className="rounded-xl bg-[#F4F9F4] border border-[#CBE0CC] px-3 py-2 flex items-center justify-between gap-2 text-[11px] text-[#3B6642]">
                        <span className="inline-flex items-center gap-1 font-semibold">
                          <Sparkles className="w-3.5 h-3.5 shrink-0" />
                          <span>
                            {appliedPromo
                              ? appliedPromo.label
                              : 'تخفیف باشگاه VIP شوک (۱۰٪)'}
                          </span>
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            if (appliedPromo) {
                              setAppliedPromo(null);
                              setPromoFeedback(null);
                            } else {
                              onToggleVip();
                            }
                          }}
                          className="underline hover:no-underline cursor-pointer shrink-0"
                        >
                          حذف
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Cost Breakdown */}
                  <div className="pt-3 border-t border-[#EFE3D8] space-y-2 text-xs">
                    <div className="flex justify-between text-[#6B5A50]">
                      <span>جمع اقلام:</span>
                      <span className="font-semibold tabular-nums-fa">
                        {formatToman(totals.subtotal)}
                      </span>
                    </div>

                    {totals.discount > 0 && (
                      <div className="flex justify-between text-[#3B6642] font-semibold">
                        <span>سود شما از تخفیف:</span>
                        <span className="tabular-nums-fa">
                          - {formatToman(totals.discount)}
                        </span>
                      </div>
                    )}

                    {giftWrap && (
                      <div className="flex justify-between text-[#6B5A50]">
                        <span>بسته‌بندی هدیه هاردباکس:</span>
                        <span className="text-[#3B6642] font-semibold">رایگان</span>
                      </div>
                    )}

                    <div className="flex justify-between text-[#6B5A50]">
                      <span>هزینه ارسال بیمه‌شده:</span>
                      <span className="font-semibold tabular-nums-fa">
                        {totals.shipping === 0 ? 'رایگان' : formatToman(totals.shipping)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center pt-3 border-t border-[#EFE3D8]">
                      <span className="text-sm font-extrabold text-[#241A14]">
                        مبلغ قابل پرداخت:
                      </span>
                      <span
                        data-testid="cart-total-amount"
                        className="text-base sm:text-lg font-extrabold text-[#8A5026] tabular-nums-fa"
                      >
                        {formatToman(totals.total)}
                      </span>
                    </div>
                  </div>

                  {step === 'cart' ? (
                    <button
                      type="button"
                      onClick={() => {
                        setStep('checkout');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="w-full h-12 rounded-full bg-gradient-to-l from-[#7E4821] to-[#985A2D] hover:from-[#6A3B19] hover:to-[#824B23] text-white text-sm font-semibold shadow-md inline-flex items-center justify-center gap-2 transition-transform hover:-translate-y-0.5 cursor-pointer"
                    >
                      <span>ادامه جهت ثبت سفارش و ارسال</span>
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      form="cart-checkout-form"
                      className="w-full h-12 rounded-full bg-gradient-to-l from-[#7E4821] to-[#985A2D] hover:from-[#6A3B19] hover:to-[#824B23] text-white text-sm font-semibold shadow-md inline-flex items-center justify-center gap-2 transition-transform hover:-translate-y-0.5 cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>تایید و ثبت نهایی سفارش</span>
                    </button>
                  )}

                  <div className="pt-2 flex items-center justify-center gap-2 text-[11px] text-[#8D7B70]">
                    <ShieldCheck className="w-4 h-4 text-[#8A5026] shrink-0" />
                    <span>تضمین اصالت الیاف · ۷ روز ضمانت تعویض سایز</span>
                  </div>
                </aside>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
