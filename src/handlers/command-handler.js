//@ts-check

const { readdirSync } = require("fs");
const { join, resolve } = require("path");
const Command = require("../commands/Command.js");
const Client = require("../Client");
const { Message, MessageEmbed } = require("discord.js");

/**
 * 
 * @param {Client} client 
 */
module.exports = (client) => {

    /**
     * 
     * @param {Command} command 
     * @param {string} file 
     * @returns {boolean}
     */
    const checkValidCommand = (command, file,) => {

        if (!command.name) {
            console.log(`ERROR: Command with file name "${file}" does not have a command name`)
            return false;
        }

        if (!command.enabled) {
            console.log(`WARNING: Command "${command.name}" is disabled.`)
            return false;
        }

        if (client.commands.has(command.name)) {
            console.log(`ERROR: There is already a command with name ${command.name}`);
            return false;
        }

        return true;

    }
    const loadCommands = (dir) => {
        const cmdFolders = readdirSync(join(__dirname, dir)).filter(file => !file.endsWith(".js"));
        cmdFolders.forEach(folder => {

            const commandFiles = readdirSync(resolve(__dirname, dir, folder)).filter(file => file.endsWith(".js"));
            for (const file of commandFiles) {
                const SubCommand = require(resolve(__dirname, dir, folder, file));
                /**
                 * @type {Command}
                 */
                const command = new SubCommand(client);
                console.log(`INFO: Loading Command ${command.name ? command.name : "- name not found -"}`)

                if (checkValidCommand(command, file)) {
                    client.commands.set(command.name, command);

                    if (command.alias) {
                        if (client.aliases.has(command.alias)) {
                            console.log(`WARNING: There is already a command with alias ${command.alias}`)
                        } else {
                            client.aliases.set(command.alias, command);
                        }
                    }

                    console.log(`INFO: Command ${command.name} successfully added to the command collection`);
                } else
                    console.log(`ERROR: Command ${command.name} not added to the command collection.`)

            }
        })
        //console.log(client.commands);
    }

    loadCommands("../commands")

    /**
     *      
     * @param {Message} message 
     * @param {number} sleep 
     * @returns 
     */
    const msgDelete = (message, sleep) => setTimeout(() => message.delete(), sleep)
    client.on("messageCreate", async message => {
        if (!message || !message.content) return;
        if (!message.content.toLowerCase().startsWith(client.config.prefix)) return;
        const args = message.content.slice(client.config.prefix.length).trim().split(/ +/);
        const commandName = args.shift();
        if (!commandName) return;
        
        const { commands, aliases } = client;
        const command = commands.get(commandName) || aliases.get(commandName);

        if (!command) return;

        const invalid = command.validateCommandInvocation(message, args);
        if (invalid != null) {
            msgDelete(await message.channel.send({ content: invalid }), 10_000);
            msgDelete(message, 2_000);
            return;
        }

        // Invoke 
        if (args[0] === "help") {
            // If the command doesn't have a dedicated help function, use default
            if (!command["help"]) {
                const help = client.commands.get("help");
                //@ts-ignore
                help.help(message, commandName);
            } else {
                command["help"](message);
            }

            return;
        }

        const result = await command.execute(message, args);
        if (typeof result === "string") {
            message.channel.send({ content: result });
        } else if (result instanceof MessageEmbed) {
            message.channel.send({ embeds: [result] })
        } else {
            message.channel.send("I have no idea what kind of behaviour this represents yet")
        }




    })
}
