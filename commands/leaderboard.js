const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder().setName("review_leaderboard").setDescription("Show top helpers."),

    async execute(interaction, client) {
        client.db.all("SELECT helper, AVG(rating) as avg FROM reviews GROUP BY helper ORDER BY avg DESC LIMIT 10", (err, rows) => {
            if (!rows || rows.length === 0) return interaction.reply("No reviews yet.");

            const desc = rows.map((r, i) => `**${i + 1}. <@${r.helper}>** — ⭐ ${r.avg.toFixed(2)}`).join("\n");

            const embed = new EmbedBuilder().setTitle("🏆 Top Helpers").setDescription(desc).setColor("Gold");

            interaction.reply({ embeds: [embed] });
        });
    }
};
