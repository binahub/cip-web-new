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
