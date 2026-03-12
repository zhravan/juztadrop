import { Skeleton } from '../skeletons';

export default function LoadingSkeleton() {
  return (
    <div
      className="flex flex-col w-full max-w-[700px] gap-10"
      aria-label="Loading volunteer"
      role="status"
    >
      <div className="flex flex-row items-center gap-8">
        <Skeleton className="w-[90px] h-[90px] rounded-full shrink-0" />
        <div className="flex flex-col gap-3 flex-1">
          <Skeleton className="h-8 w-48 rounded-xl" />
          <Skeleton className="h-4 w-72 rounded-xl" />
        </div>
      </div>
      <Skeleton className="h-24 w-full rounded-2xl" />
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-7 w-24 rounded-full" />
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-7 w-20 rounded-full" />
        ))}
      </div>
    </div>
  );
}
