const { MessageEmbed } = require("discord.js");

module.exports = async(client, interaction) => {
    if(!interaction.isCommand()) return;

    let cmd = await client.commands.get(interaction.commandName);
    if (!cmd) interaction.reply({ content: "Unknown command", ephemeral: true })
    else if (cmd.requirements.userPerms && !interaction.member.permissions.has(cmd.requirements.userPerms)) {
        
    }
}