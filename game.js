'use strict';

class Game {
    constructor() {
        this.players = {0: null, 1: null};
        // actually this is only a 2 player game why make players configurable at random length, update this.
        //this.players = [];
        this.currentPlayers = 0;
        this.board = [
            [true],
            [true, true],
            [true, true, true],
            [true, true, true, true],
            [true, true, true, true, true]
        ];
        this.rows = 5;
        this.turn = 0;
        this.hasFinished = false;
        this.winner = null;
        this.taken = 0;
        // TODO: calculate from rows-cols and make rows-cols configurable.
        this.numSticks = 15;
    }

    // If JavaScript had methor overload we could have one with just one col and this one :(
    // Cols and rows are listed in natural order but here they are 0-index
    // So take will receive the natural order intended and transform it.
    take(row, colStart, colEnd) {
        row--;
        colStart--;
        colEnd--;
        // Check for out of bounds?
        // Can manage that flow with exceptions
        for (let i = colStart; i <= colEnd; i++) {
            if (!this.board[row][i]) {
                throw new Error("Stick already taken!");
            }
        }
        for (let i = colStart; i <= colEnd; i++) {
            this.board[row][i] = false;
            this.taken++;
            // Ugly af, improve
            if (this.taken === this.numSticks) {
                this.hasFinished = true;
                this.winner = this.players[1 - this.turn];
                break;
            }
        }
    }

    nextTurn() {
        this.turn = 1 - this.turn;
    }

    join(player) {
        if (this.currentPlayers === this.maxPlayers) {
            throw new Error("This game is full.");
        }
        let playerId = player.getId();
        if (this.players[0] && this.players[0].getId() === playerId
        || this.players[1] && this.players[1].getId() === playerId) {
            //throw new Error("This player is already in the game!");
        }
        // Hehe this is smart isn't it minna
        this.players[this.currentPlayers] = player;
        this.currentPlayers++;
    }

    // chotto yikes da ne
    isTheirTurn(player) {
        return this.players[this.turn].getId() === player.getId();
    }

    nextTurn() {
        this.turn = 1 - this.turn;
    }

    isReady() {
        return !this.hasFinished && this.players[0] !== null && this.players[1] !== null;
    }

    start() {
        // ettoooo nandarou na
        return this.report();
    }

    printGame() {
        let strBoard = "```";
        for (let i = 0; i < this.board.length; i++) {
            let row = this.board[i];
            strBoard += (i + 1) + ': ';
            for (let j = 0; j < row.length; j++) {
                let stick = row[j];
                strBoard += stick ? '| ' : '_ ';
            }
            strBoard += "\n";
        }
        strBoard += "  |1|2|3|4|5\n"; // Configurable?
        return strBoard + "```";
    }

    report() {
        if (this.hasFinished) {
            return "The game finished! " + this.winner.name + " won.";
        }

        return this.printGame();
    }

    reportTurn() {
        return this.players[this.turn].name + "'s turn.";
    }
}

module.exports = Game;
