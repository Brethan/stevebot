// @ts-check

const { writeFileSync, readdirSync, existsSync } = require("fs");
// eslint-disable-next-line no-unused-vars
const { Client, Collection, Message } = require("discord.js");
const { join } = require("path");
// eslint-disable-next-line no-unused-vars
const Command = require("./commands/Command");
const Logger = require("./util/Logger");

module.exports = class SteveClient extends Client {

	/**
     * @param {import("discord.js").ClientOptions} options
     */
	constructor(options) {
		super(options);

		this.config = this.importConfig();

		/**
		 * @readonly
		 */
		this.eventsJson = require("./data/events.json");

		this.slashJson = require("./data/slashReady.json");

		/**
         * @type {Collection<string, Command>}
         */
		this.commands = new Collection();

		/**
         * @type {Collection<string, Command>}
         */
		this.aliases = new Collection();

		/**
         * @type {Collection<string, Event>}
         */
		this.events = new Collection();

		/**
         * @type {Collection<string, Message[]>}
         */
		this.edits = new Collection();

		/**
         * @type {Collection<string, Message>}
         */
		this.deletes = new Collection();

		/** @type {Logger} */
		this.logger = new Logger(this);

		this.initHandlers();

		if (!existsSync("./.env")) {
			writeFileSync("./.env", "TOKEN=\nGUILD=\nCLIENT=");
			throw new Error("You forgot to make your .env file. Made one for you, better put your token there.");
		}
	}

	initHandlers() {
		readdirSync(join(__dirname, "handlers"))
			.filter(file => file.endsWith("handler.js"))
			.forEach(handler => require("./handlers/" + handler)(this));
	}

	importConfig() {
		// Do some shit here and whatever
		if (existsSync("./config.json")) {
			return require("../config.json");
		} else {
			const data = { prefix: "s.", "log_settings": { "channel": "", "members": [], "events": [] } };
			writeFileSync("./config.json", JSON.stringify(data, null, 4));
			return data;
		}
	}

	get prefix() {
		return this.config.prefix;
	}

	set prefix(change) {
		this.config.prefix = change;
	}

	/**
     * @param {number} delay
     */
	async sleep(delay) {
		await new Promise(resolve => setTimeout(resolve, delay));
	}

	/**
     * @param {Message} message
     * @param {number | undefined} delay
     */
	async deleteMessage(message, delay = 5_000) {
		await this.sleep(delay);
		try {
			await message.delete();
		} catch (error) {
			console.log("ERROR: Could not delete a message. It may have been deleted by someone...");
		}
	}

	overwriteSlashJson() {
		console.log("INFO: Overwriting the slashReady json");
		const data = JSON.stringify(this.slashJson, null, 4);
		writeFileSync("./src/data/slashReady.json", data);
	}

	overwriteConfig() {
		console.log("INFO: Overwriting the config json");
		const data = JSON.stringify(this.config, null, 4);
		writeFileSync("./config.json", data);
	}

	externalOverrideConfig(config) {
		this.config = config;
		this.overwriteConfig();
	}

	/**
     *
     * @param {string} mention
     */
	resolveIdFromMention(mention) {
		return mention.replace(/\\|\/|:|\*|\?|"|<|>|\||@|!/g, "");
	}
};
