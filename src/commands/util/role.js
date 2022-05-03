const Command = require('../Command.js');
const discord = require('discord.js');

module.exports = class Role extends Command {
    constructor(client) {
        super(client, {
            "name": "role",
            "description": "grants or removes roles from a user",
            "args": true,
            "minArgs": 2,
            "expectedArgs": ["add", "remove"],
            "usage": ['s.role add `rolename`', 's.role remove `rolename`'],
        })
    }
    /**
     * @param {discord.Message} message
     * @param {string[]} args
     */
    execute(message, args) {
    }

}