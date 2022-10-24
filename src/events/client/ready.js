// @ts-check

// eslint-disable-next-line no-unused-vars
const SteveClient = require("../../Client");
const Event = require("../Event");
const fetchCourses = require("../../util/course-fetcher.js");

module.exports = class Ready extends Event {
	constructor() {
		super({ name: "ready", once: "once", enabled: true });
	}
	/**
	 *
	 * @param {SteveClient} client
	 */
	async ready(client) {
		const week = (1000 * 60 * 60) * 24 * 7;

		setInterval(async () => {
			console.log("INFO: Updating list of courses.");
			client.courses = await fetchCourses();
			client.overwriteCourses();
		}, week);

		process.stdout.write(`\n\rNOTICE: ${client.user?.tag} is ready and waiting\n`);
		client.user?.setActivity({
			name: "stevebotV5 in development :o",
		});

	}
};
