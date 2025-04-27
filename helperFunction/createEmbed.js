const { EmbedBuilder } = require('discord.js');
const getGitHubRawLink = require('./getGitHubRawLink.js');

/**
 * Creates a Discord embed with the provided options.
 * 
 * @param {string} message A message to display in the embed
 * @param {string} title A title to display in the embed
 * @param {HexColorString} color HEX color string
 * @param {boolean} thumbnail set to true to display the thumbnail
 * @param {Boolean} loading Set to true to display the loading indicator
 */
module.exports = (message = null, title = null, color = "default", thumbnail, loading) => {
    const colors = {
        red: "#fd6d6d",
        blurple: "#5865f2",
        green: "#2ecc71",
        yellow: "#f1c40f",
        purple: "#9b59b6",
        default: "#2b2d31"
    };

    const embed = new EmbedBuilder().setColor(colors[color] || colors.default);
    embed.setDescription(`${title ? `### ${title}` : ''}${message ? `\n${message}` : ''}`);

    if (thumbnail) {
        embed.setThumbnail(getGitHubRawLink({
            fileName: `Profile Picture v2${color === 'red' ? ' (Error)' : ''}`,
            fileExtension: 'png'
        }));
    }

    if (loading) {
        embed.setImage(getGitHubRawLink({
            fileName: `Loading v1`,
            fileExtension: 'gif'
        }));
    }

    return embed;
}
