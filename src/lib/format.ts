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
