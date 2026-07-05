import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format currency in Malawi Kwacha (MWK)
 * @param amount - Amount in kwacha
 * @param showSymbol - Whether to show MK symbol (default: true)
 * @returns Formatted currency string (e.g., "MK 1,234.56" or "1,234.56")
 */
export function formatCurrency(amount: number | string, showSymbol: boolean = true): string {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount
  
  if (isNaN(numAmount)) {
    return showSymbol ? 'MK 0.00' : '0.00'
  }

  const formatted = new Intl.NumberFormat('en-MW', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numAmount)

  return showSymbol ? `MK ${formatted}` : formatted
}

/**
 * Format date in readable format
 * @param date - Date string or Date object
 * @param formatStr - Format string (default: "MMM dd, yyyy")
 * @returns Formatted date string
 */
export function formatDate(date: Date | string, formatStr: string = 'MMM dd, yyyy'): string {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    
    if (isNaN(dateObj.getTime())) {
      return 'Invalid date'
    }
    
    return format(dateObj, formatStr)
  } catch (error) {
    console.error('[v0] Error formatting date:', error)
    return 'Invalid date'
  }
}

/**
 * Format date and time in readable format
 * @param date - Date string or Date object
 * @returns Formatted date and time string (e.g., "Jan 15, 2024 at 2:30 PM")
 */
export function formatDateTime(date: Date | string): string {
  return formatDate(date, 'MMM dd, yyyy \'at\' h:mm a')
}

/**
 * Format phone number in Malawi format
 * @param phone - Phone number string
 * @returns Formatted phone number (e.g., "+265 9 87654321")
 */
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')
  
  if (cleaned.length === 0) return phone
  
  // Handle Malawi numbers
  if (cleaned.startsWith('265')) {
    // International format: +265 9 87654321
    return `+${cleaned.slice(0, 3)} ${cleaned.slice(3, 4)} ${cleaned.slice(4)}`
  }
  
  if (cleaned.startsWith('0')) {
    // Local format: 0 9 87654321
    return `${cleaned.slice(0, 1)} ${cleaned.slice(1, 2)} ${cleaned.slice(2)}`
  }
  
  return phone
}

/**
 * Truncate text with ellipsis
 * @param text - Text to truncate
 * @param length - Max length
 * @returns Truncated text with ellipsis
 */
export function truncateText(text: string, length: number = 50): string {
  if (!text || text.length <= length) return text
  return `${text.slice(0, length)}...`
}
