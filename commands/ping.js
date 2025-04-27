const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    autoDeferReply: false,
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Check the bot\'s latency'),

    execute: async function (interaction, client) {
        const startTime = Date.now();

        await interaction.deferReply({});

        const deferEndTime = Date.now();
        const deferTime = deferEndTime - startTime;

        const roundTripLatency = Date.now() - startTime;
        const apiLatency = Math.round(client.ws.ping);

        const statusEmoji = roundTripLatency < 350 ? ":green_circle:" : roundTripLatency < 800 ? ":yellow_circle:" : ":red_circle:";

        const embed = new EmbedBuilder()
            .setColor('#5865f2')
            .setTitle('Pong! Latency Information')
            .setDescription('Here are the details:')
            .addFields(
                { name: 'Round-trip Latency', value: `${roundTripLatency}ms ${statusEmoji}`, inline: true },
                { name: 'API Latency', value: `${apiLatency}ms`, inline: true },
                { name: 'Response Delay', value: `${deferTime}ms`, inline: true }
            )
            .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
            .setTimestamp();

        await interaction.editReply({ content: null, embeds: [embed] });
    }
};

