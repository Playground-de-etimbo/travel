import { Card, CardContent } from '@/components/ui/card';

export function LoadingState() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, index) => (
        <Card key={index} className="overflow-hidden animate-pulse">
          <div className="flex flex-col md:flex-row">
            {/* Image skeleton */}
            <div className="md:w-2/5 h-48 md:h-auto bg-muted" />

            {/* Content skeleton */}
            <CardContent className="md:w-3/5 p-6 space-y-3">
              {/* Title */}
              <div className="h-6 bg-muted rounded w-3/4" />

              {/* Description */}
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded w-full" />
                <div className="h-4 bg-muted rounded w-5/6" />
              </div>

              {/* Cost items */}
              <div className="space-y-2 pt-2">
                <div className="h-3 bg-muted rounded w-full" />
                <div className="h-3 bg-muted rounded w-full" />
                <div className="h-3 bg-muted rounded w-full" />
                <div className="h-4 bg-muted rounded w-full mt-2" />
              </div>

              {/* Button skeleton */}
              <div className="h-10 bg-muted rounded w-full mt-4" />
            </CardContent>
          </div>
        </Card>
      ))}
    </div>
  );
}
