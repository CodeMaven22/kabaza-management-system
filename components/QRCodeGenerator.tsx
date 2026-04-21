'use client';

import { QRCodeCanvas } from 'qrcode.react';

interface QRCodeGeneratorProps {
  value: string;
  size?: number;
  level?: 'L' | 'M' | 'Q' | 'H';
  includeMargin?: boolean;
}

export function QRCodeGenerator({
  value,
  size = 200,
  level = 'H',
  includeMargin = true,
}: QRCodeGeneratorProps) {
  return (
    <div className="flex justify-center items-center p-4">
      <QRCodeCanvas value={value} size={size} level={level} includeMargin={includeMargin} />
    </div>
  );
}

export function QRCodeViewer({ registrationNumber }: { registrationNumber: string }) {
  const downloadQRCode = () => {
    const qrCodeElement = document.getElementById(`qr-${registrationNumber}`);
    if (qrCodeElement) {
      const canvas = qrCodeElement.querySelector('canvas');
      if (canvas) {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = `${registrationNumber}-qr.png`;
        link.click();
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-6 bg-white rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900">Registration QR Code</h3>
      <div id={`qr-${registrationNumber}`}>
        <QRCodeCanvas value={registrationNumber} size={256} level="H" includeMargin={true} />
      </div>
      <p className="text-sm text-gray-600">{registrationNumber}</p>
      <button
        onClick={downloadQRCode}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Download QR Code
      </button>
    </div>
  );
}
