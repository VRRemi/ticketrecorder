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
                            ids.push(`${id}-declined`);
                            await submit(ids, length);
                        } else {
                            user.send(`**(${interaction.member.displayName}) has requested to record your messages in ${channel} channel (yes, no)**`).then(m => {
                                const filter = (m) => m.author.id === user.id;
                                m.channel.awaitMessages({
                                    filter,
                                    time: 3 * 60000,
                                    max: 1
                                }).then(async messages => {
                                    if (!messages.first()) {
                                        user.send("**Timeout, you've been excluded**")
                                        replyEmbed(`**\`${user.user.username}\` has been excluded, Confirmation timeout**`, channel)
                                        ids.push(`${id}-declined`);
                                    } else if (["yes", "confirm", "agree", "ok", "alright", "accept", "approve"].includes(messages.first().content.toLowerCase())) {
                                        replyEmbed(`**\`${user.user.username}\` will be participating!**`, channel)
                                        user.send(`**Confirmed, You are participating in the chat record at ${channel} channel**`);
                                        ids.push(`${id}-accepted`);
                                    } else {
                                        ids.push(`${id}-declined`);
                                        replyEmbed(`**\`${user.user.username}\` has been excluded, they declined**`, channel)
                                        user.send(`**Confirmed, You are not going to participate in the chat record at ${channel} channel**`);
                                    }
                                    await submit(ids, length);
                                });
                            }).catch(async () => {
                                ids.push(`${id}-declined`);
                                replyEmbed(`**\`${user.user.username}\` has been excluded, DMs are closed**`, channel)
                                await submit(ids, length);
                            });
                        };
                    }
                });
            }
        })
    })
    const submit = async (ids, length) => {
        if (ids.length === length) {
            let confirmed = [interaction.member.id];
            ids.filter(id => id.split("-")[1] == "accepted" ? confirmed.push(id.split("-")[0]) : false);
            if (confirmed.length > 1) {
                await new RECORDS({
                    id: interaction.guildId,
                    channel: interaction.channelId,
                    author: interaction.member.id,
                    records: confirmed
                }).save();
                limits.delete(interaction.channelId+interaction.member.id);
                replyEmbed(`**Any new message at ${channel} will be recorded from the participators**\n**Type (\`stop recording\`, \`stop\`, \`end recording\`, \`end\`) to stop recording**`, channel)
            } else {
                limits.delete(interaction.channelId+interaction.member.id);
                replyEmbed("**None of the participators accepted, aborted**", channel)
            }
        };
    }
    const replyEmbed = (message, channel) => {
        return channel.send({
            embeds: [
                new MessageEmbed()
                    .setDescription(message)
                    .setColor("GREEN")
                    .setFooter({ text: `${interaction.member.displayName} recording request process`})
            ]
        });
    }
}

module.exports.help = {
    name: "record",
    description: "Record messages between you and some certain people",
    options: []
}

module.exports.requirements = {
