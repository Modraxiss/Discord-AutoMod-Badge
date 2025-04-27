const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');

module.exports = (client) => {
    client.handleCommands = async (commandFiles) => {
        const clientId = client.user.id;

        const chalk = (await import('chalk')).default;
        client.commandArray = [];

        console.log(chalk.bold.blue("Commands:"));
        for (const file of commandFiles) {
            const command = require(`../commands/${file}`);

            if (command.disable === true) {
                console.log(
                    chalk.hex("#fd6d6d").bold(` ${command.data.name} ` +
                        chalk.bgHex("#5865f2").white(` ${file} `) +
                        chalk.bgHex("#fd6d6d")(` Disabled `)
                    )
                );
                continue;
            }

            if (!command.data) continue;

            console.log(
                chalk.hex("#5865f2").bold(` ${command.data.name} ` +
                    chalk.bgHex("#5865f2").white(` ${file} `) +
                    chalk.bgGray.white(` Loaded `)
                )
            );

            command.data.dm_permission = false;
            client.commands.set(command.data.name, command);
            client.commandArray.push(command.data.toJSON());
        }

        const rest = new REST({ version: '10' }).setToken(process.env.token);

        try {
            await rest.put(
                Routes.applicationCommands(clientId),
                { body: client.commandArray }
            );
            console.log(chalk.bold.hex("#2ecc71")('Successfully reloaded application (/) commands.\n'));
        } catch (err) {
            console.error(chalk.bold.hex("#fd6d6d")('Failed to reload application (/) commands.', err));
        }
    };
};
