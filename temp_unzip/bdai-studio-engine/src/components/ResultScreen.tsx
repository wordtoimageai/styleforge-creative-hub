import { useBrand } from '../BrandContext';
import { t, getProductName, formatPrice } from '../i18n';
import type { Product } from '../types';
import BuyButton from './BuyButton';

interface Props {
  resultImage: string;
  product: Product;
  onTryAnother: () => void;
  onShare: () => void;
  onNewPhoto: () => void;
}

export default function ResultScreen({ resultImage, product, onTryAnother, onShare, onNewPhoto }: Props) {
  const { config, language } = useBrand();
  if (!config) return null;

  return (
    <div className="result-screen">
      <div className="result-image-wrap">
        <img
          src={`data:image/jpeg;base64,${resultImage}`}
          alt={`AI Try-On: ${product.name}`}
          className="result-image"
        />
      </div>

      <div className="result-details">
        <h3 className="result-title">{t('result.title', language)}</h3>
        <div className="result-product-info">
          <p className="result-product-name">{getProductName(product, language)}</p>
          {product.fabric && (
            <p className="result-fabric">
              {language === 'bn' && product.fabricBn ? product.fabricBn : product.fabric}
            </p>
          )}
          <p className="result-price">{formatPrice(product.price, language)}</p>
        </div>
      </div>

      <div className="result-actions">
        <BuyButton product={product} />

        <button className="btn btn-secondary" onClick={onShare}>
          {t('result.share', language)}
        </button>

        <button className="btn btn-ghost" onClick={onTryAnother}>
          {t('result.tryAnother', language)}
        </button>

        <button className="btn btn-ghost btn-sm" onClick={onNewPhoto}>
          {t('result.newPhoto', language)}
        </button>
      </div>
    </div>
  );
}
