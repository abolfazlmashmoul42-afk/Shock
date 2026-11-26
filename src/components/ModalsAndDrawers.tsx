import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  Heart,
  CheckCircle2,
  Sparkles,
  Scissors,
  Clock,
  PackageCheck,
  ShieldCheck,
} from 'lucide-react';
import {
  calculateCartTotals,
  formatToman,
  toPersianDigits,
  type AuthUser,
  type CartItem,
  type Product,
} from '../utils/store';
import { type JournalArticle, IMAGES } from '../data/catalog';
import { SafeImage } from './MotionPrimitives';

export interface OrderReceipt {
  orderNumber: string;
  customerName: string;
  phone: string;
  city: string;
  total: number;
  itemCount: number;
  date: string;
}

/* ==================== CART DRAWER ==================== */
interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQty: (key: string, delta: number) => void;
  vipApplied: boolean;
  onToggleVip: () => void;
  onOrderComplete: (receipt: OrderReceipt) => void;
  onOpenFullCart?: () => void;
  defaultCustomerName?: string;
  defaultPhone?: string;
}

export function CartDrawer({
  open,
  onClose,
  items,
  onUpdateQty,
  vipApplied,
  onToggleVip,
  onOrderComplete,
  onOpenFullCart,
  defaultCustomerName = '',
  defaultPhone = '',
}: CartDrawerProps) {
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'form' | 'done'>('cart');
  const [customerName, setCustomerName] = useState(defaultCustomerName);
  const [phone, setPhone] = useState(defaultPhone);
  const [city, setCity] = useState('تهران');
  const [address, setAddress] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [lastReceipt, setLastReceipt] = useState<OrderReceipt | null>(null);

  const totals = calculateCartTotals(items, vipApplied);

  useEffect(() => {
    if (open) {
      if (!customerName && defaultCustomerName) setCustomerName(defaultCustomerName);
      if (!phone && defaultPhone) setPhone(defaultPhone);
    } else if (checkoutStep === 'done') {
      setCheckoutStep('cart');
    }
  }, [open, checkoutStep, defaultCustomerName, defaultPhone, customerName, phone]);

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !phone.trim() || !address.trim()) {
      setFormError('لطفاً نام و نام خانوادگی، شماره تماس و نشانی کامل را وارد نمایید.');
      return;
    }
    setFormError(null);
    const receipt: OrderReceipt = {
      orderNumber: `SH-${Math.floor(1040 + Math.random() * 900)}`,
      customerName: customerName.trim(),
      phone: phone.trim(),
      city,
      total: totals.total,
      itemCount: totals.itemCount,
      date: 'هم‌اکنون',
    };
    setLastReceipt(receipt);
    setCheckoutStep('done');
    onOrderComplete(receipt);
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#1B120C]/45 backdrop-blur-[2px]"
          />

          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            aria-label="سبد خرید شوک"
            className="relative z-10 w-full max-w-md bg-[#FDF9F6] h-full shadow-2xl flex flex-col border-r border-[#EADCD0]"
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-[#EFE3D8] flex items-center justify-between bg-white">
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="w-5 h-5 text-[#8A5026]" />
                <h2 className="text-base font-extrabold text-[#241A14]">
                  سبد خرید شما
                </h2>
                <span className="text-xs text-[#8D7B70] tabular-nums-fa">
                  ({toPersianDigits(totals.itemCount)} کالا)
                </span>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="بستن سبد خرید"
                className="w-9 h-9 rounded-full hover:bg-[#F5EBE2] flex items-center justify-center text-[#4C392E] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6">
              {checkoutStep === 'done' && lastReceipt ? (
                <div className="bg-white rounded-3xl border border-[#E5D4C4] p-6 text-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-[#EAF3EC] text-[#46704F] flex items-center justify-center mx-auto">
                    <PackageCheck className="w-7 h-7" />
                  </div>
                  <h3 className="text-lg font-extrabold text-[#241A14]">
                    سفارش شما با موفقیت ثبت شد
                  </h3>
                  <p className="text-xs text-[#6E5E54] leading-6">
                    {lastReceipt.customerName} عزیز، سفارش شما با کد پیگیری{' '}
                    <strong className="text-[#8A5026] font-mono">
                      {lastReceipt.orderNumber}
                    </strong>{' '}
                    در آتلیه شوک جهت بسته‌بندی VIP و ارسال اکسپرس به {lastReceipt.city} تایید
                    گردید.
                  </p>
                  <div className="rounded-2xl bg-[#FAF5F0] p-4 text-xs space-y-2 text-right">
                    <div className="flex justify-between">
                      <span className="text-[#8E7C70]">تعداد اقلام:</span>
                      <span className="font-bold tabular-nums-fa">
                        {toPersianDigits(lastReceipt.itemCount)} عدد
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#8E7C70]">مبلغ نهایی پرداختی:</span>
                      <span className="font-bold text-[#8A5026] tabular-nums-fa">
                        {formatToman(lastReceipt.total)}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={onClose}
                    className="w-full h-11 rounded-full bg-[#8A5026] text-white text-xs font-semibold cursor-pointer"
                  >
                    بازگشت به فروشگاه
                  </button>
                </div>
              ) : items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-[#F5EAE0] text-[#8A5026] flex items-center justify-center mb-4">
                    <ShoppingBag className="w-7 h-7" />
                  </div>
                  <p className="text-sm font-bold text-[#241A14] mb-1.5">
                    سبد خرید شما در حال حاضر خالی است
                  </p>
                  <p className="text-xs text-[#8D7B70] max-w-xs leading-6 mb-6">
                    آثار پاییز و زمستان آتلیه شوک را مرور کنید و قطعات مورد علاقه خود را
                    بیفزایید.
                  </p>
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-2.5 rounded-full bg-[#8A5026] text-white text-xs font-semibold cursor-pointer"
                  >
                    مشاهده کالکشن
                  </button>
                </div>
              ) : checkoutStep === 'cart' ? (
                <div className="space-y-4">
                  {items.map((item) => (
                    <div
                      key={item.key}
                      className="bg-white rounded-2xl border border-[#EFE3D8] p-3.5 flex gap-3.5"
                    >
                      <SafeImage
                        src={item.product.image}
                        alt={item.product.title}
                        className="w-20 h-24 rounded-xl object-cover shrink-0"
                      />
                      <div className="flex-1 min-w-0 flex flex-col justify-between text-right">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-xs font-bold text-[#241A14] leading-snug">
                              {item.product.title}
                            </p>
                            <button
                              type="button"
                              onClick={() => onUpdateQty(item.key, -item.quantity)}
                              aria-label={`حذف ${item.product.title}`}
                              className="text-[#A49388] hover:text-[#B53D34] transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <p className="text-[11px] text-[#8E7C70] mt-1">
                            رنگ: {item.selectedColor} · سایز: {item.selectedSize}
                          </p>
                        </div>

                        <div className="flex items-center justify-between mt-3">
                          <span className="text-xs font-bold text-[#8A5026] tabular-nums-fa">
                            {formatToman(item.product.price * item.quantity)}
                          </span>
                          <div className="flex items-center gap-2 bg-[#FAF4EE] rounded-full px-2 py-1 border border-[#EADCD0]">
                            <button
                              type="button"
                              onClick={() => onUpdateQty(item.key, 1)}
                              aria-label="افزایش تعداد"
                              className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-[#241A14] cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-bold w-4 text-center tabular-nums-fa">
                              {toPersianDigits(item.quantity)}
                            </span>
                            <button
                              type="button"
                              onClick={() => onUpdateQty(item.key, -1)}
                              aria-label="کاهش تعداد"
                              className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-[#241A14] cursor-pointer"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* VIP Discount Toggle */}
                  <div className="rounded-2xl bg-[#F8EDE4] border border-[#E7D1BF] p-3.5 flex items-center justify-between">
                    <div className="text-right">
                      <p className="text-xs font-bold text-[#5C3A23]">
                        کد باشگاه VIP (۱۰٪ تخفیف)
                      </p>
                      <p className="text-[10px] text-[#8C6D56]">SHOCK-VIP10</p>
                    </div>
                    <button
                      type="button"
                      onClick={onToggleVip}
                      className={`px-3.5 py-1.5 rounded-full text-[11px] font-semibold transition-colors cursor-pointer ${
                        vipApplied
                          ? 'bg-[#46704F] text-white'
                          : 'bg-white text-[#8A5026] border border-[#DFC7B3]'
                      }`}
                    >
                      {vipApplied ? 'اعمال شده ✓' : 'اعمال تخفیف'}
                    </button>
                  </div>
                </div>
              ) : (
                <form
                  id="checkout-form"
                  onSubmit={handleCheckoutSubmit}
                  className="space-y-4 text-right"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-bold text-[#241A14]">
                      مشخصات گیرنده و ارسال VIP
                    </h3>
                    <button
                      type="button"
                      onClick={() => setCheckoutStep('cart')}
                      className="text-xs text-[#8A5026] hover:underline cursor-pointer"
                    >
                      بازگشت به سبد
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#5B473B] mb-1.5">
                      نام و نام خانوادگی *
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="مثلاً مریم ناصری"
                      className="w-full h-11 px-4 rounded-xl bg-white border border-[#E3D3C4] text-xs focus:outline-none focus:border-[#8A5026]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-[#5B473B] mb-1.5">
                        شماره موبایل *
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                        className="w-full h-11 px-4 rounded-xl bg-white border border-[#E3D3C4] text-xs focus:outline-none focus:border-[#8A5026]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#5B473B] mb-1.5">
                        شهر تحویل
                      </label>
                      <select
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full h-11 px-3 rounded-xl bg-white border border-[#E3D3C4] text-xs focus:outline-none focus:border-[#8A5026]"
                      >
                        <option value="تهران">تهران (ارسال ۲ ساعته)</option>
                        <option value="شیراز">شیراز (۲۴ ساعته)</option>
                        <option value="اصفهان">اصفهان (۲۴ ساعته)</option>
                        <option value="مشهد">مشهد (۴۸ ساعته)</option>
                        <option value="تبریز">تبریز (۴۸ ساعته)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#5B473B] mb-1.5">
                      نشانی کامل و کد پستی *
                    </label>
                    <textarea
                      rows={3}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="خیابان، کوچه، پلاک، واحد..."
                      className="w-full p-3.5 rounded-xl bg-white border border-[#E3D3C4] text-xs focus:outline-none focus:border-[#8A5026]"
                    />
                  </div>

                  {formError && (
                    <p role="alert" className="text-xs text-[#B53D34] font-medium">
                      {formError}
                    </p>
                  )}
                </form>
              )}
            </div>

            {/* Footer Summary */}
            {items.length > 0 && checkoutStep !== 'done' && (
              <div className="p-6 bg-white border-t border-[#EFE3D8] space-y-3">
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-[#7D6D63]">
                    <span>جمع اقلام:</span>
                    <span className="tabular-nums-fa">{formatToman(totals.subtotal)}</span>
                  </div>
                  {totals.discount > 0 && (
                    <div className="flex justify-between text-[#46704F] font-medium">
                      <span>تخفیف باشگاه VIP (۱۰٪):</span>
                      <span className="tabular-nums-fa">
                        - {formatToman(totals.discount)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-[#7D6D63]">
                    <span>هزینه ارسال بیمه‌شده:</span>
                    <span className="tabular-nums-fa">
                      {totals.shipping === 0 ? 'رایگان (VIP)' : formatToman(totals.shipping)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-extrabold text-[#241A14] pt-2 border-t border-[#F4EAE1]">
                    <span>مبلغ قابل پرداخت:</span>
                    <span className="text-[#8A5026] tabular-nums-fa">
                      {formatToman(totals.total)}
                    </span>
                  </div>
                </div>

                {checkoutStep === 'cart' ? (
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => setCheckoutStep('form')}
                      className="w-full h-12 rounded-full bg-gradient-to-l from-[#7E4821] to-[#985A2D] hover:from-[#6A3B19] hover:to-[#824B23] text-white text-sm font-semibold shadow-md cursor-pointer"
                    >
                      ادامه و تکمیل سفارش
                    </button>
                    {onOpenFullCart && (
                      <button
                        type="button"
                        onClick={onOpenFullCart}
                        className="w-full h-10 rounded-full bg-[#FAF5F0] border border-[#E5D6C8] text-[#5B3D2A] hover:bg-[#F2E6DA] text-xs font-semibold transition-colors cursor-pointer"
                      >
                        مشاهده صفحه اختصاصی سبد خرید
                      </button>
                    )}
                  </div>
                ) : (
                  <button
                    type="submit"
                    form="checkout-form"
                    className="w-full h-12 rounded-full bg-gradient-to-l from-[#7E4821] to-[#985A2D] hover:from-[#6A3B19] hover:to-[#824B23] text-white text-sm font-semibold shadow-md cursor-pointer"
                  >
                    تایید و ثبت نهایی سفارش
                  </button>
                )}
              </div>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}

/* ==================== WISHLIST DRAWER ==================== */
interface WishlistDrawerProps {
  open: boolean;
  onClose: () => void;
  products: Product[];
  onRemove: (productId: string) => void;
  onMoveToCart: (product: Product) => void;
  onOpenProduct: (product: Product) => void;
}

export function WishlistDrawer({
  open,
  onClose,
  products,
  onRemove,
  onMoveToCart,
  onOpenProduct,
}: WishlistDrawerProps) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#1B120C]/45 backdrop-blur-[2px]"
          />

          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            aria-label="لیست علاقه‌مندی‌ها"
            className="relative z-10 w-full max-w-md bg-[#FDF9F6] h-full shadow-2xl flex flex-col border-r border-[#EADCD0]"
          >
            <div className="px-6 py-5 border-b border-[#EFE3D8] flex items-center justify-between bg-white">
              <div className="flex items-center gap-2.5">
                <Heart className="w-5 h-5 text-[#C1382F]" />
                <h2 className="text-base font-extrabold text-[#241A14]">
                  علاقه‌مندی‌های من
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="بستن لیست علاقه‌مندی‌ها"
                className="w-9 h-9 rounded-full hover:bg-[#F5EBE2] flex items-center justify-center text-[#4C392E] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {products.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-[#F5EAE0] text-[#8A5026] flex items-center justify-center mb-4">
                    <Heart className="w-7 h-7" />
                  </div>
                  <p className="text-sm font-bold text-[#241A14] mb-1.5">
                    هنوز محصولی نشان نکرده‌اید
                  </p>
                  <p className="text-xs text-[#8D7B70] max-w-xs leading-6">
                    روی آیکون قلب در بالای هر کارت محصول کلیک کنید تا در کمد شخصی شما
                    ذخیره شود.
                  </p>
                </div>
              ) : (
                products.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-2xl border border-[#EFE3D8] p-3.5 flex gap-3.5"
                  >
                    <SafeImage
                      src={product.image}
                      alt={product.title}
                      className="w-20 h-24 rounded-xl object-cover shrink-0 cursor-pointer"
                    />
                    <div className="flex-1 flex flex-col justify-between text-right">
                      <div>
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            onOpenProduct(product);
                          }}
                          className="text-xs font-bold text-[#241A14] hover:text-[#8A5026] text-right cursor-pointer"
                        >
                          {product.title}
                        </button>
                        <p className="text-[11px] text-[#8E7C70] mt-1">
                          {product.category}
                        </p>
                        <p className="text-xs font-bold text-[#8A5026] mt-1 tabular-nums-fa">
                          {formatToman(product.price)}
                        </p>
                      </div>

                      <div className="flex items-center justify-between gap-2 mt-2">
                        <button
                          type="button"
                          onClick={() => onMoveToCart(product)}
                          className="px-3.5 py-1.5 rounded-full bg-[#8A5026] text-white text-[11px] font-semibold cursor-pointer"
                        >
                          افزودن به سبد
                        </button>
                        <button
                          type="button"
                          onClick={() => onRemove(product.id)}
                          className="text-[11px] text-[#9A8577] hover:text-[#B53D34] cursor-pointer"
                        >
                          حذف
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}

/* ==================== PRODUCT DETAIL MODAL ==================== */
interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, color: string, size: string) => void;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
}

export function ProductDetailModal({
  product,
  onClose,
  onAddToCart,
  isWishlisted,
  onToggleWishlist,
}: ProductDetailModalProps) {
  const [colorIdx, setColorIdx] = useState(0);
  const [sizeIdx, setSizeIdx] = useState(0);

  useEffect(() => {
    setColorIdx(0);
    setSizeIdx(0);
  }, [product?.id]);

  return (
    <AnimatePresence>
      {product && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#1B120C]/55 backdrop-blur-xs"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.22 }}
            role="dialog"
            aria-modal="true"
            aria-label={product.title}
            className="relative z-10 w-full max-w-3xl bg-[#FDF9F6] rounded-[28px] overflow-hidden shadow-2xl border border-[#EADCD0] grid grid-cols-1 md:grid-cols-12 max-h-[90vh] overflow-y-auto"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="بستن جزئیات محصول"
              className="absolute top-4 left-4 z-20 w-9 h-9 rounded-full bg-white/90 border border-[#E5D4C4] flex items-center justify-center text-[#241A14] hover:bg-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="md:col-span-5 bg-[#F4EAE0] relative min-h-[280px]">
              <SafeImage
                src={product.image}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between text-right">
              <div>
                <div className="flex items-center gap-2 text-[11px] text-[#8D7B70] mb-2">
                  <span>{product.category}</span>
                  <span>·</span>
                  <span className="text-[#497353] font-medium">موجود در آتلیه</span>
                </div>

                <h3 className="text-xl sm:text-2xl font-extrabold text-[#241A14] mb-3">
                  {product.title}
                </h3>

                <p className="text-xs sm:text-sm text-[#6B5A50] leading-7 mb-5">
                  {product.fullDescription}
                </p>

                <div className="rounded-2xl bg-white border border-[#EFE3D8] p-3.5 mb-5 flex items-center gap-2.5 text-xs text-[#5B473B]">
                  <ShieldCheck className="w-4 h-4 text-[#8A5026] shrink-0" />
                  <span>جنس و بافت: {product.material}</span>
                </div>

                {/* Color Selection */}
                <div className="mb-4">
                  <p className="text-xs font-semibold text-[#3F2E23] mb-2">
                    انتخاب رنگ:{' '}
                    <span className="text-[#8A5026]">
                      {product.colors[colorIdx]?.name}
                    </span>
                  </p>
                  <div className="flex items-center gap-2.5">
                    {product.colors.map((c, idx) => (
                      <button
                        key={c.name}
                        type="button"
                        onClick={() => setColorIdx(idx)}
                        className={`w-7 h-7 rounded-full transition-transform cursor-pointer ${
                          colorIdx === idx
                            ? 'ring-2 ring-offset-2 ring-[#8A5026] scale-110'
                            : 'border border-black/15'
                        }`}
                        style={{ backgroundColor: c.hex }}
                        aria-label={`انتخاب رنگ ${c.name}`}
                      />
                    ))}
                  </div>
                </div>

                {/* Size Selection */}
                <div className="mb-6">
                  <p className="text-xs font-semibold text-[#3F2E23] mb-2">
                    انتخاب سایز:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size, idx) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSizeIdx(idx)}
                        className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-colors cursor-pointer ${
                          sizeIdx === idx
                            ? 'bg-[#261B15] text-white border-[#261B15]'
                            : 'bg-white text-[#4C392E] border-[#E4D4C5] hover:border-[#8A5026]'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#EFE3D8] flex flex-wrap items-center justify-between gap-4">
                <div>
                  {product.originalPrice && (
                    <p className="text-xs text-[#A39287] line-through tabular-nums-fa">
                      {formatToman(product.originalPrice)}
                    </p>
                  )}
                  <p className="text-lg font-extrabold text-[#241A14] tabular-nums-fa">
                    {formatToman(product.price)}
                  </p>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => onToggleWishlist(product.id)}
                    aria-label="افزودن به علاقه‌مندی‌ها"
                    className="w-11 h-11 rounded-full bg-white border border-[#E5D4C4] flex items-center justify-center text-[#5A463B] cursor-pointer"
                  >
                    <Heart
                      className={`w-5 h-5 ${
                        isWishlisted ? 'fill-[#C1382F] text-[#C1382F]' : ''
                      }`}
                    />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const chosenColor = product.colors[colorIdx]?.name ?? 'اصلی';
                      const chosenSize = product.sizes[sizeIdx] ?? 'فری سایز';
                      onAddToCart(product, chosenColor, chosenSize);
                      onClose();
                    }}
                    className="h-11 px-6 rounded-full bg-gradient-to-l from-[#7E4821] to-[#985A2D] text-white text-xs sm:text-sm font-semibold shadow-md cursor-pointer"
                  >
                    افزودن به سبد خرید
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

/* ==================== ARTICLE READER MODAL ==================== */
export function ArticleModal({
  article,
  onClose,
}: {
  article: JournalArticle | null;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {article && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#1B120C]/55 backdrop-blur-xs"
          />

          <motion.article
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 18 }}
            role="dialog"
            aria-modal="true"
            className="relative z-10 w-full max-w-2xl bg-[#FDF9F6] rounded-[28px] overflow-hidden shadow-2xl border border-[#EADCD0] max-h-[88vh] overflow-y-auto text-right"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="بستن مقاله"
              className="absolute top-4 left-4 z-20 w-9 h-9 rounded-full bg-white/90 border border-[#E5D4C4] flex items-center justify-center text-[#241A14] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="h-60 sm:h-72 relative overflow-hidden">
              <SafeImage
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1E140E]/85 to-transparent" />
              <div className="absolute bottom-5 inset-x-6 text-white">
                <div className="flex items-center gap-2 text-[11px] text-[#E6CEBA] mb-2">
                  <span>{article.tag}</span>
                  <span>·</span>
                  <Clock className="w-3.5 h-3.5" />
                  <span>{article.readTime}</span>
                  <span>·</span>
                  <span>{article.date}</span>
                </div>
                <h3 className="text-lg sm:text-2xl font-extrabold">{article.title}</h3>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-4">
              {article.body.map((paragraph, index) => (
                <p
                  key={index}
                  className="text-xs sm:text-sm text-[#49372C] leading-8"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </motion.article>
        </div>
      )}
    </AnimatePresence>
  );
}

/* ==================== ATELIER STORY MODAL ==================== */
export function AtelierStoryModal({
  open,
  onClose,
  onOpenAboutPage,
}: {
  open: boolean;
  onClose: () => void;
  onOpenAboutPage?: () => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#1B120C]/60 backdrop-blur-xs"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            role="dialog"
            aria-modal="true"
            className="relative z-10 w-full max-w-2xl bg-[#221914] text-white rounded-[28px] overflow-hidden shadow-2xl border border-white/15"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="بستن داستان آتلیه"
              className="absolute top-4 left-4 z-20 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="h-56 relative">
              <SafeImage
                src={IMAGES.atelierHands}
                alt="کارگاه دوخت آتلیه شوک"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#221914] via-[#221914]/30 to-transparent" />
            </div>

            <div className="p-6 sm:p-8 text-right space-y-4">
              <div className="inline-flex items-center gap-2 text-xs text-[#E0B185]">
                <Scissors className="w-4 h-4" />
                <span>داستان شکل‌گیری خانه مد شوک</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold">
                از مزارع پشم بیه‌لا تا کارگاه‌های ابریشم یزد
              </h3>
              <p className="text-xs sm:text-sm text-[#CFC0B5] leading-8">
                خانه مد شوک با یک دغدغه ساده متولد شد: بازگرداندن حس لمس پارچه‌های زنده و
                طبیعی به کمد بانوان ایرانی. هر ردا و پالتو پیش از رسیدن به دستان شما، طی ۴۸
                ساعت توسط استادکاران برش‌زن و خیاطان باتجربه دوخته و مغزی‌دوزی می‌شود و با
                شناسنامه اصالت الیاف و گارانتی ۳ ساله عدم پرزدهی عرضه می‌گردد.
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-3">
                {onOpenAboutPage && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenAboutPage();
                    }}
                    className="px-6 py-2.5 rounded-full bg-[#8A5026] hover:bg-[#9E5E30] text-white text-xs font-semibold cursor-pointer"
                  >
                    مشاهده صفحه کامل درباره ما
                  </button>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/15 text-white text-xs font-medium cursor-pointer"
                >
                  بازگشت به ویترین
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

/* ==================== ACCOUNT & ORDERS MODAL ==================== */
export function AccountModal({
  open,
  onClose,
  orders,
  vipJoined,
  authUser,
  onOpenAuthPage,
  onLogout,
}: {
  open: boolean;
  onClose: () => void;
  orders: OrderReceipt[];
  vipJoined: boolean;
  authUser?: AuthUser | null;
  onOpenAuthPage?: () => void;
  onLogout?: () => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#1B120C]/50 backdrop-blur-xs"
          />

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            role="dialog"
            aria-modal="true"
            className="relative z-10 w-full max-w-lg bg-[#FDF9F6] rounded-[28px] p-6 sm:p-8 shadow-2xl border border-[#EADCD0] text-right"
          >
            <div className="flex items-center justify-between pb-4 border-b border-[#EFE3D8] mb-5">
              <div>
                <h3 className="text-base font-extrabold text-[#241A14]">
                  {authUser
                    ? `حساب کاربری ${authUser.fullName}`
                    : 'حساب کاربری و پیگیری سفارشات'}
                </h3>
                <p className="text-xs text-[#8D7B70] mt-0.5">
                  وضعیت عضویت:{' '}
                  {vipJoined || authUser?.vipMember
                    ? 'عضو برگزیده VIP ✓'
                    : authUser
                      ? 'عضو رسمی خانه مد شوک'
                      : 'مهمان خانه مد شوک'}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="بستن حساب کاربری"
                className="w-9 h-9 rounded-full hover:bg-[#F5EBE2] flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {orders.length === 0 ? (
              <div className="rounded-2xl bg-white border border-[#EFE3D8] p-6 text-center space-y-2">
                <Sparkles className="w-6 h-6 text-[#8A5026] mx-auto" />
                <p className="text-xs font-bold text-[#241A14]">
                  هنوز سفارشی در این نشست ثبت نشده است
                </p>
                <p className="text-[11px] text-[#8D7B70]">
                  پس از ثبت سفارش از سبد خرید، کد پیگیری و جزئیات بسته‌بندی در این بخش
                  نمایش داده می‌شود.
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-72 overflow-y-auto">
                {orders.map((ord) => (
                  <div
                    key={ord.orderNumber}
                    className="rounded-2xl bg-white border border-[#EFE3D8] p-4 space-y-1.5 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#241A14] font-mono">
                        {ord.orderNumber}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[#46704F] font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>در حال آماده‌سازی در آتلیه</span>
                      </span>
                    </div>
                    <p className="text-[#6E5E54]">
                      گیرنده: {ord.customerName} · {ord.city}
                    </p>
                    <p className="font-bold text-[#8A5026] tabular-nums-fa">
                      مبلغ کل: {formatToman(ord.total)}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {(onOpenAuthPage || (authUser && onLogout)) && (
              <div className="mt-5 pt-4 border-t border-[#EFE3D8] flex flex-wrap items-center justify-between gap-2.5">
                {onOpenAuthPage && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenAuthPage();
                    }}
                    className="h-9 px-4 rounded-full bg-[#241A14] text-white text-xs font-semibold hover:bg-[#3B2B22] transition-colors cursor-pointer"
                  >
                    {authUser ? 'مشاهده صفحه حساب کاربری' : 'ورود یا ثبت‌نام در سایت'}
                  </button>
                )}
                {authUser && onLogout && (
                  <button
                    type="button"
                    onClick={() => {
                      onLogout();
                      onClose();
                    }}
                    className="h-9 px-4 rounded-full bg-white border border-[#E5D4C4] text-[#7A543E] hover:bg-[#F5EBE2] text-xs font-medium transition-colors cursor-pointer"
                  >
                    خروج از حساب
                  </button>
                )}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
