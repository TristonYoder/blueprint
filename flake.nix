{
  description = "Blueprint — reproducible container build";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};

        blueprint = pkgs.buildNpmPackage {
          pname = "blueprint";
          version = "0.1.0";
          src = ./.;

          # Placeholder — regenerate with `prefetch-npm-deps package-lock.json`
          # (or `nix run nixpkgs#prefetch-npm-deps -- package-lock.json`) once
          # dependencies settle, then replace this hash.
          npmDepsHash = "sha256-AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=";

          nodejs = pkgs.nodejs_22;

          npmBuildScript = "build";

          installPhase = ''
            runHook preInstall
            mkdir -p $out
            cp -r .next/standalone/. $out/
            mkdir -p $out/.next
            cp -r .next/static $out/.next/static
            cp -r public $out/public
            runHook postInstall
          '';
        };
      in
      {
        packages.default = blueprint;

        packages.docker = pkgs.dockerTools.buildLayeredImage {
          name = "blueprint";
          tag = "latest";
          contents = [ blueprint pkgs.tzdata pkgs.cacert ];
          config = {
            Cmd = [ "${pkgs.nodejs_22}/bin/node" "${blueprint}/server.js" ];
            ExposedPorts = { "3000/tcp" = { }; };
            Env = [
              "NODE_ENV=production"
              "PORT=3000"
              "SSL_CERT_FILE=${pkgs.cacert}/etc/ssl/certs/ca-bundle.crt"
              "NODE_EXTRA_CA_CERTS=${pkgs.cacert}/etc/ssl/certs/ca-bundle.crt"
            ];
          };
        };

        devShells.default = pkgs.mkShell {
          buildInputs = [ pkgs.nodejs_22 ];
        };
      });
}
