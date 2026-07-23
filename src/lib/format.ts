import { DateObject } from "react-multi-date-picker";
import gregorian from "react-date-object/calendars/gregorian";
import persian from "react-date-object/calendars/persian";

/** Format a date string to a human-readable format. */
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

/** Empty / whitespace-only strings become `null` for CIP API payloads. */
export function nullIfEmpty(value: string | null | undefined): string | null {
  if (value == null) return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

/**
 * True when `YYYY/MM/DD` is a real calendar date.
 * Years below 1800 are treated as Jalali; otherwise Gregorian.
 * Rejects impossible values like `1355/55/55` or `2024/02/31`.
 */
export function isValidCalendarDate(value: string): boolean {
  const english = toEnglishDigits(value).trim();
  const match = /^(\d{4})\/(\d{2})\/(\d{2})$/.exec(english);
  if (!match) return false;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  if (month < 1 || month > 12 || day < 1 || day > 31) return false;

  const calendar = year < 1800 ? persian : gregorian;
  const date = new DateObject({ year, month, day, calendar });

  return (
    date.isValid &&
    date.year === year &&
    date.month.number === month &&
    date.day === day
  );
}

/** True when HTML `type="date"` value `YYYY-MM-DD` is a real Gregorian date. */
export function isValidIsoDateInput(value: string): boolean {
  const english = toEnglishDigits(value).trim();
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(english);
  if (!match) return false;
  return isValidCalendarDate(`${match[1]}/${match[2]}/${match[3]}`);
}

/**
 * Live mask for birth dates: `YYYY/MM/DD`.
 * Inserts `/` as soon as year (4 digits) or month (2 digits) is complete,
 * so newcomers see the structure without typing the slash themselves.
 */
export function maskBirthDateInput(raw: string, previousValue = ""): string {
  let digits = toEnglishDigits(raw).replace(/\D/g, "").slice(0, 8);
  const prevDigits = toEnglishDigits(previousValue).replace(/\D/g, "").slice(0, 8);
  const rawEnglish = toEnglishDigits(raw);

  // Backspace on an auto-inserted trailing `/` should delete the last digit too.
  if (
    previousValue.endsWith("/") &&
    rawEnglish.length < previousValue.length &&
    digits.length === prevDigits.length &&
    digits.length > 0
  ) {
    digits = digits.slice(0, -1);
  }

  if (!digits) return "";

  const year = digits.slice(0, 4);
  const month = digits.slice(4, 6);
  const day = digits.slice(6, 8);

  let masked = year;
  if (digits.length >= 4) masked += "/";
  if (month) masked += month;
  if (digits.length >= 6) masked += "/";
  if (day) masked += day;
  return masked;
}

/** Normalize stored birth dates to `YYYY/MM/DD` for form inputs. */
export function normalizeBirthDateInput(value: string | null | undefined): string {
  if (!value) return "";
  const english = toEnglishDigits(value).trim();
  if (/^\d{4}\/\d{2}\/\d{2}/.test(english)) return english.slice(0, 10);
  if (/^\d{4}-\d{2}-\d{2}/.test(english)) return english.slice(0, 10).replace(/-/g, "/");
  if (english.includes("T")) {
    const date = new Date(english);
    if (!Number.isNaN(date.getTime())) {
      return date.toISOString().slice(0, 10).replace(/-/g, "/");
    }
  }
  return maskBirthDateInput(english);
}

/**
 * Convert masked birth date (`YYYY/MM/DD`, Jalali or Gregorian) to API ISO
 * with zeroed time: `YYYY-MM-DDT00:00:00.000Z`.
 * Years below 1800 are treated as Jalali.
 */
export function birthDateInputToIso(dateInput: string): string {
  if (!isValidCalendarDate(dateInput)) return "";

  const english = toEnglishDigits(dateInput).trim();
  const match = /^(\d{4})\/(\d{2})\/(\d{2})$/.exec(english);
  if (!match) return "";

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  let gYear = year;
  let gMonth = month;
  let gDay = day;

  if (year < 1800) {
    const converted = new DateObject({
      year,
      month,
      day,
      calendar: persian,
    }).convert(gregorian);
    gYear = converted.year;
    gMonth = converted.month.number;
    gDay = converted.day;
  }

  return new Date(Date.UTC(gYear, gMonth - 1, gDay, 0, 0, 0, 0)).toISOString();
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
