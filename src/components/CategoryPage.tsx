import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowRight,
  Columns3,
  LayoutGrid,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Sparkles,
  Tag,
  X,
} from 'lucide-react';
import {
  ALL_CATALOG_PRODUCTS,
  CATEGORY_TABS,
  getCategoryMeta,
} from '../data/catalog';
import {
  filterAndSortCatalog,
  getCategoryCounts,
  toPersianDigits,
  type CatalogSortOption,
  type PriceTier,
  type Product,
} from '../utils/store';
import { SafeImage } from './MotionPrimitives';
import { ProductCard } from './ProductCard';

interface CategoryPageProps {
  categorySlug: string;
  searchQuery: string;
  wishlistIds: string[];
  onBackHome: () => void;
  onChangeCategory: (slug: string) => void;
  onSearchChange: (q: string) => void;
  onOpenProduct: (product: Product) => void;
  onToggleWishlist: (productId: string) => void;
  onQuickAdd: (product: Product, colorName: string) => void;
}

const PRICE_TIER_OPTIONS: { id: PriceTier; label: string }[] = [
  { id: 'all', label: 'همه محدوده‌های قیمتی' },
  { id: 'under-2m', label: 'تا ۲ میلیون تومان' },
  { id: '2m-to-4m', label: '۲ تا ۴ میلیون تومان' },
  { id: 'over-4m', label: 'بالای ۴ میلیون تومان' },
];

const SIZE_FILTER_OPTIONS: { id: string; label: string }[] = [
  { id: 'all', label: 'همه سایزها' },
  { id: '۳۶', label: '۳۶' },
  { id: '۳۸', label: '۳۸' },
  { id: '۴۰', label: '۴۰' },
  { id: '۴۲', label: '۴۲' },
  { id: 'free', label: 'فری / قواره‌دار' },
];

const SORT_OPTIONS: { id: CatalogSortOption; label: string }[] = [
  { id: 'featured', label: 'پیشنهاد آتلیه' },
  { id: 'price-asc', label: 'ارزان‌ترین' },
  { id: 'price-desc', label: 'گران‌ترین' },
  { id: 'discount', label: 'بیشترین تخفیف' },
  { id: 'rating', label: 'محبوب‌ترین خریداران' },
];

