import { useState, useEffect } from 'react';
import { useBrand } from '../BrandContext';
import { t } from '../i18n';

export default function ProcessingOverlay() {
  const { language } = useBrand();
  const [step, setStep] = useState(0);

  const steps = [
    t('processing.step1', language),
    t('processing.step2', language),
    t('processing.step3', language),
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => (prev + 1) % steps.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <div className="processing-overlay">
      <div className="processing-content">
        <div className="processing-spinner">
          <div className="spinner-ring" />
          <div className="spinner-ring ring-2" />
          <div className="spinner-icon">✨</div>
        </div>
        <h3 className="processing-title">{t('processing.title', language)}</h3>
        <p className="processing-step">{steps[step]}</p>
        <div className="processing-dots">
          {steps.map((_, i) => (
            <span key={i} className={`dot ${i === step ? 'active' : ''}`} />
          ))}
        </div>
        <p className="processing-wait">{t('processing.wait', language)}</p>
      </div>
    </div>
  );
}
