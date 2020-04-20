// Start up Discord client.
const Discord = require('discord.js');
const client = new Discord.Client();
try {
    client.config = require('./config.json');
} catch (err) {
    console.error("Please, copy config-example.json into config.json and fill the information.");
    process.exit(-1);
}
const Game = require('./game');
const Player = require('./player');
const games = {};

function idFromChannel(message) {
    return message.guild + ':' + message.channel;
}

function doesGameExist(id) {
    return id in games;
}

client.on("ready", () => {
    console.log('Stick bot is ready!');
});

client.on("guildCreate", guild => {
	// This event triggers when the bot joins a guild.
	console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
	client.user.setActivity(`${client.guilds.size} guilds`);
});

client.on("guildDelete", guild => {
	// This event triggers when the bot is removed from a guild.
	console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
	client.user.setActivity(`Active on ${client.guilds.size} servers`);
});

client.on("message", async message => {

	// Ignore bots.
	if (message.author.bot) return;

    // Ignore messages without a prefix.
	if (message.content.indexOf(client.config.prefix) !== 0) return;

    let result = '';
    const args = message.content.slice(client.config.prefix.length).trim().split(/ +/g);
    const gameId = idFromChannel(message);

    if (args[0] === 'begin') {
        if (doesGameExist(gameId)) {
            result = "There's already a game going on in this channel!";
        }
        games[gameId] = new Game();
        result = "Type s!join to join the game.";
    } else if (args[0] === 'join') {
        if (!doesGameExist(gameId)) {
            result = "There's no game going on in this channel!";
        }
        try {
            games[gameId].join(new Player(message.author));
            result = "You have joined the game.";
            if (games[gameId].isReady()) {
                games[gameId].start();
                result += "\nThe game is starting!\n";
                result += games[gameId].report() + "\n";
                result += games[gameId].reportTurn();
            }
        } catch (err) {
            result = err.message;
        }
    } else if (args[0] === 'take') {
        // I AM VERY SORRY ABOUT THE ELSE IF
        // IT IS GONNA BE REFACTORES AS SOON AS IT JUST WORKS TM I SWEAR TO MADOKA
        if (!doesGameExist(gameId)) {
            result = "There's no game going on in this channel!";
        } else
        // This is not efficient, wrap players once and manage them with that.
        if (!games[gameId].isTheirTurn(new Player(message.author))) {
            result = "It's not your turn!";
        } else
        if (!args[1] || args[1].indexOf(':') === -1) {
            result = "Wrong syntax. Take sticks with: s!take row:col or s!take row:colStart-colEnd";
        } else
        {
            let reimu = args[1].split(':');
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
                games[gameId].take(row, initialCol, lastCol);
                games[gameId].nextTurn();
                result = games[gameId].report() + "\n";
                if (!games[gameId].hasFinished) {
                    result += games[gameId].reportTurn();
                }
            } catch (err) {
                result = err.message;
            }
        }
    }

    // This is also pretty bad but not as bad as it could be.
    // Messages that are not relevant to the bot should all be ignored and dropped as fast as possible to save some cpu cycles.
    if (result && result !== '') {
        message.channel.send(result);
    }
});

client.login(client.config.token);
