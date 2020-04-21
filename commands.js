const games = require('./games');
const Game = require('./game');

const commands = {
    begin: (user, gameId) => {
        if (games.doesGameExist(gameId)) {
            return "There's already a game going on in this channel!";
        }
        games.add(gameId, new Game());
        return "Type s!join to join the game.";
    },
    join: (user, gameId) => {
        if (!games.doesGameExist(gameId)) {
            return "There's no game going on in this channel!";
        }

        let result = '';
        try {
            games.join(gameId, user);
            result = "You have joined the game.";
            const game = games.get(gameId);
            if (game.isReady()) {
                game.start();
                result += "\nThe game is starting!\n";
                result += game.report() + "\n";
                result += game.reportTurn();
            }
        } catch (err) {
            result = err.message;
        }
        return result;
    },
    take: (user, gameId, sticks) => {
        // Game needs to exist.
        if (!games.doesGameExist(gameId)) {
            return "There's no game going on in this channel!";
        }

        const game = games.get(gameId);

        // Must be user's turn to take sticks.
        if (!game.isTheirTurn(user)) {
            return "It's not your turn!";
        }

        // Must give a valid board position.
        if (!sticks || sticks.indexOf(':') === -1) {
            return "Wrong syntax. Take sticks with: s!take row:col or s!take row:colStart-colEnd";
        }

        let result = '';
        let reimu = sticks.split(':');
        let row = reimu[0];
        let cols = reimu[1];
        let initialCol = cols;
        let lastCol = cols;

        // Check whether we are taking more than one column.
        if (cols.indexOf('-') !== -1) {
            let colsList = cols.split('-');
            initialCol = colsList[0];
            lastCol = colsList[1];
        }
        initialCol = parseInt(initialCol);
        lastCol = parseInt(lastCol);
        try {
            game.take(row, initialCol, lastCol);
            game.nextTurn();
            result = game.report() + "\n";
            if (!game.hasFinished) {
                result += game.reportTurn();
            } else {
                delete games[gameId];
            }
        } catch (err) {
            result = err.message;
        }

        return result;
    }
};

module.exports = {
    exists: (command) => {
        return command in {begin:1, take:1, join:1};
    },
    isAllowed: (user, gameId, command) => {
        // This could be a permission system if you strongly believe in it!
        return true;
    },
    run: (user, gameId, command, sticks) => {
        try {
            return commands[command](user, gameId, sticks);
        } catch (err) {
            throw err;
        }
    }
};
