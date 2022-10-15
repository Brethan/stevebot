const Command = require('../Command.js');
// eslint-disable-next-line no-unused-vars
const { Message, ChatInputCommandInteraction, SlashCommandBuilder } = require('discord.js');

module.exports = class Role extends Command {
	constructor(client) {
		super(client, {
			"name": "ping",
			"description": "Responds to the user with a pong!",
			"usage": ['s.ping'],
			autoclear: 8_000,
		});
	}

	/**
	 * @override
	 */
	createSlashCommand() {
		const slash = new SlashCommandBuilder()
			.setName(this.name)
			.setDescription(this.description);

		return slash;
	}

	/**
	 * @param {Message} message
	 * @param {string[]} args
	 * @override
	 */
	async execute() {
		return "Pong!";
	}

	/**
	 *
	 * @param {ChatInputCommandInteraction} interaction
	 */
	async slash(interaction) {
		interaction.reply({ content: "Pong!", ephemeral: true });
	}

};
