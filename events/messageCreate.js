const { MessageEmbed } = require ("discord.js");
let MSGS = require("../models/msgs");
let RECORDS = require("../models/records");
let { RandomString } = require("../utils");

module.exports = async (client, message) => {
    if (message.author.bot || message.channel.type == "DM") return;
    
}