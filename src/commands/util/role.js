const Command = require('../Command.js');
// eslint-disable-next-line no-unused-vars
const discord = require('discord.js');

module.exports = class Role extends Command {
	constructor(client) {
		super(client, {
			"name": "role",
			"description": "grants or removes roles from a user",
			"alias": "r",
			"args": true,
			"minArgs": 2,
			"expectedArgs": ["add", "remove"],
			"usage": ['s.role add `rolename`', 's.role remove `rolename`'],
			autoclear: 5_000,
		});
	}
	/**
	 * @param {discord.Message} message
	 * @param {string[]} args
	 * @override
	 */
	// eslint-disable-next-line no-unused-vars
	async execute(message, args) {
		let reply = { content: "gamer" };
		if (args[0].match(/add|remove/))
			reply = await this.common(args[1], message.guild.roles.cache, message.member, args[0]);


		return reply;
	}

	/**
	 *
	 * @param {string} roleName
	 * @param {discord.Collection<string, discord.Role>} roleCache
	 * @param {discord.GuildMember} member
	 * @param {"add" | "remove"} method
	 */
	async common(roleName, roleCache, member, method) {
		const roles = [...this.client.rolesJson];
		const roleID = roles.find(id => roleCache.find(r => r.name.toLowerCase() === roleName)?.id === id);

		if (!roleID) return { content: "Couldn't find role with name " + roleName };

		const role = roleCache.get(roleID);

		await member.roles[method](role);
		return { content: `${member}, ${method === "add" ? "added" : "removed"} role ${role.name}` };
	}

	/**
	 *
	 * @param {discord.Message} _message
	 */
	help(_message) {
		return { content: "This is just a test to see if this will work" };
	}

};
