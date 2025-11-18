import { InteractionResponseType } from "discord-interactions";
import { getUserStats, getReviewsForUser } from "../utils/database.js";

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

export default function profileCommand(interaction, res) {
    const target =
        interaction.data.options?.[0]?.value ||
        interaction.member.user.id;

    const stats = getUserStats(target) || {
        points: 0,
        reviews_count: 0,
        vouches_count: 0
    };

    const badge = getBadge(stats.points);

    const reviews = getReviewsForUser(target);

    const reviewList =
        reviews.length === 0
            ? "No reviews yet."
            : reviews
                  .slice(0, 10)
                  .map(
                      r =>
                          `⭐ **${r.rating}** — *${r.category}*\n📝 ${r.comment}\n👤 Reviewer: <@${r.reviewer_id}>\n`
                  )
                  .join("\n");

    return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
            embeds: [
                {
                    title: `📘 Profile of <@${target}>`,
                    color: 0x0099ff,
                    fields: [
                        { name: "Points", value: `${stats.points}`, inline: true },
                        { name: "Rank", value: badge, inline: true },
                        { name: "Reviews", value: `${stats.reviews_count}`, inline: true },
                        { name: "Vouches", value: `${stats.vouches_count}`, inline: true },
                        { name: "Recent Reviews", value: reviewList }
                    ],
                    timestamp: new Date().toISOString()
                }
            ]
        }
    });
}
