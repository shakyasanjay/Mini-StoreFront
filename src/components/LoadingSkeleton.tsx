const LoadingSkeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse p-3 border rounded bg-gray-100 dark:bg-gray-700 h-64"
        />
      ))}
    </div>
  );
}

export default LoadingSkeleton
