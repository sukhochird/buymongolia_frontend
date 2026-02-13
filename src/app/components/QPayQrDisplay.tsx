'use client';

import { QrCodeDisplay } from '@/app/components/QrCodeDisplay';

interface QPayQrDisplayProps {
  /** QPay-аас ирсэн base64 зураг. data:image/... эсвэл зөвхөн base64 string. */
  qrImage?: string | null;
  /** QPay-аас ирсэн QR текст. Энийг QR болгон үзүүлнэ. */
  qrCode?: string | null;
  size?: number;
  className?: string;
}

/**
 * qr_image эсвэл qr_code-оор QR харуулна.
 * qr_image: base64 учираас шууд img render.
 * qr_code: текстээс QR үүсгэж харуулна.
 */
export function QPayQrDisplay({ qrImage, qrCode, size = 220, className = '' }: QPayQrDisplayProps) {
  const hasImage = typeof qrImage === 'string' && qrImage.trim().length > 0;
  const hasCode = typeof qrCode === 'string' && qrCode.trim().length > 0;

  if (hasImage) {
    const src = qrImage!.startsWith('data:') ? qrImage! : `data:image/png;base64,${qrImage!}`;
    return (
      <div className={`flex justify-center p-4 bg-white rounded-lg border border-gray-200 ${className}`}>
        <img src={src} alt="QPay QR" width={size} height={size} className="w-auto h-auto max-w-full" />
      </div>
    );
  }

  if (hasCode) {
    return <QrCodeDisplay value={qrCode!} size={size} className={className} />;
  }

  return (
    <div className={`flex justify-center items-center p-6 bg-gray-100 rounded-lg border border-gray-200 min-h-[200px] ${className}`}>
      <span className="text-sm text-gray-500 text-center">QR код ирээгүй. Банкны холбоосоор төлнө үү.</span>
    </div>
  );
}
