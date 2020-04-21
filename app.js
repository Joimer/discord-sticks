// Start up Discord client.
const Discord = require('discord.js');
const client = new Discord.Client();
try {
    client.config = require('./config.json');
} catch (err) {
    console.error("Please, copy config-example.json into config.json and fill the information.");
    process.exit(-1);
}
const Player = require('./player');
const Commands = require('./commands');

// 何をしましょうかなぁ~
function idFromChannel(message) {
    return message.guild + ':' + message.channel;
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

    const args = message.content.slice(client.config.prefix.length).trim().split(/ +/g);
    const gameId = idFromChannel(message);
    const player = new Player(message.author);

    if (Commands.exists(args[0]) && Commands.isAllowed(player, gameId, args[0])) {
        try {
            let result = Commands.run(player, gameId, args[0], args[1]);
            if (!result || result === '') {
                result = "Something went wrong.";
            }
            message.channel.send(result);
        } catch (err) {
            console.log(`An error happened while handling command ${args[0]} for game ${gameId}.`);
            console.log(result);
            console.error(err);
        }
    }
});

client.login(client.config.token);
