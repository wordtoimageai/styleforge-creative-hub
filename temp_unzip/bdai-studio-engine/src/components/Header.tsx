import { useBrand } from '../BrandContext';
import { t } from '../i18n';

export default function Header() {
  const { config, language, toggleLanguage } = useBrand();
  if (!config) return null;

  return (
    <header className="app-header">
      <div className="header-inner">
        <div className="header-brand">
          {config.logo && (
            <img
              src={config.logo}
              alt={config.brandName}
              className="header-logo"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          )}
          <div className="header-text">
            <h1 className="header-title">{language === 'bn' ? config.brandNameBn : config.brandName}</h1>
            <span className="header-tagline">{t('app.title', language)}</span>
          </div>
        </div>
        <button
          className="lang-toggle"
          onClick={toggleLanguage}
          aria-label="Switch language"
        >
          <span className="lang-flag">{language === 'bn' ? '🇧🇩' : '🌐'}</span>
          <span className="lang-label">{language === 'bn' ? 'EN' : 'বাং'}</span>
        </button>
      </div>
    </header>
  );
}
