const {Client , Collection} = require("discord.js");
const config = require("./config.js");
const client = new Client({disableMentions: "everyone", disabledEvents: ["TYPING_START"], intents: 32767, partials: ['MESSAGE', 'CHANNEL', 'REACTION']});
const events = require("./structures/event");
const command = require("./structures/slash");