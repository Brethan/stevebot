const Command = require('../Command.js');
// eslint-disable-next-line no-unused-vars
const { Message, EmbedBuilder } = require('discord.js');

module.exports = class Roles extends Command {
	constructor(client) {
		super(client, {
			"name": "roles",
			"description": "grants or removes roles from a user",
			"alias": "rs",
			"args": true,
			"moderator": true,
			"minArgs": 1,
			"expectedArgs": ["add", "remove", "info"],
			"usage": ['s.roles add `rolename`'],
		});
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
		const primary = args.shift();
		if (this[primary]) {
			this[primary]((await this.filterRoleIds(args, message.guild)));
		}

		return { embeds: [this.info()] };
	}

	/**
	 * @returns {EmbedBuilder}
	 */
	info() {
		const embed = new EmbedBuilder()
			.setDescription("Members are able to add the following roles: "
				+ this.snowflakesToMention(this.client.rolesJson.sort((a, b) => a - b), "role"))
			.setThumbnail(this.client.user.displayAvatarURL())
			.setTitle("Command Info: Roles")
			.setColor('Blurple');

		return embed;
	}

	async add(args) {
		const temp = [...this.client.rolesJson].concat(args);
		this.client.rolesJson = Array.from(new Set(temp));
		this.client.overwriteRoles();
	}

	async remove(args) {
		const temp = [...this.client.rolesJson].filter(s => !args.includes(s));
		this.client.rolesJson = Array.from(temp);
		this.client.overwriteRoles();
	}

	// eslint-disable-next-line no-unused-vars
	checkVariableArguments(args) {
		return [];
	}

	help(message) {
		message.channel.send("this is just a test to see if this'll work");
	}

};
