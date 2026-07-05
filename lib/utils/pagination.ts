import { PAGINATION_CONFIG } from '@/lib/config';

export interface PaginationParams {
  page: number;
  page_size: number;
}

export interface PaginatedResponse<T> {
  results: T[];
  count: number;
  next: string | null;
  previous: string | null;
  page?: number;
  page_size?: number;
  total_pages?: number;
}

export interface PaginationState {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/**
 * Calculate pagination params from current page and page size
 */
export function getPaginationParams(page: number, pageSize: number): PaginationParams {
  return {
    page: Math.max(1, page),
    page_size: Math.min(pageSize, PAGINATION_CONFIG.maxPageSize),
  };
}

/**
 * Calculate offset for SQL LIMIT/OFFSET queries
 */
export function getOffsetAndLimit(page: number, pageSize: number) {
  const validPage = Math.max(1, page);
  const offset = (validPage - 1) * pageSize;
  return { offset, limit: pageSize };
}

/**
 * Build query string from pagination params
 */
export function buildPaginationQuery(params: PaginationParams): string {
  return `page=${params.page}&page_size=${params.page_size}`;
}

/**
 * Extract pagination info from response
 */
export function extractPaginationInfo<T>(
  response: PaginatedResponse<T>,
  currentPage: number,
  pageSize: number
): PaginationState {
  const totalPages = Math.ceil(response.count / pageSize);

  return {
    currentPage,
    pageSize,
    totalItems: response.count,
    totalPages,
    hasNextPage: !!response.next,
    hasPreviousPage: !!response.previous,
  };
}

/**
 * Generate page numbers for pagination controls
 */
export function generatePageNumbers(
  currentPage: number,
  totalPages: number,
  siblingCount: number = 1
): (number | string)[] {
  const totalPageNumbers = siblingCount + 5; // Current + siblings + first + last + ellipsis

  if (totalPages <= totalPageNumbers) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
  const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

  const shouldShowLeftEllipsis = leftSiblingIndex > 2;
  const shouldShowRightEllipsis = rightSiblingIndex < totalPages - 2;

  const leftRange = Array.from(
    { length: rightSiblingIndex - leftSiblingIndex + 1 },
    (_, i) => leftSiblingIndex + i
  );

  if (shouldShowLeftEllipsis && !shouldShowRightEllipsis) {
    return [1, '...', ...leftRange, totalPages];
  }

  if (!shouldShowLeftEllipsis && shouldShowRightEllipsis) {
    return [1, ...leftRange, '...', totalPages];
  }

  if (shouldShowLeftEllipsis && shouldShowRightEllipsis) {
    return [1, '...', ...leftRange, '...', totalPages];
  }

  return [1, ...leftRange, totalPages];
}

/**
 * Validate page number
 */
export function isValidPageNumber(page: number | null, totalPages: number): boolean {
  if (!page) return false;
  return page >= 1 && page <= totalPages;
}

/**
 * Build URL with pagination params
 */
export function buildPaginationURL(
  baseURL: string,
  params: PaginationParams,
  additionalParams?: Record<string, any>
): string {
  const url = new URL(baseURL);
  url.searchParams.set('page', params.page.toString());
  url.searchParams.set('page_size', params.page_size.toString());

  if (additionalParams) {
    Object.entries(additionalParams).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        url.searchParams.set(key, String(value));
      }
    });
  }

  return url.toString();
}

/**
 * Format pagination info for display
 */
export function formatPaginationInfo(
  currentPage: number,
  pageSize: number,
  totalItems: number
): string {
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);
  return `Showing ${startItem} to ${endItem} of ${totalItems} items`;
}
