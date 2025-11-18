import { InteractionResponseType } from "discord-interactions";
import { addPoints } from "../utils/database.js";

export default async function vouchCommand(interaction, res) {
    const author = interaction.member.user.id;
    const target = interaction.data.options[0]?.value;

    if (!target) {
        return res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: { content: "❌ You must choose a user to vouch for." }
        });
    }

    if (author === target) {
        return res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: { content: "❌ You cannot vouch for yourself." }
        });
    }

    // Punkte hinzufügen (+10)
    addPoints(target, 10);

    return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
            embeds: [
                {
                    title: "💚 New Vouch Added",
                    color: 0x00ff6a,
                    fields: [
                        { name: "User", value: `<@${target}>`, inline: true },
                        { name: "Given by", value: `<@${author}>`, inline: true },
                        { name: "Points Added", value: "+10", inline: true }
                    ],
                    footer: { text: "Vouch System" },
                    timestamp: new Date().toISOString()
                }
            ]
        }
    });
}
