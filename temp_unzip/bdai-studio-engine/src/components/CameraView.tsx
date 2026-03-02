import { useRef, useState, useEffect, useCallback } from 'react';
import { useBrand } from '../BrandContext';
import { t } from '../i18n';

interface Props {
  onCapture: (photo: string) => void;
  onBack: () => void;
}

export default function CameraView({ onCapture, onBack }: Props) {
  const { language } = useBrand();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [captured, setCaptured] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startCamera = useCallback(async (facing: 'user' | 'environment') => {
    try {
      if (stream) stream.getTracks().forEach((t) => t.stop());

      const newStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facing, width: { ideal: 1280 }, height: { ideal: 1920 } },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
        await videoRef.current.play();
      }
      setStream(newStream);
      setError(null);
    } catch {
      setError(t('camera.error', language));
    }
  }, [stream, language]);

  useEffect(() => {
    startCamera(facingMode);
    return () => { stream?.getTracks().forEach((t) => t.stop()); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCapture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Mirror if front camera
    if (facingMode === 'user') {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(video, 0, 0);

    const base64 = canvas.toDataURL('image/jpeg', 0.85).split(',')[1];
    setCaptured(base64);
  };

  const handleSwitch = () => {
    const newFacing = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(newFacing);
    startCamera(newFacing);
  };

  const handleUse = () => {
    if (captured) onCapture(captured);
  };

  const handleRetake = () => {
    setCaptured(null);
    startCamera(facingMode);
  };

  if (error) {
    return (
      <div className="camera-error">
        <p className="error-icon">📸</p>
        <p>{error}</p>
        <button className="btn btn-secondary" onClick={onBack}>
          ← {t('start.uploadPhoto', language)}
        </button>
      </div>
    );
  }

  return (
    <div className="camera-view">
      <button className="camera-back-btn" onClick={onBack}>←</button>

      {!captured ? (
        <>
          <div className="camera-viewport">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`camera-video ${facingMode === 'user' ? 'mirrored' : ''}`}
            />
            <div className="camera-guide">
              <div className="guide-frame" />
              <span className="guide-text">{t('camera.guide', language)}</span>
            </div>
          </div>

          <div className="camera-controls">
            <button className="camera-switch-btn" onClick={handleSwitch}>
              🔄
            </button>
            <button className="camera-capture-btn" onClick={handleCapture}>
              <span className="capture-ring" />
            </button>
            <div style={{ width: 48 }} />
          </div>
        </>
      ) : (
        <>
          <div className="camera-preview">
            <img
              src={`data:image/jpeg;base64,${captured}`}
              alt="Captured"
              className="preview-image"
            />
          </div>
          <div className="camera-confirm">
            <button className="btn btn-secondary" onClick={handleRetake}>
              {t('camera.retake', language)}
            </button>
            <button className="btn btn-primary" onClick={handleUse}>
              {t('camera.use', language)} ✓
            </button>
          </div>
        </>
      )}

      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
}
