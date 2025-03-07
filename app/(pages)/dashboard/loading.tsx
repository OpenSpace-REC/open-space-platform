import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

export default function DashboardLoading() {
  return (
    <div className="container mx-auto p-4">
      <div className="grid gap-4">
        <Card className="w-full mb-4 sm:mb-6 bg-card">
          <CardHeader>
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Skeleton className="w-20 h-20 sm:w-24 sm:h-24 rounded-full" />
              <div className="text-center sm:text-left flex-grow space-y-3 w-full">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
                  <Skeleton className="h-8 w-48" />
                  <div className="flex gap-2 w-full sm:w-auto justify-center sm:justify-end">
                    <Skeleton className="h-9 w-24" />
                    <Skeleton className="h-9 w-32" />
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-5 w-16" />
                </div>
                <Skeleton className="h-4 w-full max-w-md" />
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-4 justify-center sm:justify-start">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-8 w-48" />
            </div>
          </CardHeader>
        </Card>

        <Card className="w-full">
          <CardHeader className="space-y-1">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Card className="bg-muted p-4">
              <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-36" />
                <Skeleton className="h-5 w-24" />
              </div>
              <Skeleton className="h-4 w-full mt-2" />
            </Card>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card className="bg-muted">
                <CardContent className="flex flex-col items-center p-4">
                  <Skeleton className="h-6 w-6 mb-2" />
                  <Skeleton className="h-8 w-8" />
                  <Skeleton className="h-4 w-24 mt-2" />
                </CardContent>
              </Card>
              <Card className="bg-muted">
                <CardContent className="flex flex-col items-center p-4">
                  <Skeleton className="h-6 w-6 mb-2" />
                  <Skeleton className="h-8 w-8" />
                  <Skeleton className="h-4 w-24 mt-2" />
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader>
            <div className="flex justify-between items-center mb-4">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-9 w-32" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <Card key={`project-${i}`} className="flex flex-col">
                  <CardContent className="p-4 space-y-4">
                    <Skeleton className="h-40 w-full rounded-lg" />
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <div className="flex gap-2">
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-6 w-16" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
} 