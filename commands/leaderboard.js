import db from "../utils/database.js";
import { EmbedBuilder } from "discord.js";

// Badge system – SAME as your rank.js
function getBadge(points) {
    if (points >= 5000) return "🏆 Champion";
    if (points >= 3000) return "👑 Emerald";
    if (points >= 2000) return "🔥 Ruby";
    if (points >= 1000) return "💎 Diamond";
    if (points >= 500) return "🥇 Gold";
    if (points >= 200) return "🥈 Silver";
    if (points >= 50) return "🥉 Bronze";
    return "🪙 Unranked";
}

export default async function handleLeaderboard(interaction) {
    // Pull top 10 users
    const rows = await db.all(
        "SELECT userID, SUM(points) AS total FROM points GROUP BY userID ORDER BY total DESC LIMIT 10"
    );

    if (!rows || rows.length === 0) {
        return interaction.reply({
            content: "❌ No leaderboard data found.",
            ephemeral: true
        });
    }

    let description = "";
    let position = 1;

    for (const row of rows) {
        const user = await interaction.client.users.fetch(row.userID).catch(() => null);
        const username = user ? user.tag : `Unknown User (${row.userID})`;

        const badge = getBadge(row.total);

        description += `**${position}.** ${badge} — <@${row.userID}> — **${row.total} points**\n`;
        position++;
    }

    const embed = new EmbedBuilder()
        .setColor(0x5865f2)
        .setTitle("🏆 Leaderboard — Top 10")
        .setDescription(description)
        .setTimestamp()
        .setFooter({ text: "Ranking System" });

    await interaction.reply({ embeds: [embed] });
}
