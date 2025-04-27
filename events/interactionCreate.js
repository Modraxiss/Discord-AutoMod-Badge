const { MessageFlags } = require('discord.js');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        if (!interaction.isCommand()) return;

        const command = client.commands.get(interaction.commandName);

        if (!command) {
            return interaction.reply({ content: 'Command not found!', flags: MessageFlags.Ephemeral }).catch(console.error);
        }

        if (!interaction.guild) {
            return interaction.reply({ content: 'Slash commands only work on servers!', flags: MessageFlags.Ephemeral }).catch(console.error);
        }

        if (command.autoDeferReply ?? true) {
            await interaction.deferReply({ flags: command?.ephemeralReply ? MessageFlags.Ephemeral : 0 }).catch(console.error);
        }

        await command.execute(interaction, client).catch(async err => {
            console.error(`Command execution error:`, err);
            await interaction.editReply({ content: 'There was an error while executing this command!', embeds: [], components: [] }).catch(console.error);
        });
    }
};
