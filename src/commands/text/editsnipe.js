const Command = require('../Command.js');
// eslint-disable-next-line no-unused-vars
const { Message } = require('discord.js');

module.exports = class extends Command {
	constructor(client) {
		super(client, {
			"name": "editsnipe",
			"alias": "es",
			"description": "",
			"usage": ["s.editsnipe", ""],
			"ownerCommand": false,
			"disabled": false,
		});
	}

	/**
	 * @param {Message} message
	 * @param {string[]} args
	 */
	execute(message, args) {
		// I will define this later
		if (args) {
			// Something here
		} else {
			// Something else here
		}

		return message.content;
	}

};
