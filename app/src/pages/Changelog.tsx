import { Typo } from "@beadi/components";
import { FunctionComponent } from "react";
import ReactMarkdown from "react-markdown";

export const ChangelogPage: FunctionComponent = () => {
  const changelog = BEADI_CHANGELOG;
  return (
    <article>
      <Typo variant="h1" page>
        Changelog
      </Typo>

      <div className="markdown">
        <ReactMarkdown children={changelog}></ReactMarkdown>
      </div>
    </article>
  );
};
