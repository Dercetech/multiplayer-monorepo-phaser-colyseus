# Phaser & Colyseus monorepo

This workspace demonstrates how to share code between a game client and its server.

## Features

### Centralized game logic

We apply the DRY principle in a balanced way. Therefore all code that runs on the client AND the server, such as AI and gameplay logic are stored in a shared package.

### Authoritative server

The server recieves a client's input and broadcasts the resulting position of a character.

### Client side prediction & interpolation

A player can't enjoy a game that imposes a delay between input and result. We pre-compute the expected position of a character as we send the input state to the server. We then align, if needed, with the server's snapshot to avoid gameplay artifacts.

Server tickrate is lower than the game's framerate. This results in choppy sprite motion. This is addressed by linear interpolation.

## Workspace helpers

### Sprite helper

Texturepacker users will enjoy the scripts we wrote to ease and automate sprite/graphics related pipelines.

More about this soon!

## Workspace setup

The monorepo was built without Lerna since it's not necessary. Upgrade to Lerna only if your use case justifies adding a moving part to your toolchain.
Many users struggle with importing the contents of their shared package into app, client and server packages.

The VS Code plugin "pmneo.tsimporter" does a great job here. Given our tsconfig and package.json files, this extension properly suggests the proper auto-imports.

## Contributors

### Naming conventions

- **Feature branches** are named `feature/x-topic`.
- **Bugfix branches** are named `bugfix/x-topic`.
- **Refactor branches** are named `refactor/x-topic`.
- **Hotfix branches** are named `hotfix/x-topic`.

The [CHANGELOG](CHANGELOG) must list an entry as structured below:

    [Feature/Bugfix/Refactor/hotfix x] Topic (summary)

Replace `x` with the feature/bug/hotfix/refactor number found in the title of stories listed in our [issues sections](https://github.com/Dercetech/multiplayer-monorepo-phaser-colyseus/issues/).

**REM** we chose to use Github's "issue" function to ease the integration. Issue ID is incremented by github while we assign the Feature/Bugfix/Refactor/Hotifx number by hand until further notice.
