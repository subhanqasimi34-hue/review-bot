import { InteractionResponseType } from "discord-interactions";
import { addReview, addPoints } from "../utils/database.js";

export default async function reviewCommand(interaction, res) {
    const reviewer = interaction.member.user.id;
    const target = interaction.data.options[0].value;

    if (reviewer === target) {
        return res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
                content: "❌ You cannot review yourself."
            }
        });
    }

    const stars = interaction.data.options[1]?.value || 5;
    const category = interaction.data.options[2]?.value || "other";
    const text = interaction.data.options[3]?.value || "No text provided.";

    // Save review in SQLite
    addReview(target, reviewer, stars, category, text);

    // Add points based on stars
    const pointsToAdd = stars * 2;   // example: 5 ⭐ = +10 points
    addPoints(target, pointsToAdd);

    return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
            embeds: [
                {
                    title: "⭐ New Review Submitted",
                    color: 0x00aaff,
                    fields: [
                        { name: "Reviewer", value: `<@${reviewer}>`, inline: true },
                        { name: "Reviewed User", value: `<@${target}>`, inline: true },
                        { name: "Stars", value: `${"⭐".repeat(stars)}`, inline: true },
                        { name: "Category", value: category, inline: true },
                        { name: "Comment", value: text }
                    ],
                    footer: { text: `+${pointsToAdd} points awarded` },
                    timestamp: new Date().toISOString()
                }
            ]
        }
    });
}
