"use client";

import { Toaster } from "sonner";

/**
 * Global toast host — CIP dark theme, RTL.
 * Mount once near the app root (inside client providers).
 */
export default function AppToaster() {
  return (
    <Toaster
      position="top-center"
      dir="rtl"
      closeButton
      duration={4500}
      visibleToasts={3}
      toastOptions={{
        classNames: {
          toast:
            "font-yekan-bakh !rounded-2xl !border !shadow-lg !backdrop-blur-md !gap-3 !px-4 !py-3",
          title: "!text-sm !font-semibold !leading-6",
          description: "!text-xs !leading-5 !opacity-90",
          closeButton:
            "!bg-transparent !border-0 !text-white/70 hover:!text-white !right-auto !left-2 !top-2",
          success:
            "!bg-dropdown-bg/95 !border-success/40 !text-text-hero [&>[data-icon]]:!text-success",
          error:
            "!bg-dropdown-bg/95 !border-danger/50 !text-text-hero [&>[data-icon]]:!text-danger",
          warning:
            "!bg-dropdown-bg/95 !border-accent/50 !text-text-hero [&>[data-icon]]:!text-accent",
          info: "!bg-dropdown-bg/95 !border-accent/35 !text-text-hero [&>[data-icon]]:!text-accent",
        },
      }}
    />
  );
}
