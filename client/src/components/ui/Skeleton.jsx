export function SkeletonBlock({ className = "" }) {
  return <div className={`animate-pulse bg-gray-200 rounded ${className}`} />;
}

export function SkeletonCircle({ className = "" }) {
  return <div className={`animate-pulse bg-gray-200 rounded-full ${className}`} />;
}

export function SkeletonText({ lines = 3, className = "" }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`animate-pulse bg-gray-200 rounded h-4 ${
            i === lines - 1 ? "w-3/4" : "w-full"
          }`}
        />
      ))}
    </div>
  );
}

export function ServiceCardSkeleton() {
  return (
    <div className="flex flex-col bg-white border border-gray-100 rounded-xl shadow-sm h-full overflow-hidden">
      <div className="h-40 overflow-hidden">
        <SkeletonBlock className="w-full h-full rounded-none" />
      </div>
      <div className="flex flex-col items-center text-center p-5 flex-1 gap-6">
        <SkeletonBlock className="h-5 w-32" />
        <SkeletonText lines={2} className="w-full" />
        <SkeletonBlock className="h-10 w-24 rounded-xl" />
      </div>
    </div>
  );
}

export function ProjectCardSkeleton() {
  return (
    <div className="flex flex-col bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
      <div className="h-48 overflow-hidden">
        <SkeletonBlock className="w-full h-full rounded-none" />
      </div>
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div className="py-16 md:py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <SkeletonBlock className="h-12 w-96 mx-auto" />
        <div className="mt-10 flex justify-center">
          <SkeletonBlock className="w-full max-w-2xl h-64 md:h-80 rounded-2xl" />
        </div>
        <div className="mt-10 max-w-3xl mx-auto space-y-4">
          <SkeletonText lines={4} />
        </div>
        <div className="mt-12 flex justify-center">
          <SkeletonBlock className="h-10 w-36 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5, cols = 4 }) {
  return (
    <tbody>
      {Array.from({ length: rows }).map((_, i) => (
        <tr key={i} className="border-t border-gray-100">
          {Array.from({ length: cols }).map((_, j) => (
            <td key={j} className="py-3 pr-3">
              <SkeletonBlock className={`h-4 ${j === 0 ? "w-16" : "w-24"}`} />
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
}

export function ReviewCardSkeleton() {
  return (
    <div className="border border-gray-100 rounded p-4">
      <div className="flex gap-4 animate-pulse">
        <SkeletonCircle className="w-10 h-10 shrink-0" />
        <div className="flex-1 space-y-2">
          <SkeletonBlock className="h-4 w-32" />
          <SkeletonBlock className="h-3 w-48" />
          <SkeletonBlock className="h-3 w-full" />
        </div>
      </div>
    </div>
  );
}

export function TestimonialCardSkeleton() {
  return (
    <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <SkeletonCircle className="w-12 h-12" />
        <div className="space-y-2">
          <SkeletonBlock className="h-4 w-24" />
          <SkeletonBlock className="h-3 w-16" />
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <SkeletonBlock className="h-3 w-20" />
        <SkeletonText lines={2} />
      </div>
    </div>
  );
}
