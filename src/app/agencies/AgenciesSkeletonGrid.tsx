export default function AgenciesSkeletonGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="h-32 w-full rounded-xl bg-gray-200 animate-pulse"
        />
      ))}
    </div>
  );
}
