import { InteractionResponseType } from "discord-interactions";
import { getLeaderboard } from "../utils/database.js";

// Badge system like rank.js
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

export default function leaderboardCommand(interaction, res) {
    const rows = getLeaderboard(10);

    if (!rows || rows.length === 0) {
        return res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: { content: "📉 No leaderboard data found." }
        });
    }

    const description = rows
        .map((row, i) => {
            const place =
                i === 0 ? "🥇" :
                i === 1 ? "🥈" :
                i === 2 ? "🥉" :
                `${i + 1}.`;

            const badge = getBadge(row.points);

            return `${place} ${badge} — <@${row.user_id}> — **${row.points} pts**`;
        })
        .join("\n");

    return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
            embeds: [
                {
                    title: "🏆 Leaderboard — Top 10",
                    color: 0x5865f2,
                    description: description,
                    timestamp: new Date().toISOString()
                }
            ]
        }
    });
}
