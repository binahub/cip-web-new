import Skeleton from "@/components/ui/Skeleton";

/** Mirrors ServiceCard dimensions to avoid layout shift while services load. */
function ServiceCardSkeleton() {
  return (
    <div className="relative h-[405px] w-full overflow-hidden rounded-[24px] bg-photo-card-bg">
      <div className="absolute inset-x-0 bottom-0 h-[160px] sm:h-[205px]">
        <Skeleton className="h-full w-full rounded-none bg-white/[0.06]" />
      </div>

      <div className="absolute left-1/2 top-8 flex w-[90%] -translate-x-1/2 flex-col items-center gap-3">
        <Skeleton className="h-7 w-3/4 sm:h-8" />
        <div className="flex gap-2.5">
          <Skeleton className="h-7 w-24 rounded-full" />
          <Skeleton className="h-7 w-24 rounded-full" />
        </div>
      </div>

      <div className="absolute left-1/2 top-[113px] flex -translate-x-1/2 items-end gap-2">
        <Skeleton className="mb-1 h-3 w-10" />
        <Skeleton className="h-6 w-20" />
        <Skeleton className="mb-1 h-3 w-8" />
      </div>

      <Skeleton className="absolute left-1/2 top-[161px] h-8 w-32 -translate-x-1/2 rounded-lg" />
    </div>
  );
}

const SKELETON_COUNT = 6;

export default function ServiceCategoryGridSkeleton() {
  return (
    <div
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      aria-busy="true"
      aria-live="polite"
    >
      {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
        <ServiceCardSkeleton key={index} />
      ))}
      <span className="sr-only">در حال بارگذاری خدمات</span>
    </div>
  );
}
