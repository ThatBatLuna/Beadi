import clsx from "clsx";
import { FunctionComponent, HTMLAttributes, ReactNode } from "react";

type TypoProps = {
  element?: string;
  variant?: string;
  children?: ReactNode;
  className?: HTMLAttributes<HTMLElement>["className"];
  style?: HTMLAttributes<HTMLElement>["style"];
};
export const Typo: FunctionComponent<TypoProps> = ({
  element = "h1",
  children,
  variant = element,
  className,
  style,
}) => {
  const El = element as any;

  return (
    <El
      className={clsx(
        {
          "font-bold text-2xl": variant === "h1",
          "font-bold text-xl": variant === "h2",
        },
        className
      )}
      style={style}
    >
      {children}
    </El>
  );
};
