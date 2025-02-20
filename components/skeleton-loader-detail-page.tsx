export default function SkeletonLoader() {
    return (
      <div className="w-full container mx-auto p-4 space-y-6 mt-16">
        {/* Header with back button and export */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-muted animate-pulse" />
            <div className="w-32 h-4 rounded bg-muted animate-pulse" />
          </div>
          <div className="w-24 h-8 rounded bg-muted animate-pulse" />
        </div>
  
        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="p-4 rounded-lg border">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-muted animate-pulse" />
                  <div className="w-32 h-4 rounded bg-muted animate-pulse" />
                </div>
                <div className="w-16 h-6 rounded bg-muted animate-pulse" />
                <div className="w-24 h-3 rounded bg-muted animate-pulse" />
              </div>
            </div>
          ))}
        </div>
  
        {/* Graph Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-40 h-5 rounded bg-muted animate-pulse" />
            <div className="w-4 h-4 rounded bg-muted animate-pulse" />
          </div>
          <div className="h-[300px] rounded-lg border p-4">
            <div className="w-full h-full bg-muted/50 rounded animate-pulse" />
          </div>
        </div>
  
        {/* Three Panel Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="p-4 rounded-lg border">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-muted animate-pulse" />
                    <div className="w-32 h-4 rounded bg-muted animate-pulse" />
                  </div>
                  <div className="w-16 h-6 rounded bg-muted animate-pulse" />
                </div>
                <div className="space-y-2">
                  {[...Array(3)].map((_, j) => (
                    <div key={j} className="w-full h-4 rounded bg-muted animate-pulse" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
  
        {/* Installation Section */}
        <div className="space-y-4">
          <div className="w-48 h-5 rounded bg-muted animate-pulse" />
          <div className="flex gap-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-20 h-8 rounded bg-muted animate-pulse" />
            ))}
          </div>
          <div className="w-full h-[200px] rounded-lg bg-muted animate-pulse" />
        </div>
      </div>
    )
  }
  
  