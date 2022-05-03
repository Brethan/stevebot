const { writeFileSync, readdir, readdirSync } = require("fs");
const discord = require("discord.js");
const { join } = require("path");
const Command = require("./commands/Command");
const Event = require("./events/Event");

module.exports = class Client extends discord.Client {

    constructor(intents) {
        super({ intents: intents });

        this.config = require("../config.json");

        /**
         * @type {discord.Collection<string, Command>}
         */
        this.commands = new discord.Collection()

        /**
         * @type {discord.Collection<string, Command>}
         */
        this.aliases = new discord.Collection();

        /**
         * @type {discord.Collection<string, Event>}
         */
        this.events = new discord.Collection();
        
        this.initHandlers();
    }

    initHandlers() {
        readdirSync(join(__dirname, "handlers"))
            .filter(file => file.endsWith("handler.js"))
            .forEach(handler => require("./handlers/" + handler)(this, discord));
    }

    get prefix() {
        return this.config.prefix;
    }

    set prefix(change) {
        this.config.prefix = change;
    }

    overwriteConfig() {
        const data = JSON.stringify(this.config, null, 4);
        writeFileSync("./config.json", data);
    }

    externalOverrideConfig(config) {
        this.config = config;
        this.overwriteConfig();
    }
}