// @ts-check
const SteveClient = require("./src/Client.js");
const { GatewayIntentBits } = require("discord.js");
require("dotenv").config();


const client = new SteveClient({ "intents": [
	GatewayIntentBits.DirectMessageReactions,
	GatewayIntentBits.DirectMessageTyping,
	GatewayIntentBits.DirectMessages,
	GatewayIntentBits.GuildBans,
	GatewayIntentBits.GuildEmojisAndStickers,
	GatewayIntentBits.GuildIntegrations,
	GatewayIntentBits.GuildInvites,
	GatewayIntentBits.GuildMembers,
	GatewayIntentBits.GuildMessageReactions,
	GatewayIntentBits.GuildMessageTyping,
	GatewayIntentBits.GuildMessages,
	GatewayIntentBits.GuildPresences,
	GatewayIntentBits.GuildScheduledEvents,
	GatewayIntentBits.GuildVoiceStates,
	GatewayIntentBits.GuildWebhooks,
	GatewayIntentBits.Guilds,
	GatewayIntentBits.MessageContent,
] });

client.login(process.env.TOKEN);
