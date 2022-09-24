const Command = require('../Command.js');
// eslint-disable-next-line no-unused-vars
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
		});
	}
	/**
	 * @param {discord.Message} message
	 * @param {string[]} args
	 * @override
	 */
	// eslint-disable-next-line no-unused-vars
	async execute(message, args) {
		// Things
	}

	// eslint-disable-next-line no-unused-vars
	checkVariableArguments(args) {
		return [];
	}

	help(message) {
		message.channel.send("this is just a test to see if this'll work");
	}

};
