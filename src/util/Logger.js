// eslint-disable-next-line no-unused-vars
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
	 * @param {string | string[]} toAdd
	 * @param {"members" | "events"} method
	 */
	addToLog(toAdd, method) {
		if (typeof toAdd === "string") {
			toAdd = [toAdd];
		}

		this[method] = Array.from(new Set([...this[method]].concat(toAdd)));
	}

	/**
	 *
	 * @param {string | string[]} members
	 */
	addMembersToLog(members) {
		this.addToLog(members, "members");
	}

	/**
	 *
	 * @param {string | string[]} events
	 */
	addEventsToLog(events) {
		this.addToLog(events, "events");
	}

	/**
	 *
	 * @param {string | string[]} toRemove
	 * @param {"events" | "members"} method
	 */
	removeFromLog(toRemove, method) {
		if (typeof toRemove === "string") {
			toRemove = [toRemove];
		}

		this[method] = this[method].filter(str => !toRemove.includes(str));
	}

	/**
	 *
	 * @param {string | string[]} members
	 */
	removeMembersFromLog(members) {
		this.removeFromLog(members, "members");
	}

	/**
	 *
	 * @param {string | string[]} events
	 */
	removeEventsFromLog(events) {
		this.removeFromLog(events, "events");
	}


};
