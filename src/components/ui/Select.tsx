"use client";

import {
  forwardRef,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type FocusEvent,
  type ReactNode,
  type SelectHTMLAttributes,
} from "react";
import { ArrowDown2, SearchNormal1 } from "iconsax-react";
import Skeleton from "@/components/ui/Skeleton";
import { toEnglishDigits } from "@/lib/format";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "children"> {
  options: SelectOption[];
  label?: string;
  error?: string;
  placeholder?: string;
  leadingIcon?: ReactNode;
  /** Shows a layout-matched skeleton while options load from the API. */
  isLoading?: boolean;
  /** Enables a search field inside the dropdown to filter options. */
  searchable?: boolean;
  searchPlaceholder?: string;
}

function normalizeSearch(value: string) {
  return toEnglishDigits(value).trim().toLowerCase();
}

/**
 * Shared custom select (dropdown) — accent hover/selected, RHF-compatible.
 */
const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      options,
      placeholder = "انتخاب کنید",
      leadingIcon,
      isLoading = false,
      searchable = false,
      searchPlaceholder = "جستجو...",
      className = "",
      id,
      disabled,
      name,
      value,
      defaultValue,
      onChange,
      onBlur,
      ...props
    },
    ref,
  ) => {
    const selectId = id ?? (label ? label.replace(/\s+/g, "-") : undefined);
    const listboxId = useId();
    const rootRef = useRef<HTMLDivElement>(null);
    const hiddenRef = useRef<HTMLSelectElement | null>(null);
    const searchRef = useRef<HTMLInputElement>(null);
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [internalValue, setInternalValue] = useState(String(defaultValue ?? ""));

    const isControlled = value !== undefined;
    const currentValue = isControlled ? String(value ?? "") : internalValue;
    const selected = options.find((option) => option.value === currentValue);

    const filteredOptions = useMemo(() => {
      if (!searchable || !query.trim()) return options;
      const needle = normalizeSearch(query);
      return options.filter((option) => normalizeSearch(option.label).includes(needle));
    }, [options, query, searchable]);

    function setRefs(node: HTMLSelectElement | null) {
      hiddenRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;

      // After RHF attaches the ref (and applies form values / reset), sync display.
      if (node && !isControlled) {
        setInternalValue(node.value);
      }
    }

    useEffect(() => {
      if (isControlled) {
        return;
      }
      if (defaultValue !== undefined) {
        setInternalValue(String(defaultValue ?? ""));
      }
    }, [defaultValue, isControlled]);

    // Keep display in sync when RHF writes `.value` on reset (uncontrolled mode).
    useEffect(() => {
      const select = hiddenRef.current;
      if (!select || isControlled) return;

      const proto = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, "value");
      if (!proto?.get || !proto?.set) return;

      Object.defineProperty(select, "value", {
        configurable: true,
        enumerable: true,
        get() {
          return proto.get!.call(this);
        },
        set(next: string) {
          proto.set!.call(this, next);
          setInternalValue(String(next ?? ""));
        },
      });

      return () => {
        Object.defineProperty(select, "value", {
          configurable: true,
          enumerable: proto.enumerable,
          get: proto.get,
          set: proto.set,
        });
      };
    }, [isControlled, name, isLoading]);

    useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
        if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
          setOpen(false);
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
      if (!open) {
        setQuery("");
        return;
      }
      if (searchable) {
        requestAnimationFrame(() => searchRef.current?.focus());
      }
    }, [open, searchable]);

    function commit(next: string) {
      if (!isControlled) setInternalValue(next);
      if (hiddenRef.current) hiddenRef.current.value = next;

      onChange?.({
        target: { name, value: next },
        currentTarget: { name, value: next },
      } as ChangeEvent<HTMLSelectElement>);
      setOpen(false);
      setQuery("");
    }

    function handleBlur(event: FocusEvent<HTMLButtonElement>) {
      onBlur?.({
        target: { name, value: currentValue },
        currentTarget: { name, value: currentValue },
      } as FocusEvent<HTMLSelectElement>);
      void event;
    }

    if (isLoading) {
      return (
        <div
          className={`flex w-full flex-col gap-1.5 ${className}`}
          dir="rtl"
          aria-busy="true"
          aria-live="polite"
        >
          {label ? <Skeleton className="ml-auto h-4 w-24" /> : null}
          <Skeleton className="h-14 w-full rounded-2xl" />
          <span className="sr-only">در حال بارگذاری گزینه‌ها</span>
        </div>
      );
    }

    return (
      <div ref={rootRef} className={`relative flex w-full flex-col gap-1.5 ${className}`} dir="rtl">
        {label ? (
          <label htmlFor={selectId} className="text-sm font-medium text-text-secondary">
            {label}
          </label>
        ) : null}

        <select
          ref={setRefs}
          id={selectId}
          name={name}
          disabled={disabled}
          value={currentValue}
          tabIndex={-1}
          aria-hidden="true"
          className="pointer-events-none absolute h-0 w-0 opacity-0"
          {...props}
          onChange={onChange}
          onBlur={onBlur}
        >
          {placeholder ? <option value="">{placeholder}</option> : null}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <button
          type="button"
          id={label ? undefined : selectId}
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listboxId}
          onClick={() => !disabled && setOpen((prev) => !prev)}
          onBlur={handleBlur}
          className={`flex h-14 w-full items-center gap-2 rounded-2xl border bg-transparent px-4 transition-colors disabled:opacity-50 ${
            error ? "border-danger" : "border-border-input focus:border-accent/60"
          }`}
        >
          {leadingIcon}
          <span
            className={`min-w-0 flex-1 truncate text-right text-sm sm:text-base ${
              selected ? "text-white" : "text-text-secondary"
            }`}
          >
            {selected?.label || placeholder}
          </span>
          <ArrowDown2 size={16} color="#969696" variant="Linear" />
        </button>

        {open ? (
          <div
            id={listboxId}
            role="listbox"
            className="absolute inset-x-0 top-full z-[100] mt-2 overflow-hidden rounded-2xl border border-border-input bg-dropdown-bg shadow-2xl"
          >
            {searchable ? (
              <div className="border-b border-border-input/20 p-2">
                <div className="flex h-11 items-center gap-2 rounded-xl border border-border-input/40 bg-transparent px-3">
                  <SearchNormal1 size={16} color="#969696" variant="Linear" />
                  <input
                    ref={searchRef}
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder={searchPlaceholder}
                    className="min-w-0 flex-1 bg-transparent text-right text-sm text-white outline-none placeholder:text-text-secondary"
                    aria-label={searchPlaceholder}
                    autoComplete="off"
                  />
                </div>
              </div>
            ) : null}

            <div className="app-scroll max-h-60 overflow-y-auto overflow-x-hidden overscroll-contain py-2">
              {placeholder && !query.trim() ? (
                <button
                  type="button"
                  role="option"
                  aria-selected={currentValue === ""}
                  dir="rtl"
                  onClick={() => commit("")}
                  className={`w-full px-4 py-3 text-right text-sm transition-colors hover:bg-cta-pill-bg sm:text-base ${
                    currentValue === "" ? "text-accent" : "text-text-secondary"
                  }`}
                >
                  {placeholder}
                </button>
              ) : null}

              {filteredOptions.length === 0 ? (
                <p className="px-4 py-3 text-right text-sm text-text-secondary">موردی یافت نشد.</p>
              ) : (
                filteredOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    role="option"
                    aria-selected={currentValue === option.value}
                    dir="rtl"
                    onClick={() => commit(option.value)}
                    className={`w-full px-4 py-3 text-right text-sm transition-colors hover:bg-cta-pill-bg sm:text-base ${
                      currentValue === option.value ? "text-accent" : "text-text-secondary"
                    }`}
                  >
                    {option.label}
                  </button>
                ))
              )}
            </div>
          </div>
        ) : null}

        {error ? <p className="text-xs text-danger">{error}</p> : null}
      </div>
    );
  },
);

Select.displayName = "Select";

export default Select;
