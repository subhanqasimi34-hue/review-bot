import { SlashCommandBuilder, EmbedBuilder } from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName("profile")
        .setDescription("Zeigt dein Review & Vouch Profil.")
        .addUserOption(option =>
            option.setName("user")
                .setDescription("Wessen Profil willst du sehen?")
        ),

    async execute(interaction, db) {
        const target = interaction.data.options?.[0]?.value || interaction.user.id;

        // User Infos
        const user = interaction.member.user;
        const username = user.username;

        try {
            // Reviews zählen
            const reviews = await dbGet(db,
                "SELECT COUNT(*) AS total, AVG(rating) AS average FROM reviews WHERE target_id = ?",
                [target]
            );

            // Vouches zählen
            const vouches = await dbGet(db,
                "SELECT COUNT(*) AS amount FROM vouches WHERE target_id = ?",
                [target]
            );

            // Punkte
            const points = await dbGet(db,
                "SELECT points FROM points WHERE user_id = ?",
                [target]
            );

            const embed = new EmbedBuilder()
                .setTitle(`📌 Profil von <@${target}>`)
                .setColor("#00bfff")
                .addFields(
                    {
                        name: "⭐ Reviews",
                        value: `${reviews.total} insgesamt\nDurchschnitt: ${reviews.average ? reviews.average.toFixed(2) : "N/A"}`
                    },
                    {
                        name: "🤝 Vouches",
                        value: `${vouches.amount} erhalten`
                    },
                    {
                        name: "🏆 Punkte",
                        value: `${points?.points || 0}`
                    }
                )
                .setThumbnail(`https://cdn.discordapp.com/avatars/${target}/${user.avatar}.png`)
                .setTimestamp();

            interaction.reply({ embeds: [embed] });

        } catch (err) {
            console.error(err);
            interaction.reply("Fehler beim Laden des Profils.");
        }
    }
};

// Helper für db.get
function dbGet(db, sql, params = []) {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
            if (err) reject(err);
            else resolve(row || {});
        });
    });
}
