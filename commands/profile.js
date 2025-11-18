import { InteractionResponseType } from "discord-interactions";
import { getReviews, getUserStats } from "../utils/database.js";

export default async function profileCommand(interaction, res) {
    const target = interaction.data.options?.[0]?.value || interaction.member.user.id;

    const stats = getUserStats(target) || { points: 0, reviews_count: 0, vouches_count: 0 };
    const reviews = getReviews(target);

    return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
            embeds: [
                {
                    title: `📘 Profile of ${interaction.data.resolved?.users?.[target]?.username || "User"}`,
                    color: 0x0099ff,
                    fields: [
                        { name: "Points", value: `${stats.points}`, inline: true },
                        { name: "Reviews", value: `${stats.reviews_count}`, inline: true },
                        { name: "Vouches", value: `${stats.vouches_count}`, inline: true },
                        { name: "Latest Reviews", value: reviews.length ? reviews.map(r => `⭐ ${r.stars} — ${r.category}`).join("\n") : "No reviews yet." }
                    ],
                    timestamp: new Date().toISOString()
                }
            ]
        }
    });
}
