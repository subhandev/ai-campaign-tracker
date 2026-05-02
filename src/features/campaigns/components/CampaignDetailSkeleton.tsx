import { Skeleton } from "@/components/ui/skeleton";

export function CampaignDetailSkeleton() {
  return (
    <div className="space-y-6 max-w-6xl">
      {/* Back button */}
      <Skeleton className="h-7 w-40" />

      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Skeleton className="h-7 w-56" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
          <div className="flex items-center gap-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-28" />
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-8 w-8" />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1">
        <Skeleton className="h-9 w-24 rounded-md" />
        <Skeleton className="h-9 w-16 rounded-md" />
        <Skeleton className="h-9 w-20 rounded-md" />
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-3"
          >
            <div className="flex items-center justify-between">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-8 w-8 rounded-lg" />
            </div>
            <Skeleton className="h-7 w-16" />
            <Skeleton className="h-3 w-36" />
          </div>
        ))}
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Campaign Info — lg:col-span-2 */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-4">
            <Skeleton className="h-4 w-44" />
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="space-y-1">
                  <Skeleton className="h-2.5 w-16" />
                  <Skeleton className="h-4 w-28" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI Insights */}
        <div>
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 shadow-sm p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-8 rounded-full" />
            </div>
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="p-3 rounded-lg border space-y-2">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4 rounded-full" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-3/4" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
