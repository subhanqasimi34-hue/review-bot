const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("review_rank_user")
        .setDescription("Show user's average rating.")
        .addUserOption(o => o.setName("user").setDescription("User").setRequired(true)),

    async execute(interaction, client) {
        const user = interaction.options.getUser("user");

        client.db.all("SELECT rating FROM reviews WHERE helper = ?", [user.id], (err, rows) => {
            if (!rows || rows.length === 0) return interaction.reply("No reviews found.");

            const avg = rows.reduce((a, b) => a + b.rating, 0) / rows.length;

            const embed = new EmbedBuilder()
                .setTitle(`⭐ Rating for ${user.username}`)
                .setDescription(`Average Rating: **${avg.toFixed(2)}**`)
                .setColor("Aqua");

            interaction.reply({ embeds: [embed] });
        });
    }
};