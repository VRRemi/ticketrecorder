const { MessageEmbed } = require("discord.js");

module.exports = async(client, guild) => {
    commands = guild ? guild.commands : client.application?.commands
}