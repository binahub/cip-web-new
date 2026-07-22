"use client";

import { CloseSquare } from "iconsax-react";
import LoginForm from "@/components/auth/LoginForm";
import SignupForm from "@/components/auth/SignupForm";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import type { AuthModalView, AuthSessionData } from "@/services/auth/auth.types";
import { useEffect } from "react";

interface AuthModalProps {
  open: boolean;
  view: AuthModalView;
  onViewChange: (view: AuthModalView) => void;
  onClose: () => void;
  onAuthenticated: (session: AuthSessionData, options?: { successMessage?: string }) => void;
}

export default function AuthModal({
  open,
  view,
  onViewChange,
  onClose,
  onAuthenticated,
}: AuthModalProps) {
  useBodyScrollLock(open);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-end justify-center overflow-hidden p-0 sm:items-center sm:p-4">
      <button
        type="button"
        aria-label="بستن"
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Shell: fixed height budget; header stays put; only body scrolls */}
      <div
        role="dialog"
        aria-modal="true"
        className="relative z-10 flex w-full max-h-[min(92dvh,720px)] flex-col overflow-hidden rounded-t-3xl border border-border-input/40 bg-dropdown-bg shadow-2xl sm:max-w-[440px] sm:rounded-3xl"
      >
        <div className="flex shrink-0 items-center justify-between px-5 pb-2 pt-4 sm:px-6 sm:pt-5">
          <div className="mx-auto h-1 w-10 rounded-full bg-white/15 sm:hidden" aria-hidden="true" />
          <button
            type="button"
            onClick={onClose}
            aria-label="بستن پنجره"
            className="mr-auto flex h-10 w-10 items-center justify-center rounded-xl bg-cta-pill-bg transition-opacity hover:opacity-80"
          >
            <CloseSquare size={20} color="#c9ada7" variant="Linear" />
          </button>
        </div>

        <div className="modal-scroll min-h-0 flex-1 px-5 pb-5 sm:px-6 sm:pb-6">
          {view === "login" ? (
            <LoginForm
              onGoSignup={() => onViewChange("signup")}
              onSuccess={(session) =>
                onAuthenticated(session, { successMessage: "با موفقیت وارد شدید." })
              }
            />
          ) : (
            <SignupForm
              onGoLogin={() => onViewChange("login")}
              onSuccess={(session) =>
                onAuthenticated(session, { successMessage: "ثبت‌نام با موفقیت انجام شد." })
              }
            />
          )}
        </div>
      </div>
    </div>
  );
}
