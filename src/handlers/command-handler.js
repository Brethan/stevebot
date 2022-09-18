//@ts-check

const { Message, MessageEmbed } = require("discord.js");
const SteveClient = require("../Client");
const command_loader = require("../util/command-loader.js");


/**
 * 
 * @param {SteveClient} client 
 */
module.exports = (client) => {

    command_loader("../commands", client);

    /**
     *      
     * @param {Message} message
     * @returns 
     */
    const msgDelete = (message) => setTimeout(() => message.delete(),6000)
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
            message.react("❔").then(() => msgDelete(message));
            return;
        }
        
        if (!member) {
            // Send message to channel
            const reply = "Something unexpected happened (Discord error?). Try sending that again!";
            msgDelete(await message.reply(reply));
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
            msgDelete(await channel.send({ content: missingPermissions.join(", ")}))
            return;
        }


        console.log("DEBUG: 3")

        try {
            // Invoke 
            if (args[0] === "help") {
                // If the command doesn't have a dedicated help function, use default
                if (!command["help"]) {
                    const help = client.commands.get("help");
                    //@ts-ignore
                    help.defaultHelp(message, commandName);

                } else {
                    command["help"](message);
                }

            } else {

                const result = await command.execute(message, args)
                
            }
        } catch (error) {
            console.log("This error has been thrown")
        }

    })
}
