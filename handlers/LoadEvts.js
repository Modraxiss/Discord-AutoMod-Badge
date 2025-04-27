module.exports = (client) => {
    client.handleEvents = async (eventFiles) => {
        const chalk = (await import('chalk')).default;

        console.log(chalk.bold.blue("Events:"));
        for (const file of eventFiles) {
            const event = require(`../events/${file}`);
            console.log(
                chalk.hex("#5865f2").bold(` ${event.name} ` +
                    chalk.bgHex("#5865f2").white(` ${file} `) +
                    chalk.bgGray.white(` Loaded `)
                )
            );

            if (event.once) {
                client.once(event.name, (...args) => event.execute(...args, client));
            } else {
                client.on(event.name, (...args) => event.execute(...args, client));
            }
        }
    };
};
