const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("vouch")
        .setDescription("Vouch for a helper.")
        .addUserOption(o => o.setName("user").setDescription("Helper").setRequired(true)),

    async execute(interaction, client) {
        const user = interaction.options.getUser("user");

        client.db.run("INSERT INTO vouches (helper) VALUES (?)", [user.id]);

        interaction.reply(`You vouched for **${user.username}**`);
    }
};
