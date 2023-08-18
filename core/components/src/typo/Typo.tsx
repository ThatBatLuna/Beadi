import clsx from "clsx";
import { FunctionComponent, HTMLAttributes, ReactNode } from "react";

export type TypoProps = {
  element?: string;
  variant?: string;
  page?: boolean;
  children?: ReactNode;
  className?: HTMLAttributes<HTMLElement>["className"];
  style?: HTMLAttributes<HTMLElement>["style"];
};
export const Typo: FunctionComponent<TypoProps> = ({ element = "h1", children, variant = element, className, style, page = false }) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const El = element as any;

  return (
    <El
      className={clsx(
        page
          ? clsx({
              "font-bold text-5xl mt-8 mb-8  text-center": variant === "h0",
              "font-bold text-4xl mt-8 mb-4  w-fit": variant === "h1",
              "font-bold text-3xl mt-8 mb-4  w-fit": variant === "h2",
            })
          : clsx({
              "font-bold text-3xl": variant === "h0",
              "font-bold text-2xl": variant === "h1",
              "font-bold text-xl": variant === "h2",
              "font-bold": variant === "h3",
            }),
        className
      )}
      style={style}
    >
      {children}
    </El>
  );
};
