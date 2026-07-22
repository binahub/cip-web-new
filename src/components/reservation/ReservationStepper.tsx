"use client";

const STEPS = [
  { id: 1, label: "اطلاعات پرواز" },
  { id: 2, label: "تایید تعداد" },
  { id: 3, label: "مسافران" },
  { id: 4, label: "خدمات" },
  { id: 5, label: "پرداخت" },
] as const;

interface ReservationStepperProps {
  currentStep: number;
}

export default function ReservationStepper({ currentStep }: ReservationStepperProps) {
  return (
    <nav aria-label="مراحل رزرو" className="mx-auto w-full max-w-4xl" dir="rtl">
      <ol className="app-scroll flex items-center justify-center gap-2 overflow-x-auto pb-1.5">
        {STEPS.map((step, index) => {
          const done = currentStep > step.id;
          const active = currentStep === step.id;
          return (
            <li key={step.id} className="flex shrink-0 items-center gap-2">
              <div
                className={`flex items-center gap-2 rounded-2xl border px-3 py-2 text-sm ${
                  active
                    ? "border-accent/50 bg-cta-pill-bg text-accent"
                    : done
                      ? "border-accent/30 text-accent"
                      : "border-border-input/30 text-text-secondary"
                }`}
              >
                <span
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                    active || done ? "bg-accent text-black" : "bg-white/10 text-text-secondary"
                  }`}
                >
                  {step.id}
                </span>
                <span className="whitespace-nowrap font-medium">{step.label}</span>
              </div>
              {index < STEPS.length - 1 ? (
                <span className="hidden h-px w-6 bg-border-input/40 sm:block" aria-hidden="true" />
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export { STEPS };
