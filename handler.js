import {
    InteractionType,
    InteractionResponseType
} from "discord-interactions";

import reviewCommand from "./commands/review.js";
import profileCommand from "./commands/profile.js";
import leaderboardCommand from "./commands/leaderboard.js";
import rankCommand from "./commands/rank.js";
import vouchCommand from "./commands/vouch.js";

export default async function handler(req, res) {
    const interaction = req.body;

    try {
        if (interaction.type === InteractionType.APPLICATION_COMMAND) {
            const name = interaction.data.name;

            if (name === "review") return reviewCommand(interaction, res);
            if (name === "profile") return profileCommand(interaction, res);
            if (name === "leaderboard") return leaderboardCommand(interaction, res);
            if (name === "rank") return rankCommand(interaction, res);
            if (name === "vouch") return vouchCommand(interaction, res);

            return res.send({
                type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                data: { content: "❌ Unknown command." }
            });
        }

        if (interaction.type === InteractionType.MODAL_SUBMIT) {
            const customId = interaction.data.custom_id;

            if (customId.startsWith("review-modal"))
                return reviewCommand.handleModal(interaction, res);

            return res.send({
                type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                data: { content: "❌ Unknown modal." }
            });
        }

        return res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: { content: "⚠️ Unsupported interaction." }
        });
    } catch (err) {
        console.error("Handler Error:", err);
        return res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: { content: "❌ Internal Bot Error." }
        });
    }
}