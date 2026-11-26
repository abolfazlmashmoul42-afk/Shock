import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Flame } from 'lucide-react';
import {
  ALL_CATALOG_PRODUCTS,
  CATEGORY_TABS,
  JOURNAL_ARTICLES,
  PRODUCTS,
  findProductById,
  type JournalArticle,
} from './data/catalog';
import {
  addOrIncrementCartItem,
  updateCartItemQty,
  type AuthUser,
  type CartItem,
  type Product,
} from './utils/store';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { EventPromoSlider } from './components/EventPromoSlider';
import { CategoriesSection } from './components/CategoriesSection';
import { CategoryPage } from './components/CategoryPage';
import { AboutPage } from './components/AboutPage';
import { ContactPage } from './components/ContactPage';
import { AuthPage } from './components/AuthPage';
import { CartPage } from './components/CartPage';
import { BlogPage } from './components/BlogPage';
import { ProductCard } from './components/ProductCard';
import { ProductPage } from './components/ProductPage';
import { AtelierBanner } from './components/AtelierBanner';
import { CampaignPosters } from './components/CampaignPosters';
import { FourStepsPromise } from './components/FourStepsPromise';
import { TestimonialsAndVip } from './components/TestimonialsAndVip';
import { MagazineSection } from './components/MagazineSection';
import { Footer } from './components/Footer';
import {
  EditorialReveal,
  StaggerGrid,
  StaggerItem,
} from './components/MotionPrimitives';
import {
  AccountModal,
  ArticleModal,
  AtelierStoryModal,
  CartDrawer,
  WishlistDrawer,
  type OrderReceipt,
} from './components/ModalsAndDrawers';

const VALID_CATEGORY_SLUGS = new Set(CATEGORY_TABS.map((t) => t.slug));

function getInitialProductFromUrl(): Product | null {
  if (typeof window === 'undefined') return null;
  const params = new URLSearchParams(window.location.search);
  return findProductById(params.get('product'));
}

function getInitialCategoryFromUrl(): string | null {
  if (typeof window === 'undefined') return null;
  const params = new URLSearchParams(window.location.search);
  if (findProductById(params.get('product'))) return null;
  const slug = params.get('category');
  if (!slug) return null;
  return VALID_CATEGORY_SLUGS.has(slug) ? slug : 'all';
}

const AUTH_STORAGE_KEY = 'shock_auth_user';
const CART_STORAGE_KEY = 'shock_cart_items';

function getInitialCartItems(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    const restored: CartItem[] = [];
    for (const entry of parsed) {
      if (
        entry &&
        typeof entry === 'object' &&
        typeof entry.key === 'string' &&
        typeof entry.productId === 'string' &&
        typeof entry.selectedColor === 'string' &&
        typeof entry.selectedSize === 'string' &&
        typeof entry.quantity === 'number' &&
        entry.quantity > 0
      ) {
        const matched = findProductById(entry.productId);
        if (matched) {
          restored.push({
            key: entry.key,
            product: matched,
            selectedColor: entry.selectedColor,
            selectedSize: entry.selectedSize,
            quantity: Math.floor(entry.quantity),
          });
        }
      }
    }
    return restored;
  } catch {
    return [];
  }
}

function getInitialAuthUser(): AuthUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<AuthUser>;
    if (parsed && typeof parsed.fullName === 'string' && typeof parsed.contact === 'string') {
      return {
        id: parsed.id || 'usr-saved',
        fullName: parsed.fullName,
        contact: parsed.contact,
        vipMember: Boolean(parsed.vipMember),
        joinedAt: parsed.joinedAt || 'امروز',
      };
    }
  } catch {
    return null;
  }
  return null;
}

type InfoPageName = 'about' | 'contact' | 'auth' | 'cart' | 'blog';

function isInfoPageName(value: string | null): value is InfoPageName {
  return (
    value === 'about' ||
    value === 'contact' ||
    value === 'auth' ||
    value === 'cart' ||
    value === 'blog'
  );
}

