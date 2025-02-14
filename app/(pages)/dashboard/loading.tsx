import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

export default function DashboardLoading() {
  return (
    <div className="container mx-auto text-foreground min-h-screen p-2 sm:p-4 bg-background max-w-full">
      {/* Welcome Card */}
      <Card className="w-full mb-4 sm:mb-6 bg-card border">
        <CardHeader>
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-full max-w-md" />
            <Skeleton className="h-10 w-40 mt-2" />
          </div>
        </CardHeader>
      </Card>

      <div className="space-y-4 sm:space-y-6">
        {/* Profile Section */}
        <Card className="w-full">
          <CardHeader>
            <div className="flex items-center gap-4">
              <Skeleton className="h-24 w-24 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-8 w-48 mb-2" />
                <Skeleton className="h-4 w-full max-w-md" />
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Activity Overview */}
        <Card className="w-full">
          <CardHeader>
            <Skeleton className="h-6 w-48 mb-2" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <Card key={`stat-${i}`} className="bg-muted">
                  <CardContent className="p-4">
                    <Skeleton className="h-8 w-16 mb-2" />
                    <Skeleton className="h-4 w-32" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardHeader>
        </Card>

        {/* Projects Section */}
        <Card className="w-full">
          <CardHeader>
            <div className="flex justify-between items-center mb-4">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-10 w-32" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={`project-${i}`} className="h-64 w-full" />
              ))}
            </div>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
} 