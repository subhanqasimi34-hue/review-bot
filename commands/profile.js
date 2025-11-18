const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("review_profile_helper_user")
        .setDescription("Show a helper's profile.")
        .addUserOption(o => o.setName("user").setDescription("Helper").setRequired(true)),

    async execute(interaction, client) {
        const user = interaction.options.getUser("user");

        client.db.all("SELECT rating FROM reviews WHERE helper = ?", [user.id], (err, rows) => {
            if (!rows || rows.length === 0) return interaction.reply("This helper has no reviews.");

            const avg = rows.reduce((a, b) => a + b.rating, 0) / rows.length;

            client.db.get("SELECT COUNT(*) as total FROM vouches WHERE helper = ?", [user.id], (err, v) => {
                const embed = new EmbedBuilder()
                    .setTitle(`📘 Profile of ${user.username}`)
                    .addFields(
                        { name: "⭐ Average Rating", value: avg.toFixed(2), inline: true },
                        { name: "📝 Total Reviews", value: rows.length.toString(), inline: true },
                        { name: "🤝 Vouches", value: (v?.total || 0).toString(), inline: true }
                    )
                    .setColor("Blue");

                interaction.reply({ embeds: [embed] });
            });
        });
    }
};