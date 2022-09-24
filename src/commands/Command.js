// @ts-check

// eslint-disable-next-line no-unused-vars
const { Message, EmbedBuilder, GuildMember, PermissionFlagsBits, PermissionsBitField } = require("discord.js");
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
	 *
	 * @param {Message} message
	 * @param {string[]} args
	 * @abstract
	 * @returns {Promise<String | EmbedBuilder>}
	 */
	// eslint-disable-next-line no-unused-vars
	async execute(message, args) {
		throw new Error("This command has not been implemented yet because steve is lazy.");
	}

	/**
	 * @param {string[]} args
	 * @returns {string}
	 */
	validateCommandInvocation(args) {

		// Args are required and none are provided
		if (this.args && !args.length) return "You didn't provide any arguments!";

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
	 * @param {string[]} args
	 * @returns {string[]}
	 * @abstract
	 */
	// eslint-disable-next-line no-unused-vars
	checkVariableArguments(args) {
		throw new Error(this.name + " variable argument checking has not been implemented");
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

};
