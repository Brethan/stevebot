const Command = require('../Command.js');
// eslint-disable-next-line no-unused-vars
const { Message, ChatInputCommandInteraction, ButtonBuilder, ButtonStyle, ActionRowBuilder, ButtonInteraction } = require('discord.js');

module.exports = class Exams extends Command {
	constructor(client) {
		super(client, {
			"name": "examss",
			"description": "Command for testing out them buttons",
			"slashOnly": true,
			"permissions": ["Administrator"],
			"usage": ['s.button'],
			"owner": true,
			autoclear: 8_000,
		});

		/**
		 * Instead of doing some kind of modular thing in the constructor,
		 * there should be a function that creates a slash command rather than them
		 * being created in the command-loader.js file.
		 */
	}

	/**
	 *
	 * @param {any} _args0
	 * @override
	 */
	createSlashCommand(_args0) {
		/** @type {import('discord.js').APIApplicationCommandOptionChoice[]} */
		const deptChoices = [];
		for (const dept of this.client.departments) {
			deptChoices.push({ name: "dept", value: dept });
		}
		const slash = super.createSlashCommand(false)
			.addStringOption(option => {
				option.setName("department")
					.setDescription("Department stuff ha ha lol")
					.setRequired(true);
				option.choices = deptChoices;
				return option;
			});

		return slash;
	}

	/**
	 *
	 * @param {ChatInputCommandInteraction} interaction
	 */
	async slash(interaction) {
		interaction.channel.send("bruh stop");
	}

};
