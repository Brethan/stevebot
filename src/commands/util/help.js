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
        })
    }
    /**
     * @param {discord.Message} message
     * @param {string[]} args
     */
    execute(message, args) {

    }

    help(message, commandName) {
        message.channel.send("the help command has not been implemented yet.")
    }
}