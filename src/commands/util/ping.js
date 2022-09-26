const Command = require('../Command.js');
// eslint-disable-next-line no-unused-vars
const discord = require('discord.js');

module.exports = class Role extends Command {
	constructor(client) {
		super(client, {
			"name": "ping",
			"description": "Responds to the user with a pong!",
			"slashReady": true,
			"usage": ['s.ping'],
			autoclear: 8_000,
		});
	}

	/**
	 * @param {discord.Message} message
	 * @param {string[]} args
	 * @override
	 */
	async execute() {
		return "Pong!";
	}

	/**
	 *
	 * @param {discord.ChatInputCommandInteraction} interaction
	 */
	async slash(interaction) {
		interaction.reply({ content: "Pong!", ephemeral: true });
	}

};
