import React from "react";

function Icon() {
  return (
    <div className="flex flex-col">
      <div className="flex fill-white stroke-white p-2 pb-4 items-end justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 28 28" className="h-8">
          <g>
            <path
              strokeDashoffset="5.143"
              strokeLinejoin="round"
              strokeWidth="0.021"
              d="M8.194 8.985A2.296 2.296 0 015.9 11.281a2.296 2.296 0 01-2.297-2.294 2.296 2.296 0 012.294-2.298 2.296 2.296 0 012.298 2.293"
            ></path>
            <path
              strokeDashoffset="5.143"
              strokeLinejoin="round"
              strokeWidth="0.017"
              d="M5.596 3.186A1.823 1.823 0 013.774 5.01 1.823 1.823 0 011.95 3.188a1.823 1.823 0 011.821-1.824 1.823 1.823 0 011.825 1.82"
            ></path>
            <path
              strokeDashoffset="5.143"
              strokeLinejoin="round"
              strokeWidth="0.024"
              d="M22.036 20.528a2.591 2.591 0 01-2.59 2.59 2.591 2.591 0 01-2.592-2.588 2.591 2.591 0 012.588-2.593 2.591 2.591 0 012.594 2.587"
            ></path>
            <path
              strokeDashoffset="5.143"
              strokeLinejoin="round"
              strokeWidth="0.031"
              d="M13.652 15.034a3.353 3.353 0 01-3.351 3.352 3.353 3.353 0 01-3.354-3.35 3.353 3.353 0 013.349-3.355 3.353 3.353 0 013.356 3.348"
            ></path>
            <path
              strokeDasharray="none"
              strokeDashoffset="5.143"
              strokeLinejoin="round"
              strokeOpacity="1"
              strokeWidth="0.432"
              d="M25.07 20.528a5.625 5.625 0 01-5.623 5.625 5.625 5.625 0 01-5.627-5.621 5.625 5.625 0 015.619-5.63 5.625 5.625 0 015.631 5.617"
            ></path>
            <path
              stroke="black"
              strokeDasharray="none"
              strokeDashoffset="5.143"
              strokeLinejoin="round"
              strokeOpacity="1"
              strokeWidth="1.328"
              d="M23.503 20.528a4.058 4.058 0 01-4.057 4.057 4.058 4.058 0 01-4.059-4.054 4.058 4.058 0 014.053-4.061 4.058 4.058 0 014.063 4.052"
            ></path>
          </g>
        </svg>
        <span className="font-bold">Beadi</span>
      </div>
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

export default Icon;
