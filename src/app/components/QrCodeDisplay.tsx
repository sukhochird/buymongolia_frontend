'use client';

import { useState, useEffect } from 'react';
import { toDataURL } from 'qrcode';

interface QrCodeDisplayProps {
  value: string;
  size?: number;
  className?: string;
}

/** qr_code текстээс QR кодыг img (data URL) болгон харуулна. */
export function QrCodeDisplay({ value, size = 220, className = '' }: QrCodeDisplayProps) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [error, setError] = useState(false);

  const str = typeof value === 'string' ? value.trim() : value ? String(value).trim() : '';

  useEffect(() => {
    if (!str) {
      setDataUrl(null);
      setError(false);
      return;
    }
    setError(false);
    toDataURL(str, { width: size, margin: 2, errorCorrectionLevel: 'M' })
      .then(setDataUrl)
      .catch(() => setError(true));
  }, [str, size]);

  if (!str) return null;
  if (error) {
    return (
      <div className={`flex justify-center items-center p-4 bg-gray-100 rounded-lg border border-gray-200 min-h-[120px] ${className}`}>
        <span className="text-sm text-gray-500">QR үүсгэхэд алдаа гарлаа.</span>
      </div>
    );
  }
  if (!dataUrl) {
    return (
      <div className={`flex justify-center items-center p-4 bg-gray-100 rounded-lg border border-gray-200 ${className}`} style={{ width: size, height: size }}>
        <span className="text-sm text-gray-500">QR ачаалж байна...</span>
      </div>
    );
  }
  return (
    <div className={`flex justify-center p-4 bg-white rounded-lg border border-gray-200 ${className}`}>
      <img src={dataUrl} alt="QPay QR код" width={size} height={size} className="w-auto h-auto" />
    </div>
  );
}
