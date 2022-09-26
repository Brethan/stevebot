// @ts-check

// eslint-disable-next-line no-unused-vars
const SteveClient = require("../../Client");
const Event = require("../Event");

module.exports = class Ready extends Event {
	constructor() {
		super({ name: "ready", once: "once", enabled: true });
	}
	/**
	 *
	 * @param {SteveClient} client
	 */
	async ready(client) {
		console.log("\nNOTICE:", client.user?.tag, "is ready and waiting");
		client.user?.setActivity({
			name: "stevebotV5 in development :o",
		});
	}
};
