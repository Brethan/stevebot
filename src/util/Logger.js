const Client = require("../Client");

module.exports = class Logger {
    /**
     * 
     * @param {Client} client 
     */
    constructor(client) {
        this.logSettings = client.config.log_settings;
    }

    get events() {
        return this.logSettings.events;
    }

    get people() {
        return this.logSettings.people;
    }

    get eventLoggingChannel() {
        return this.logSettings.log_channels.events;
    }

    get peopleLoggingChannel() {
        return this.logSettings.log_channels.people;
    }

    /**
     * 
     * @param {string|string[]} events 
     */
    addEvents(events) {
        if (!(events instanceof Array)) {
            events = [events]
        }

        
    }

    /**
     * 
     * @param {string|string[]} people 
     */
    addPeople(people) {
        if (!(people instanceof Array)) {
            people = [people];
        }

        
    }
}