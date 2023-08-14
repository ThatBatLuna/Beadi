import { Logo } from "@beadi/components";

function Icon() {
  return (
    <div className="flex flex-col">
      <Logo />
      {import.meta.env.REACT_APP_BRANCH === "main" ? (
        <a
          className="hover:underline bg-purple-400 text-black text-sm rounded-md m-2 p-1 mt-0 text-center"
          href={import.meta.env.REACT_APP_BETA_PUBLIC_URL}
        >
          Visit Beta Version
        </a>
      ) : (
        <a
          className="ml-auto hover:underline bg-purple-400 p-2 text-black font-bold rounded-md px-4 flex flex-col items-center m-4 mt-0"
          href={import.meta.env.REACT_APP_PUBLIC_URL}
        >
          <span>BETA</span>
          <span className="text-xs">Switch to Release Version</span>
        </a>
      )}
    </div>
  );
}

export { Icon };
