// @ts-check

// eslint-disable-next-line no-unused-vars
const { Message, EmbedBuilder, GuildMember, PermissionFlagsBits, PermissionsBitField, MessagePayload, Guild, SlashCommandBuilder } = require("discord.js");
// eslint-disable-next-line no-unused-vars
const SteveClient = require("../Client");


/**
 * Design goal for commands: break into functions such that
 * running a command does not require the execute method to run.
 */
module.exports = class Command {

	/**
	 *
	 * @param {SteveClient} client
	 * @param {Object} options
	 * @param {string} options.name
	 * @param {?string} options.description
	 * @param {?string} options.alias
	 * @param {?boolean} options.slashOnly
	 * @param {?import("discord.js").PermissionResolvable[]} options.permissions
	 * @param {?boolean} options.args
	 * @param {number} options.minArgs
	 * @param {?string[]} options.expectedArgs
	 * @param {?(string[])} options.usage
	 * @param {?boolean} options.moderator
	 * @param {?boolean} options.admin
	 * @param {?boolean} options.owner
	 * @param {?boolean} options.enabled
	 * @param {?number} options.autoclear
	 */
	constructor(client, options) {

		this.client = client;

		/** @type {string} Name of the command */
		this.name = options.name;

		/** @type {string} Describes what the command does / is used for */
		this.description = options.description || this.name;

		/** @type {?string} A shortened name for this command*/
		this.alias = options.alias;

		/**
		 * @type {import("discord.js").PermissionResolvable[]} A list of the user and / or channel
		 * permissions necessary to run this command
		 */
		this.permissions = options.permissions || [PermissionsBitField.Flags.SendMessages];

		/**
		 * @type {boolean} Whether or not the user needs to provide
		 * arguments to run this command
		 */
		this.args = options.args || false;

		/**
		 * @type {number} The minimum number of arguments required to run the command
		 * aside from a potential 0 argument use case
		 */
		this.minArgs = options.minArgs || 0;


		/** @type {boolean} */
		this.slashOnly = (options.slashOnly == null) ? false : options.slashOnly;


		/** @type {string[]} A list of the expected primary arguments. */
		this.expectedArgs = (options.expectedArgs || []).concat("help");

		/**  @type {string[]} A string containing examples on how to use the command */
		this.usage = [...options.usage || `${client.prefix}.${this.name}`];

		/**
		 * @type {boolean} Whether or not this command requires a user to be a moderator
		 * to invoke
		 */
		this.moderator = options.moderator || false;

		/**
		 * @type {boolean} Whether or not this command requires a user to have the
		 * Administrator permission to invoke
		 */
		this.admin = options.admin || false;

		/**
		 * @type {boolean} Whether or not this command can only be used by the
		 * owner of the server
		 */
		this.owner = options.owner || false;

		/**
		 * @type {boolean} Whether or not this command is disabled.
		 * Note: Command state "toggle" commands should never be disabled.
		 */
		this.enabled = options.enabled == null ? true : options.enabled;

		/**
		 * @type {number} The amount of time in milliseconds before the command
		 * response is deleted automatically.
		 *
		 * If left unset or set to 0, the command response will not be deleted
		 */
		this.autoclear = options.autoclear || 0;
	}

	/**
	 * Create the slash command interaction for this command
	 * @param {boolean} external
	 * @abstract
	 * @returns {?SlashCommandBuilder}
	 */
	createSlashCommand(external) {
		if (external) {
			return null;
		} else {
			return new SlashCommandBuilder()
				.setName(this.name)
				.setDescription(this.description);
		}
	}

	/**
	 *
	 * @param {Message} _message
	 * @param {string[]} _args
	 * @abstract
	 * @returns {Promise<import("discord.js").MessageCreateOptions>}
	 */
	async execute(_message, _args) {
		throw new Error("This command has not been implemented yet because steve is lazy.");
	}

	/**
	 *
	 * @param {import("discord.js").Interaction} _interaction
	 * @abstract
	 */
	async slash(_interaction) {
		throw new Error("This command is not ready for slash commands!");
	}

	/**
	 * @param {string[]} args
	 * @returns {string}
	 */
	validateCommandInvocation(args) {

		// Args are required and none are provided
		if (this.args && !args.length) return "You didn't provide any arguments!";

		// Bypass if arg[0] is help
		else if (args[0] === "help") return "";

		// Minimum # of args are required and N < minArgs, N = args provided
		else if (this.minArgs > args.length) return "You didn't provide enough arguments!";

		// Expected args are required and one is not provided
		else if (this.args && !this.expectedArgs.includes(args[0])) return "Unexpected argument: " + args[0];

		return "";
	}
	/**
	 *
	 * @param {GuildMember} member
	 * @param {string} channelId
	 */
	checkPermissions(member, channelId) {
		/** @type {import("discord.js").PermissionResolvable[]} */
		const missingPermissions = [];
		for (const perm of this.permissions) {
			// @ts-ignore
			if (!(member.permissions.has(perm) || member.permissionsIn(channelId).has(perm))) {
				missingPermissions.push(perm);
			}
		}

		return missingPermissions;
	}

	/**
	 *
	 * @param {string[]} _args
	 * @returns {string[]}
	 * @abstract
	 */
	checkVariableArguments(_args) {
		throw new Error(this.name + " variable argument checking has not been implemented");
	}

	/**
	 *
	 * @param {GuildMember} member
	 */
	async checkValidStaff(member) {
		// member.fetch();
		// @ts-ignore
		const { moderator, admin } = this.client.config;

		if (member.guild.ownerId === member.id) {
			return "";
		}

		if (this.owner) {
			return (member.guild.ownerId !== member.id) ? "the Server Owner" : "";

		} else if (this.admin) {
			return (!member.roles.cache.has(admin)) ? "an Admin" : "";

		} else if (this.moderator) {
			return (!member.roles.cache.has(moderator)) ? "a Moderator" : "";
		}

		return "";
	}

	/**
	 * Temporarily disables the commands autoclear timer (command response will not be cleared).
	 *
	 * This is useful for a command that would usually want to clear away its response for most
	 * of its functions except for one or two.
	 */
	tempDisableAutoclear() {
		const temp = this.autoclear;
		this.autoclear = 0;

		setTimeout(() => {
			this.autoclear = temp;
		}, 500);
	}

	/**
	 *
	 * @param {string[]} members_raw
	 * @param {?Guild} guild
	 * @returns {Promise<string[]>}
	 */
	async filterMemberIds(members_raw, guild) {
		const memberIds = this.resolveBulkSnowflakeIds(members_raw);
		await guild?.members.fetch();

		return memberIds.filter(id => guild?.members.cache.has(id));
	}

	/**
	 *
	 * @param {string[]} roles_raw
	 * @param {?Guild} guild
	 */
	async filterRoleIds(roles_raw, guild) {
		const roleIds = this.resolveBulkSnowflakeIds(roles_raw);
		await guild?.roles.fetch();

		return roleIds.filter(id => guild?.roles.cache.has(id));
	}

	/**
	 *
	 * @param {string[]} snowflakes
	 * @param {"role" | "mention" | "channel"} type
	 */
	snowflakesToMention(snowflakes, type = "role") {
		const append = ">";
		const prepend = "<" + (type == "channel" ? "#" : "@") + (type == "role" ? "&" : "");
		const mentions = [];

		for (const s of snowflakes) {
			mentions.push(prepend + s + append);
		}

		return mentions.join(", ");
	}

	/**
		 *
		 * @param {string[]} snowflakes
		 */
	resolveBulkSnowflakeIds(snowflakes) {
		const member = [];
		for (const id of snowflakes) {
			member.push(this.client.resolveIdFromMention(id));
		}

		return member;
	}

	toString() {
		return ["\nCommand Name: " + this.name, "\nDescription: " + this.description, "\nAlias: " + (this.alias || "None")].join("; ");
	}

};
