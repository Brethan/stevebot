//@ts-check

const { Message, MessageEmbed } = require("discord.js");
const Client = require("../Client");


module.exports = class Command {

    /**
     * 
     * @param {Client} client 
     * @param {Object} options
     * @param {string} options.name
     * @param {?string} options.description
     * @param {?string} options.alias
     * @param {?string[]} options.permissions
     * @param {?boolean} options.args
     * @param {number} options.minArgs
     * @param {?string[]} options.expectedArgs
     * @param {?(string[])} options.usage
     * @param {?boolean} options.moderator
     * @param {?boolean} options.admin
     * @param {?boolean} options.owner
     * @param {?boolean} options.enabled
     */
    constructor(client, options) {

        /** @type {string} Name of the command */
        this.name = options.name;

        /** @type {string} Describes what the command does / is used for */
        this.description = options.description || this.name;

        /** @type {?string} A shortened name for this command*/
        this.alias = options.alias;

        /** 
         * @type {string[]} A list of the user and / or channel 
         * permissions necessary to run this command 
         */
        this.permissions = options.permissions || ["SEND_MESSAGES"];

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

        /** @type {?string[]} A list of the expected primary arguments  */
        this.expectedArgs = options.expectedArgs;

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
        this.enabled = options.enabled || true;
    }

    /**
     * 
     * @param {Message} message 
     * @param {string[]} args 
     * @abstract
     * @returns {Promise<String | MessageEmbed>} 
     */
    async execute(message, args) {
        
        throw new Error("This command has not been implemented yet because steve is lazy.");
    }

    /**
     * @param {Message} message
     * @param {string[]} args
     * @returns {?string}
     */
    validateCommandInvocation(message, args) {
        if (args[0] === "help") 
            return null;
        
        if (!args.length && this.args) {
            return "You didn't provide any arguments!";
        } else if (args.length) {
            if (this.expectedArgs && !this.expectedArgs.includes(args[0])) {
                const secondary = this.validateSecondaryArguments(args);
                return `Unexpected arguments:  ${args[0]}${secondary.length ? ', ' + secondary.join(", ") : ""}`;
            }
            if (args.length < this.minArgs)
                return "You didn't provide enough arguments!";
        }
        /** @type {string[]} */
        const noPerms = [];
        const { member } = message;
        for (const perm of this.permissions) {
            //@ts-ignore
            if (!(member.permissions.has(perm) || member.permissionsIn(message.channel.id).has(perm))) {
                noPerms.push(perm)
            }
        }

        if (noPerms.length) {
            return "You do not have permission to use this command.\nMissing permissions: " + noPerms.join(", ");
        }

        return null;
    }

    /**
     * 
     * @param {string[]} args 
     * @returns {string[]}
     * @abstract
     */
    validateSecondaryArguments(args) {
        throw new Error(this.name + " secondary argument validation has not been implemented")
    }
}
