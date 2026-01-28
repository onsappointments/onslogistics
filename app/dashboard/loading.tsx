export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="h-8 w-64 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 w-96 bg-gray-200 rounded animate-pulse" />
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-32 bg-white rounded-xl shadow-md p-6 space-y-4"
          >
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
            <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Array.from({ length: 2 }).map((_, i) => (
          <div
            key={i}
            className="h-[340px] bg-white rounded-xl shadow-md p-6"
          >
            <div className="h-5 w-40 bg-gray-200 rounded animate-pulse mb-4" />
            <div className="h-full bg-gray-100 rounded-lg animate-pulse" />
          </div>
        ))}
      </div>

      {/* Big chart */}
      <div className="h-[380px] bg-white rounded-xl shadow-md p-6">
        <div className="h-5 w-48 bg-gray-200 rounded animate-pulse mb-4" />
        <div className="h-full bg-gray-100 rounded-lg animate-pulse" />
      </div>
    </div>
  );
}
