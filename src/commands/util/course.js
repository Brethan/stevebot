const Command = require('../Command.js');
// eslint-disable-next-line no-unused-vars
const { AutocompleteInteraction, ChatInputCommandInteraction, SlashCommandBooleanOption } = require('discord.js');
const courseInfo = require('../../util/course-info.js');

module.exports = class Course extends Command {
	constructor(client) {
		super(client, {
			"name": "course",
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

		const departmentOption = this.createCmdStringOption("department");
		const codeOption = this.createCmdStringOption("course_code");
		const invisibleOption = new SlashCommandBooleanOption()
			.setName("visible")
			.setDescription("Make the command visible to other users")
			.setRequired(false);

		const options = [departmentOption, codeOption, invisibleOption];
		const slash = super.createSlashCommand(false)
			.addSubcommand(this.createSubCommand("exam_schedule", null, ...options))
			.addSubcommand(this.createSubCommand("info", null, ...options));

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
				await this.handleChatInputCommand(interaction);
		} catch (error) {
			console.log(error);
		}


	}

	/**
	 *
	 * @param {ChatInputCommandInteraction} interaction
	 */
	async handleChatInputCommand(interaction) {
		const sub = interaction.options.getSubcommand();
		const dept = interaction.options.getString("department", true);
		const code = interaction.options.getString("course_code", true);
		const visible = interaction.options.getBoolean("visible", false);

		if (sub === "info")
			interaction.reply({ embeds: [await courseInfo(dept, code)], ephemeral: !visible });
		else if (sub === "exam_schedule")
			interaction.reply({ content: "Exam schedule command is in development!", ephemeral: !visible });

		return;
	}

	/**
	 *
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
