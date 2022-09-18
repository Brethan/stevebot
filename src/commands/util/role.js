const Command = require('../Command.js');
const discord = require('discord.js');

module.exports = class Role extends Command {
    constructor(client) {
        super(client, {
            "name": "role",
            "description": "grants or removes roles from a user",
            "alias": "r",
            "args": true,
            "minArgs": 2,
            "expectedArgs": ["add", "remove"],
            "usage": ['s.role add `rolename`', 's.role remove `rolename`'],
        })
    }
    /**
     * @param {discord.Message} message
     * @param {string[]} args
     * @override
     */
    async execute(message, args) {
    }

    checkVariableArguments(args) {
        return [];
    }

    help(message) {
        message.channel.send("this is just a test to see if this'll work")
    }

}
