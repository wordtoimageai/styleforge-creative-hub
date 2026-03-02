import { useBrand } from '../BrandContext';
import { t, getProductName, formatPrice } from '../i18n';
import type { Product } from '../types';
import { trackEvent } from '../services/geminiService';

interface Props {
  product: Product;
  fullWidth?: boolean;
}

export default function BuyButton({ product, fullWidth }: Props) {
  const { config, language } = useBrand();
  if (!config) return null;

  const productName = getProductName(product, language);
  const brandName = language === 'bn' ? config.brandNameBn : config.brandName;
  const price = formatPrice(product.price, language);

  const handleBuy = () => {
    trackEvent(config.brandId, 'conversion_click', {
      productId: product.id,
      productName: product.name,
      buyType: config.buyLinkType,
    });

    switch (config.buyLinkType) {
      case 'website': {
        const url = product.buyUrl || product.buyLink || config.buyLinkUrl || config.websiteUrl;
        if (url) window.open(url, '_blank');
        break;
      }
      case 'whatsapp': {
        const phone = config.contactWhatsApp.replace(/[^0-9]/g, '');
        const msg = language === 'bn'
          ? `আসসালামু আলাইকুম! আমি "${productName}" (${price}) কিনতে চাই। BDai.studio AI ট্রাই-অন থেকে এসেছি।`
          : `Hi! I'd like to buy "${productName}" (${price}). I tried it via AI on BDai.studio.`;
        window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
        break;
      }
      case 'facebook': {
        const url = config.buyLinkUrl || `https://facebook.com`;
        window.open(url, '_blank');
        break;
      }
      case 'messenger': {
        const url = config.buyLinkUrl || `https://m.me/`;
        window.open(url, '_blank');
        break;
      }
    }
  };

  const buyLabel = () => {
    switch (config.buyLinkType) {
      case 'website': return `🛍️ ${t('buy.buyFromBrand', language)} ${brandName}`;
      case 'whatsapp': return `💬 ${t('buy.whatsapp', language)}`;
      case 'facebook': return `📘 ${t('buy.facebook', language)}`;
      default: return `🛍️ ${t('result.buy', language)}`;
    }
  };

  return (
    <button
      className={`btn btn-accent ${fullWidth ? 'btn-full' : ''}`}
      onClick={handleBuy}
    >
      {buyLabel()}
    </button>
  );
}
