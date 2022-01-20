const { MessageEmbed } = require("discord.js");
let RECORDS = require("../models/records");
let limits = new Map();

module.exports.run = async (client, interaction, options) => {
    let check = await RECORDS.findOne({ id: interaction.guildId, channel: interaction.channelId, author: interaction.member.id });
    if (check) {
        limits.delete(interaction.channelId+interaction.member.id);
    }