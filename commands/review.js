import { InteractionResponseType } from "discord-interactions";
import { addReview } from "../utils/database.js";

export default async function reviewCommand(interaction, res) {
    const user = interaction.data.options[0].value;
    const reviewer = interaction.member.user.id;
    const stars = interaction.data.options[1]?.value || 5;
    const category = interaction.data.options[2]?.value || "other";
    const text = interaction.data.options[3]?.value || "No text provided.";

    addReview(user, reviewer, stars, category, text);

    return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
            embeds: [
                {
                    title: "⭐ New Review",
                    color: 0x00aaff,
                    fields: [
                        { name: "Reviewer", value: `<@${reviewer}>`, inline: true },
                        { name: "User", value: `<@${user}>`, inline: true },
                        { name: "Stars", value: `${stars} ⭐`, inline: true },
                        { name: "Category", value: category, inline: true },
                        { name: "Text", value: text }
                    ],
                    timestamp: new Date().toISOString()
                }
            ]
        }
    });
}
