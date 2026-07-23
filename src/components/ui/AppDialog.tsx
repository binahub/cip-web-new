"use client";

import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";

interface AppDialogProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  /** Extra classes for the dialog panel shell. */
  className?: string;
  /** Accessible title for screen readers when no visible heading is wired. */
  "aria-labelledby"?: string;
}

/**
 * Viewport-fixed dialog via portal — avoids sticky headers / overflow ancestors
 * clipping or covering the panel (common on profile mobile layouts).
 */
export default function AppDialog({
  open,
  onClose,
  children,
  className = "",
  "aria-labelledby": ariaLabelledBy,
}: AppDialogProps) {
  const [mounted, setMounted] = useState(false);

  useBodyScrollLock(open);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-300 flex items-end justify-center overflow-hidden p-0 sm:items-center sm:p-6">
      <button
        type="button"
        aria-label="بستن"
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={ariaLabelledBy}
        className={`relative z-10 flex min-h-0 w-full max-h-[min(90dvh,720px)] flex-col overflow-hidden rounded-t-3xl border border-border-input/40 bg-dropdown-bg shadow-2xl sm:max-h-[min(85dvh,680px)] sm:max-w-lg sm:rounded-3xl ${className}`}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
}
