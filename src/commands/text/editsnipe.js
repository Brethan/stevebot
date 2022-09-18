const Command = require('../Command.js');
const discord = require('discord.js');

module.exports = class  extends Command {
    constructor(client) {
        super(client, {
            "name": "editsnipe",
            "alias": "es",
            "description": "",
            "permissions": ["PERMISSIONS"],
            "args": true,
            "minArgs": 1,
            "expectedArgs": ["args", ],
            "usage": ['s. '],
            "ownerCommand": false,
            "disabled": false,
        })
    }
    /**
     * @param {discord.Message} message
     * @param {string[]} args
     */
    execute(message, args) {

    }

    

}