export function CategoryPage({
  categorySlug,
  searchQuery,
  wishlistIds,
  onBackHome,
  onChangeCategory,
  onSearchChange,
  onOpenProduct,
  onToggleWishlist,
  onQuickAdd,
}: CategoryPageProps) {
  const [priceTier, setPriceTier] = useState<PriceTier>('all');
  const [selectedSize, setSelectedSize] = useState<string>('all');
  const [onlyDiscounted, setOnlyDiscounted] = useState(false);
  const [sortBy, setSortBy] = useState<CatalogSortOption>('featured');
  const [gridCols, setGridCols] = useState<3 | 4>(3);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const tabsRowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = tabsRowRef.current;
    if (!container) return;
    const activeBtn = container.querySelector<HTMLElement>('[aria-pressed="true"]');
    if (!activeBtn) return;
    const containerRect = container.getBoundingClientRect();
    const btnRect = activeBtn.getBoundingClientRect();
    const delta =
      btnRect.left + btnRect.width / 2 - (containerRect.left + containerRect.width / 2);
    container.scrollBy({ left: delta, behavior: 'auto' });
  }, [categorySlug]);

  const categoryMeta = useMemo(
    () => getCategoryMeta(categorySlug),
    [categorySlug],
  );

  const categoryCounts = useMemo(
    () => getCategoryCounts(ALL_CATALOG_PRODUCTS),
    [],
  );

  const filteredProducts = useMemo(
    () =>
      filterAndSortCatalog(ALL_CATALOG_PRODUCTS, {
        categorySlug,
        query: searchQuery,
        priceTier,
        size: selectedSize,
        onlyDiscounted,
        sortBy,
      }),
    [categorySlug, searchQuery, priceTier, selectedSize, onlyDiscounted, sortBy],
  );

  const activeFilterCount =
    (priceTier !== 'all' ? 1 : 0) +
    (selectedSize !== 'all' ? 1 : 0) +
    (onlyDiscounted ? 1 : 0) +
    (searchQuery.trim() ? 1 : 0);

  const handleResetFilters = () => {
    setPriceTier('all');
    setSelectedSize('all');
    setOnlyDiscounted(false);
    setSortBy('featured');
    onSearchChange('');
  };

  const renderFiltersContent = () => (
    <div className="space-y-6 text-right">
      {/* Search within category */}
      <div className="space-y-2">
        <label
          htmlFor="category-search-input"
          className="block text-xs font-extrabold text-[#241A14]"
        >
          جستجو در کالاها
        </label>
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-[#9B897E] absolute right-3.5 pointer-events-none" />
          <input
            id="category-search-input"
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="نام محصول، پارچه یا رنگ..."
            className="w-full h-10 pr-10 pl-3 rounded-xl bg-[#FAF5F0] border border-[#E5D6C8] text-xs text-[#241A14] placeholder:text-[#9D8D83] focus:outline-none focus:bg-white focus:border-[#8A5026]"
          />
        </div>
      </div>

      {/* Price Tier Filter */}
      <div className="space-y-2.5 pt-4 border-t border-[#F2E8DF]">
        <p className="text-xs font-extrabold text-[#241A14]">محدوده قیمت</p>
        <div className="space-y-1.5">
          {PRICE_TIER_OPTIONS.map((opt) => {
            const active = priceTier === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setPriceTier(opt.id)}
                aria-pressed={active}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors cursor-pointer ${
                  active
                    ? 'bg-[#EFE3D6] text-[#5B361D] font-bold'
                    : 'text-[#6A594F] hover:bg-[#FAF5F0]'
                }`}
              >
                <span>{opt.label}</span>
                <span
                  className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                    active ? 'border-[#8A5026] bg-[#8A5026]' : 'border-[#CBB8A6]'
                  }`}
                >
                  {active && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Size Filter */}
      <div className="space-y-2.5 pt-4 border-t border-[#F2E8DF]">
        <p className="text-xs font-extrabold text-[#241A14]">سایز و قواره</p>
        <div className="flex flex-wrap gap-2">
          {SIZE_FILTER_OPTIONS.map((opt) => {
            const active = selectedSize === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setSelectedSize(opt.id)}
                aria-pressed={active}
                className={`px-3 py-1.5 rounded-full text-xs border transition-colors cursor-pointer tabular-nums-fa ${
                  active
                    ? 'bg-[#241A14] text-white border-[#241A14] font-semibold'
                    : 'bg-white text-[#5A463B] border-[#E5D6C8] hover:border-[#8A5026]'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Discount Toggle */}
      <div className="pt-4 border-t border-[#F2E8DF]">
        <button
          type="button"
          role="switch"
          aria-checked={onlyDiscounted}
          onClick={() => setOnlyDiscounted((prev) => !prev)}
          className={`w-full flex items-center justify-between p-3 rounded-2xl border text-xs transition-colors cursor-pointer ${
            onlyDiscounted
              ? 'bg-[#FBEAE8] border-[#ECC1BC] text-[#A23027] font-bold'
              : 'bg-[#FAF6F2] border-[#EFE3D8] text-[#4C392E] hover:border-[#D7C1AE]'
          }`}
        >
          <span className="flex items-center gap-2">
            <Tag className="w-4 h-4 shrink-0" />
            <span>فقط تخفیف‌های ویژه VIP</span>
          </span>
          <span
            className={`w-9 h-5 rounded-full p-0.5 transition-colors flex items-center ${
              onlyDiscounted ? 'bg-[#C1382F] justify-start' : 'bg-[#D6C6B8] justify-end'
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-white shadow-xs" />
          </span>
        </button>
      </div>

      {activeFilterCount > 0 && (
        <button
          type="button"
          onClick={handleResetFilters}
          className="w-full h-10 rounded-full border border-[#DFCEBE] bg-white hover:bg-[#FAF5F0] text-xs font-semibold text-[#6E4528] flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>پاک‌سازی فیلترها</span>
        </button>
      )}
    </div>
  );

  return (
    <div data-testid="category-page" data-category-slug={categorySlug} className="bg-[#FAF5F0]">
      {/* Breadcrumb & Back Bar */}
      <div className="border-b border-[#EDE0D4] bg-[#FBF7F3]">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3">
          <nav
            aria-label="مسیر دسته‌بندی"
            className="flex items-center flex-wrap gap-2 text-xs text-[#8D7B70]"
          >
            <button
              type="button"
              onClick={onBackHome}
              className="hover:text-[#8A5026] transition-colors cursor-pointer"
            >
              خانه مد شوک
            </button>
            <span aria-hidden="true">/</span>
            <button
              type="button"
              onClick={() => onChangeCategory('all')}
              className="hover:text-[#8A5026] transition-colors cursor-pointer"
            >
              دسته‌بندی کالاها
            </button>
            {categorySlug !== 'all' && (
              <>
                <span aria-hidden="true">/</span>
                <span className="text-[#241A14] font-semibold">
                  {categoryMeta.title}
                </span>
              </>
            )}
          </nav>

          <button
            type="button"
            onClick={onBackHome}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5C3D28] hover:text-[#8A5026] transition-colors cursor-pointer"
          >
            <ArrowRight className="w-4 h-4" />
            <span>بازگشت به صفحه اصلی</span>
          </button>
        </div>
      </div>

      {/* Editorial Category Hero Banner */}
      <section className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        <div className="relative rounded-[28px] overflow-hidden bg-[#231914] text-white border border-[#3B2B22] shadow-[0_18px_42px_rgba(36,26,20,0.12)] grid grid-cols-1 lg:grid-cols-12 items-center">
          <div className="lg:col-span-7 p-6 sm:p-9 lg:p-11 text-right space-y-3.5 relative z-10">
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#DFB287]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{categoryMeta.kicker}</span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums-fa">
                {toPersianDigits(categoryCounts[categorySlug] ?? filteredProducts.length)} اثر موجود
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-[34px] font-extrabold leading-snug text-white">
              {categoryMeta.title}
            </h1>

            <p className="text-xs sm:text-sm text-[#D6C7BC] leading-7 max-w-2xl">
              {categoryMeta.description}
            </p>
          </div>

          <div className="lg:col-span-5 h-52 sm:h-60 lg:h-[268px] relative overflow-hidden">
            <SafeImage
              src={categoryMeta.image}
              alt={categoryMeta.title}
              className={`w-full h-full object-cover ${categoryMeta.imagePosition ?? 'object-center'}`}
            />
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-l from-[#231914] via-[#231914]/30 to-transparent" />
          </div>
        </div>
      </section>

      {/* Horizontal Category Switcher Strip */}
      <section
        aria-label="انتخاب دسته‌بندی"
        className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 pt-6"
      >
        <div
          ref={tabsRowRef}
          className="flex items-center gap-2.5 overflow-x-auto no-scrollbar pb-2"
        >
          {CATEGORY_TABS.map((tab) => {
            const isActive = categorySlug === tab.slug;
            const count = categoryCounts[tab.slug] ?? 0;
            return (
              <button
                key={tab.slug}
                type="button"
                onClick={() => onChangeCategory(tab.slug)}
                aria-pressed={isActive}
                className={`shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl border text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#241A14] text-white border-[#241A14] shadow-sm'
                    : 'bg-white text-[#4C392E] border-[#EADCD0] hover:border-[#8A5026]/60'
                }`}
              >
                <span>{tab.title}</span>
                <span
                  className={`text-[11px] tabular-nums-fa ${
                    isActive ? 'text-[#DFB287]' : 'text-[#9A8577]'
                  }`}
                >
                  ({toPersianDigits(count)})
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Main Content: Filters Sidebar + Catalog Grid */}
      <section className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
          {/* Desktop Sidebar */}
          <aside
            aria-label="فیلترهای پیشرفته"
            className="hidden lg:block lg:col-span-3 lg:sticky lg:top-24 bg-white rounded-[26px] border border-[#EFE3D8] shadow-[0_8px_28px_rgba(36,26,20,0.035)] p-5 sm:p-6"
          >
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#F2E8DF]">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#8A5026]" />
                <h2 className="text-sm font-extrabold text-[#241A14]">
                  فیلترهای کالا
                </h2>
              </div>
              {activeFilterCount > 0 && (
                <span className="text-[11px] font-bold text-[#8A5026] tabular-nums-fa">
                  {toPersianDigits(activeFilterCount)} فعال
                </span>
              )}
            </div>

            {renderFiltersContent()}
          </aside>

          {/* Results Column */}
          <div className="lg:col-span-9 space-y-5">
            {/* Toolbar */}
            <div className="bg-white rounded-2xl border border-[#EFE3D8] px-4 sm:px-5 py-3.5 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(true)}
                  className="lg:hidden inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#FAF4EE] border border-[#E6D6C7] text-xs font-semibold text-[#4C392E] cursor-pointer"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-[#8A5026]" />
                  <span>فیلترها</span>
                  {activeFilterCount > 0 && (
                    <span className="text-[#8A5026] tabular-nums-fa">
                      ({toPersianDigits(activeFilterCount)})
                    </span>
                  )}
                </button>

                <p
                  data-testid="category-result-count"
                  className="text-xs sm:text-sm font-semibold text-[#4C392E] tabular-nums-fa"
                >
                  نمایش {toPersianDigits(filteredProducts.length)} اثر از کالکشن
                </p>
              </div>

              <div className="flex items-center justify-between w-full sm:w-auto gap-3">
                <div className="flex items-center justify-between w-full sm:w-auto gap-2">
                  <label
                    htmlFor="category-sort-select"
                    className="text-xs text-[#8D7B70] whitespace-nowrap"
                  >
                    مرتب‌سازی:
                  </label>
                  <select
                    id="category-sort-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as CatalogSortOption)}
                    className="h-9 px-3 rounded-xl bg-[#FAF5F0] border border-[#E5D6C8] text-xs font-semibold text-[#241A14] focus:outline-none focus:border-[#8A5026] cursor-pointer"
                  >
                    {SORT_OPTIONS.map((opt) => (
                      <option key={opt.id} value={opt.id}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Desktop Grid Columns Toggle */}
                <div className="hidden xl:flex items-center bg-[#FAF5F0] rounded-xl border border-[#E5D6C8] p-0.5">
                  <button
                    type="button"
                    onClick={() => setGridCols(3)}
                    aria-label="نمایش ۳ ستونه"
                    aria-pressed={gridCols === 3}
                    className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                      gridCols === 3
                        ? 'bg-white text-[#8A5026] shadow-xs'
                        : 'text-[#8D7B70] hover:text-[#241A14]'
                    }`}
                  >
                    <Columns3 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setGridCols(4)}
                    aria-label="نمایش ۴ ستونه"
                    aria-pressed={gridCols === 4}
                    className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                      gridCols === 4
                        ? 'bg-white text-[#8A5026] shadow-xs'
                        : 'text-[#8D7B70] hover:text-[#241A14]'
                    }`}
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Active Filter Removal Summary Bar */}
            {activeFilterCount > 0 && (
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="text-[#8D7B70]">فیلترهای فعال:</span>
                {searchQuery.trim() && (
                  <button
                    type="button"
                    onClick={() => onSearchChange('')}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#E3D3C3] text-[#241A14] hover:border-[#8A5026] cursor-pointer"
                  >
                    <span>جستجو: «{searchQuery}»</span>
                    <X className="w-3 h-3 text-[#8D7B70]" />
                  </button>
                )}
                {priceTier !== 'all' && (
                  <button
                    type="button"
                    onClick={() => setPriceTier('all')}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#E3D3C3] text-[#241A14] hover:border-[#8A5026] cursor-pointer"
                  >
                    <span>
                      {PRICE_TIER_OPTIONS.find((p) => p.id === priceTier)?.label}
                    </span>
                    <X className="w-3 h-3 text-[#8D7B70]" />
                  </button>
                )}
                {selectedSize !== 'all' && (
                  <button
                    type="button"
                    onClick={() => setSelectedSize('all')}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#E3D3C3] text-[#241A14] hover:border-[#8A5026] cursor-pointer"
                  >
                    <span>
                      سایز: {SIZE_FILTER_OPTIONS.find((s) => s.id === selectedSize)?.label}
                    </span>
                    <X className="w-3 h-3 text-[#8D7B70]" />
                  </button>
                )}
                {onlyDiscounted && (
                  <button
                    type="button"
                    onClick={() => setOnlyDiscounted(false)}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FBEAE8] border border-[#ECC1BC] text-[#A23027] cursor-pointer"
                  >
                    <span>تخفیف‌دار VIP</span>
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            )}

            {/* Product Grid or Empty State */}
            {filteredProducts.length > 0 ? (
              <div
                data-testid="category-product-grid"
                className={`grid grid-cols-1 sm:grid-cols-2 gap-5 ${
                  gridCols === 4 ? 'xl:grid-cols-4 lg:grid-cols-3' : 'lg:grid-cols-3'
                }`}
              >
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    variant={product.section}
                    uniformMediaAspect
                    isWishlisted={wishlistIds.includes(product.id)}
                    onToggleWishlist={onToggleWishlist}
                    onOpenProduct={onOpenProduct}
                    onQuickAdd={onQuickAdd}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-[28px] border border-[#EFE3D8] p-10 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-[#F6ECE3] text-[#8A5026] flex items-center justify-center mx-auto">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="text-base font-extrabold text-[#241A14]">
                  اثری مطابق با فیلترهای انتخابی یافت نشد
                </h3>
                <p className="text-xs text-[#7D6D63] max-w-md mx-auto leading-6">
                  فیلترهای قیمت یا سایز را تغییر دهید یا تمام کالاهای کالکشن را مشاهده کنید.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="px-5 py-2.5 rounded-full bg-[#8A5026] text-white text-xs font-semibold cursor-pointer"
                  >
                    پاک‌سازی فیلترها
                  </button>
                  {categorySlug !== 'all' && (
                    <button
                      type="button"
                      onClick={() => {
                        handleResetFilters();
                        onChangeCategory('all');
                      }}
                      className="px-5 py-2.5 rounded-full bg-[#FAF4EE] border border-[#E5D3C2] text-[#4C392E] text-xs font-semibold cursor-pointer"
                    >
                      مشاهده همه کالکشن‌ها
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {mobileFilterOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileFilterOpen(false)}
              className="fixed inset-0 bg-[#1B120C]/50 backdrop-blur-[2px]"
            />

            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              aria-label="فیلترهای موبایل"
              className="relative z-10 w-full max-w-sm bg-white h-full shadow-2xl flex flex-col border-r border-[#EADCD0]"
            >
              <div className="px-5 py-4 border-b border-[#EFE3D8] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-[#8A5026]" />
                  <h2 className="text-sm font-extrabold text-[#241A14]">
                    فیلترهای کالا
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(false)}
                  aria-label="بستن فیلترها"
                  className="w-8 h-8 rounded-full hover:bg-[#FAF4EE] flex items-center justify-center text-[#4C392E] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5">{renderFiltersContent()}</div>

              <div className="p-4 border-t border-[#EFE3D8] bg-[#FDF9F6]">
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(false)}
                  className="w-full h-11 rounded-full bg-gradient-to-l from-[#7E4821] to-[#985A2D] text-white text-xs font-semibold shadow-sm cursor-pointer"
                >
                  مشاهده {toPersianDigits(filteredProducts.length)} محصول
                </button>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
