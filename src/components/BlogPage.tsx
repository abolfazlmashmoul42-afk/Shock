import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  BookOpen,
  Check,
  CheckCircle2,
  Clock,
  Search,
  Share2,
  ShoppingBag,
  Sparkles,
  X,
} from 'lucide-react';
import {
  JOURNAL_ARTICLES,
  findProductById,
  type JournalArticle,
} from '../data/catalog';
import {
  filterBlogArticles,
  formatToman,
  getAdjacentBlogArticles,
  getBlogTags,
  toPersianDigits,
  validateVipContact,
  type Product,
} from '../utils/store';
import { SafeImage } from './MotionPrimitives';

const SAVED_ARTICLES_KEY = 'shock_saved_articles';

function loadSavedArticleIds(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(SAVED_ARTICLES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed)
      ? parsed.filter((id): id is string => typeof id === 'string')
      : [];
  } catch {
    return [];
  }
}

interface BlogPageProps {
  selectedArticleId: string | null;
  onSelectArticle: (articleId: string | null) => void;
  onBackHome: () => void;
  onOpenProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onSelectCategory: (slug: string) => void;
  vipJoined: boolean;
  onVipJoined: () => void;
}

export function BlogPage({
  selectedArticleId,
  onSelectArticle,
  onBackHome,
  onOpenProduct,
  onAddToCart,
  onSelectCategory,
  vipJoined,
  onVipJoined,
}: BlogPageProps) {
  const [activeTag, setActiveTag] = useState<string>('همه');
  const [query, setQuery] = useState<string>('');
  const [savedOnly, setSavedOnly] = useState<boolean>(false);
  const [savedIds, setSavedIds] = useState<string[]>(loadSavedArticleIds);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [vipContact, setVipContact] = useState<string>('');
  const [vipError, setVipError] = useState<string | null>(null);

  useEffect(() => {
    try {
      window.localStorage.setItem(SAVED_ARTICLES_KEY, JSON.stringify(savedIds));
    } catch {
      // ignore storage quota errors
    }
  }, [savedIds]);

  const tags = useMemo(() => getBlogTags(JOURNAL_ARTICLES), []);

  const activeArticle: JournalArticle | null = useMemo(
    () =>
      selectedArticleId
        ? JOURNAL_ARTICLES.find((art) => art.id === selectedArticleId) ?? null
        : null,
    [selectedArticleId],
  );

  const filteredArticles = useMemo(() => {
    const matched = filterBlogArticles(JOURNAL_ARTICLES, {
      tag: activeTag,
      query,
    });
    if (!savedOnly) return matched;
    return matched.filter((art) => savedIds.includes(art.id));
  }, [activeTag, query, savedOnly, savedIds]);

  const showFeaturedBanner =
    activeTag === 'همه' && query.trim().length === 0 && !savedOnly;
  const featuredArticle = useMemo(
    () =>
      showFeaturedBanner
        ? filteredArticles.find((art) => art.featured) ?? filteredArticles[0] ?? null
        : null,
    [showFeaturedBanner, filteredArticles],
  );

  const gridArticles = useMemo(
    () =>
      featuredArticle
        ? filteredArticles.filter((art) => art.id !== featuredArticle.id)
        : filteredArticles,
    [featuredArticle, filteredArticles],
  );

  const adjacent = useMemo(
    () =>
      activeArticle
        ? getAdjacentBlogArticles(JOURNAL_ARTICLES, activeArticle.id)
        : { previous: null, next: null },
    [activeArticle],
  );

  const relatedProducts = useMemo(() => {
    if (!activeArticle?.relatedProductIds) return [];
    return activeArticle.relatedProductIds
      .map((id) => findProductById(id))
      .filter((p): p is Product => p !== null);
  }, [activeArticle]);

  const toggleSaveArticle = (articleId: string) => {
    setSavedIds((prev) =>
      prev.includes(articleId)
        ? prev.filter((id) => id !== articleId)
        : [...prev, articleId],
    );
  };

  const handleCopyArticleLink = (article: JournalArticle) => {
    const url =
      typeof window !== 'undefined'
        ? `${window.location.origin}${window.location.pathname}?page=blog&article=${article.id}`
        : '';
    if (url && typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(url).catch(() => {});
    }
    setCopiedId(article.id);
    setTimeout(() => {
      setCopiedId((curr) => (curr === article.id ? null : curr));
    }, 2400);
  };

  const handleVipSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = validateVipContact(vipContact);
    if (!res.valid) {
      setVipError(res.error ?? 'اطلاعات تماس معتبر نیست.');
      return;
    }
    setVipError(null);
    onVipJoined();
  };

  const resetFilters = () => {
    setActiveTag('همه');
    setQuery('');
    setSavedOnly(false);
  };

  return (
    <div className="bg-[#FAF5F0] min-h-screen pb-16">
      {/* Top Breadcrumb Bar */}
      <div className="border-b border-[#EDE1D6] bg-[#FDF9F6]">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center justify-between gap-3">
          <nav
            aria-label="مسیر صفحه"
            className="flex flex-wrap items-center gap-2 text-xs text-[#8D7B70]"
          >
            <button
              type="button"
              onClick={onBackHome}
              className="hover:text-[#8A5026] transition-colors cursor-pointer"
            >
              صفحه اصلی
            </button>
            <span aria-hidden="true">/</span>
            {activeArticle ? (
              <>
                <button
                  type="button"
                  onClick={() => onSelectArticle(null)}
                  className="hover:text-[#8A5026] transition-colors cursor-pointer"
                >
                  مجله و وبلاگ شوک
                </button>
                <span aria-hidden="true">/</span>
                <span className="text-[#241A14] font-semibold line-clamp-1 max-w-[260px] sm:max-w-md">
                  {activeArticle.title}
                </span>
              </>
            ) : (
              <span className="text-[#241A14] font-semibold">مجله و وبلاگ شوک</span>
            )}
          </nav>

          {activeArticle ? (
            <button
              type="button"
              onClick={() => onSelectArticle(null)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8A5026] hover:text-[#663918] transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <ArrowRight className="w-3.5 h-3.5" />
              <span>بازگشت به فهرست مقالات</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onBackHome}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8A5026] hover:text-[#663918] transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <ArrowRight className="w-3.5 h-3.5" />
              <span>بازگشت به فروشگاه</span>
            </button>
          )}
        </div>
      </div>

      {activeArticle ? (
        /* ==================== ARTICLE READER VIEW ==================== */
        <article
          data-testid="blog-article-reader"
          className="pt-8 sm:pt-12 pb-6"
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            {/* Article Header */}
            <header className="text-right space-y-4 mb-7">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2 text-xs text-[#8A5026] font-medium tabular-nums-fa">
                  <span>{activeArticle.tag}</span>
                  <span aria-hidden="true" className="text-[#C7B3A3]">·</span>
                  <span className="text-[#7D6D63]">{activeArticle.date}</span>
                  <span aria-hidden="true" className="text-[#C7B3A3]">·</span>
                  <span className="inline-flex items-center gap-1 text-[#7D6D63]">
                    <Clock className="w-3.5 h-3.5" />
                    {activeArticle.readTime} مطالعه
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => toggleSaveArticle(activeArticle.id)}
                    aria-pressed={savedIds.includes(activeArticle.id)}
                    className={`h-9 px-3.5 rounded-full border text-xs font-semibold inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      savedIds.includes(activeArticle.id)
                        ? 'bg-[#241A14] border-[#241A14] text-white'
                        : 'bg-white border-[#E5D6C8] text-[#49372C] hover:border-[#8A5026]'
                    }`}
                  >
                    <Bookmark
                      className={`w-3.5 h-3.5 ${
                        savedIds.includes(activeArticle.id) ? 'fill-current' : ''
                      }`}
                    />
                    <span>
                      {savedIds.includes(activeArticle.id) ? 'ذخیره شد' : 'ذخیره مقاله'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleCopyArticleLink(activeArticle)}
                    className="h-9 px-3.5 rounded-full bg-white border border-[#E5D6C8] hover:border-[#8A5026] text-xs font-semibold text-[#49372C] inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    {copiedId === activeArticle.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#3B6642]" />
                        <span className="text-[#3B6642]">لینک کپی شد</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="w-3.5 h-3.5 text-[#8A5026]" />
                        <span>اشتراک‌گذاری</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold text-[#241A14] leading-snug text-balance">
                {activeArticle.title}
              </h1>

              <p className="text-sm sm:text-base text-[#6A594F] leading-7 max-w-3xl">
                {activeArticle.excerpt}
              </p>

              {activeArticle.author && (
                <p className="text-xs text-[#7D6D63] pt-1">
                  نوشته{' '}
                  <span className="font-bold text-[#241A14]">{activeArticle.author}</span>
                  {activeArticle.authorRole ? ` · ${activeArticle.authorRole}` : ''}
                </p>
              )}
            </header>

            {/* Cover Photography */}
            <div className="rounded-[28px] overflow-hidden border border-[#E8DACD] bg-[#F2E6DA] aspect-[16/9] max-h-[460px] w-full mb-9">
              <SafeImage
                src={activeArticle.image}
                alt={activeArticle.title}
                eager
                className="w-full h-full object-cover"
              />
            </div>

            {/* Editorial Prose */}
            <div className="max-w-3xl mx-auto space-y-6 text-right">
              {activeArticle.body.map((paragraph, index) => (
                <p
                  key={index}
                  className="text-sm sm:text-base text-[#3A2B22] leading-8 sm:leading-9"
                >
                  {paragraph}
                </p>
              ))}

              {/* Key Takeaways Box */}
              {activeArticle.takeaways && activeArticle.takeaways.length > 0 && (
                <div className="mt-8 rounded-[24px] bg-white border border-[#EADCD0] p-6 sm:p-7">
                  <h2 className="text-sm sm:text-base font-extrabold text-[#241A14] mb-4">
                    نکات کلیدی این راهنما
                  </h2>
                  <ul className="space-y-3">
                    {activeArticle.takeaways.map((tip, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-3 text-xs sm:text-sm text-[#4C392E] leading-7"
                      >
                        <span className="w-5 h-5 rounded-full bg-[#F5EAE0] text-[#8A5026] font-bold text-[11px] flex items-center justify-center shrink-0 mt-1 tabular-nums-fa">
                          {toPersianDigits(idx + 1)}
                        </span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Shop the Story — Related Products */}
            {relatedProducts.length > 0 && (
              <section
                aria-label="محصولات مرتبط با این مقاله"
                className="mt-12 pt-10 border-t border-[#E8DACD]"
              >
                <div className="flex flex-wrap items-end justify-between gap-3 mb-6 text-right">
                  <div>
                    <p className="text-[11px] font-medium text-[#8A5026] mb-1">
                      پیشنهاد متناسب با متن مقاله
                    </p>
                    <h2 className="text-lg sm:text-2xl font-extrabold text-[#241A14]">
                      آثار مرتبط از کالکشن شوک
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => onSelectCategory('all')}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8A5026] hover:underline cursor-pointer"
                  >
                    <span>مشاهده کل کالکشن</span>
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  {relatedProducts.map((product) => (
                    <article
                      key={product.id}
                      className="bg-white rounded-[22px] border border-[#EFE3D8] overflow-hidden flex flex-col justify-between group"
                    >
                      <button
                        type="button"
                        onClick={() => onOpenProduct(product)}
                        className="aspect-[4/3] w-full bg-[#F3E7DC] overflow-hidden cursor-pointer block"
                      >
                        <SafeImage
                          src={product.image}
                          alt={product.title}
                          eager
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </button>

                      <div className="p-4 flex flex-col justify-between flex-1 text-right gap-3">
                        <div>
                          <p className="text-[11px] text-[#9A8577]">{product.category}</p>
                          <button
                            type="button"
                            onClick={() => onOpenProduct(product)}
                            className="text-xs sm:text-sm font-bold text-[#241A14] hover:text-[#8A5026] transition-colors mt-1 text-right cursor-pointer line-clamp-1"
                          >
                            {product.title}
                          </button>
                        </div>

                        <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#F4EAE0]">
                          <span className="text-xs font-extrabold text-[#8A5026] tabular-nums-fa">
                            {formatToman(product.price)}
                          </span>
                          <button
                            type="button"
                            onClick={() => onAddToCart(product)}
                            className="h-8 px-3 rounded-full bg-[#FAF2EA] hover:bg-[#8A5026] text-[#8A5026] hover:text-white text-[11px] font-semibold inline-flex items-center gap-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                          >
                            <ShoppingBag className="w-3 h-3" />
                            <span>+ افزودن</span>
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )}

            {/* Next / Previous Article Navigation */}
            <nav
              aria-label="مقالات قبلی و بعدی"
              className="mt-10 pt-8 border-t border-[#E8DACD] grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              {adjacent.previous ? (
                <button
                  type="button"
                  onClick={() => onSelectArticle(adjacent.previous!.id)}
                  className="p-4 rounded-2xl bg-white border border-[#EFE3D8] hover:border-[#8A5026] text-right transition-colors cursor-pointer"
                >
                  <span className="inline-flex items-center gap-1 text-[11px] text-[#8D7B70] mb-1">
                    <ArrowRight className="w-3.5 h-3.5" />
                    <span>مقاله قبلی</span>
                  </span>
                  <p className="text-xs sm:text-sm font-bold text-[#241A14] line-clamp-1">
                    {adjacent.previous.title}
                  </p>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => onSelectArticle(null)}
                  className="p-4 rounded-2xl bg-white border border-[#EFE3D8] hover:border-[#8A5026] text-right transition-colors cursor-pointer"
                >
                  <span className="inline-flex items-center gap-1 text-[11px] text-[#8D7B70] mb-1">
                    <ArrowRight className="w-3.5 h-3.5" />
                    <span>فهرست مقالات</span>
                  </span>
                  <p className="text-xs sm:text-sm font-bold text-[#241A14]">
                    بازگشت به صفحه اصلی مجله شوک
                  </p>
                </button>
              )}

              {adjacent.next ? (
                <button
                  type="button"
                  onClick={() => onSelectArticle(adjacent.next!.id)}
                  className="p-4 rounded-2xl bg-white border border-[#EFE3D8] hover:border-[#8A5026] text-left transition-colors cursor-pointer"
                >
                  <span className="inline-flex items-center gap-1 text-[11px] text-[#8D7B70] mb-1">
                    <span>مقاله بعدی</span>
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </span>
                  <p className="text-xs sm:text-sm font-bold text-[#241A14] line-clamp-1">
                    {adjacent.next.title}
                  </p>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => onSelectArticle(null)}
                  className="p-4 rounded-2xl bg-white border border-[#EFE3D8] hover:border-[#8A5026] text-left transition-colors cursor-pointer"
                >
                  <span className="inline-flex items-center gap-1 text-[11px] text-[#8D7B70] mb-1">
                    <span>پایان آرشیو</span>
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </span>
                  <p className="text-xs sm:text-sm font-bold text-[#241A14]">
                    مرور همه مقالات مجله
                  </p>
                </button>
              )}
            </nav>
          </div>
        </article>
      ) : (
        /* ==================== BLOG EDITORIAL INDEX VIEW ==================== */
        <>
          {/* Header & Filter Controls */}
          <section className="pt-8 sm:pt-12 pb-6">
            <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-[#E8DACD]">
                <div className="text-right max-w-2xl">
                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8A5026] mb-2">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>تحریریه و مجله تخصصی شوک</span>
                  </div>
                  <h1 className="text-2xl sm:text-4xl font-extrabold text-[#241A14] leading-snug text-balance">
                    مجله استایل، پارچه‌شناسی و روایت‌های آتلیه
                  </h1>
                  <p className="text-xs sm:text-sm text-[#6B5A50] leading-7 mt-2.5">
                    راهنمای خرید آگاهانه پالتو و مانتو، شناخت الیاف اصیل ابریشم و کشمیر و
                    نگاهی نزدیک به هنر دوخت دست‌ساز در کارگاه شوک.
                  </p>
                </div>

                {/* Search Box */}
                <div className="w-full lg:w-[340px] shrink-0">
                  <div className="relative flex items-center">
                    <Search className="w-4 h-4 text-[#8D7B70] absolute right-3.5 pointer-events-none" />
                    <input
                      type="search"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="جستجو در مقالات مجله..."
                      aria-label="جستجو در مقالات مجله"
                      className="w-full h-11 pr-10 pl-9 rounded-full bg-white border border-[#E5D6C8] text-xs text-[#241A14] placeholder:text-[#9D8D83] focus:outline-none focus:border-[#8A5026]"
                    />
                    {query && (
                      <button
                        type="button"
                        onClick={() => setQuery('')}
                        aria-label="پاک کردن جستجو"
                        className="absolute left-3 text-[#8D7B70] hover:text-[#241A14] cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Topic Filter Tabs + Bookmarks Toggle */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-5">
                <div
                  role="tablist"
                  aria-label="موضوعات مقالات"
                  className="flex flex-wrap items-center gap-2"
                >
                  {tags.map((tag) => {
                    const active = activeTag === tag;
                    return (
                      <button
                        key={tag}
                        type="button"
                        role="tab"
                        aria-selected={active}
                        onClick={() => setActiveTag(tag)}
                        className={`h-9 px-4 rounded-full text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                          active
                            ? 'bg-[#241A14] text-white'
                            : 'bg-white border border-[#E8DACD] text-[#5B473B] hover:border-[#8A5026]'
                        }`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>

                <div className="w-full sm:w-auto flex items-center justify-between sm:justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setSavedOnly((v) => !v)}
                    aria-pressed={savedOnly}
                    className={`h-9 px-3.5 rounded-full border text-xs font-semibold inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      savedOnly
                        ? 'bg-[#8A5026] border-[#8A5026] text-white'
                        : 'bg-white border-[#E8DACD] text-[#5B473B] hover:border-[#8A5026]'
                    }`}
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${savedOnly ? 'fill-current' : ''}`} />
                    <span>نشان‌شده‌ها ({toPersianDigits(savedIds.length)})</span>
                  </button>

                  <span className="text-xs text-[#8D7B70] tabular-nums-fa whitespace-nowrap">
                    {toPersianDigits(filteredArticles.length)} مقاله
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Main Articles Feed */}
          <section className="py-4">
            <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
              {filteredArticles.length === 0 ? (
                <div className="bg-white rounded-[28px] border border-[#E8DACD] p-10 text-center max-w-xl mx-auto my-6">
                  <p className="text-base font-extrabold text-[#241A14] mb-2">
                    مقاله‌ای با این فیلتر یا عبارت یافت نشد
                  </p>
                  <p className="text-xs text-[#7D6D63] leading-6 mb-5">
                    می‌توانید عبارت جستجو را تغییر دهید یا تمام مقالات مجله شوک را مرور کنید.
                  </p>
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="h-10 px-6 rounded-full bg-[#8A5026] hover:bg-[#6E3E1B] text-white text-xs font-semibold transition-colors cursor-pointer"
                  >
                    نمایش همه مقالات
                  </button>
                </div>
              ) : (
                <>
                  {/* Featured Editorial Article */}
                  {featuredArticle && (
                    <article
                      data-testid="blog-featured-article"
                      className="bg-white rounded-[28px] border border-[#E8DACD] overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-stretch shadow-[0_8px_24px_rgba(36,26,20,0.04)]"
                    >
                      <button
                        type="button"
                        onClick={() => onSelectArticle(featuredArticle.id)}
                        className="lg:col-span-6 relative min-h-[260px] sm:min-h-[340px] bg-[#F2E6DA] overflow-hidden group cursor-pointer block"
                      >
                        <SafeImage
                          src={featuredArticle.image}
                          alt={featuredArticle.title}
                          eager
                          className="w-full h-full object-cover lg:h-full transition-transform duration-700 group-hover:scale-105"
                        />
                      </button>

                      <div className="lg:col-span-6 p-6 sm:p-8 lg:p-10 flex flex-col justify-between text-right">
                        <div className="space-y-4">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex flex-wrap items-center gap-2 text-xs text-[#8A5026] font-medium tabular-nums-fa">
                              <span>{featuredArticle.featuredTag || 'مقاله ویژه'}</span>
                              <span aria-hidden="true" className="text-[#C7B3A3]">·</span>
                              <span>{featuredArticle.tag}</span>
                              <span aria-hidden="true" className="text-[#C7B3A3]">·</span>
                              <span className="text-[#7D6D63]">{featuredArticle.date}</span>
                              <span aria-hidden="true" className="text-[#C7B3A3]">·</span>
                              <span className="text-[#7D6D63]">{featuredArticle.readTime}</span>
                            </div>

                            <button
                              type="button"
                              onClick={() => toggleSaveArticle(featuredArticle.id)}
                              aria-label={`ذخیره مقاله ${featuredArticle.title}`}
                              aria-pressed={savedIds.includes(featuredArticle.id)}
                              className="w-8 h-8 rounded-full border border-[#EFE3D8] hover:border-[#8A5026] flex items-center justify-center text-[#6B5A50] cursor-pointer"
                            >
                              <Bookmark
                                className={`w-4 h-4 ${
                                  savedIds.includes(featuredArticle.id)
                                    ? 'fill-[#8A5026] text-[#8A5026]'
                                    : ''
                                }`}
                              />
                            </button>
                          </div>

                          <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#241A14] leading-snug text-balance">
                            <button
                              type="button"
                              onClick={() => onSelectArticle(featuredArticle.id)}
                              className="text-right hover:text-[#8A5026] transition-colors cursor-pointer"
                            >
                              {featuredArticle.title}
                            </button>
                          </h2>

                          <p className="text-xs sm:text-sm text-[#6A594F] leading-7">
                            {featuredArticle.excerpt}
                          </p>
                        </div>

                        <div className="pt-6 mt-6 border-t border-[#F2E8DF] flex flex-wrap items-center justify-between gap-3">
                          {featuredArticle.author && (
                            <span className="text-xs text-[#7D6D63]">
                              به قلم{' '}
                              <span className="font-semibold text-[#241A14]">
                                {featuredArticle.author}
                              </span>
                            </span>
                          )}

                          <button
                            type="button"
                            onClick={() => onSelectArticle(featuredArticle.id)}
                            className="h-10 px-5 rounded-full bg-[#241A14] hover:bg-[#8A5026] text-white text-xs font-semibold inline-flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                          >
                            <span>مطالعه کامل مقاله</span>
                            <ArrowLeft className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </article>
                  )}

                  {/* Uniform 3-Column Editorial Article Grid */}
                  {gridArticles.length > 0 && (
                    <div
                      data-testid="blog-articles-grid"
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                      {gridArticles.map((article) => {
                        const isSaved = savedIds.includes(article.id);
                        return (
                          <article
                            key={article.id}
                            className="bg-white rounded-[24px] border border-[#EFE3D8] overflow-hidden flex flex-col justify-between group hover:shadow-[0_10px_28px_rgba(36,26,20,0.06)] transition-shadow"
                          >
                            <div>
                              <button
                                type="button"
                                onClick={() => onSelectArticle(article.id)}
                                className="aspect-[4/3] w-full bg-[#F3E7DC] overflow-hidden cursor-pointer block"
                              >
                                <SafeImage
                                  src={article.image}
                                  alt={article.title}
                                  eager
                                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                              </button>

                              <div className="p-5 sm:p-6 text-right space-y-2.5">
                                <div className="flex items-center justify-between gap-2">
                                  <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-[#8D7B70] tabular-nums-fa">
                                    <span className="text-[#8A5026] font-semibold">
                                      {article.tag}
                                    </span>
                                    <span aria-hidden="true">·</span>
                                    <span>{article.date}</span>
                                    <span aria-hidden="true">·</span>
                                    <span>{article.readTime}</span>
                                  </div>

                                  <button
                                    type="button"
                                    onClick={() => toggleSaveArticle(article.id)}
                                    aria-label={`ذخیره مقاله ${article.title}`}
                                    aria-pressed={isSaved}
                                    className="w-7 h-7 rounded-full hover:bg-[#FAF2EA] flex items-center justify-center text-[#7D6D63] shrink-0 cursor-pointer"
                                  >
                                    <Bookmark
                                      className={`w-3.5 h-3.5 ${
                                        isSaved ? 'fill-[#8A5026] text-[#8A5026]' : ''
                                      }`}
                                    />
                                  </button>
                                </div>

                                <h3 className="text-base font-extrabold text-[#241A14] leading-snug">
                                  <button
                                    type="button"
                                    onClick={() => onSelectArticle(article.id)}
                                    className="text-right hover:text-[#8A5026] transition-colors cursor-pointer"
                                  >
                                    {article.title}
                                  </button>
                                </h3>

                                <p className="text-xs text-[#6B5A50] leading-6 line-clamp-2">
                                  {article.excerpt}
                                </p>
                              </div>
                            </div>

                            <div className="px-5 sm:px-6 pb-5 pt-3 border-t border-[#F5ECE3] flex items-center justify-between gap-2 text-xs">
                              <span className="text-[11px] text-[#8D7B70] truncate">
                                {article.author ?? 'تحریریه شوک'}
                              </span>

                              <button
                                type="button"
                                onClick={() => onSelectArticle(article.id)}
                                className="inline-flex items-center gap-1 font-semibold text-[#8A5026] hover:text-[#5F3416] whitespace-nowrap shrink-0 cursor-pointer"
                              >
                                <span>مطالعه مقاله</span>
                                <ArrowLeft className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  )}
                </>
              )}

              {/* Editorial Newsletter / VIP Strip */}
              <div className="rounded-[28px] bg-[#241A14] text-white p-6 sm:p-9 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                <div className="lg:col-span-7 text-right space-y-2">
                  <div className="inline-flex items-center gap-1.5 text-xs font-medium text-[#E5BC96]">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>خبرنامه تحریریه و باشگاه VIP</span>
                  </div>
                  <h2 className="text-lg sm:text-2xl font-extrabold text-balance">
                    از شماره‌های تازه مجله شوک و پیش‌فروش کالکشن‌ها باخبر شوید
                  </h2>
                  <p className="text-xs text-[#D5C3B5] leading-6 max-w-xl">
                    مقالات فصلی راهنمای استایل، پشت صحنه آتلیه و کد تخفیف ۱۰٪ عضویت VIP
                    مستقیماً برای شما ارسال می‌شود.
                  </p>
                </div>

                <div className="lg:col-span-5">
                  {vipJoined ? (
                    <div className="rounded-2xl bg-white/10 border border-white/15 px-4 py-3 text-xs text-[#CBE9D1] font-semibold flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>عضویت شما در خبرنامه و باشگاه VIP فعال است.</span>
                    </div>
                  ) : (
                    <form onSubmit={handleVipSubmit} noValidate>
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                        <input
                          type="text"
                          value={vipContact}
                          onChange={(e) => {
                            setVipContact(e.target.value);
                            if (vipError) setVipError(null);
                          }}
                          placeholder="شماره موبایل یا ایمیل شما"
                          aria-label="شماره موبایل یا ایمیل برای خبرنامه مجله"
                          className="flex-1 h-11 px-4 rounded-full bg-white text-xs text-[#241A14] placeholder:text-[#9D8D83] focus:outline-none"
                        />
                        <button
                          type="submit"
                          className="h-11 px-5 rounded-full bg-[#8A5026] hover:bg-[#9E5E30] text-white text-xs font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer"
                        >
                          عضویت در مجله
                        </button>
                      </div>
                      {vipError && (
                        <p className="text-[11px] text-[#F4B4AE] mt-2 text-right">{vipError}</p>
                      )}
                    </form>
                  )}
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
