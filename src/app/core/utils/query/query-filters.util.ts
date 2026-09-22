export type SearchField<T> = keyof T | ((item: T) => unknown);

type DateValue = Date | string | number | null | undefined;

export type DateField<T> = {
  [K in keyof T]: T[K] extends DateValue ? K : never;
}[keyof T] | ((item: T) => DateValue);

export interface DateRangeFilterOptions {
  includeMissing?: boolean;
}

function getFieldValue<T>(item: T, field: SearchField<T>): unknown {
  return typeof field === 'function' ? field(item) : item[field];
}

function toDateOnly(value: DateValue): string | null {
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value.toISOString().slice(0, 10);
  }

  if (typeof value === 'string') {
    const dateOnly = value.slice(0, 10);
    return dateOnly ? dateOnly : null;
  }

  if (typeof value === 'number') {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date.toISOString().slice(0, 10);
  }

  return null;
}

/** Returns items whose configured fields contain the supplied term, case-insensitively. */
export function filterBySearch<T>(
  data: readonly T[],
  term: string | null | undefined,
  fields: readonly SearchField<T>[],
): T[] {
  const normalizedTerm = term?.trim().toLocaleLowerCase();

  if (!normalizedTerm || fields.length === 0) {
    return [...data];
  }

  return data.filter((item) =>
    fields.some((field) => {
      const value = getFieldValue(item, field);
      return value !== null && value !== undefined
        && String(value).toLocaleLowerCase().includes(normalizedTerm);
    }),
  );
}

/** Returns items whose configured date is inclusively within the supplied ISO date range. */
export function filterByDateRange<T>(
  data: readonly T[],
  range: { startDate?: string; endDate?: string },
  field: DateField<T>,
  options: DateRangeFilterOptions = {},
): T[] {
  const startDate = range.startDate?.slice(0, 10);
  const endDate = range.endDate?.slice(0, 10);

  if (!startDate || !endDate) {
    return [...data];
  }

  return data.filter((item) => {
    const value: DateValue = typeof field === 'function'
      ? field(item)
      : item[field] as DateValue;
    const itemDate = toDateOnly(value);
    return itemDate === null
      ? options.includeMissing === true
      : itemDate >= startDate && itemDate <= endDate;
  });
}

/** Returns items where a field matches the supplied value, or passes a supplied predicate. */
export function filterByField<T, K extends keyof T>(
  data: readonly T[],
  field: K,
  expected: T[K] | ((value: T[K], item: T) => boolean),
): T[] {
  return data.filter((item) =>
    typeof expected === 'function'
      ? (expected as (value: T[K], item: T) => boolean)(item[field], item)
      : Object.is(item[field], expected),
  );
}
