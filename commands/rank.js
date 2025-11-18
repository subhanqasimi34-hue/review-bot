import { InteractionResponseType } from "discord-interactions";
import db from "../utils/database.js";

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

export default async function rankCommand(interaction, res) {
    const target =
        interaction.data.options?.[0]?.value ||
        interaction.member.user.id;

    const row = db.prepare(
        "SELECT points FROM users WHERE user_id = ?"
    ).get(target);

    const points = row?.points || 0;
    const badge = getBadge(points);

    return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
            embeds: [
                {
                    title: `🏅 Rank for <@${target}>`,
                    color: 0x00aaff,
                    fields: [
                        { name: "Points", value: String(points), inline: true },
                        { name: "Badge", value: badge, inline: true }
                    ],
                    timestamp: new Date().toISOString()
                }
            ]
        }
    });
}
