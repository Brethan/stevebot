const Command = require('../Command.js');
// eslint-disable-next-line no-unused-vars
const { Message, EmbedBuilder } = require('discord.js');

module.exports = class Prefix extends Command {
	constructor(client) {
		super(client, {
			"name": "prefix",
			"description": "Sets the text command prefix for the bots",
			"alias": "px",
			"args": true,
			"admin": true,
			"minArgs": 2,
			"expectedArgs": ["set"],
			"usage": ['s.roles set `new_prefix`'],
			autoclear: 8_000,
		});
	}

	createSlashCommand(_args0) {
		const slash = super.createSlashCommand(false);

		return slash;
	}

	/**
	 * @param {Message} message
	 * @param {string[]} args
	 * @override
	 * @returns {import('discord.js').MessageCreateOptions}
	 */
	// eslint-disable-next-line no-unused-vars
	async execute(message, args) {
		// Things
		const new_prefix = args[1];
		this.client.prefix = new_prefix;

		return { content: `Prefix set to ${this.client.config.prod}` };
	}

	// eslint-disable-next-line no-unused-vars
	checkVariableArguments(args) {
		return [];
	}

	help(message) {
		message.channel.send("this is just a test to see if this'll work");
	}

};
