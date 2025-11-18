import { InteractionResponseType } from "discord-interactions";
import { addVouch } from "../utils/database.js";

export default async function vouchCommand(interaction, res) {
    const sender = interaction.member.user.id;
    const target = interaction.data.options[0]?.value;

    // no user selected
    if (!target) {
        return res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
                content: "❌ You must choose a user to vouch for."
            }
        });
    }

    // cannot vouch yourself
    if (sender === target) {
        return res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
                content: "❌ You cannot vouch for yourself."
            }
        });
    }

    // save vouch in SQLite
    addVouch(target, sender);

    return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
            embeds: [
                {
                    title: "💚 New Vouch Added",
                    color: 0x00ff6a,
                    fields: [
                        { name: "Receiver", value: `<@${target}>`, inline: true },
                        { name: "Given by", value: `<@${sender}>`, inline: true },
                        { name: "Points Added", value: "+10", inline: true }
                    ],
                    footer: { text: "Vouch System — stored in database" },
                    timestamp: new Date().toISOString()
                }
            ]
        }
    });
}
