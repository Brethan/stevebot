const Command = require('../Command.js');
const discord = require('discord.js');

module.exports = class Help extends Command {
    constructor(client) {
        super(client, {
            "name": "help",
            "description": "Displays a list of commands, as well as their expected arguments",
            "permissions": ["SEND_MESSAGES"],
            "args": false,
            "usage": ['s.help ', "s.help `commandName`"],
            autoclear: 5000
        })
    }

    /**
     * @param {discord.Message} message
     * @param {string[]} args
     * @return {string | discord.MessageEmbed}
     */
    async execute(message, args) {
        return "This command has not been implemented yet!";
    }

    /**
     * Sends a message to the channel containing the usage of
     * the command with the name commandName 
     * 
     * @param {discord.Message} message 
     * @param {string} commandName Name of the command to generate usage for
     * @return {string | discord.MessageEmbed}
     */
    async defaultHelp(message, commandName) {
        return "The help command has not been implemented yet!";
    }

    /**
     * Sends a message to the channel containing instructions 
     * on how to use this command
     * 
     * @param {discord.Message} message
     * @return {string | discord.MessageEmbed}
     */
    help(message) {
        return "The help command has not been implemented yet!";
    }
}
