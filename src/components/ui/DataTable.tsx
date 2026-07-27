"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import Spinner from "@/components/ui/Spinner";

export interface DataTableColumn<T> {
  key: string;
  header: string;
  className?: string;
  /**
   * When set, string/number cell values longer than this length show an
   * ellipsis and the full text in a hover/focus tooltip.
   */
  truncateAt?: number;
  render: (row: T) => ReactNode;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  rows: T[];
  rowKey: (row: T) => string | number;
  isLoading?: boolean;
  emptyMessage?: string;
  /** Current page index as returned by the API (0-based or 1-based). */
  page?: number;
  totalPages?: number;
  /** Minimum allowed page value (0 or 1). Default 0. */
  minPage?: number;
  onPageChange?: (page: number) => void;
}

function TruncatedCell({
  children,
  truncateAt,
}: {
  children: ReactNode;
  truncateAt?: number;
}) {
  const triggerRef = useRef<HTMLSpanElement>(null);
  const tooltipId = useId();
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    function updatePosition() {
      const el = triggerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      setCoords({
        top: rect.top - 8,
        left: rect.left + rect.width / 2,
      });
    }

    updatePosition();
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);
    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [open]);

  if (truncateAt == null || truncateAt <= 0) {
    return <>{children}</>;
  }

  const plain =
    typeof children === "string" || typeof children === "number"
      ? String(children)
      : null;

  if (plain == null) {
    return <>{children}</>;
  }

  if (plain.length <= truncateAt) {
    return <>{plain}</>;
  }

  const short = `${plain.slice(0, truncateAt)}…`;

  return (
    <>
      <span
        ref={triggerRef}
        className="inline-flex max-w-full cursor-default justify-center outline-none"
        tabIndex={0}
        aria-describedby={open ? tooltipId : undefined}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
      >
        <span aria-hidden="true">{short}</span>
        <span className="sr-only">{plain}</span>
      </span>
      {mounted && open
        ? createPortal(
            <span
              id={tooltipId}
              role="tooltip"
              className="pointer-events-none fixed z-9999 w-max max-w-[min(18rem,70vw)] -translate-x-1/2 -translate-y-full rounded-xl border border-border-input/50 bg-dropdown-bg px-3 py-2 text-center text-xs leading-relaxed text-white shadow-lg"
              style={{ top: coords.top, left: coords.left }}
              dir="rtl"
            >
              {plain}
            </span>,
            document.body,
          )
        : null}
    </>
  );
}

export default function DataTable<T>({
  columns,
  rows,
  rowKey,
  isLoading = false,
  emptyMessage = "موردی برای نمایش وجود ندارد.",
  page,
  totalPages,
  minPage = 0,
  onPageChange,
}: DataTableProps<T>) {
  const showPagination =
    typeof page === "number" &&
    typeof totalPages === "number" &&
    totalPages > 1 &&
    typeof onPageChange === "function";

  const displayPage = typeof page === "number" ? page - minPage + 1 : 0;

  return (
    <div className="w-full" dir="rtl">
      <div className="app-scroll overflow-x-auto overscroll-x-contain rounded-2xl border border-border-input/40 bg-service-chip-bg">
        <table className="min-w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-border-input/30 bg-dropdown-bg/80">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`whitespace-nowrap px-4 py-3 text-center font-semibold text-text-secondary ${column.className ?? ""}`}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-10">
                  <Spinner className="py-0" />
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-10 text-center text-text-secondary"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr
                  key={rowKey(row)}
                  className="border-b border-border-input/20 last:border-b-0 transition-colors hover:bg-cta-pill-bg/40"
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={`px-4 py-3 text-center align-middle text-white/90 ${column.className ?? ""}`}
                    >
                      <TruncatedCell truncateAt={column.truncateAt}>
                        {column.render(row)}
                      </TruncatedCell>
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showPagination ? (
        <div className="mt-4 flex items-center justify-between gap-3">
          <button
            type="button"
            disabled={page! <= minPage}
            onClick={() => onPageChange!(page! - 1)}
            className="rounded-xl border border-border-input px-4 py-2 text-sm text-accent transition-opacity hover:bg-cta-pill-bg disabled:pointer-events-none disabled:opacity-40"
          >
            قبلی
          </button>
          <span className="text-sm text-text-secondary" dir="ltr">
            {displayPage} / {totalPages}
          </span>
          <button
            type="button"
            disabled={page! >= minPage + totalPages! - 1}
            onClick={() => onPageChange!(page! + 1)}
            className="rounded-xl border border-border-input px-4 py-2 text-sm text-accent transition-opacity hover:bg-cta-pill-bg disabled:pointer-events-none disabled:opacity-40"
          >
            بعدی
          </button>
        </div>
      ) : null}
    </div>
  );
}
