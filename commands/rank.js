import db from "../utils/database.js";
import { EmbedBuilder } from "discord.js";

export default async function handleRank(interaction) {
    const user = interaction.options.getUser("user") || interaction.user;

    // get total points
    const row = await db.get(
        "SELECT SUM(points) AS total FROM points WHERE userID = ?",
        [user.id]
    );

    const points = row?.total || 0;

    // Badge system
    let badge = "🪙 Unranked";
    let color = 0x777777;

    if (points >= 5000) { badge = "🏆 Champion"; color = 0xffd700; }
    else if (points >= 3000) { badge = "👑 Emerald"; color = 0x50c878; }
    else if (points >= 2000) { badge = "🔥 Ruby"; color = 0xe0115f; }
    else if (points >= 1000) { badge = "💎 Diamond"; color = 0x00e5ff; }
    else if (points >= 500) { badge = "🥇 Gold"; color = 0xffd700; }
    else if (points >= 200) { badge = "🥈 Silver"; color = 0xc0c0c0; }
    else if (points >= 50) { badge = "🥉 Bronze"; color = 0xcd7f32; }

    // Build embed
    const embed = new EmbedBuilder()
        .setColor(color)
        .setTitle(`🏅 Rank Status`)
        .setThumbnail(user.displayAvatarURL())
        .addFields(
            { name: "User", value: `<@${user.id}>`, inline: true },
            { name: "Points", value: `${points}`, inline: true },
            { name: "Badge", value: `${badge}`, inline: true }
        )
        .setTimestamp();

    return interaction.reply({
        embeds: [embed],
        ephemeral: false
    });
}
