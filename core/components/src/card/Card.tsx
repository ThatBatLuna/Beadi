import { FunctionComponent, ReactNode } from "react";
import clsx from "clsx";

export type CardProps = {
  header?: ReactNode | FunctionComponent<Record<string, never>>;
  children?: ReactNode | FunctionComponent<Record<string, never>>;
  forceExpanded?: boolean | undefined;
  startExpanded?: boolean;
};
export const Card: FunctionComponent<CardProps> = ({ header: Header, children: Children }) => {
  return (
    <div className="bg-primary-800 rounded-md">
      {Header !== undefined && (
        <div className={clsx("h-12 flex flex-row p-2 items-center bg-primary-700 rounded-t-md rounded-b-md")}>
          {typeof Header === "function" ? <Header /> : Header}
        </div>
      )}
      <div className={clsx("p-2", { "border-t border-t-primary-400": Header != null })}>
        {typeof Children === "function" ? <Children /> : Children}
      </div>
    </div>
  );
};
