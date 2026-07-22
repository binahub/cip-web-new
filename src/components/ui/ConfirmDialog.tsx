"use client";

import AppDialog from "@/components/ui/AppDialog";

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  /** Destructive styling for delete / irreversible actions. */
  tone?: "danger" | "default";
  isConfirming?: boolean;
}

/**
 * Focused confirmation dialog — preferred over window.confirm for destructive actions.
 */
export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "تایید",
  cancelLabel = "انصراف",
  tone = "default",
  isConfirming = false,
}: ConfirmDialogProps) {
  const confirmClass =
    tone === "danger"
      ? "bg-danger text-white hover:opacity-90"
      : "bg-accent text-black hover:opacity-90";

  return (
    <AppDialog open={open} onClose={onClose} aria-labelledby="confirm-dialog-title">
      <div className="flex flex-col px-5 pb-5 pt-5" dir="rtl">
        <h3 id="confirm-dialog-title" className="text-lg font-bold text-white">
          {title}
        </h3>
        <p className="mt-3 text-sm leading-7 text-text-secondary">{description}</p>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            disabled={isConfirming}
            onClick={onConfirm}
            className={`flex h-12 flex-1 items-center justify-center rounded-2xl font-extrabold transition-opacity disabled:opacity-50 ${confirmClass}`}
          >
            {isConfirming ? "در حال انجام..." : confirmLabel}
          </button>
          <button
            type="button"
            disabled={isConfirming}
            onClick={onClose}
            className="flex h-12 flex-1 items-center justify-center rounded-2xl border border-border-input text-text-secondary transition-opacity hover:bg-cta-pill-bg disabled:opacity-50"
          >
            {cancelLabel}
          </button>
        </div>
      </div>
    </AppDialog>
  );
}
