import { memo } from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

const SkeletonSection = memo(({ count, className }: { count: number; className?: string }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[...Array(count)].map((_, i) => (
      <Skeleton key={i} className={className || "h-64 w-full"} />
    ))}
  </div>
));
SkeletonSection.displayName = 'SkeletonSection';

const StatsCardsSkeleton = memo(() => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    {[...Array(3)].map((_, i) => (
      <Card key={`stat-${i}`}>
        <CardContent className="p-4">
          <Skeleton className="h-8 w-20 mb-2" />
          <Skeleton className="h-6 w-32" />
        </CardContent>
      </Card>
    ))}
  </div>
));
StatsCardsSkeleton.displayName = 'StatsCardsSkeleton';

export default memo(function ExploreProjectsLoading() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <Skeleton className="h-10 w-48" />
      </div>

      {/* Recent Activity Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-10 w-24" />
        </div>
        <SkeletonSection count={3} />
      </section>

      {/* All Projects Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-10 w-24" />
        </div>
        <SkeletonSection count={6} />
      </section>

      {/* Stats Cards */}
      <StatsCardsSkeleton />
    </div>
  );
});