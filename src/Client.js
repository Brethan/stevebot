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

		this.departments = require("./data/departments.json");

		/** @type {any} */
		this.courses = require("./data/courses.json");

		/** @type {string[]} */
		// @ts-ignore
		this.rolesJson = Array.from(require("./data/roles.json"));

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
			const data = {
				prod: "s.",
				dev: "n.",
				"log_settings": {
					"channel": "",
					"members": [],
					"events": [],
				},
			};
			writeFileSync("./config.json", JSON.stringify(data, null, 4));
			return data;
		}
	}

	get prefix() {
		if (!this.user) return this.config.dev;
		const username = this.user.username.toLowerCase();
		return username.startsWith("steve") ? this.config.prod : this.config.dev;
	}

	set prefix(change) {
		this.config.prod = change;
		this.overwriteConfig();
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

	overwriteCourses() {
		console.log("INFO: Overwriting the courses json");
		this.overwriteData(this.courses, "./src/data/courses.json");
	}

	overwriteSlashJson() {
		console.log("INFO: Overwriting the slashReady json");
		this.overwriteData(this.slashJson, "./src/data/slashReady.json");
	}

	overwriteRoles() {
		console.log("INFO: Overwriting the roles json");
		this.overwriteData(this.rolesJson, "./src/data/roles.json");
	}

	overwriteConfig() {
		console.log("INFO: Overwriting the config json");
		this.overwriteData(this.config, "./config.json");
	}

	/**
	 * @param {any} obj
	 * @param {import("fs").PathOrFileDescriptor} path
	 */
	overwriteData(obj, path) {
		const data = JSON.stringify(obj, null, 4);
		writeFileSync(path, data);
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
		return mention.replace(/[A-Za-z]|\\|\/|:|\*|\?|"|<|>|\||@|!|&/g, "");
	}
};
