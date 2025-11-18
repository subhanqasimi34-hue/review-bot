import { SlashCommandBuilder, EmbedBuilder } from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName("leaderboard")
        .setDescription("Zeigt die Top 10 Nutzer."),

    async execute(interaction, db) {
        const rows = await dbAll(db,
            "SELECT user_id, points FROM points ORDER BY points DESC LIMIT 10"
        );

        if (!rows.length)
            return interaction.reply("Noch keine Punkte gespeichert.");

        const list = rows
            .map((u, i) => `**#${i + 1}** <@${u.user_id}> — ${u.points} Punkte`)
            .join("\n");

        const embed = new EmbedBuilder()
            .setTitle("🏆 Leaderboard")
            .setColor("#FFD700")
            .setDescription(list);

        interaction.reply({ embeds: [embed] });
    }
};

function dbAll(db, sql, params = []) {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => err ? reject(err) : resolve(rows));
    });
}
