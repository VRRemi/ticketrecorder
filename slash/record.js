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
            time: 3 * 60000,
            max: 1
        }).then(async messages => {
            if (!messages.first()) {
                limits.delete(interaction.channelId+interaction.member.id);
                replyEmbed("**Timeout, retry again later**", channel);
            }
            if (messages.first().content.toLowerCase() == "cancel") {
                limits.delete(interaction.channelId+interaction.member.id);
                return replyEmbed("**Recording request has been aborted**", channel);
            } else {
                replyEmbed("**Waiting for participator's confirmation!**", channel)
                let length = 0
                let ids = [];
                messages.first().content.split(", ").filter(e => e).map(async id => {
                    length++
                    if (id === interaction.member.id) {
                        replyEmbed(`**You can't include yourself**`, channel)
                        ids.push(`${id}-declined`);
                        await submit(ids, length);
                    } else {
                        let user = await interaction.member.guild.members.cache.get(id);
                        if (!user) {
                            replyEmbed(`**\`${id}\` has been excluded, couldn't find them in the server**`, channel)
                        };
                    }
                });
            }
        })
    })