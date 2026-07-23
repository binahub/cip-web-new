interface SkeletonProps {
  className?: string;
}

/** Soft pulse block for loading placeholders. Prefer matching real content shape. */
export default function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse rounded-md bg-white/10 ${className}`.trim()}
    />
  );
}
