const Client = require("../../Client");
const { Message } = require("discord.js");

/**
 * 
 * @param {Client} client 
 * @param {Message} message 
 */

module.exports = async (client, message) => {
    try {
        if (message.author.bot) return;
        if (message.content.toLowerCase().startsWith(client.config.prefix)) return;
    } catch (error) {
        console.error(error);
    }
}