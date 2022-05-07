const { readdirSync } = require("fs");
const { resolve } = require("path");
const Client = require("../Client");

/**
 * 
 * @param {Client} client 
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
            const event = require(resolve(event_basePath, eventSrc));
            const eventName = eventSrc.split(".")[0];
            client[event.once ? "once" : "on"](eventName, event.bind(null, client));
        }
    }

    ["client", "guild"].forEach(e => loadEvents(e));
}