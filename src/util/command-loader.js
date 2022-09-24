const { readdirSync } = require("fs");
const { join, resolve } = require("path");
// eslint-disable-next-line no-unused-vars
const Command = require("../commands/Command.js");
// eslint-disable-next-line no-unused-vars
const SteveClient = require("../Client");

/**
 *
 * @param {string} dir
 * @param {SteveClient} client
 */
module.exports = (dir, client) => {

	/**
	 *
	 * @param {Command} command
	 * @param {string} file
	 * @returns {boolean}
	 */
	const checkValidCommand = (command, file) => {

		if (!command.name) {
			console.log(`ERROR: Command with file name "${file}" does not have a command name`);
			return false;
		}

		if (!command.enabled) {
			console.log(`WARNING: Command "${command.name}" is disabled.`);
			return false;
		}

		if (client.commands.has(command.name)) {
			console.log(`ERROR: There is already a command with name ${command.name}`);
			return false;
		}

		return true;

	};

	const cmdFolders = readdirSync(join(__dirname, dir)).filter(file => !file.endsWith(".js"));
	console.log(`NOTICE: Loading commands [${cmdFolders.join(", ")}]`);
	cmdFolders.forEach(folder => {
		const commandFiles = readdirSync(resolve(__dirname, dir, folder)).filter(file => file.endsWith(".js"));
		for (const file of commandFiles) {
			const SubCommand = require(resolve(__dirname, dir, folder, file));
			/**
			 * @type {Command}
			 */
			const command = new SubCommand(client);
			console.log(`INFO: Loading Command ${command.name ? command.name : "- name not found -"}`);

			if (checkValidCommand(command, file)) {
				client.commands.set(command.name, command);

				if (command.alias) {
					if (client.aliases.has(command.alias)) {
						console.log(`WARNING: There is already a command with alias ${command.alias}`);
					}
					else {
						client.aliases.set(command.alias, command);
					}
				}

				console.log(`INFO: Command ${command.name} successfully added to the command collection`);
			}
			else {console.log(`ERROR: Command ${command.name} not added to the command collection.`);}

		}
	});
	// console.log(client.commands);
};
