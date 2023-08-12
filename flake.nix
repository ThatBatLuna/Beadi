{
  description = "Beadi Dev Environment";

  inputs = {
    nixpkgs = {
      url = "nixpkgs/nixos-22.11";
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
        version = "18.16.0";
        sha256 = "sha256-M9gaIz4jWlCa3aSk8iCQCNBFkZed5rPw9nwckGCT8Rg=";
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
