const Client = require("./src/Client.js");
const {Intents} = require("discord.js");
require("dotenv").config();

const intents = [];
for (const intent in Intents.FLAGS) {
    intents.push(intent);
}
console.log(intents);
const client = new Client(intents);

client.login(process.env.TOKEN);
