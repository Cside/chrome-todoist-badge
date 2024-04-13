export const Spinner = ({ className }: { className?: string }) => (
  // biome-ignore lint/nursery/useSortedClasses:
  <span className={`loading loading-spinner loading-sm ${className ?? ""}`} />
);
