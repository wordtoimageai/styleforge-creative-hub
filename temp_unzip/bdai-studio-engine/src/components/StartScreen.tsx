import { useRef } from 'react';
import { useBrand } from '../BrandContext';
import { t } from '../i18n';

interface Props {
  onTakePhoto: () => void;
  onUploadPhoto: (photo: string) => void;
  onBrowseFirst: () => void;
}

export default function StartScreen({ onTakePhoto, onUploadPhoto, onBrowseFirst }: Props) {
  const { config, language } = useBrand();
  const fileRef = useRef<HTMLInputElement>(null);

  if (!config) return null;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert(language === 'bn' ? 'ছবি ১০MB এর কম হতে হবে' : 'Image must be under 10MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1];
      onUploadPhoto(base64);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="start-screen">
      <div className="start-hero">
        <div className="start-brand-badge">
          {config.logo && <img src={config.logo} alt="" className="start-brand-logo" />}
        </div>
        <h2 className="start-heading">
          {language === 'bn' ? config.taglineBn : config.tagline}
        </h2>
        <p className="start-subtext">{t('start.instruction', language)}</p>
      </div>

      <div className="start-actions">
        <button className="btn btn-primary btn-lg" onClick={onTakePhoto}>
          {t('start.takePhoto', language)}
        </button>

        <button className="btn btn-secondary btn-lg" onClick={() => fileRef.current?.click()}>
          {t('start.uploadPhoto', language)}
        </button>

        <button className="btn btn-ghost btn-lg" onClick={onBrowseFirst}>
          {t('start.browseFirst', language)}
        </button>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />

      <div className="start-tips">
        <p className="tip-item">{t('start.photoTip', language)}</p>
        <p className="tip-privacy">{t('start.privacy', language)}</p>
      </div>
    </div>
  );
}
