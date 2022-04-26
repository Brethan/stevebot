const { writeFileSync } = require("fs");
const discord = require("discord.js");

module.exports = class Client extends discord.Client {

    constructor(intents) {
        super({ intents: intents });

        this.config = require("../config.json");
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
}