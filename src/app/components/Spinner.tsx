import { twMerge } from "tailwind-merge";

export const Spinner = ({ className }: { className?: string }) => (
  // FIXME undefined 変えるときも大丈夫なんかや
  <div className={twMerge("loading loading-spinner loading-sm block", className)} />
);
