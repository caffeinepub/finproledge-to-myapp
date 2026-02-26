/**
 * Generic sort and filter utilities for table data.
 */

export type SortDirection = 'asc' | 'desc' | null;

export interface SortState {
  column: string | null;
  direction: SortDirection;
}

/**
 * Sort an array of objects by a given key and direction.
 * Handles string, number, bigint comparisons.
 */
export function genericSort<T extends Record<string, unknown>>(
  data: T[],
  key: string,
  direction: 'asc' | 'desc'
): T[] {
  return [...data].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];

    if (aVal == null && bVal == null) return 0;
    if (aVal == null) return direction === 'asc' ? -1 : 1;
    if (bVal == null) return direction === 'asc' ? 1 : -1;

    let cmp = 0;
    if (typeof aVal === 'bigint' && typeof bVal === 'bigint') {
      cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
    } else if (typeof aVal === 'number' && typeof bVal === 'number') {
      cmp = aVal - bVal;
    } else {
      cmp = String(aVal).toLowerCase().localeCompare(String(bVal).toLowerCase());
    }

    return direction === 'asc' ? cmp : -cmp;
  });
}

/**
 * Filter an array of objects by a map of field keys to filter strings.
 * All filters are ANDed together. Empty filter values are ignored.
 */
export function multiFilter<T extends Record<string, unknown>>(
  data: T[],
  filters: Record<string, string>
): T[] {
  return data.filter((row) => {
    return Object.entries(filters).every(([key, filterVal]) => {
      if (!filterVal || filterVal.trim() === '') return true;
      const cellVal = row[key];
      if (cellVal == null) return false;
      return String(cellVal).toLowerCase().includes(filterVal.toLowerCase());
    });
  });
}

/**
 * Toggle sort direction: null → asc → desc → null
 */
export function toggleSortDirection(
  currentColumn: string | null,
  currentDirection: SortDirection,
  newColumn: string
): SortState {
  if (currentColumn !== newColumn) {
    return { column: newColumn, direction: 'asc' };
  }
  if (currentDirection === 'asc') return { column: newColumn, direction: 'desc' };
  if (currentDirection === 'desc') return { column: null, direction: null };
  return { column: newColumn, direction: 'asc' };
}
