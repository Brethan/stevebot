const Command = require('../Command.js');
const { existsSync, mkdirSync, appendFile } = require("fs");
// eslint-disable-next-line no-unused-vars
const { AutocompleteInteraction, ChatInputCommandInteraction, SlashCommandBooleanOption, EmbedBuilder } = require('discord.js');
const courseInfo = require('../../util/course-info.js');

module.exports = class Course extends Command {
	constructor(client) {
		super(client, {
			"name": "course",
			"description": "Command for testing out them buttons",
			"slashOnly": true,
			"permissions": ["Administrator"],
			"owner": true,
			autoclear: 8_000,
		});

		this.subcommands = ["info", "exams"];
		this.stringOptions = ["department", "number", "section"];
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

		const departmentOption = this.createCmdStringOption(this.stringOptions[0]);
		const codeOption = this.createCmdStringOption(this.stringOptions[1]);
		const sectionOption = this.createCmdStringOption(this.stringOptions[2]);
		const invisibleOption = new SlashCommandBooleanOption()
			.setName("visible")
			.setDescription("Make the command visible to other users")
			.setRequired(false);

		const options = [departmentOption, codeOption, invisibleOption];
		const slash = super.createSlashCommand(false)
			.addSubcommand(this.createSubCommand(this.subcommands[0], null, ...options))
			.addSubcommand(this.createSubCommand(this.subcommands[1], null, ...options, sectionOption));

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
			const d = new Date();
			const temp = d.toISOString();
			const date = temp.substring(0, temp.indexOf("T"));
			if (!existsSync("./logs/errors"))
				mkdirSync("./logs/errors", { recursive: true });

			appendFile(`./logs/errors/${date}.log`, String(error) + "\n\n", (err) => {
				if (err) console.error(err);
			});
		}


	}

	/**
	 * @typedef examObj
	 * @property {string} startDate
	 * @property {string} endDate
	 * @property {string} length
	 * @property {string} startTime
	 * @property {string} endTime
	 * @property {string} loc
	 * @property {string} type
	 */

	/**
	 *
	 * @param {string} dept
	 * @param {string} code
	 */
	examInfo(dept, code, section) {
		/** @type {examObj} */
		const exam = this.client.exams[dept]?.[code]?.[section];
		return new EmbedBuilder()
			.setTitle(`Exam Schedule`)
			.setDescription(`Exam details for **${dept} ${code} - ${section}**`)
			.setColor("Green")
			.addFields(
				{ name: "Start Date", value: exam.startDate, inline: true },
				{ name: "End Date", value: exam.endDate, inline: true },
				{ name: "Exam Duration", value: exam.length, inline: true },
				{ name: "Type", value: exam.type, inline: true },
				{ name: "Start Time", value: exam.startTime, inline: true },
				{ name: "End Time", value: exam.endTime, inline: true },
				{ name: "Location", value: exam.loc, inline: false },
			);
	}

	/**
	 *
	 * @param {ChatInputCommandInteraction} interaction
	 */
	async handleChatInputCommand(interaction) {
		const sub = interaction.options.getSubcommand();
		const dept = interaction.options.getString(this.stringOptions[0], true).toUpperCase();
		const code = interaction.options.getString(this.stringOptions[1], true).toUpperCase();
		const visible = interaction.options.getBoolean("visible", false);

		if (interaction.replied)
			return;

		if (sub === this.subcommands[0])
			// eslint-disable-next-line curly
			await interaction.reply({ embeds: [await courseInfo(dept, code)], ephemeral: !visible });
		else if (sub === this.subcommands[1]) {
			const section = interaction.options.getString(this.stringOptions[2], true).toUpperCase();
			await interaction.reply({ embeds: [this.examInfo(dept, code, section)], ephemeral: !visible });
		}

		return;
	}

	/**
	 *
	 * @param {AutocompleteInteraction} interaction
	 */
	async handleAutoComplete(interaction) {
		const sub = interaction.options.getSubcommand(true);
		const collection = (sub === this.subcommands[0]) ? this.client.courses : this.client.exams;

		const deptArr = Object.keys(collection);
		const foc = interaction.options.getFocused(true);

		const respond = async (/** @type {string[]} */ arr) => {
			const filtered = arr.filter(choice => choice.toLowerCase().startsWith(foc.value));
			const limited = filtered.splice(0, Math.min(25, filtered.length));
			await interaction.respond(limited.map(str => ({ name: str, value: str })));
		};

		if (foc.name === this.stringOptions[0]) {
			await respond(deptArr);
		} else if (foc.name === this.stringOptions[1]) {
			const deptVal = interaction.options.getString(this.stringOptions[0], true).toUpperCase();
			const codeArr = (sub === this.subcommands[0]) ? this.client.courses[deptVal] : Object.keys(this.client.exams[deptVal]);
			if (!codeArr)
				return;

			await respond(codeArr);
		} else if (foc.name === this.stringOptions[2]) {
			const deptVal = interaction.options.getString(this.stringOptions[0], true).toUpperCase();
			const codeVal = interaction.options.getString(this.stringOptions[1], true).toUpperCase();
			const sectionArr = this.client.exams[deptVal]?.[codeVal].sections;
			if (!sectionArr)
				return;

			await respond(sectionArr);
		}

	}

};
