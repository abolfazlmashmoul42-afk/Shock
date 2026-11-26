import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Heart, Plus, Star, Check } from 'lucide-react';
import { formatToman, toPersianDigits, type Product } from '../utils/store';
import { SafeImage } from './MotionPrimitives';

interface ProductCardProps {
  product: Product;
  variant?: 'new' | 'vip' | 'popular';
  uniformMediaAspect?: boolean;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
  onOpenProduct: (product: Product) => void;
  onQuickAdd: (product: Product, colorName: string) => void;
}

export function ProductCard({
  product,
  variant = 'new',
  uniformMediaAspect = false,
  isWishlisted,
  onToggleWishlist,
  onOpenProduct,
  onQuickAdd,
}: ProductCardProps) {
  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const [justAdded, setJustAdded] = useState(false);

  const selectedColor = product.colors[selectedColorIdx]?.name ?? product.colors[0]?.name ?? 'اصلی';

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onQuickAdd(product, selectedColor);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      className="group bg-white rounded-[24px] border border-[#EFE3D8] shadow-[0_6px_24px_rgba(36,26,20,0.035)] hover:shadow-[0_14px_34px_rgba(36,26,20,0.08)] overflow-hidden flex flex-col transition-shadow duration-300"
    >
      {/* Product Photo Container */}
      <div
        className={`relative overflow-hidden bg-[#F5ECE3] ${
          variant === 'vip' && !uniformMediaAspect
            ? 'aspect-[4/3.15]'
            : 'aspect-[3/3.45]'
        }`}
      >
        <button
          type="button"
          onClick={() => onOpenProduct(product)}
          aria-label={`مشاهده جزئیات ${product.title}`}
          className="w-full h-full block cursor-pointer text-right"
        >
          <SafeImage
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.04]"
          />
        </button>

        {/* Top-Right Badge (New / Discount) */}
        {variant === 'new' && product.badge && (
          <span className="pointer-events-none absolute top-3.5 right-3.5 px-3 py-1 rounded-full bg-[#7A4926] text-white text-[10px] font-semibold shadow-sm">
            {product.badge}
          </span>
        )}
        {variant === 'vip' && product.discountPercent && (
          <span className="pointer-events-none absolute top-3.5 right-3.5 px-3 py-1 rounded-full bg-[#C1382F] text-white text-[10px] font-bold shadow-sm tabular-nums-fa">
            {toPersianDigits(product.discountPercent)}٪ تخفیف
          </span>
        )}

        {/* Top-Left Wishlist Heart Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product.id);
          }}
          aria-label={
            isWishlisted
              ? `حذف ${product.title} از علاقه‌مندی‌ها`
              : `افزودن ${product.title} به علاقه‌مندی‌ها`
          }
          className="absolute top-3.5 left-3.5 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm border border-[#EDE0D5] flex items-center justify-center text-[#5A463B] hover:scale-105 transition-transform cursor-pointer"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isWishlisted ? 'fill-[#C1382F] text-[#C1382F]' : ''
            }`}
          />
        </button>

        {/* Bottom-Right VIP Pill Tag */}
        {variant === 'vip' && product.badge && (
          <span className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-white/95 text-[#6E4528] text-[10px] font-semibold shadow-sm tabular-nums-fa">
            {product.badge}
          </span>
        )}

        {/* Bottom-Left Rating Pill for Popular Cards */}
        {variant === 'popular' && product.rating && (
          <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-sm shadow-sm flex items-center gap-1.5 text-[10px] tabular-nums-fa">
            <div className="flex items-center gap-0.5 text-[#C78839]">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-2.5 h-2.5 fill-[#C78839] text-[#C78839]" />
              ))}
            </div>
            <span className="font-bold text-[#241A14]">
              {toPersianDigits(product.rating.toFixed(1))}
            </span>
            {product.reviewCount && (
              <span className="text-[#8E7C70]">
                ({toPersianDigits(product.reviewCount)})
              </span>
            )}
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between text-right">
        <div>
          {/* Category + In Stock row */}
          <div className="flex items-center justify-between text-[11px] mb-2">
            <span className="text-[#968275]">{product.category}</span>
            <span className="inline-flex items-center gap-1.5 text-[#497353] font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-[#52895F]" />
              <span>موجود</span>
            </span>
          </div>

          {/* Product Title */}
          <button
            type="button"
            onClick={() => onOpenProduct(product)}
            className="text-right w-full text-sm sm:text-[15px] font-bold text-[#241A14] hover:text-[#8A5026] transition-colors mb-1.5 cursor-pointer"
          >
            {product.title}
          </button>

          {/* Description (shown on new, vip, and uniform category grids) */}
          {(variant !== 'popular' || uniformMediaAspect) && (
            <p className="text-xs text-[#7F6F65] leading-6 line-clamp-2 mb-3">
              {product.description}
            </p>
          )}
        </div>

        <div>
          {/* Interactive Color Swatches */}
          <div className="flex items-center gap-1.5 mb-3.5">
            {product.colors.map((c, idx) => (
              <button
                key={c.name}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedColorIdx(idx);
                }}
                aria-label={`رنگ ${c.name} برای ${product.title}`}
                title={c.name}
                className={`w-3.5 h-3.5 rounded-full transition-transform cursor-pointer ${
                  selectedColorIdx === idx
                    ? 'ring-2 ring-offset-2 ring-[#8A5026] scale-110'
                    : 'border border-black/15 hover:scale-105'
                }`}
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>

          {/* Bottom Price + Action Bar */}
          <div className="flex items-center justify-between pt-3 border-t border-[#F4EAE1]">
            <div className="text-right">
              {product.originalPrice && (
                <p className="text-[11px] text-[#A9988D] line-through tabular-nums-fa">
                  {formatToman(product.originalPrice)}
                </p>
              )}
              <p className="text-sm font-bold text-[#241A14] tabular-nums-fa">
                {formatToman(product.price)}
              </p>
            </div>

            {variant === 'new' && (
              <motion.button
                whileTap={{ scale: 0.9 }}
                type="button"
                onClick={handleAdd}
                aria-label={`افزودن سریع ${product.title} به سبد`}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                  justAdded
                    ? 'bg-[#4D7755] text-white'
                    : 'bg-[#F8EAE0] hover:bg-[#8A5026] text-[#8A5026] hover:text-white'
                }`}
              >
                {justAdded ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              </motion.button>
            )}

            {variant === 'vip' && (
              <motion.button
                whileTap={{ scale: 0.96 }}
                type="button"
                onClick={handleAdd}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                  justAdded
                    ? 'bg-[#4D7755] text-white'
                    : 'bg-[#7A4723] hover:bg-[#623719] text-white'
                }`}
              >
                {justAdded ? 'به سبد اضافه شد' : 'خرید با تخفیف'}
              </motion.button>
            )}

            {variant === 'popular' && (
              <button
                type="button"
                onClick={handleAdd}
                className={`inline-flex items-center gap-1 text-xs font-semibold transition-colors cursor-pointer ${
                  justAdded
                    ? 'text-[#4D7755]'
                    : 'text-[#8A5026] hover:text-[#653717]'
                }`}
              >
                {justAdded ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>اضافه شد</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5" />
                    <span>افزودن</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
}
