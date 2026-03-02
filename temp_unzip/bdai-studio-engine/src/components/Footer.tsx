import { useBrand } from '../BrandContext';
import { t } from '../i18n';

export default function Footer() {
  const { config, language } = useBrand();
  if (!config) return null;

  return (
    <footer className="app-footer">
      {config.contactWhatsApp && (
        <a
          href={`https://wa.me/${config.contactWhatsApp.replace(/[^0-9]/g, '')}`}
          className="footer-support"
          target="_blank"
          rel="noopener noreferrer"
        >
          💬 {t('footer.support', language)}
        </a>
      )}
      {config.poweredByBadge && (
        <div className="footer-powered">
          <span className="powered-badge">
            ⚡ {t('app.poweredBy', language)}
          </span>
        </div>
      )}
      <div className="footer-links">
        <a href="https://bdai.studio/terms" target="_blank" rel="noopener noreferrer">
          {t('footer.terms', language)}
        </a>
        <span className="footer-dot">·</span>
        <a href="https://bdai.studio/privacy" target="_blank" rel="noopener noreferrer">
          {t('footer.privacy', language)}
        </a>
      </div>
      <p className="footer-copyright">{t('footer.copyright', language)}</p>
    </footer>
  );
}
