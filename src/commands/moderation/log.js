// @ts-check

const Command = require('../Command.js');
const discord = require('discord.js');
// eslint-disable-next-line no-unused-vars
const Logger = require('../../util/Logger.js');
// eslint-disable-next-line no-unused-vars
const SteveClient = require('../../Client.js');

module.exports = class Log extends Command {
	/**
	 *
	 * @param {SteveClient} client
	 */
	constructor(client) {
		// @ts-ignore
		super(client, {
			"name": "log",
			"description": "Displays a list of commands, as well as their expected arguments",
			"permissions": ['SendMessages', "ManageMessages", 'ManageChannels'],
			"args": true,
			"minArgs": 1,
			"expectedArgs": [
				"info", "set-channel",
				"add-event", "remove-event",
				"add-member", "remove-member",
			],
			"usage": ['s.help ', "s.help `commandName`"],
			autoclear: 500,
		});

	}

	/**
	 * @param {discord.Message} message
	 * @param {string[]} args
	 * @return {Promise<string | discord.EmbedBuilder>}
	 */
	async execute(message, args) {
		const logger = this.client.logger;
		const primary = args.shift()?.replace("-", "_") || "";
		let reply;

		if (this[primary]) {reply = await this[primary](logger, message, args);}

		return reply || new discord.EmbedBuilder({ description: "ooog" });
	}

	/**
	 *
	 * @param {Logger} logger
	 * @param {discord.Message} message
	 */
	async info(logger, message) {
		const { guild } = message;
		if (!guild) return;

		const channel = await guild.channels.fetch(logger.loggingChannel);
		const members = [];
		for (const str of logger.members) {
			const member = (await guild.members.fetch(str));
			if (!member) continue;

			members.push(`<@${member.id}>`);
		}

		const embed = new discord.EmbedBuilder()
			.setTitle("Command Info: Log")
			.setDescription(`Logging Channel: ${channel}\n\n`
				+ `**Members**\n${members.length ? members.join("\n") : "No members being logged"}\n\n`
				+ `**Events**\n${logger.events.length ? logger.events.join("\n") : "No events being logged"}`)
			.setColor("Blurple");

		if (this.client.user) {
			embed.setThumbnail(this.client.user.displayAvatarURL());
		}

		this.tempDisableAutoclear();

		return embed;
	}

	/**
	 *
	 * @param {Logger} logger
	 * @param {discord.Message} message
	 */
	set_channel(logger, message) {
		logger.loggingChannel = message.channel.id;
	}

	/**
	 *
	 * @param {Logger} logger
	 * @param {discord.Message} message
	 * @param {string[]} args
	 */
	async add_member(logger, message, args) {
		logger.addMembersToLog((await this.filterMemberIds(args, message.guild)));

	}

	/**
	 *
	 * @param {Logger} logger
	 * @param {discord.Message} message
	 * @param {string[]} args
	 */
	async remove_member(logger, message, args) {
		logger.removeMembersFromLog((await this.filterMemberIds(args, message.guild)));
	}

	/**
	 *
	 * @param {Logger} logger
	 * @param {discord.Message} _message
	 * @param {string[]} args
	 */
	async add_event(logger, _message, args) {
		// method stub

	}

	/**
	 *
	 * @param {Logger} logger
	 * @param {discord.Message} _message
	 * @param {string[]} args
	 */
	async remove_event(logger, _message, args) {
		// method stub
	}


	/**
	 *
	 * @param {string[]} members_raw
	 * @param {?discord.Guild} guild
	 * @returns {Promise<string[]>}
	 */
	async filterMemberIds(members_raw, guild) {
		const memberIds = this.resolveBulkMemberIds(members_raw);
		await guild?.members.fetch();

		return memberIds.filter(id => guild?.members.cache.has(id));
	}

	/**
	 *
	 * @param {string[]} members_raw
	 */
	resolveBulkMemberIds(members_raw) {
		const member = [];
		for (const id of members_raw) {
			member.push(this.client.resolveIdFromMention(id));
		}

		return member;
	}

};
