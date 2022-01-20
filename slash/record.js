const { MessageEmbed } = require("discord.js");
let RECORDS = require("../models/records");
let limits = new Map();

module.exports.run = async (client, interaction, options) => {
    let check = await RECORDS.findOne({ id: interaction.guildId, channel: interaction.channelId, author: interaction.member.id });
    if (check) {
        limits.delete(interaction.channelId+interaction.member.id);
        return interaction.reply("**You've already active recording process in this channel**");
    }
    if (limits.get(interaction.channelId+interaction.member.id)) return interaction.reply("**There is already active record request in this channel**")
    limits.set(interaction.channelId+interaction.member.id
        , true)
    let channel = interaction.member.guild.channels.cache.get(interaction.channelId);
    interaction.reply({
        embeds: [
            new MessageEmbed()
                .setDescription("**Provide the ids of people will join the record in the following sort (`id, id, id`)**")
                .setColor("GREEN")
                .setFooter({ text: "Expires in 3 minutes" })
            ]
    }).then(msg => {
        const filter = (m) => m.author.id === interaction.member.id;
        channel.awaitMessages({
            filter,
    })
}