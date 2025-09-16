type LoadingSkeletonProps = {
  variant?: "grid" | "detail";
};

const LoadingSkeleton = ({ variant = "grid" }: LoadingSkeletonProps) => {
  if (variant === "detail") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 p-4 animate-pulse">
        {/* Left: Image Skeleton */}
        <div className="w-full h-96 bg-gray-200 dark:bg-gray-700 rounded-lg" />

        {/* Right: Info Skeleton */}
        <div className="flex flex-col space-y-4">
          <div className="w-3/4 h-8 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="w-1/2 h-4 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="w-full h-20 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="w-1/3 h-10 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="w-1/2 h-12 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      </div>
    );
  }

  // Default grid skeleton (for product lists)
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-pulse">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="p-3 border rounded bg-gray-100 dark:bg-gray-700 h-64"
        />
      ))}
    </div>
  );
};

export default LoadingSkeleton;
