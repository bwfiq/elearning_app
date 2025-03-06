with import <nixpkgs> {}; let
  # We'll use the Python 3.12 packages for this project.
  pythonPackages = python312Packages;
  # Provides a script that copies required files to ~/
  podmanSetupScript = let
    registriesConf = pkgs.writeText "registries.conf" ''
      [registries.search]
      registries = ['docker.io']
      [registries.block]
      registries = []
    '';
  in pkgs.writeScript "podman-setup" ''
    #!${pkgs.runtimeShell}
    # Dont overwrite customised configuration
    if ! test -f ~/.config/containers/policy.json; then
      install -Dm555 ${pkgs.skopeo.src}/default-policy.json ~/.config/containers/policy.json
    fi
    if ! test -f ~/.config/containers/registries.conf; then
      install -Dm555 ${registriesConf} ~/.config/containers/registries.conf
    fi
  '';

  # Provides a fake "docker" binary mapping to podman
  dockerCompat = pkgs.runCommandNoCC "docker-podman-compat" {} ''
    mkdir -p $out/bin
    ln -s ${pkgs.podman}/bin/podman $out/bin/docker
  '';
in
  pkgs.mkShell {
    name = "impurePythonEnv";
    venvDir = "./.venv";
    buildInputs = [
      # A Python interpreter including the 'venv' module is required to bootstrap
      # the environment.
      pythonPackages.python

      # This executes some shell code to initialize a venv in $venvDir before
      # dropping into the shell
      pythonPackages.venvShellHook

      # Those are dependencies that we would like to use from nixpkgs, which will
      # add them to PYTHONPATH and thus make them accessible from within the venv.
      # pythonPackages.django

      pkgs.nodejs
      pkgs.nodePackages.npm

      # oss alt to docker
      # https://gist.github.com/adisbladis/187204cb772800489ee3dac4acdd9947
      dockerCompat
      pkgs.podman  # Docker compat
      pkgs.runc  # Container runtime
      pkgs.conmon  # Container runtime monitor
      pkgs.skopeo  # Interact with container registry
      pkgs.slirp4netns  # User-mode networking for unprivileged namespaces
      pkgs.fuse-overlayfs  # CoW for images, much faster than default vfs
    ];

    # Run this command, only after creating the virtual environment
    postVenvCreation = ''
      unset SOURCE_DATE_EPOCH
      pip install -r requirements.txt
    '';

    # Now we can execute any commands within the virtual environment.
    # This is optional and can be left out to run pip manually.
    postShellHook = ''
      # allow pip to install wheels
      unset SOURCE_DATE_EPOCH
      
      # Install required configuration
      ${podmanSetupScript}
    '';
  }
