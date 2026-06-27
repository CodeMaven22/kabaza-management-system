'use client';

import { Bike } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, FileText, Edit, Eye, Printer } from 'lucide-react';
import { useState } from 'react';

interface BikeActionsProps {
  bike: Bike;
  onEdit?: (bike: Bike) => void;
  onViewDetails?: (bike: Bike) => void;
}

export function BikeActions({ bike, onEdit, onViewDetails }: BikeActionsProps) {
  const [isPrintingReceipt, setIsPrintingReceipt] = useState(false);
  const [isPrintingSticker, setIsPrintingSticker] = useState(false);

  const handlePrintReceipt = async () => {
    setIsPrintingReceipt(true);
    console.log('[v0] Printing receipt for bike:', bike.registrationNumber);

    // Simulate print receipt
    const receiptContent = `
      ===============================================
      BIKE REGISTRATION RECEIPT
      ===============================================
      Receipt Number: ${bike.receiptNumber}
      Bike Registration: ${bike.registrationNumber}
      Owner ID: ${bike.ownerId}
      Operator ID: ${bike.operatorId}
      Color: ${bike.color}
      Type: ${bike.bikeType}
      Registration Date: ${bike.registrationDate}
      QR Code: ${bike.qrCode}
      Sticker Code: ${bike.stickerCode}
      ===============================================
    `;

    const printWindow = window.open('', '', 'height=400,width=600');
    if (printWindow) {
      printWindow.document.write('<pre>' + receiptContent + '</pre>');
      printWindow.document.close();
      printWindow.print();
    }

    setIsPrintingReceipt(false);
  };

  const handlePrintSticker = async () => {
    setIsPrintingSticker(true);
    console.log('[v0] Printing sticker for bike:', bike.registrationNumber);

    // Simulate print sticker with QR code and sticker code
    const stickerContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Bike Sticker</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          .sticker { border: 3px solid black; padding: 20px; width: 400px; height: 300px; }
          .code { font-size: 32px; font-weight: bold; text-align: center; margin: 20px 0; }
          .qr { text-align: center; padding: 20px; }
          .info { text-align: center; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="sticker">
          <div class="code">${bike.stickerCode}</div>
          <div class="info">
            <p><strong>Registration:</strong> ${bike.registrationNumber}</p>
            <p><strong>Bike Type:</strong> ${bike.bikeType}</p>
            <p><strong>Color:</strong> ${bike.color}</p>
          </div>
          <div class="qr">
            <p><strong>QR Code:</strong> ${bike.qrCode}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const printWindow = window.open('', '', 'height=500,width=700');
    if (printWindow) {
      printWindow.document.write(stickerContent);
      printWindow.document.close();
      printWindow.print();
    }

    setIsPrintingSticker(false);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onViewDetails?.(bike)} className="cursor-pointer">
          <Eye className="mr-2 h-4 w-4" />
          View Details
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onEdit?.(bike)} className="cursor-pointer">
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handlePrintReceipt} disabled={isPrintingReceipt} className="cursor-pointer">
          <FileText className="mr-2 h-4 w-4" />
          {isPrintingReceipt ? 'Printing Receipt...' : 'Print Receipt'}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handlePrintSticker} disabled={isPrintingSticker} className="cursor-pointer">
          <Printer className="mr-2 h-4 w-4" />
          {isPrintingSticker ? 'Printing Sticker...' : 'Print Sticker'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
