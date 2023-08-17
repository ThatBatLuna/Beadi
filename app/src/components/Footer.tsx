import { VBar } from "@beadi/components";
import { FunctionComponent } from "react";
import { BsGithub, BsMastodon } from "react-icons/bs";
import { Link } from "react-router-dom";

export const Footer: FunctionComponent = () => {
  return (
    <div className="bg-black flex flex-row px-8 py-4 items-center">
      <div className="flex flex-col gap-4">
        <div>
          <span className="font-bold">Beadi</span>
          <VBar />
          <span>Made with 💜 by That Bat Luna</span>
        </div>
        <div className="flex flex-row justify-center gap-4">
          <Link to="https://github.com/ThatBatLuna/Beadi" target="_blank" rel="noreferrer">
            <BsGithub className="w-6 h-6" />
          </Link>
          <Link to="https://thicc.horse/@thatbatluna" target="_blank" rel="noreferrer">
            <BsMastodon className="w-6 h-6" />
          </Link>
        </div>
      </div>
      <div className="grow"></div>
      <div>
        <Link to="/imprint">Imprint/Impressum</Link>
        <VBar />
        <Link to="/privacy">Privacy Policy</Link>
        <VBar />
        <Link to="/cookies">Cookies</Link>
        <VBar />
        <div>© 2023 Mona Mayrhofer - Linz, Austria</div>
      </div>
    </div>
  );
};
