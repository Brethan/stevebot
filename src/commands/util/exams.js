const Command = require('../Command.js');
// eslint-disable-next-line no-unused-vars
const { AutocompleteInteraction } = require('discord.js');

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
			}).addStringOption(option => {
				option.setName("course_code")
					.setDescription("Course number stuff ha ha lol")
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
		try {
			if (interaction.isAutocomplete())
				await this.handleAutoComplete(interaction);
			else if (interaction.isChatInputCommand())
				await this.handleChatInputCommand();
		} catch (error) {
			console.log(error);
		}


	}

	/**
	 * TODO: Refactor this into a module to be used for course info and related items.
	 * @param {AutocompleteInteraction} interaction
	 */
	async handleAutoComplete(interaction) {
		const deptArr = Object.keys(this.client.courses);
		const foc = interaction.options.getFocused(true);

		const respond = async (/** @type {string[]} */ arr) => {
			const filtered = arr.filter(choice => choice.toLowerCase().startsWith(foc.value));
			const limited = filtered.splice(0, Math.min(25, filtered.length));
			await interaction.respond(limited.map(str => ({ name: str, value: str })));
		};

		if (foc.name === "department") {
			respond(deptArr);
		} else if (foc.name === "course_code") {
			const deptVal = interaction.options.getString("department", true);
			if (!this.client.courses[deptVal])
				return;

			respond(this.client.courses[deptVal]);
		}

	}

};
