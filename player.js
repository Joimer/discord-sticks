'use strict';

// Wraps the discord user in an agnostic API for the game.
class Player {

    constructor(discordUser) {
        this.id = discordUser.id;
        this.name = discordUser.username;
    }

    getId() {
        return this.id;
    }
}

module.exports = Player;
