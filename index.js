const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
require('dotenv').config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.commands = new Collection();

require('./handlers/LoadCmds')(client);
require('./handlers/LoadEvts')(client);

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

(async () => {
    try {
        const token = process.env.token;
        const chalk = (await import('chalk')).default;

        if (!token) {
            console.error(chalk.bold.hex("#fd6d6d")("Token not found. Please set the token in your .env file."));
            process.exit(1);
        }

        await client.login(token).catch(() => {
            console.error(chalk.bold.hex("#fd6d6d")("Failed to login. Please check your token."));
            process.exit(1);
        }).then(() => console.log(chalk.bold.hex("#2ecc71")("Logged in successfully.\n")));

        await client.handleEvents(eventFiles);
        await client.handleCommands(commandFiles);
    } catch (error) {
        console.error("Error occurred during bot startup:", error);
        process.exit();
    }
})();
