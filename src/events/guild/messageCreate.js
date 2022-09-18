//@ts-check
const { Message } = require("discord.js");
const SteveClient = require("../../Client");
const Event = require("../Event.js");


module.exports = class MessageCreate extends Event {
    constructor() {
        super({
            name: "messageCreate",
            once: "on",
            enabled: true
        })
    }

    /**
     * @param {SteveClient} client
     * @param {Message} message 
     */
    async messageCreate(client, message) {
        console.log(message?.content);
    }
}
