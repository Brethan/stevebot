const SteveClient = require("../Client");

module.exports = class Logger {
    /**
     * 
     * @param {SteveClient} client 
     */
    constructor(client) {
        /** @type {SteveClient} */
        this.client = client;
        this.logSettings = client.config.log_settings;
    }

    get events() {
        return this.logSettings.events;
    }

    get members() {
        return this.logSettings.members;
    }
    
    get loggingChannel() {
        return this.logSettings.channel;
    }

    set events(events) {
        this.logSettings.events = events;
        this.client.overwriteConfig();
    }

    set members(members) {
        this.logSettings.members = members;
        this.client.overwriteConfig();
    }

    set loggingChannel(channel) {
        this.logSettings.channel = this.client.resolveIdFromMention(channel);
        this.client.overwriteConfig();
    }

    /**
     * 
     * @param {string | string[]} members 
     */
    addMembersToLog(members) {
        if (typeof members === "string") {
            members = [members];
        }
        
        this.members = Array.from(new Set([...this.members].concat(members)));
    }

    /**
     * 
     * @param {string | string[]} members 
     */
    removeMembersFromLog(members) {
        if (typeof members === "string") {
            members = [members];
        }

        this.members = this.members.filter(id => !members.includes(id));
    }
}
