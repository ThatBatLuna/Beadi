{
  description = "Beadi Dev Environment";

  inputs = {
    nixpkgs = {
      url = "nixpkgs/nixos-23.05";
    };

    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = {
    self,
    nixpkgs,
    flake-utils,
    ...
  }:
    flake-utils.lib.eachDefaultSystem (system: let
      pkgs = import nixpkgs {
        inherit system;
      };

      buildNodeJs = pkgs.callPackage "${nixpkgs}/pkgs/development/web/nodejs/nodejs.nix" {
        python = pkgs.python3;
      };

      nodejs = buildNodeJs {
        enableNpm = true;
        version = "18.17.1";
        sha256 = "sha256-8hXPA9DwDwesC2dMaBn4BMFULhbxUtoEmAAirsz15lo=";
      };
    in rec {
      flakedPkgs = pkgs;

      # enables use of `nix shell`
      devShell = pkgs.mkShell {
        # add things you want in your shell here
        buildInputs = with pkgs; [
          nodejs
          nodePackages.pnpm
        ];
      };
    });
}
