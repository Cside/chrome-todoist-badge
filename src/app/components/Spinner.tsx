import { twMerge } from "tailwind-merge";

export const Spinner = ({ className }: { className?: string }) => (
  // twMerge は一応 undefined も受け付ける作りになっているので大丈夫
  <div
    className={twMerge("loading loading-spinner loading-sm block", className)}
  />
);
