import clsx from "clsx";
import { FunctionComponent, HTMLAttributes, ReactNode } from "react";

export type TypoProps = {
  element?: string;
  variant?: string;
  children?: ReactNode;
  className?: HTMLAttributes<HTMLElement>["className"];
  style?: HTMLAttributes<HTMLElement>["style"];
};
export const Typo: FunctionComponent<TypoProps> = ({ element = "h1", children, variant = element, className, style }) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const El = element as any;

  return (
    <El
      className={clsx(
        {
          "font-bold text-3xl": variant === "h0",
          "font-bold text-2xl": variant === "h1",
          "font-bold text-xl": variant === "h2",
          "font-bold": variant === "h3",
        },
        className
      )}
      style={style}
    >
      {children}
    </El>
  );
};
