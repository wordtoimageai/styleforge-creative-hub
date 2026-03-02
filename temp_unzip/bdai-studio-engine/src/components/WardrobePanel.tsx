import { useMemo } from 'react';
import { useBrand } from '../BrandContext';
import { t, formatPrice, getProductName, getCategoryName } from '../i18n';
import type { Product } from '../types';

interface Props {
  selectedProduct: Product | null;
  selectedCategory: string;
  selectedGender: 'men' | 'women' | 'all';
  searchQuery: string;
  hasPhoto: boolean;
  onSelectProduct: (p: Product) => void;
  onSetCategory: (c: string) => void;
  onSetGender: (g: 'men' | 'women' | 'all') => void;
  onSearch: (q: string) => void;
  onTryOn: () => void;
  onBack: () => void;
}

export default function WardrobePanel({
  selectedProduct, selectedCategory, selectedGender, searchQuery,
  hasPhoto, onSelectProduct, onSetCategory, onSetGender, onSearch,
  onTryOn, onBack,
}: Props) {
  const { config, language } = useBrand();
  if (!config) return null;

  const categories = useMemo(() => {
    const cats = config.categories || [];
    if (selectedGender === 'all') return cats;
    return cats.filter((c) => !c.gender || c.gender === selectedGender);
  }, [config.categories, selectedGender]);

  const filteredProducts = useMemo(() => {
    let items = config.products.filter((p) => p.isActive !== false);

    if (selectedGender !== 'all') {
      items = items.filter((p) => !p.gender || p.gender === selectedGender);
    }
    if (selectedCategory !== 'all') {
      items = items.filter((p) => p.category === selectedCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      items = items.filter((p) =>
        p.name.toLowerCase().includes(q) ||
        (p.nameBn && p.nameBn.includes(q)) ||
        (p.fabric && p.fabric.toLowerCase().includes(q)) ||
        (p.color && p.color.toLowerCase().includes(q))
      );
    }

    return items.sort((a, b) => {
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;
      return (a.sortOrder || 99) - (b.sortOrder || 99);
    });
  }, [config.products, selectedCategory, selectedGender, searchQuery]);

  const hasGenderProducts = config.products.some((p) => p.gender);

  return (
    <div className="wardrobe-panel">
      <div className="wardrobe-header">
        <button className="back-btn" onClick={onBack}>←</button>
        <h2 className="wardrobe-title">{t('wardrobe.title', language)}</h2>
      </div>

      {/* Gender Toggle */}
      {hasGenderProducts && (
        <div className="gender-toggle">
          {(['all', 'men', 'women'] as const).map((g) => (
            <button
              key={g}
              className={`gender-btn ${selectedGender === g ? 'active' : ''}`}
              onClick={() => onSetGender(g)}
            >
              {g === 'all' ? (language === 'bn' ? 'সব' : 'All') : t(`wardrobe.${g}`, language)}
            </button>
          ))}
        </div>
      )}

      {/* Search */}
      <div className="wardrobe-search">
        <input
          type="text"
          placeholder={t('wardrobe.search', language)}
          value={searchQuery}
          onChange={(e) => onSearch(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Category Tabs */}
      <div className="category-tabs">
        <button
          className={`cat-tab ${selectedCategory === 'all' ? 'active' : ''}`}
          onClick={() => onSetCategory('all')}
        >
          {t('wardrobe.all', language)}
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`cat-tab ${selectedCategory === cat.id ? 'active' : ''}`}
            onClick={() => onSetCategory(cat.id)}
          >
            <span className="cat-icon">{cat.icon}</span>
            {getCategoryName(cat, language)}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="product-grid">
        {filteredProducts.length === 0 ? (
          <div className="empty-state">
            <p>{t('wardrobe.noResults', language)}</p>
          </div>
        ) : (
          filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isSelected={selectedProduct?.id === product.id}
              language={language}
              onSelect={() => onSelectProduct(product)}
            />
          ))
        )}
      </div>

      {/* Try On Button (sticky) */}
      {selectedProduct && (
        <div className="wardrobe-cta">
          <button
            className="btn btn-primary btn-lg btn-full"
            onClick={onTryOn}
            disabled={!hasPhoto}
          >
            {hasPhoto
              ? `${t('wardrobe.tryOn', language)} — ${getProductName(selectedProduct, language)}`
              : t('error.noPhoto', language)
            }
          </button>
        </div>
      )}
    </div>
  );
}

function ProductCard({
  product, isSelected, language, onSelect,
}: {
  product: Product; isSelected: boolean; language: 'bn' | 'en';
  onSelect: () => void;
}) {
  return (
    <button
      className={`product-card ${isSelected ? 'selected' : ''}`}
      onClick={onSelect}
    >
      {/* Image or Color Swatch */}
      <div className="product-image-wrap">
        {product.imageUrl && product.imageUrl.startsWith('http') ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="product-image"
            loading="lazy"
          />
        ) : (
          <div
            className="product-swatch"
            style={{ background: product.colorHex || 'var(--color-primary-light)' }}
          >
            <span className="swatch-initial">{product.name[0]}</span>
          </div>
        )}

        {/* Badges */}
        <div className="product-badges">
          {product.isEidCollection && (
            <span className="badge badge-eid">🌙 {language === 'bn' ? 'ঈদ' : 'Eid'}</span>
          )}
          {product.isFeatured && (
            <span className="badge badge-featured">⭐</span>
          )}
          {product.isNewArrival && (
            <span className="badge badge-new">{language === 'bn' ? 'নতুন' : 'New'}</span>
          )}
          {product.stockStatus === 'low_stock' && (
            <span className="badge badge-low">{language === 'bn' ? 'অল্প!' : 'Few!'}</span>
          )}
          {product.discount && (
            <span className="badge badge-discount">-{product.discount}%</span>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="product-info">
        <p className="product-name">{getProductName(product, language)}</p>
        {product.fabric && (
          <p className="product-fabric">
            {language === 'bn' && product.fabricBn ? product.fabricBn : product.fabric}
          </p>
        )}
        <div className="product-price-row">
          <span className="product-price">{formatPrice(product.price, language)}</span>
          {product.originalPrice && (
            <span className="product-original-price">
              {formatPrice(product.originalPrice, language)}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
