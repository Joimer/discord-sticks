// Singleton with game instances for ease of use throughout modules.
const games = {};

module.exports = {
    doesGameExist: (id) => {
        return id in games;
    },
    get: (id) => {
        return games[id];
    },
    add: (id, game) => {
        games[id] = game;
    },
    join: (gameId, user) => {
        games[gameId].join(user);
    }
};
