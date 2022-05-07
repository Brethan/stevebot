//@ts-check
const Client = require("./src/Client.js");
const { Intents } = require("discord.js");
require("dotenv").config();

let intents = 0;

for (const intent in Intents.FLAGS) {
    intents |= Intents.FLAGS[intent];
}

const client = new Client(intents);

client.login(process.env.TOKEN);
