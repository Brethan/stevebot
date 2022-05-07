//@ts-check

const { readdirSync } = require("fs");
const { join, resolve } = require("path");
const Command = require("../commands/Command.js");
const Client = require("../Client");

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

    client.on("messageCreate", message => {
        if (!message || !message.content) return;
        if (!message.content.toLowerCase().startsWith(client.config.prefix)) return;

        const args = message.content.toLowerCase().slice(client.config.prefix.length).trim().split(/ +/);
        const commandName = args.shift();
        

    })
}
