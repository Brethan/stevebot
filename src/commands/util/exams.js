const Command = require('../Command.js');
// eslint-disable-next-line no-unused-vars
const { Message, ChatInputCommandInteraction, ButtonBuilder, ButtonStyle, ActionRowBuilder, ButtonInteraction } = require('discord.js');

module.exports = class Exams extends Command {
	constructor(client) {
		super(client, {
			"name": "exams",
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

		const slash = super.createSlashCommand(false)
			.addStringOption(option => {
				option.setName("department")
					.setDescription("Department stuff ha ha lol")
					.setAutocomplete(true)
					.setRequired(true);
				return option;
			});

		return slash;
	}

	/**
	 *
	 * @param {import('discord.js').Interaction} interaction
	 */
	async slash(interaction) {
		if (interaction.isAutocomplete()) {
			const deptArr = this.client.departments;
			const foc = interaction.options.getFocused();
			try {
				const filteredDepartments = deptArr.filter(choice => choice.toLowerCase().startsWith(foc));
				const limitDepartments = filteredDepartments.splice(0, Math.min(25, filteredDepartments.length));
				await interaction.respond(limitDepartments.map(str => ({ name: str, value: str })))
			} catch (error) {
				console.log("ERROR: exams.js::slash(interaction): await interaction.respond() - Unknown (Cancelled?) Interaction!");
			}
		}
	}

};
