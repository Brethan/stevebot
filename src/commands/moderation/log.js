//@ts-check

const Command = require('../Command.js');
const discord = require('discord.js');
const SteveClient = require('../../Client.js');
const { time, timeEnd } = require('console');

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
            "permissions": ["SEND_MESSAGES", "MANAGE_MESSAGES", "MANAGE_CHANNELS"],
            "args": true,
            "minArgs": 1,
            "expectedArgs": [
                "info", "set-channel",
                "add-event", "remove-event",
                "add-member", "remove-member"
            ],
            "usage": ['s.help ', "s.help `commandName`"],
            autoclear: 500
        })

    }

    /**
     * @param {discord.Message} message
     * @param {string[]} args
     * @return {Promise<string | discord.MessageEmbed>}
     */
    async execute(message, args) {
        const logger = this.client.logger;
        const primary = args.shift();
        switch (primary) {
            case "add-member":
                logger.addMembersToLog((await this.filterMemberIds(args, message.guild)));
                break;
            case "remove-member":
                logger.removeMembersFromLog((await this.filterMemberIds(args, message.guild)));
                break;
            case "add-event":
                console.log(require("../../data/events.json"));
                break;
            case "remove-event":
                break;
            default:
                break;
        }

        return "a";
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

        return member
    }

}
