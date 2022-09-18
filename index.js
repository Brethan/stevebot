//@ts-check
const SteveClient = require("./src/Client.js");
const { Intents } = require("discord.js");
require("dotenv").config();

let intents = 0;

for (const intent in Intents.FLAGS) {
    intents |= Intents.FLAGS[intent];
}

const client = new SteveClient({intents});

client.login(process.env.TOKEN);
