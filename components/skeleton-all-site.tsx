export default function SitesSkeleton() {
    return (
      <div className="space-y-6">
        {/* Header */}
        {/* Sites Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="rounded-lg border p-4 space-y-4">
              {/* URL and Last Update */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-muted animate-pulse" />
                    <div className="h-5 w-40 bg-muted rounded animate-pulse" />
                  </div>
                  <div className="h-5 w-16 bg-muted/60 rounded animate-pulse" />
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-4 w-36 bg-muted rounded animate-pulse" />
                  <div className="h-4 w-32 bg-muted rounded animate-pulse" />
                </div>
              </div>
  
              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-4">
                {/* Loading Time */}
                <div className="space-y-1">
                  <div className="h-4 w-32 bg-muted rounded animate-pulse" />
                  <div className="h-6 w-12 bg-muted rounded animate-pulse" />
                </div>
  
                {/* JS Errors */}
                <div className="space-y-1">
                  <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                  <div className="h-6 w-8 bg-muted rounded animate-pulse" />
                </div>
  
                {/* Console Logs */}
                <div className="space-y-1">
                  <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                  <div className="h-6 w-8 bg-muted rounded animate-pulse" />
                </div>
  
                {/* Image Issues */}
                <div className="space-y-1">
                  <div className="h-4 w-32 bg-muted rounded animate-pulse" />
                  <div className="h-6 w-8 bg-muted rounded animate-pulse" />
                </div>
              </div>
  
              {/* Site ID */}
              <div className="flex items-center justify-between pt-2">
                <div className="h-4 w-64 bg-muted rounded animate-pulse" />
                <div className="w-4 h-4 bg-muted rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }
  
  