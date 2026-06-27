import { ReactNode } from "react";
import clsx from "clsx";

interface Props {
  children: ReactNode;
  className?: string;
}

export default function Container({
  children,
  className,
}: Props) {
  return (
    <div
      className={clsx(
        "mx-auto w-full max-w-7xl px-6 lg:px-8",
        className
      )}
    >
      {children}
    </div>
  );
}