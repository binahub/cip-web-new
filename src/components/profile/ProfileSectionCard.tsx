"use client";

import type { ReactNode } from "react";

interface ProfileSectionCardProps {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
}

export default function ProfileSectionCard({
  title,
  description,
  action,
  children,
}: ProfileSectionCardProps) {
  return (
    <section className="rounded-[24px] border border-border-input/30 bg-service-detail-card p-4 sm:p-6" dir="rtl">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1 text-right">
          <h2 className="text-lg font-bold text-white sm:text-xl">{title}</h2>
          {description ? (
            <p className="text-sm text-text-secondary">{description}</p>
          ) : null}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
