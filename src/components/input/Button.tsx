import clsx from "clsx";
import {
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  FunctionComponent,
  PropsWithChildren,
  ReactNode,
} from "react";


type ButtonElementProps = {
} & ButtonHTMLAttributes<HTMLButtonElement>
type ButtonProps = {
  variant?: "normal" | "big";
  children?: ReactNode;
  disabledNotice?: string;
  icon?: ReactNode;
  Element?: React.ComponentType<PropsWithChildren<ButtonElementProps>>;
} & DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

export const Button: FunctionComponent<ButtonProps> = ({
  children,
  disabled,
  icon,
  variant = "normal",
  disabledNotice,
  className,
  Element = "button",
  ...buttonProps
}) => {
  const isIcon = icon !== undefined;
  const big = variant === "big";
  return (
    <Element
      {...buttonProps}
      disabled={disabled}
      className={clsx(
        "cursor-pointer text-center bg-primary-500 rounded-md hover:bg-primary-400 text-white shadow-[1px_1px_1px_0_black] disabled:text-slate-400 disabled:bg-primary-500 disabled:hover:bg-primary-500",
        {
          "px-2 py-2 h-8 w-8": isIcon && !big,
          "px-2 h-12 md:h-6": !isIcon && !big,
        },
        className
      )}
    >
      {icon}
      {children && <div>{children}</div>}
    </Element>
  );
};