function findArticleIdFromUrl(): string | null {
  if (typeof window === 'undefined') return null;
  const params = new URLSearchParams(window.location.search);
  const articleId = params.get('article');
  if (!articleId) return null;
  return JOURNAL_ARTICLES.some((art) => art.id === articleId) ? articleId : null;
}

function getInitialPageFromUrl(): InfoPageName | null {
  if (typeof window === 'undefined') return null;
  const params = new URLSearchParams(window.location.search);
  if (findProductById(params.get('product')) || params.get('category')) return null;
  const page = params.get('page');
  return isInfoPageName(page) ? page : null;
}

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryPage, setSelectedCategoryPage] = useState<string | null>(
    getInitialCategoryFromUrl,
  );
  const [activeInfoPage, setActiveInfoPage] = useState<InfoPageName | null>(
    getInitialPageFromUrl,
  );
  const [activeBlogArticleId, setActiveBlogArticleId] = useState<string | null>(() =>
    getInitialPageFromUrl() === 'blog' ? findArticleIdFromUrl() : null,
  );
  const [activeCategory, setActiveCategory] = useState<string>(
    () => getInitialCategoryFromUrl() ?? 'all',
  );
  const [cartItems, setCartItems] = useState<CartItem[]>(getInitialCartItems);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [authUser, setAuthUser] = useState<AuthUser | null>(getInitialAuthUser);
  const [vipJoined, setVipJoined] = useState<boolean>(() => Boolean(getInitialAuthUser()?.vipMember));
  const [vipDiscountApplied, setVipDiscountApplied] = useState<boolean>(() =>
    Boolean(getInitialAuthUser()?.vipMember),
  );

  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [storyOpen, setStoryOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(
    getInitialProductFromUrl,
  );
  const [activeArticle, setActiveArticle] = useState<JournalArticle | null>(null);
  const [orders, setOrders] = useState<OrderReceipt[]>([]);
  const [toastTitle, setToastTitle] = useState<string | null>(null);

  useEffect(() => {
    try {
      const compact = cartItems.map((item) => ({
        key: item.key,
        productId: item.product.id,
        selectedColor: item.selectedColor,
        selectedSize: item.selectedSize,
        quantity: item.quantity,
      }));
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(compact));
    } catch {
      // ignore storage quota errors
    }
  }, [cartItems]);

  useEffect(() => {
    const onPopState = () => {
      const params = new URLSearchParams(window.location.search);
      const nextProduct = findProductById(params.get('product'));
      setSelectedProduct(nextProduct);
      if (nextProduct) {
        setSelectedCategoryPage(null);
        setActiveInfoPage(null);
        return;
      }
      const nextCat = params.get('category');
      const nextPage = params.get('page');
      if (nextCat && VALID_CATEGORY_SLUGS.has(nextCat)) {
        setSelectedCategoryPage(nextCat);
        setActiveCategory(nextCat);
        setActiveInfoPage(null);
        setActiveBlogArticleId(null);
      } else if (nextCat) {
        setSelectedCategoryPage('all');
        setActiveCategory('all');
        setActiveInfoPage(null);
        setActiveBlogArticleId(null);
      } else if (isInfoPageName(nextPage)) {
        setSelectedCategoryPage(null);
        setActiveInfoPage(nextPage);
        setActiveBlogArticleId(nextPage === 'blog' ? findArticleIdFromUrl() : null);
      } else {
        setSelectedCategoryPage(null);
        setActiveInfoPage(null);
        setActiveBlogArticleId(null);
        setActiveCategory('all');
      }
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const syncUrl = (
    productId: string | null,
    categorySlug: string | null,
    pageName: InfoPageName | null = null,
    articleId: string | null = null,
  ) => {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    if (productId) {
      url.searchParams.set('product', productId);
      url.searchParams.delete('category');
      url.searchParams.delete('page');
      url.searchParams.delete('article');
    } else if (categorySlug) {
      url.searchParams.delete('product');
      url.searchParams.delete('page');
      url.searchParams.delete('article');
      url.searchParams.set('category', categorySlug);
    } else if (pageName) {
      url.searchParams.delete('product');
      url.searchParams.delete('category');
      url.searchParams.set('page', pageName);
      if (pageName === 'blog' && articleId) {
        url.searchParams.set('article', articleId);
      } else {
        url.searchParams.delete('article');
      }
    } else {
      url.searchParams.delete('product');
      url.searchParams.delete('category');
      url.searchParams.delete('page');
      url.searchParams.delete('article');
    }
    window.history.pushState({}, '', `${url.pathname}${url.search}${url.hash}`);
  };

  const handleOpenProductPage = (product: Product) => {
    setSelectedProduct(product);
    setSelectedCategoryPage(null);
    setActiveInfoPage(null);
    setActiveBlogArticleId(null);
    syncUrl(product.id, null, null);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleOpenAboutPage = () => {
    setSelectedProduct(null);
    setSelectedCategoryPage(null);
    setActiveInfoPage('about');
    setActiveBlogArticleId(null);
    syncUrl(null, null, 'about');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleOpenContactPage = () => {
    setSelectedProduct(null);
    setSelectedCategoryPage(null);
    setActiveInfoPage('contact');
    setActiveBlogArticleId(null);
    syncUrl(null, null, 'contact');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleOpenAuthPage = () => {
    setSelectedProduct(null);
    setSelectedCategoryPage(null);
    setActiveInfoPage('auth');
    setActiveBlogArticleId(null);
    syncUrl(null, null, 'auth');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleOpenCartPage = () => {
    setCartOpen(false);
    setWishlistOpen(false);
    setSelectedProduct(null);
    setSelectedCategoryPage(null);
    setActiveInfoPage('cart');
    setActiveBlogArticleId(null);
    syncUrl(null, null, 'cart');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleOpenBlogPage = (articleId: string | null = null) => {
    setSelectedProduct(null);
    setSelectedCategoryPage(null);
    setActiveInfoPage('blog');
    setActiveBlogArticleId(articleId);
    syncUrl(null, null, 'blog', articleId);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleOpenAccountAction = () => {
    if (!authUser) {
      handleOpenAuthPage();
      return;
    }
    setAccountOpen(true);
  };

  const handleLoginSuccess = (user: AuthUser) => {
    setAuthUser(user);
    if (user.vipMember) {
      setVipJoined(true);
      setVipDiscountApplied(true);
    }
    try {
      window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } catch {
      // ignore storage quota errors
    }
  };

  const handleLogout = () => {
    setAuthUser(null);
    try {
      window.localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch {
      // ignore storage errors
    }
  };

  const handleGoHome = () => {
    setSelectedProduct(null);
    setSelectedCategoryPage(null);
    setActiveInfoPage(null);
    setActiveCategory('all');
    syncUrl(null, null, null);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleBackFromProduct = () => {
    setSelectedProduct(null);
    setSelectedCategoryPage(null);
    setActiveInfoPage(null);
    syncUrl(null, null, null);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const newArrivals = useMemo(
    () => PRODUCTS.filter((p) => p.section === 'new'),
    [],
  );
  const vipOffers = useMemo(
    () => PRODUCTS.filter((p) => p.section === 'vip'),
    [],
  );
  const popularPieces = useMemo(
    () => PRODUCTS.filter((p) => p.section === 'popular'),
    [],
  );

  const wishlistProducts = useMemo(
    () => ALL_CATALOG_PRODUCTS.filter((p) => wishlistIds.includes(p.id)),
    [wishlistIds],
  );

  const totalCartCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems],
  );

  const handleToggleWishlist = (productId: string) => {
    setWishlistIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId],
    );
  };

  const handleAddToCart = (
    product: Product,
    selectedColor?: string,
    selectedSize?: string,
    quantity = 1,
  ) => {
    const color = selectedColor || product.colors[0]?.name || 'اصلی';
    const size = selectedSize || product.sizes[0] || 'فری سایز';
    setCartItems((prev) =>
      addOrIncrementCartItem(prev, product, color, size, quantity),
    );
    if (activeInfoPage !== 'cart') {
      setToastTitle(product.title);
      setTimeout(() => {
        setToastTitle((curr) => (curr === product.title ? null : curr));
      }, 3000);
    }
  };

  const handleSelectCategory = (slug: string) => {
    if (slug === 'about') {
      handleOpenAboutPage();
      return;
    }
    if (slug === 'contact') {
      handleOpenContactPage();
      return;
    }
    if (slug === 'auth') {
      handleOpenAuthPage();
      return;
    }
    if (slug === 'cart') {
      handleOpenCartPage();
      return;
    }
    if (slug === 'blog' || slug === 'journal') {
      handleOpenBlogPage(null);
      return;
    }
    const normalized = VALID_CATEGORY_SLUGS.has(slug) ? slug : 'all';
    setSelectedProduct(null);
    setActiveInfoPage(null);
    setActiveBlogArticleId(null);
    setSelectedCategoryPage(normalized);
    setActiveCategory(normalized);
    syncUrl(null, normalized, null);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleSearchSubmit = () => {
    const targetSlug = selectedCategoryPage ?? 'all';
    setSelectedProduct(null);
    setActiveInfoPage(null);
    setSelectedCategoryPage(targetSlug);
    setActiveCategory(targetSlug);
    syncUrl(null, targetSlug, null);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleNavigateAnchor = (anchor: string) => {
    if (anchor === '#footer') {
      document.querySelector('#footer')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    if (selectedProduct || selectedCategoryPage || activeInfoPage) {
      setSelectedProduct(null);
      setSelectedCategoryPage(null);
      setActiveInfoPage(null);
      setActiveCategory('all');
      syncUrl(null, null, null);
      setTimeout(() => {
        document.querySelector(anchor)?.scrollIntoView({ behavior: 'smooth' });
      }, 90);
      return;
    }
    document.querySelector(anchor)?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleVipJoined = () => {
    setVipJoined(true);
    setVipDiscountApplied(true);
  };

  const handleOrderComplete = (receipt: OrderReceipt) => {
    setOrders((prev) => [receipt, ...prev]);
    setCartItems([]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF5F0] text-[#241A14] overflow-x-clip">
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearchSubmit={handleSearchSubmit}
        onSelectCategory={handleSelectCategory}
        onGoHome={handleGoHome}
        onOpenProduct={handleOpenProductPage}
        onOpenCart={handleOpenCartPage}
        onOpenWishlist={() => setWishlistOpen(true)}
        onOpenAccount={handleOpenAccountAction}
        userName={authUser?.fullName ?? null}
        cartCount={totalCartCount}
        wishlistCount={wishlistIds.length}
        activeCategory={
          selectedProduct
            ? 'product'
            : selectedCategoryPage ?? (activeInfoPage ?? activeCategory)
        }
        isHomeActive={!selectedProduct && !selectedCategoryPage && !activeInfoPage}
        onNavigateAnchor={handleNavigateAnchor}
      />

      <main className="flex-1">
        {selectedProduct ? (
          <ProductPage
            product={selectedProduct}
            isWishlisted={wishlistIds.includes(selectedProduct.id)}
            wishlistIds={wishlistIds}
            onBack={handleBackFromProduct}
            onSelectCategory={handleSelectCategory}
            onOpenProduct={handleOpenProductPage}
            onToggleWishlist={handleToggleWishlist}
            onAddToCart={handleAddToCart}
            onQuickCheckout={(product, color, size, quantity) => {
              handleAddToCart(product, color, size, quantity);
              handleOpenCartPage();
            }}
          />
        ) : selectedCategoryPage ? (
          <CategoryPage
            categorySlug={selectedCategoryPage}
            searchQuery={searchQuery}
            wishlistIds={wishlistIds}
            onBackHome={handleGoHome}
            onChangeCategory={handleSelectCategory}
            onSearchChange={setSearchQuery}
            onOpenProduct={handleOpenProductPage}
            onToggleWishlist={handleToggleWishlist}
            onQuickAdd={(p, color) => handleAddToCart(p, color)}
          />
        ) : activeInfoPage === 'about' ? (
          <AboutPage
            onBackHome={handleGoHome}
            onSelectCategory={handleSelectCategory}
            vipJoined={vipJoined}
            onVipJoined={handleVipJoined}
          />
        ) : activeInfoPage === 'contact' ? (
          <ContactPage
            onBackHome={handleGoHome}
            onOpenAbout={handleOpenAboutPage}
            onSelectCategory={handleSelectCategory}
            onOpenAccount={handleOpenAccountAction}
          />
        ) : activeInfoPage === 'auth' ? (
          <AuthPage
            authUser={authUser}
            orders={orders}
            wishlistCount={wishlistIds.length}
            cartCount={totalCartCount}
            vipJoined={vipJoined}
            onLoginSuccess={handleLoginSuccess}
            onLogout={handleLogout}
            onBackHome={handleGoHome}
            onSelectCategory={handleSelectCategory}
            onOpenCart={handleOpenCartPage}
            onOpenWishlist={() => setWishlistOpen(true)}
            onOpenContact={handleOpenContactPage}
          />
        ) : activeInfoPage === 'cart' ? (
          <CartPage
            items={cartItems}
            wishlistIds={wishlistIds}
            vipApplied={vipDiscountApplied}
            authUser={authUser}
            onUpdateQty={(key, delta) =>
              setCartItems((prev) => updateCartItemQty(prev, key, delta))
            }
            onClearCart={() => setCartItems([])}
            onAddToCart={(product, color, size, quantity) =>
              handleAddToCart(product, color, size, quantity)
            }
            onMoveToWishlist={(item) => {
              setWishlistIds((prev) =>
                prev.includes(item.product.id) ? prev : [...prev, item.product.id],
              );
              setCartItems((prev) => updateCartItemQty(prev, item.key, -item.quantity));
            }}
            onToggleVip={() => setVipDiscountApplied((v) => !v)}
            onOpenProduct={handleOpenProductPage}
            onSelectCategory={handleSelectCategory}
            onBackHome={handleGoHome}
            onOpenAuthPage={handleOpenAuthPage}
            onOrderComplete={handleOrderComplete}
          />
        ) : activeInfoPage === 'blog' ? (
          <BlogPage
            selectedArticleId={activeBlogArticleId}
            onSelectArticle={(articleId) => handleOpenBlogPage(articleId)}
            onBackHome={handleGoHome}
            onOpenProduct={handleOpenProductPage}
            onAddToCart={(product) => handleAddToCart(product)}
            onSelectCategory={handleSelectCategory}
            vipJoined={vipJoined}
            onVipJoined={handleVipJoined}
          />
        ) : (
          <>
            {/* 1. Hero Section + Trust Ticker */}
            <HeroSection
              onExploreCollection={() =>
                document
                  .querySelector('#new-arrivals')
                  ?.scrollIntoView({ behavior: 'smooth' })
              }
              onExplorePopular={() =>
                document
                  .querySelector('#popular-pieces')
                  ?.scrollIntoView({ behavior: 'smooth' })
              }
              onOpenProduct={handleOpenProductPage}
            />

            {/* 1.5 Event & Promo Banners Slider (Black Friday / New Collections) */}
            <EventPromoSlider onOpenCategory={handleSelectCategory} />

            {/* 2. Categories (7 cards) */}
            <CategoriesSection
              activeCategory={activeCategory}
              onSelectCategory={handleSelectCategory}
            />

            {/* 3. New Arrivals (جدیدترین آثار هنری پاییزه) */}
            <section id="new-arrivals" className="py-14 sm:py-16 bg-[#FBF7F3]">
              <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
                <EditorialReveal>
                  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-9">
                    <div className="text-right">
                      <p className="text-[11px] font-medium text-[#9D8576] mb-1.5">
                        تازه از آتلیه
                      </p>
                      <h2 className="text-2xl sm:text-3xl font-extrabold text-[#241A14]">
                        جدیدترین آثار هنری پاییزه
                      </h2>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleSelectCategory('manteau')}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-[#7C5236] hover:text-[#57341E] transition-colors self-start sm:self-auto whitespace-nowrap cursor-pointer"
                    >
                      <span>مشاهده همه تازه‌رسیده‌ها</span>
                      <ArrowLeft className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </EditorialReveal>

                <StaggerGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {newArrivals.map((product) => (
                    <StaggerItem key={product.id}>
                      <ProductCard
                        product={product}
                        variant="new"
                        isWishlisted={wishlistIds.includes(product.id)}
                        onToggleWishlist={handleToggleWishlist}
                        onOpenProduct={handleOpenProductPage}
                        onQuickAdd={(p, color) => handleAddToCart(p, color)}
                      />
                    </StaggerItem>
                  ))}
                </StaggerGrid>
              </div>
            </section>

            {/* 4. Dark Atelier Banner */}
            <AtelierBanner
              onOpenStory={() => setStoryOpen(true)}
              onExploreWoolCollection={() => handleSelectCategory('coat')}
            />

            {/* 5. Limited VIP Offers (پیشنهادهای ویژه با تیراژ محدود) */}
            <section id="vip-offers" className="py-14 sm:py-16 bg-[#FBF7F3]">
              <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
                <EditorialReveal>
                  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-9">
                    <div className="text-right">
                      <p className="text-[11px] font-medium text-[#9D8576] mb-1.5">
                        فرصت استثنایی خرید VIP
                      </p>
                      <h2 className="text-2xl sm:text-3xl font-extrabold text-[#241A14]">
                        پیشنهادهای ویژه با تیراژ محدود
                      </h2>
                      <p className="text-xs sm:text-sm text-[#7D6D63] mt-2">
                        تخفیف‌های فصلی روی محبوب‌ترین آثار منتخب فصل گذشته شوک.
                      </p>
                    </div>

                    <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#FBEAE8] border border-[#F2CECA] text-[#B53D34] text-xs font-bold self-start sm:self-auto tabular-nums-fa">
                      <Flame className="w-3.5 h-3.5" />
                      <span>تا ۳۰٪ تخفیف</span>
                    </div>
                  </div>
                </EditorialReveal>

                <StaggerGrid className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
                  {vipOffers.map((product) => (
                    <StaggerItem key={product.id}>
                      <ProductCard
                        product={product}
                        variant="vip"
                        isWishlisted={wishlistIds.includes(product.id)}
                        onToggleWishlist={handleToggleWishlist}
                        onOpenProduct={handleOpenProductPage}
                        onQuickAdd={(p, color) => handleAddToCart(p, color)}
                      />
                    </StaggerItem>
                  ))}
                </StaggerGrid>
              </div>
            </section>

            {/* 6. Campaign Posters Lookbook Slider */}
            <CampaignPosters
              onSelectCampaign={(slug) => handleSelectCategory(slug)}
            />

            {/* 7. Most Popular Pieces (محبوب‌ترین تن‌پوش‌های این فصل) */}
            <section id="popular-pieces" className="py-16 sm:py-20 bg-[#FDF9F6]">
              <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
                <EditorialReveal>
                  <div className="text-center max-w-xl mx-auto mb-10">
                    <p className="text-[11px] font-medium text-[#9D8576] mb-1.5">
                      انتخاب بانوان شیک‌پوش
                    </p>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-[#241A14]">
                      محبوب‌ترین تن‌پوش‌های این فصل
                    </h2>
                    <p className="text-xs sm:text-sm text-[#7D6D63] mt-2">
                      محصولاتی که بیشترین میزان رضایت مشتریان و ثبت سفارش مکرر را داشته‌اند.
                    </p>
                  </div>
                </EditorialReveal>

                <StaggerGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {popularPieces.map((product) => (
                    <StaggerItem key={product.id}>
                      <ProductCard
                        product={product}
                        variant="popular"
                        isWishlisted={wishlistIds.includes(product.id)}
                        onToggleWishlist={handleToggleWishlist}
                        onOpenProduct={handleOpenProductPage}
                        onQuickAdd={(p, color) => handleAddToCart(p, color)}
                      />
                    </StaggerItem>
                  ))}
                </StaggerGrid>
              </div>
            </section>

            {/* 8. Four Steps Promise */}
            <FourStepsPromise />

            {/* 9. Testimonials + VIP Club + Signature Piece Strip */}
            <TestimonialsAndVip
              vipJoined={vipJoined}
              onVipJoined={handleVipJoined}
              onOpenSignaturePiece={handleOpenProductPage}
            />

            {/* 10. Editorial Magazine / Journal */}
            <MagazineSection
              onOpenArticle={(article) => handleOpenBlogPage(article.id)}
              onOpenBlogPage={() => handleOpenBlogPage(null)}
            />
          </>
        )}
      </main>

      {/* 11. Footer */}
      <Footer
        onSelectCategory={handleSelectCategory}
        onOpenAbout={handleOpenAboutPage}
        onOpenContact={handleOpenContactPage}
        onOpenAuth={handleOpenAuthPage}
        onOpenCart={handleOpenCartPage}
        onOpenBlog={() => handleOpenBlogPage(null)}
        onNavigateAnchor={handleNavigateAnchor}
        onOpenWishlist={() => setWishlistOpen(true)}
        onOpenAccount={handleOpenAccountAction}
        vipJoined={vipJoined}
        onVipJoined={handleVipJoined}
      />

      {/* Drawers & Modals */}
      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
        onUpdateQty={(key, delta) =>
          setCartItems((prev) => updateCartItemQty(prev, key, delta))
        }
        vipApplied={vipDiscountApplied}
        onToggleVip={() => setVipDiscountApplied((v) => !v)}
        onOrderComplete={handleOrderComplete}
        onOpenFullCart={handleOpenCartPage}
        defaultCustomerName={authUser?.fullName ?? ''}
        defaultPhone={authUser?.contact ?? ''}
      />

      <WishlistDrawer
        open={wishlistOpen}
        onClose={() => setWishlistOpen(false)}
        products={wishlistProducts}
        onRemove={handleToggleWishlist}
        onMoveToCart={(product) => {
          handleAddToCart(product);
          setWishlistOpen(false);
          handleOpenCartPage();
        }}
        onOpenProduct={handleOpenProductPage}
      />

      <ArticleModal
        article={activeArticle}
        onClose={() => setActiveArticle(null)}
      />

      <AtelierStoryModal
        open={storyOpen}
        onClose={() => setStoryOpen(false)}
        onOpenAboutPage={handleOpenAboutPage}
      />

      <AccountModal
        open={accountOpen}
        onClose={() => setAccountOpen(false)}
        orders={orders}
        vipJoined={vipJoined}
        authUser={authUser}
        onOpenAuthPage={handleOpenAuthPage}
        onLogout={handleLogout}
      />

      {toastTitle && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed left-5 z-40 bg-[#221914] text-white rounded-full px-4 py-2.5 shadow-xl border border-white/15 flex items-center gap-3 text-xs ${
            selectedProduct ? 'bottom-20 lg:bottom-5' : 'bottom-5'
          }`}
        >
          <span>«{toastTitle}» به سبد خرید اضافه شد</span>
          <button
            type="button"
            onClick={() => {
              setToastTitle(null);
              handleOpenCartPage();
            }}
            className="px-3 py-1 rounded-full bg-[#8A5026] text-white font-semibold hover:bg-[#9E5E30] whitespace-nowrap shrink-0 cursor-pointer"
          >
            مشاهده سبد
          </button>
        </div>
      )}
    </div>
  );
}

