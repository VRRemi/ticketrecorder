const { MessageEmbed } = require ("discord.js");
let MSGS = require("../models/msgs");
let RECORDS = require("../models/records");
let { RandomString } = require("../utils");

module.exports = async (client, message) => {
    if (message.author.bot || message.channel.type == "DM") return;
    if (["stop recording", "stop", "end recording", "end"].includes(message.content.toLowerCase())) {
        let check = await RECORDS.findOne({ id: message.guildId, channel: message.channelId, author: message.author.id })
        
    }
}