// @ts-check

// eslint-disable-next-line no-unused-vars
const SteveClient = require("../Client");
const Help = require("../commands/util/help");
const command_loader = require("../util/command-loader.js");


/**
 *
 * @param {SteveClient} client
 */
module.exports = (client) => {

	command_loader("../commands", client);

	client.on("messageCreate", async message => {
		// Guard clauses
		if (!message || !message.content) return;
		if (!message.content.toLowerCase().startsWith(client.config.prefix)) return;

		// Split the message content -> "s.", ["cmdName", "arg_0", "arg_1", ..., "arg_n"]
		const args = message.content.slice(client.config.prefix.length).trim().split(/ +/);
		const commandName = args.shift();
		if (!commandName) return;

		const { commands, aliases } = client;
		const { member, channel } = message;

		// Check commands and aliases collections for the matching command
		const command = commands.get(commandName) || aliases.get(commandName);

		const cancelCommand = async (/** @type {string} */ reason) => {
			await client.deleteMessage(await message.reply({ content: reason }), 6_000);
			return client.deleteMessage(message, 500);
		};

		// Member tried to use an unknown command
		if (!command) {
			await message.react("❔");
			return client.deleteMessage(message, 6_000);
		}
		// Member is null
		if (!member) {
			const reply = "Something unexpected happened (Discord error?). Try sending that again!";
			return cancelCommand(reply);
		}
		// Member sent invalid arguments, an incorrect # of arguments, or both
		let invalidReason = command.validateCommandInvocation(args);
		if (invalidReason.length)
			return cancelCommand(invalidReason);

		// Member does not have permission to use this command
		const missingPermissions = command.checkPermissions(member, channel.id);
		if (missingPermissions.length > 0) {
			invalidReason = "You do not have permission to use this command.\nMissing Permissions: ";
			invalidReason += missingPermissions.join(", ");
			return cancelCommand(invalidReason);
		}
		// Member does not have the appropriate roles to use this command
		invalidReason = await command.checkValidStaff(member);
		if (invalidReason.length > 0) {
			invalidReason = `You need to be ${invalidReason} to use this command!`;
			return cancelCommand(invalidReason);
		}
		// This command should only be able to be used via slash commands
		if (command.slashOnly) {
			invalidReason = "This command is only available as a slash command!\n";
			invalidReason += `(/${command.name})`;
			return cancelCommand(invalidReason);
		}

		try {
			/** @type {import("discord.js").MessageCreateOptions} */
			let result;
			// Invoke the command's help method if "help" is the primary argument
			if (args[0] === "help") {
				// If the command doesn't have a dedicated help function, use default
				if (!command["help"]) {
					const help = client.commands.get("help");
					result = (help instanceof Help) ?
						(await help.defaultHelp(message, commandName)) : { content: "Something went wrong!" };

				} else {
					result = await command["help"](message);
				}

				// Otherwise invoke the execute method
			} else {
				result = await command.execute(message, args);
			}

			// Send the response to the member. If autoclear is set, delete the response
			const response = await message.channel.send(result);
			if (command.autoclear > 0)
				await client.deleteMessage(response, command.autoclear);


			// Delete the command invocation message
			await message.delete();

		} catch (error) {
			console.error(error);
		}

	});

	client.on("interactionCreate", async interaction => {
		if (interaction.isAutocomplete() || interaction.isChatInputCommand()) {
			const { commandName } = interaction;

			const command = client.commands.get(commandName);
			await command?.slash(interaction);
		}

	});
};
