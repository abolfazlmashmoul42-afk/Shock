import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Heart,
  KeyRound,
  LogOut,
  PackageCheck,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Sparkles,
  UserCheck,
} from 'lucide-react';
import { IMAGES } from '../data/catalog';
import {
  formatToman,
  generateDeterministicOtp,
  toPersianDigits,
  validateLoginForm,
  validateSignupForm,
  validateVipContact,
  verifyOtpCode,
  type AuthUser,
} from '../utils/store';
import { SafeImage } from './MotionPrimitives';
import type { OrderReceipt } from './ModalsAndDrawers';

interface AuthPageProps {
  authUser: AuthUser | null;
  orders: OrderReceipt[];
  wishlistCount: number;
  cartCount: number;
  vipJoined: boolean;
  onLoginSuccess: (user: AuthUser) => void;
  onLogout: () => void;
  onBackHome: () => void;
  onSelectCategory: (slug: string) => void;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenContact: () => void;
}

type AuthTab = 'login' | 'signup';
type LoginMethod = 'password' | 'otp';

export function AuthPage({
  authUser,
  orders,
  wishlistCount,
  cartCount,
  vipJoined,
  onLoginSuccess,
  onLogout,
  onBackHome,
  onSelectCategory,
  onOpenCart,
  onOpenWishlist,
  onOpenContact,
}: AuthPageProps) {
  const [activeTab, setActiveTab] = useState<AuthTab>('login');
  const [loginMethod, setLoginMethod] = useState<LoginMethod>('password');

  // Password login state
  const [loginContact, setLoginContact] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [forgotNotice, setForgotNotice] = useState<string | null>(null);

  // OTP login state
  const [otpContact, setOtpContact] = useState('');
  const [otpSentCode, setOtpSentCode] = useState<string | null>(null);
  const [otpInput, setOtpInput] = useState('');

  // Signup state
  const [signupName, setSignupName] = useState('');
  const [signupContact, setSignupContact] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [signupInvite, setSignupInvite] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (!authUser) {
      setActiveTab('login');
      setLoginMethod('password');
      setOtpSentCode(null);
      setOtpInput('');
      setLoginPassword('');
      setSignupPassword('');
      setFormError(null);
      setForgotNotice(null);
    }
  }, [authUser]);

  const switchTab = (tab: AuthTab) => {
    setActiveTab(tab);
    setFormError(null);
    setForgotNotice(null);
  };

  const switchLoginMethod = (method: LoginMethod) => {
    setLoginMethod(method);
    setFormError(null);
    setForgotNotice(null);
  };

  const buildMemberNameFromContact = (contact: string): string => {
    const clean = contact.trim();
    if (clean.includes('@')) {
      return clean.split('@')[0] || 'عضو شوک';
    }
    return 'مشتری گرامی شوک';
  };

  const handlePasswordLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const check = validateLoginForm({
      contact: loginContact,
      password: loginPassword,
    });
    if (!check.valid) {
      setFormError(check.error ?? 'لطفاً اطلاعات ورود را بررسی کنید.');
      return;
    }
    setFormError(null);
    onLoginSuccess({
      id: `usr-${Date.now()}`,
      fullName: buildMemberNameFromContact(loginContact),
      contact: loginContact.trim(),
      vipMember: vipJoined,
      joinedAt: 'امروز',
    });
  };

  const handleRequestOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const check = validateVipContact(otpContact);
    if (!check.valid) {
      setFormError(check.error ?? 'لطفاً شماره موبایل یا ایمیل معتبر وارد کنید.');
      return;
    }
    setFormError(null);
    const code = generateDeterministicOtp(otpContact);
    setOtpSentCode(code);
    setOtpInput('');
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpSentCode || !verifyOtpCode(otpInput, otpSentCode)) {
      setFormError('کد تایید واردشده صحیح نیست. لطفاً کد ۴ رقمی را دوباره بررسی کنید.');
      return;
    }
    setFormError(null);
    onLoginSuccess({
      id: `usr-${Date.now()}`,
      fullName: buildMemberNameFromContact(otpContact),
      contact: otpContact.trim(),
      vipMember: vipJoined,
      joinedAt: 'امروز',
    });
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const check = validateSignupForm({
      fullName: signupName,
      contact: signupContact,
      password: signupPassword,
      acceptedTerms,
    });
    if (!check.valid) {
      setFormError(check.error ?? 'لطفاً فیلدهای الزامی را تکمیل نمایید.');
      return;
    }
    setFormError(null);
    const isVip = vipJoined || signupInvite.trim().toUpperCase().includes('VIP');
    onLoginSuccess({
      id: `usr-${Date.now()}`,
      fullName: signupName.trim(),
      contact: signupContact.trim(),
      vipMember: isVip,
      joinedAt: 'امروز',
    });
  };

  return (
    <div data-testid="auth-page" className="bg-[#FAF5F0] text-[#241A14]">
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
            <span className="font-semibold text-[#241A14]">
              {authUser ? 'حساب کاربری شما' : 'ورود و ثبت‌نام در خانه مد شوک'}
            </span>
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

      {/* Main Content */}
      <section className="py-10 sm:py-14">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          {authUser ? (
            /* Authenticated Member View */
            <div
              data-testid="auth-member-dashboard"
              className="max-w-[1040px] mx-auto space-y-6"
            >
              <div className="bg-white rounded-[28px] border border-[#E8DACD] p-6 sm:p-9 flex flex-col sm:flex-row sm:items-center justify-between gap-6 text-right">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#8F552B] to-[#6B3C1A] text-white flex items-center justify-center shrink-0">
                    <UserCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-[#8A5026] mb-1">
                      {authUser.vipMember || vipJoined
                        ? 'عضو برگزیده باشگاه VIP شوک'
                        : 'عضو رسمی خانه مد شوک'}
                    </p>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-[#241A14]">
                      خوش آمدید، {authUser.fullName}
                    </h1>
                    <p className="text-xs text-[#7A685E] mt-1 tabular-nums-fa">
                      اطلاعات تماس ثبت‌شده: {authUser.contact}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => onSelectCategory('all')}
                    className="h-10 px-5 rounded-full bg-[#241A14] text-white text-xs font-semibold hover:bg-[#3A2B22] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    مشاهده کالکشن‌ها
                  </button>
                  <button
                    type="button"
                    onClick={onLogout}
                    className="h-10 px-4 rounded-full bg-[#FAF5F0] border border-[#E5D6C8] text-[#6B4A35] hover:bg-[#F2E6DA] text-xs font-semibold inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>خروج از حساب کاربری</span>
                  </button>
                </div>
              </div>

              {/* Quick Summary Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-[#FDF9F6] rounded-[24px] border border-[#E8DACD] p-5 text-right flex items-center justify-between">
                  <div>
                    <p className="text-xs text-[#8D7B70] mb-1">سفارش‌های ثبت‌شده</p>
                    <p className="text-xl font-extrabold text-[#241A14] tabular-nums-fa">
                      {toPersianDigits(orders.length)} سفارش
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-[#F3E7DC] text-[#8A5026] flex items-center justify-center">
                    <PackageCheck className="w-5 h-5" />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onOpenWishlist}
                  className="bg-[#FDF9F6] hover:bg-[#F7EFE7] rounded-[24px] border border-[#E8DACD] p-5 text-right flex items-center justify-between transition-colors cursor-pointer"
                >
                  <div>
                    <p className="text-xs text-[#8D7B70] mb-1">علاقه‌مندی‌های من</p>
                    <p className="text-xl font-extrabold text-[#241A14] tabular-nums-fa">
                      {toPersianDigits(wishlistCount)} کالا
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-[#F3E7DC] text-[#B53D34] flex items-center justify-center">
                    <Heart className="w-5 h-5" />
                  </div>
                </button>

                <button
                  type="button"
                  onClick={onOpenCart}
                  className="bg-[#FDF9F6] hover:bg-[#F7EFE7] rounded-[24px] border border-[#E8DACD] p-5 text-right flex items-center justify-between transition-colors cursor-pointer"
                >
                  <div>
                    <p className="text-xs text-[#8D7B70] mb-1">سبد خرید فعال</p>
                    <p className="text-xl font-extrabold text-[#241A14] tabular-nums-fa">
                      {toPersianDigits(cartCount)} کالا
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-[#F3E7DC] text-[#8A5026] flex items-center justify-center">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                </button>
              </div>

              {/* Recent Orders */}
              <div className="bg-white rounded-[28px] border border-[#E8DACD] p-6 sm:p-8 text-right">
                <div className="flex items-center justify-between mb-5 pb-3 border-b border-[#EFE3D8]">
                  <h2 className="text-lg font-extrabold text-[#241A14]">
                    سوابق و پیگیری سفارش‌ها
                  </h2>
                  <button
                    type="button"
                    onClick={onOpenContact}
                    className="text-xs font-semibold text-[#8A5026] hover:underline cursor-pointer"
                  >
                    نیاز به پشتیبانی؟
                  </button>
                </div>

                {orders.length === 0 ? (
                  <div className="py-8 text-center space-y-2.5">
                    <p className="text-sm font-bold text-[#241A14]">
                      هنوز سفارشی در حساب شما ثبت نشده است
                    </p>
                    <p className="text-xs text-[#8D7B70]">
                      پس از نهایی‌سازی خرید از سبد، وضعیت ارسال و کد پیگیری اینجا نمایش داده
                      می‌شود.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {orders.map((ord) => (
                      <div
                        key={ord.orderNumber}
                        className="rounded-2xl bg-[#FAF5F0] border border-[#EAE0D7] p-4 flex flex-wrap items-center justify-between gap-3 text-xs"
                      >
                        <div>
                          <p className="font-bold text-[#241A14] font-mono">
                            {ord.orderNumber}
                          </p>
                          <p className="text-[#6E5E54] mt-1">
                            گیرنده: {ord.customerName} · {ord.city}
                          </p>
                        </div>
                        <div className="text-left">
                          <span className="inline-flex items-center gap-1 text-[#46704F] font-semibold">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>در حال آماده‌سازی</span>
                          </span>
                          <p className="font-bold text-[#8A5026] mt-1 tabular-nums-fa">
                            {formatToman(ord.total)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Login & Signup Editorial Split */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              {/* Form Card (7 cols) */}
              <div className="lg:col-span-7 bg-white rounded-[28px] border border-[#E8DACD] p-6 sm:p-10 text-right flex flex-col justify-between">
                <div>
                  <div className="mb-7">
                    <p className="text-xs font-medium text-[#8A5026] mb-2">
                      حساب کاربری خانه مد شوک
                    </p>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-[#241A14] leading-[1.35] text-balance">
                      {activeTab === 'login'
                        ? 'ورود به حساب کاربری شوک'
                        : 'ساخت حساب کاربری جدید'}
                    </h1>
                    <p className="text-xs sm:text-sm text-[#6B5A50] mt-2 leading-6">
                      {activeTab === 'login'
                        ? 'برای دسترسی به سوابق سفارش‌ها، ذخیره علاقه‌مندی‌ها و خرید سریع وارد شوید.'
                        : 'با ایجاد حساب کاربری، از ارسال رایگان و دسترسی زودهنگام به کالکشن‌های فصلی بهره‌مند شوید.'}
                    </p>
                  </div>

                  {/* Primary Mode Switcher */}
                  <div
                    role="tablist"
                    aria-label="انتخاب ورود یا ثبت‌نام"
                    className="grid grid-cols-2 gap-1.5 p-1.5 rounded-2xl bg-[#FAF5F0] border border-[#EAE0D7] mb-7"
                  >
                    <button
                      type="button"
                      role="tab"
                      aria-selected={activeTab === 'login'}
                      onClick={() => switchTab('login')}
                      className={`h-10 rounded-xl text-xs sm:text-sm font-bold transition-colors whitespace-nowrap cursor-pointer ${
                        activeTab === 'login'
                          ? 'bg-[#241A14] text-white shadow-sm'
                          : 'text-[#6A594F] hover:text-[#241A14]'
                      }`}
                    >
                      ورود به حساب
                    </button>
                    <button
                      type="button"
                      role="tab"
                      aria-selected={activeTab === 'signup'}
                      onClick={() => switchTab('signup')}
                      className={`h-10 rounded-xl text-xs sm:text-sm font-bold transition-colors whitespace-nowrap cursor-pointer ${
                        activeTab === 'signup'
                          ? 'bg-[#241A14] text-white shadow-sm'
                          : 'text-[#6A594F] hover:text-[#241A14]'
                      }`}
                    >
                      ثبت‌نام جدید
                    </button>
                  </div>

                  {activeTab === 'login' ? (
                    <div className="space-y-5">
                      {/* Login Method Toggle */}
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => switchLoginMethod('password')}
                          aria-pressed={loginMethod === 'password'}
                          className={`h-9 px-3.5 rounded-full text-xs font-medium border inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                            loginMethod === 'password'
                              ? 'bg-[#F5EBE1] border-[#8A5026]/50 text-[#5C3419] font-semibold'
                              : 'bg-white border-[#E5D6C8] text-[#6B5A50] hover:bg-[#FAF5F0]'
                          }`}
                        >
                          <KeyRound className="w-3.5 h-3.5" />
                          <span>ورود با رمز عبور</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => switchLoginMethod('otp')}
                          aria-pressed={loginMethod === 'otp'}
                          className={`h-9 px-3.5 rounded-full text-xs font-medium border inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                            loginMethod === 'otp'
                              ? 'bg-[#F5EBE1] border-[#8A5026]/50 text-[#5C3419] font-semibold'
                              : 'bg-white border-[#E5D6C8] text-[#6B5A50] hover:bg-[#FAF5F0]'
                          }`}
                        >
                          <Smartphone className="w-3.5 h-3.5" />
                          <span>ورود سریع با کد تایید</span>
                        </button>
                      </div>

                      {loginMethod === 'password' ? (
                        <form
                          onSubmit={handlePasswordLoginSubmit}
                          noValidate
                          className="space-y-4"
                        >
                          <div>
                            <label
                              htmlFor="auth-login-contact"
                              className="block text-xs font-semibold text-[#3F2E23] mb-1.5"
                            >
                              شماره موبایل یا ایمیل
                            </label>
                            <input
                              id="auth-login-contact"
                              type="text"
                              value={loginContact}
                              onChange={(e) => {
                                setLoginContact(e.target.value);
                                if (formError) setFormError(null);
                              }}
                              placeholder="۰۹۱۲۳۴۵۶۷۸۹ یا sara@shockfashion.ir"
                              className="w-full h-11 px-4 rounded-xl bg-[#FAF5F0] border border-[#E5D6C8] text-xs text-[#241A14] placeholder:text-[#A39287] focus:outline-none focus:bg-white focus:border-[#8A5026]"
                            />
                          </div>

                          <div>
                            <div className="flex items-center justify-between mb-1.5">
                              <label
                                htmlFor="auth-login-password"
                                className="block text-xs font-semibold text-[#3F2E23]"
                              >
                                رمز عبور
                              </label>
                              <button
                                type="button"
                                onClick={() =>
                                  setForgotNotice(
                                    'می‌توانید از تب «ورود سریع با کد تایید» بدون نیاز به رمز وارد شوید.',
                                  )
                                }
                                className="text-[11px] font-medium text-[#8A5026] hover:underline cursor-pointer"
                              >
                                فراموشی رمز عبور؟
                              </button>
                            </div>
                            <div className="relative flex items-center">
                              <input
                                id="auth-login-password"
                                type={showLoginPassword ? 'text' : 'password'}
                                value={loginPassword}
                                onChange={(e) => {
                                  setLoginPassword(e.target.value);
                                  if (formError) setFormError(null);
                                }}
                                placeholder="حداقل ۶ کاراکتر"
                                className="w-full h-11 pr-4 pl-11 rounded-xl bg-[#FAF5F0] border border-[#E5D6C8] text-xs text-[#241A14] placeholder:text-[#A39287] focus:outline-none focus:bg-white focus:border-[#8A5026]"
                              />
                              <button
                                type="button"
                                onClick={() => setShowLoginPassword((prev) => !prev)}
                                aria-label={
                                  showLoginPassword ? 'پنهان کردن رمز عبور' : 'نمایش رمز عبور'
                                }
                                className="absolute left-3 text-[#8D7B70] hover:text-[#241A14] cursor-pointer"
                              >
                                {showLoginPassword ? (
                                  <EyeOff className="w-4 h-4" />
                                ) : (
                                  <Eye className="w-4 h-4" />
                                )}
                              </button>
                            </div>
                          </div>

                          {forgotNotice && (
                            <p className="text-xs text-[#6B5A50] bg-[#FAF5F0] border border-[#E5D6C8] rounded-xl px-3.5 py-2.5">
                              {forgotNotice}
                            </p>
                          )}

                          {formError && (
                            <p
                              role="alert"
                              data-testid="auth-form-error"
                              className="text-xs font-semibold text-[#B53D34]"
                            >
                              {formError}
                            </p>
                          )}

                          <button
                            type="submit"
                            className="w-full h-12 rounded-full bg-gradient-to-l from-[#7E4821] to-[#985A2D] hover:from-[#6A3B19] hover:to-[#824B23] text-white text-sm font-semibold shadow-md transition-transform hover:-translate-y-0.5 cursor-pointer"
                          >
                            ورود به خانه مد شوک
                          </button>
                        </form>
                      ) : otpSentCode ? (
                        <form onSubmit={handleVerifyOtp} noValidate className="space-y-4">
                          <div className="rounded-2xl bg-[#FAF5F0] border border-[#E5D6C8] p-4 flex flex-wrap items-center justify-between gap-2 text-xs">
                            <span className="text-[#5B473B]">
                              کد تایید برای{' '}
                              <strong className="text-[#241A14] tabular-nums-fa">
                                {otpContact}
                              </strong>{' '}
                              ارسال شد.
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                setOtpSentCode(null);
                                setFormError(null);
                              }}
                              className="text-[#8A5026] font-semibold hover:underline cursor-pointer"
                            >
                              تغییر شماره
                            </button>
                          </div>

                          <div
                            data-testid="otp-preview-hint"
                            className="rounded-xl bg-[#F4F9F4] border border-[#CBE0CC] px-3.5 py-2.5 text-xs text-[#3B6642]"
                          >
                            کد تایید پیامکی شما:{' '}
                            <strong className="font-mono tracking-widest">
                              {toPersianDigits(otpSentCode)}
                            </strong>
                          </div>

                          <div>
                            <label
                              htmlFor="auth-otp-code"
                              className="block text-xs font-semibold text-[#3F2E23] mb-1.5"
                            >
                              کد تایید ۴ رقمی
                            </label>
                            <input
                              id="auth-otp-code"
                              type="text"
                              inputMode="numeric"
                              maxLength={4}
                              value={otpInput}
                              onChange={(e) => {
                                setOtpInput(e.target.value);
                                if (formError) setFormError(null);
                              }}
                              placeholder="مثلاً ۴۸۲۵"
                              className="w-full h-11 px-4 rounded-xl bg-[#FAF5F0] border border-[#E5D6C8] text-sm tracking-widest text-center text-[#241A14] placeholder:text-[#A39287] focus:outline-none focus:bg-white focus:border-[#8A5026] tabular-nums-fa"
                            />
                          </div>

                          {formError && (
                            <p
                              role="alert"
                              data-testid="auth-form-error"
                              className="text-xs font-semibold text-[#B53D34]"
                            >
                              {formError}
                            </p>
                          )}

                          <button
                            type="submit"
                            className="w-full h-12 rounded-full bg-gradient-to-l from-[#7E4821] to-[#985A2D] hover:from-[#6A3B19] hover:to-[#824B23] text-white text-sm font-semibold shadow-md transition-transform hover:-translate-y-0.5 cursor-pointer"
                          >
                            تایید کد و ورود به حساب
                          </button>
                        </form>
                      ) : (
                        <form onSubmit={handleRequestOtp} noValidate className="space-y-4">
                          <div>
                            <label
                              htmlFor="auth-otp-contact"
                              className="block text-xs font-semibold text-[#3F2E23] mb-1.5"
                            >
                              شماره موبایل یا ایمیل
                            </label>
                            <input
                              id="auth-otp-contact"
                              type="text"
                              value={otpContact}
                              onChange={(e) => {
                                setOtpContact(e.target.value);
                                if (formError) setFormError(null);
                              }}
                              placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                              className="w-full h-11 px-4 rounded-xl bg-[#FAF5F0] border border-[#E5D6C8] text-xs text-[#241A14] placeholder:text-[#A39287] focus:outline-none focus:bg-white focus:border-[#8A5026]"
                            />
                          </div>

                          {formError && (
                            <p
                              role="alert"
                              data-testid="auth-form-error"
                              className="text-xs font-semibold text-[#B53D34]"
                            >
                              {formError}
                            </p>
                          )}

                          <button
                            type="submit"
                            className="w-full h-12 rounded-full bg-gradient-to-l from-[#7E4821] to-[#985A2D] hover:from-[#6A3B19] hover:to-[#824B23] text-white text-sm font-semibold shadow-md transition-transform hover:-translate-y-0.5 cursor-pointer"
                          >
                            دریافت کد تایید ۴ رقمی
                          </button>
                        </form>
                      )}
                    </div>
                  ) : (
                    /* Signup Form */
                    <form onSubmit={handleSignupSubmit} noValidate className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label
                            htmlFor="auth-signup-name"
                            className="block text-xs font-semibold text-[#3F2E23] mb-1.5"
                          >
                            نام و نام خانوادگی
                          </label>
                          <input
                            id="auth-signup-name"
                            type="text"
                            value={signupName}
                            onChange={(e) => {
                              setSignupName(e.target.value);
                              if (formError) setFormError(null);
                            }}
                            placeholder="مثلاً: نگار صدیقی"
                            className="w-full h-11 px-4 rounded-xl bg-[#FAF5F0] border border-[#E5D6C8] text-xs text-[#241A14] placeholder:text-[#A39287] focus:outline-none focus:bg-white focus:border-[#8A5026]"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="auth-signup-contact"
                            className="block text-xs font-semibold text-[#3F2E23] mb-1.5"
                          >
                            شماره موبایل یا ایمیل
                          </label>
                          <input
                            id="auth-signup-contact"
                            type="text"
                            value={signupContact}
                            onChange={(e) => {
                              setSignupContact(e.target.value);
                              if (formError) setFormError(null);
                            }}
                            placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                            className="w-full h-11 px-4 rounded-xl bg-[#FAF5F0] border border-[#E5D6C8] text-xs text-[#241A14] placeholder:text-[#A39287] focus:outline-none focus:bg-white focus:border-[#8A5026]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label
                            htmlFor="auth-signup-password"
                            className="block text-xs font-semibold text-[#3F2E23] mb-1.5"
                          >
                            رمز عبور
                          </label>
                          <div className="relative flex items-center">
                            <input
                              id="auth-signup-password"
                              type={showSignupPassword ? 'text' : 'password'}
                              value={signupPassword}
                              onChange={(e) => {
                                setSignupPassword(e.target.value);
                                if (formError) setFormError(null);
                              }}
                              placeholder="حداقل ۶ کاراکتر"
                              className="w-full h-11 pr-4 pl-11 rounded-xl bg-[#FAF5F0] border border-[#E5D6C8] text-xs text-[#241A14] placeholder:text-[#A39287] focus:outline-none focus:bg-white focus:border-[#8A5026]"
                            />
                            <button
                              type="button"
                              onClick={() => setShowSignupPassword((prev) => !prev)}
                              aria-label={
                                showSignupPassword ? 'پنهان کردن رمز عبور' : 'نمایش رمز عبور'
                              }
                              className="absolute left-3 text-[#8D7B70] hover:text-[#241A14] cursor-pointer"
                            >
                              {showSignupPassword ? (
                                <EyeOff className="w-4 h-4" />
                              ) : (
                                <Eye className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </div>

                        <div>
                          <label
                            htmlFor="auth-signup-invite"
                            className="block text-xs font-semibold text-[#3F2E23] mb-1.5"
                          >
                            کد دعوت یا باشگاه VIP (اختیاری)
                          </label>
                          <input
                            id="auth-signup-invite"
                            type="text"
                            value={signupInvite}
                            onChange={(e) => setSignupInvite(e.target.value)}
                            placeholder="مثلاً: SHOCK-VIP10"
                            className="w-full h-11 px-4 rounded-xl bg-[#FAF5F0] border border-[#E5D6C8] text-xs text-[#241A14] placeholder:text-[#A39287] focus:outline-none focus:bg-white focus:border-[#8A5026]"
                          />
                        </div>
                      </div>

                      <label className="flex items-center gap-2.5 text-xs text-[#5B473B] cursor-pointer select-none pt-1">
                        <input
                          id="auth-signup-terms"
                          type="checkbox"
                          checked={acceptedTerms}
                          onChange={(e) => {
                            setAcceptedTerms(e.target.checked);
                            if (formError) setFormError(null);
                          }}
                          className="w-4 h-4 rounded accent-[#8A5026] cursor-pointer"
                        />
                        <span>
                          قوانین خرید، شرایط تعویض و حریم خصوصی خانه مد شوک را می‌پذیرم.
                        </span>
                      </label>

                      {formError && (
                        <p
                          role="alert"
                          data-testid="auth-form-error"
                          className="text-xs font-semibold text-[#B53D34]"
                        >
                          {formError}
                        </p>
                      )}

                      <button
                        type="submit"
                        className="w-full h-12 rounded-full bg-gradient-to-l from-[#7E4821] to-[#985A2D] hover:from-[#6A3B19] hover:to-[#824B23] text-white text-sm font-semibold shadow-md transition-transform hover:-translate-y-0.5 cursor-pointer"
                      >
                        ثبت‌نام و ساخت حساب کاربری
                      </button>
                    </form>
                  )}
                </div>

                <div className="mt-8 pt-5 border-t border-[#EFE3D8] flex flex-wrap items-center justify-between gap-3 text-xs text-[#8D7B70]">
                  <span>
                    {activeTab === 'login'
                      ? 'هنوز عضو خانه مد شوک نشده‌اید؟'
                      : 'پیش‌تر حساب کاربری ساخته‌اید؟'}
                  </span>
                  <button
                    type="button"
                    onClick={() => switchTab(activeTab === 'login' ? 'signup' : 'login')}
                    className="font-bold text-[#8A5026] hover:underline cursor-pointer"
                  >
                    {activeTab === 'login' ? 'ایجاد حساب جدید' : 'ورود به حساب کاربری'}
                  </button>
                </div>
              </div>

              {/* Editorial Dark Member Benefits Panel (5 cols) */}
              <div className="lg:col-span-5 bg-[#221914] text-white rounded-[28px] overflow-hidden border border-white/10 flex flex-col justify-between text-right">
                <div className="relative h-60 sm:h-64 overflow-hidden">
                  <SafeImage
                    src={IMAGES.bannerWinterSilk}
                    alt="کالکشن زمستانی خانه مد شوک"
                    eager
                    className="w-full h-full object-cover object-[50%_28%]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#221914] via-[#221914]/35 to-transparent" />
                  <div className="absolute bottom-4 inset-x-6">
                    <p className="text-[11px] text-[#E0B185] mb-1">
                      SHOCK · HOUSE OF FASHION
                    </p>
                    <p className="text-base sm:text-lg font-extrabold text-white">
                      مزایای عضویت در باشگاه مشتریان شوک
                    </p>
                  </div>
                </div>

                <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-6">
                  <ul className="space-y-4 text-xs sm:text-sm text-[#CFC0B5]">
                    <li className="flex items-start gap-3">
                      <Sparkles className="w-4 h-4 text-[#E0B185] shrink-0 mt-1" />
                      <div>
                        <p className="font-bold text-white mb-0.5">
                          دسترسی زودهنگام به کالکشن‌های محدود
                        </p>
                        <p className="text-xs text-[#B8A496] leading-6">
                          پیش از انتشار عمومی، آثار تک‌دوز و پالتوهای فوتر را مشاهده و رزرو
                          کنید.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <PackageCheck className="w-4 h-4 text-[#E0B185] shrink-0 mt-1" />
                      <div>
                        <p className="font-bold text-white mb-0.5">
                          پیگیری آنلاین سفارش و خرید سریع‌تر
                        </p>
                        <p className="text-xs text-[#B8A496] leading-6">
                          ذخیره نشانی ارسال و مشاهده وضعیت بسته‌بندی VIP در لحظه.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <ShieldCheck className="w-4 h-4 text-[#E0B185] shrink-0 mt-1" />
                      <div>
                        <p className="font-bold text-white mb-0.5">
                          تضمین اصالت و تعویض رایگان ۷ روزه
                        </p>
                        <p className="text-xs text-[#B8A496] leading-6">
                          همراه با ضمانت ۳ ساله عدم پرزدهی و خدمات تنظیم قد آستین در آتلیه.
                        </p>
                      </div>
                    </li>
                  </ul>

                  <div className="pt-2 flex flex-wrap items-center gap-3">
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
                      onClick={onOpenContact}
                      className="h-10 px-5 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 text-[#F2E3D4] text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      ارتباط با پشتیبانی
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
