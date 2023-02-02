# Codenames: Duet

Implementation of the board game [Codenames: Duet](https://boardgamegeek.com/boardgame/224037/codenames-duet), the two-player version of [Codenames](https://boardgamegeek.com/boardgame/178900/codenames).

This version of the game is intended for offline play as a PWA, and only requires a shared seed between two players to set up the same game.

Live builds are deployed here:

### [Play Codenames: Duet](https://codenames.lessi.ng)

## Build information

This project is built using SvelteKit 1.0. Package management is handled using `yarn`.

To run the dev mode:
```sh
yarn dev
```
This will set up a live-reloading developer environment and run the game at [localhost:5173](http://localhost:5173).

To build a standalone deployable:
```sh
yarn build
```
This creates a fully static site in the `build` directory.

On push to `main`, the latest version is automatically deployed to GitHub Pages and available at [https://codenames.lessi.ng](https://codenames.lessi.ng).
