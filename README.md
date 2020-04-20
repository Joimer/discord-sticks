This is a Discord bot to play the chat game sticks. It's about removing sticks from a pile until there's only one, then the player that picks last losses.

This bot itself is pretty straightforward, just start it with `npm start` or `node app.js`.

The game is played with the pre-configured prefix of `s!`, and the commands it takes are `begin`, `join`, and `take`. To create a game, currently not requiring permissions, just type `s!begin`. Then, to join a game (up to 2 players by design), type `s!join`. There can be one game per channel. The command to take sticks is either `s!take [row]:[column]` or `s!take [row]:[column-start]-[column-end]`, where all numbers should be positive integers that you can use to denote a position in the playing field.

Shield: [![CC BY-SA 4.0][cc-by-sa-shield]][cc-by-sa]

This work is licensed under a [Creative Commons Attribution-ShareAlike 4.0
International License][cc-by-sa].

[![CC BY-SA 4.0][cc-by-sa-image]][cc-by-sa]

[cc-by-sa]: http://creativecommons.org/licenses/by-sa/4.0/
[cc-by-sa-image]: https://licensebuttons.net/l/by-sa/4.0/88x31.png
[cc-by-sa-shield]: https://img.shields.io/badge/License-CC%20BY--SA%204.0-lightgrey.svg
