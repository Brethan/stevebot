//@ts-check

const { Message, MessageEmbed } = require("discord.js");
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
        if (!message || !message.content) return;
        if (!message.content.toLowerCase().startsWith(client.config.prefix)) return;
        const args = message.content.slice(client.config.prefix.length).trim().split(/ +/);
        const commandName = args.shift();
        if (!commandName) return;
        
        const { commands, aliases } = client;
        const { member, channel } = message;

        const command = commands.get(commandName) || aliases.get(commandName);
        
        if (!command) {
            // Delete message from channel
            await message.react("❔")
            client.deleteMessage(message, 6_000);
            return;
        }
        
        if (!member) {
            // Send message to channel
            const reply = "Something unexpected happened (Discord error?). Try sending that again!";
            client.deleteMessage(await message.reply(reply), 6_000);
            return;
        }

        console.log("DEBUG: 1")
        const invalidReason = command.validateCommandInvocation(args);
        if (invalidReason.length) {
            //@ts-ignore
            msgDelete(await channel.send({ content: invalidReason }));
            return;
        }

        console.log("DEBUG: 2")

        const missingPermissions = command.checkPermissions(member, channel.id);
        if (missingPermissions.length > 0) {
            // Send message to channel
            client.deleteMessage(await channel.send({ content: missingPermissions.join(", ")}), 6_000);
            return;
        }


        console.log("DEBUG: 3")

        try {
            /** @type {string | MessageEmbed} */
            let result;
            // Invoke the command's help method if "help" is the primary argument
            if (args[0] === "help") {
                // If the command doesn't have a dedicated help function, use default
                if (!command[args[0]]) {
                    const help = client.commands.get(args[0]);
                    result = (help instanceof Help) ?  help.defaultHelp(message, commandName) : "Something went wrong!";
                } else 
                    result = await command[args[0]](message);

            // Otherwise invoke the execute method
            } else {
                result = await command.execute(message, args)
            }


            const response = await message.channel.send(typeof result === "string" ? {content: result} : {embeds: [result]})
            if (command.autoclear > 0) {
                await client.deleteMessage(response, command.autoclear);
            }

        } catch (error) {
            console.log("This error has been thrown")
        }

        await message.delete();
    })
}
