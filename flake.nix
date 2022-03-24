{
  description = "Demo of hspec github actions problem matcher";
  inputs = {
    nixpkgs.url = "github:NixOs/nixpkgs?rev=521e4d7d13b09bc0a21976b9d19abd197d4e3b1e";
    flake-utils.url = "github:numtide/flake-utils";
  };
  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
        haskellPackages = pkgs.haskellPackages;
        packageName = "hspec-github-actions-example";
      in {
        packages.${packageName} = haskellPackages.callCabal2nix packageName self {};
        defaultPackage = self.packages.${system}.${packageName};
      });
}
