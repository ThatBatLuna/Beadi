import clsx from "clsx";
import { FunctionComponent } from "react";
import { Link, LinkProps } from "react-router-dom";

export type TypoLinkProps = LinkProps;
export const TypoLink: FunctionComponent<TypoLinkProps> = (props) => {
  return <Link {...props} className={clsx("text-purple-300 underline hover:text-purple-400", props.className)}></Link>;
};
