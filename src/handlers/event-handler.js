const { readdirSync } = require("fs");
const { resolve } = require("path");
const SteveClient = require("../Client");
const Event = require("../events/Event.js");

/**
 * 
 * @param {SteveClient} client 
 */
module.exports = (client) => {

    /**
     * 
     * @param {string} dir 
     */
    const loadEvents = (dir) => {
        const event_basePath = resolve("./src", "events", dir);
        const eventFiles = readdirSync(event_basePath).filter(file => file.endsWith(".js"));
        
        for (const eventSrc of eventFiles) {

            const Event = require(resolve(event_basePath, eventSrc));
            /** @type {Event} */
            const event = new Event();
            const eventName = event.name;
            client[event.once](eventName, event[eventName].bind(null, client));
            
        }
    }

    ["client", "guild"].forEach(e => loadEvents(e));
}
