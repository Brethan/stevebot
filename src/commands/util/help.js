const Command = require('../Command.js');
// eslint-disable-next-line no-unused-vars
const discord = require('discord.js');

module.exports = class Help extends Command {
	constructor(client) {
		super(client, {
			"name": "help",
			"description": "Displays a list of commands, as well as their expected arguments",
			"permissions": ["SEND_MESSAGES"],
			"args": false,
			"usage": ['s.help ', "s.help `commandName`"],
			autoclear: 5000,
		});
	}

	/**
	 * @param {discord.Message} message
	 * @param {string[]} args
	 * @return {Promise<import("discord.js").MessageCreateOptions>}
	 */
	// eslint-disable-next-line no-unused-vars
	async execute(message, args) {
		return { content: "This command has not been implemented yet!" };
	}

	/**
	 * Sends a message to the channel containing the usage of
	 * the command with the name commandName
	 *
	 * @param {discord.Message} message
	 * @param {string} commandName Name of the command to generate usage for
	 * @return {Promise<import("discord.js").MessageCreateOptions>}
	 */
	// eslint-disable-next-line no-unused-vars
	async defaultHelp(message, commandName) {
		return "The help command has not been implemented yet!";
	}

	/**
	 * Sends a message to the channel containing instructions
	 * on how to use this command
	 *
	 * @param {discord.Message} message
	 * @return {Promise<import("discord.js").MessageCreateOptions>}
	 */
	// eslint-disable-next-line no-unused-vars
	async help(message) {
		return { content: "The help command has not been implemented yet!" };
	}
};
