import { InteractionResponseType } from "discord-interactions";
import { addReview } from "../utils/database.js";

export default async function reviewCommand(interaction, res) {
    const reviewer = interaction.member.user.id;
    const target = interaction.data.options[0]?.value;

    // ❌ Self-review check
    if (reviewer === target) {
        return res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
                content: "❌ You cannot review yourself."
            }
        });
    }

    // ⭐ Extract and validate options
    const rawStars = interaction.data.options[1]?.value || 5;
    const stars = Math.max(1, Math.min(5, rawStars)); // Clamp between 1–5

    const allowedCategories = ["support", "design", "code", "other"];
    const rawCategory = interaction.data.options[2]?.value || "other";
    const category = allowedCategories.includes(rawCategory) ? rawCategory : "other";

    const rawText = interaction.data.options[3]?.value || "No comment provided.";
    const text = rawText.slice(0, 1024); // Discord field limit

    // 💾 Save review to database
    addReview(target, reviewer, stars, category, text);

    // ✅ Respond with embed
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
                        { name: "Stars", value: `${stars} ⭐`, inline: true },
                        { name: "Category", value: category, inline: true },
                        { name: "Comment", value: text }
                    ],
                    footer: {
                        text: `Review saved — +${stars * 10} points awarded`
                    },
                    timestamp: new Date().toISOString()
                }
            ]
        }
    });
}
