import { useBrand } from '../BrandContext';
import { t, getProductName } from '../i18n';
import type { Product } from '../types';

interface Props {
  resultImage: string;
  product: Product;
  onClose: () => void;
}

export default function SharePanel({ resultImage, product, onClose }: Props) {
  const { config, language } = useBrand();
  if (!config) return null;

  const brandName = language === 'bn' ? config.brandNameBn : config.brandName;
  const productName = getProductName(product, language);
  const shareText = language === 'bn'
    ? `${brandName} থেকে "${productName}" AI দিয়ে পরে দেখলাম! 🎉 BDai.studio তে আপনিও ট্রাই করুন!`
    : `Tried "${productName}" from ${brandName} using AI! 🎉 Try it at BDai.studio`;
  
  const shareUrl = config.websiteUrl || `https://bdai.studio/${config.brandId}`;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = `data:image/jpeg;base64,${resultImage}`;
    link.download = `${config.brandId}-tryon-${product.id}.jpg`;
    link.click();
  };

  const handleFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`,
      '_blank'
    );
  };

  const handleWhatsApp = () => {
    window.open(
      `https://wa.me/?text=${encodeURIComponent(shareText + '\n\n' + shareUrl)}`,
      '_blank'
    );
  };

  const handleMessenger = () => {
    window.open(
      `https://www.facebook.com/dialog/send?link=${encodeURIComponent(shareUrl)}&app_id=0&redirect_uri=${encodeURIComponent(shareUrl)}`,
      '_blank'
    );
  };

  const handleInstagram = () => {
    handleDownload();
    alert(language === 'bn'
      ? '📸 ছবি ডাউনলোড হয়েছে! এখন Instagram এ পোস্ট করুন।'
      : '📸 Image downloaded! Now post it on Instagram.'
    );
  };

  return (
    <div className="share-overlay" onClick={onClose}>
      <div className="share-panel" onClick={(e) => e.stopPropagation()}>
        <div className="share-header">
          <h3>{t('share.title', language)}</h3>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="share-preview">
          <img src={`data:image/jpeg;base64,${resultImage}`} alt="Preview" className="share-preview-img" />
        </div>

        <div className="share-buttons">
          {config.socialShare.facebook && (
            <button className="share-btn share-facebook" onClick={handleFacebook}>
              <span className="share-icon">📘</span>
              {t('share.facebook', language)}
            </button>
          )}

          {config.socialShare.whatsapp && (
            <button className="share-btn share-whatsapp" onClick={handleWhatsApp}>
              <span className="share-icon">💬</span>
              {t('share.whatsapp', language)}
            </button>
          )}

          {config.socialShare.messenger && (
            <button className="share-btn share-messenger" onClick={handleMessenger}>
              <span className="share-icon">💜</span>
              {t('share.messenger', language)}
            </button>
          )}

          {config.socialShare.instagram && (
            <button className="share-btn share-instagram" onClick={handleInstagram}>
              <span className="share-icon">📷</span>
              {t('share.instagram', language)}
            </button>
          )}

          {config.socialShare.download && (
            <button className="share-btn share-download" onClick={handleDownload}>
              <span className="share-icon">💾</span>
              {t('share.download', language)}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
