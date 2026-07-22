/**
 * Format a date string to a human-readable format.
 */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/** Persian (Jalali-aware locale) date for profile UI. */
export function formatDateFa(dateString: string): string {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;
  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

/**
 * Format a number as currency.
 */
export function formatCurrency(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
}

/**
 * Format a price for Persian UI (Persian digits + thousand separators).
 */
export function formatPrice(price: string | number): string {
  const amount = typeof price === "string" ? Number(price) : price;
  if (Number.isNaN(amount)) return String(price);
  return new Intl.NumberFormat("fa-IR").format(amount);
}

/** Convert `YYYY-MM-DD` (date input) to ISO string for APIs. */
export function dateInputToIso(dateInput: string): string {
  if (!dateInput) return "";
  if (dateInput.includes("T")) return dateInput;
  return new Date(`${dateInput}T00:00:00.000Z`).toISOString();
}

/** Convert ISO / date string to `YYYY-MM-DD` for date inputs. */
export function isoToDateInput(value: string | null | undefined): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value.slice(0, 10);
  return date.toISOString().slice(0, 10);
}

/** Convert Persian/Arabic digits to Latin digits. */
export function toEnglishDigits(value: string): string {
  return value
    .replace(/[۰-۹]/g, (digit) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit)))
    .replace(/[٠-٩]/g, (digit) => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)));
}

/**
 * Build CIP flight datetime: `1404/12/06 14:30:00`
 * from separate Jalali date + time DateObject values.
 */
export function formatJalaliDateTime(
  date: { format: (pattern: string) => string } | null | undefined,
  time: { format: (pattern: string) => string } | null | undefined,
): string | null {
  if (!date || !time) return null;
  const datePart = toEnglishDigits(date.format("YYYY/MM/DD"));
  const timePart = toEnglishDigits(time.format("HH:mm:ss"));
  if (!datePart || !timePart) return null;
  return `${datePart} ${timePart}`;
}
