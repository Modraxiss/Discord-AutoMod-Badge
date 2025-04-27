module.exports = {
    name: 'ready',
    async execute(client) {
        const chalk = (await import('chalk')).default;
        const gradient = (await import('gradient-string')).default;

        const defaultGradient = gradient(['#6662f5', '#716df8', '#7d78fa', '#7d78fa', '#8a84fb']);

        console.log(defaultGradient(`\n${client.user.displayName} is now online!\n`));
        console.log(chalk.bold.hex("#acaac7")(`Monitoring ${client.guilds.cache.size} server(s) for activity...\n`

        ));

        try {
            client.user.setPresence({ status: "online", activities: [{ name: `${client.guilds.cache.size} servers`, type: 2 }] });

            const app = await client.application.fetch();
            const owner = app.owner;

            if (owner) {
                console.log(
                    chalk.bold.hex("#a6a1ff")("Bot Details:\n") +
                    chalk.bold.hex("#8a84fb")(" Owner: ") + chalk.hex("#acaac7")(`@${owner.displayName} (${owner.username})`) + "\n" +
                    chalk.bold.hex("#8a84fb")(" Invite-Link: ") + chalk.hex("#acaac7")(
                        `https://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=32`
                    ) + "\n" +
                    chalk.bold.hex("#8a84fb")(" DM Owner: ") + chalk.hex("#acaac7")(
                        `https://discord.com/users/${owner.id}`
                    ) + "\n" +
                    chalk.bold.hex("#8a84fb")(" Repo: ") + chalk.hex("#acaac7")(
                        `https://github.com/Modraxiss/Discord-AutoMod-Badge`
                    ) + "\n" +
                    chalk.bold.hex("#8a84fb")(" Tip: ") + chalk.hex("#acaac7")("Check the README for full setup instructions.\n")
                );

                await owner.send(`<@${owner.id}>`).then(msg => { setTimeout(() => { msg.delete().catch(() => { }); }, 50) }).catch(() => { });
            } else {
                console.error("❌ Failed to fetch bot owner.");
            }
        } catch (error) {
            console.error("Error fetching bot owner:", error);
        }
    }
};
