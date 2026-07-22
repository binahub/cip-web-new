import Skeleton from "@/components/ui/Skeleton";

function ImageSliderSkeleton() {
  return (
    <div className="relative mx-auto w-full max-w-[711px]">
      <div className="relative flex h-[220px] items-center justify-center sm:h-[291px]">
        <Skeleton className="absolute left-0 top-1/2 hidden h-[190px] w-[100px] -translate-y-1/2 rounded-lg sm:block lg:h-[235px] lg:w-[134px]" />
        <Skeleton className="relative z-10 h-full w-full rounded-lg sm:w-[min(100%,529px)]" />
        <Skeleton className="absolute right-0 top-1/2 hidden h-[190px] w-[100px] -translate-y-1/2 rounded-lg sm:block lg:h-[235px] lg:w-[134px]" />
      </div>
      <div className="mt-4 flex justify-center gap-2">
        <Skeleton className="h-1.5 w-4 rounded-full" />
        <Skeleton className="h-1.5 w-1.5 rounded-full" />
        <Skeleton className="h-1.5 w-1.5 rounded-full" />
      </div>
    </div>
  );
}

function DescriptionSkeleton() {
  return (
    <section className="w-full space-y-6" dir="rtl">
      <Skeleton className="ml-auto h-8 w-2/3 sm:h-10" />
      <div className="space-y-3">
        <Skeleton className="ml-auto h-5 w-40" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
      <div className="space-y-3">
        <Skeleton className="ml-auto h-5 w-32" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
      </div>
    </section>
  );
}

function FeaturesSkeleton() {
  return (
    <section className="w-full" dir="rtl">
      <Skeleton className="mb-4 ml-auto h-5 w-24" />
      <Skeleton className="mb-4 h-10 w-full rounded-xl" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-10 w-full rounded-xl" />
        ))}
      </div>
    </section>
  );
}

function PricingSkeleton() {
  return (
    <section className="w-full">
      <Skeleton className="mx-auto mb-6 h-8 w-36" />
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {Array.from({ length: 2 }).map((_, col) => (
          <div key={col} className="flex flex-col gap-6">
            <Skeleton className="mx-auto h-6 w-40" />
            <div className="relative overflow-hidden rounded-2xl bg-service-chip-bg px-4 pb-8 pt-[160px] sm:px-8 sm:pt-[185px]">
              <Skeleton className="absolute inset-x-0 top-0 h-[174px] rounded-none" />
              <div className="relative z-10 flex flex-col items-end gap-4" dir="rtl">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <div className="mt-2 w-full space-y-3">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
                <Skeleton className="mt-2 h-11 w-full rounded-xl" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function RulesSkeleton() {
  return (
    <section className="mx-auto w-full max-w-[381px] space-y-3">
      <Skeleton className="mx-auto h-5 w-28" />
      <Skeleton className="mx-auto h-4 w-full" />
      <Skeleton className="mx-auto h-4 w-5/6" />
      <Skeleton className="mx-auto h-4 w-4/5" />
    </section>
  );
}

/** Layout-matched placeholder for ServiceDetailView while detail data loads. */
export default function ServiceDetailSkeleton() {
  return (
    <div
      className="relative overflow-x-hidden pb-8 pt-8 sm:pt-10"
      aria-busy="true"
      aria-live="polite"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[min(100vw,1200px)] -translate-x-1/2 rounded-full opacity-40 blur-3xl"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(80,70,65,0.35) 0%, rgba(0,0,0,0) 70%)",
        }}
      />

      <div className="relative z-10 mx-auto w-full max-w-[856px] overflow-hidden rounded-[24px] bg-service-detail-card px-3 pb-10 pt-8 sm:px-8 sm:pb-12 sm:pt-10 lg:px-10">
        <div className="mx-auto flex w-full max-w-[776px] flex-col gap-8 sm:gap-12">
          <ImageSliderSkeleton />
          <DescriptionSkeleton />
          <FeaturesSkeleton />
          <PricingSkeleton />
          <RulesSkeleton />
        </div>
      </div>

      <span className="sr-only">در حال بارگذاری جزئیات خدمت</span>
    </div>
  );
}
