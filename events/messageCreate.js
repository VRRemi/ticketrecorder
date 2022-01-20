const { MessageEmbed } = require ("discord.js");
let MSGS = require("../models/msgs");
let RECORDS = require("../models/records");
let { RandomString } = require("../utils");

module.exports = async (client, message) => {
    if (message.author.bot || message.channel.type == "DM") return;
    if (["stop recording", "stop", "end recording", "end"].includes(message.content.toLowerCase())) {
        let check = await RECORDS.findOne({ id: message.guildId, channel: message.channelId, author: message.author.id })
        let (check) {
            let key = RandomString(46)
            await new MSGS({
                id: key,
                messages: check.messages,
                guild: message.guildId,
                channel: message.channelId,
                author: message.author.id
            }).save();
            message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor("GREEN")
                        .setDescription(`**${message.channel} recording has been stopped [${message.channel.name.charAt(0).toUpperCase() + message.channel.name.slice(1)} Channel Transcript](${client.config.domain}/transcript/${key})**`)
                        .setFooter({ text: `${message.author.username} recording request process` })
                ]
            })
            return check.deleteOne();
        }
    }
}