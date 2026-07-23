"use client";

import { useEffect } from "react";

/**
 * Locks document scroll while a modal/overlay is open.
 * Compensates scrollbar width to avoid layout shift.
 */
export function useBodyScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;

    const { body, documentElement } = document;
    const scrollbarWidth = window.innerWidth - documentElement.clientWidth;
    const previousOverflow = body.style.overflow;
    const previousPaddingRight = body.style.paddingRight;
    const previousOverscroll = documentElement.style.overscrollBehavior;

    body.style.overflow = "hidden";
    documentElement.style.overscrollBehavior = "none";
    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      body.style.overflow = previousOverflow;
      body.style.paddingRight = previousPaddingRight;
      documentElement.style.overscrollBehavior = previousOverscroll;
    };
  }, [locked]);
}
