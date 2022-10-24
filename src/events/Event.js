// @ts-check

module.exports = class Event {

	/**
	 *
	 * @param {Object} options
	 * @param {keyof import("discord.js").ClientEvents} options.name
	 * @param {?("once" | "on")} options.once
	 * @param {?boolean} options.enabled
	 */
	constructor(options) {

		/** @type {keyof import("discord.js").ClientEvents} */
		this.name = options.name;

		/** @type {"once" | "on"} */
		this.once = options.once || "on";

		/** @type {boolean} */
		this.enabled = options.enabled || true;

	}
};
