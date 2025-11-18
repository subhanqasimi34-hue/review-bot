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
        // Handle Slash Commands
        if (interaction.type === InteractionType.APPLICATION_COMMAND) {
            const command = interaction.data.name;

            switch (command) {
                case "review":
                    return reviewCommand(interaction, res);

                case "profile":
                    return profileCommand(interaction, res);

                case "leaderboard":
                    return leaderboardCommand(interaction, res);

                case "rank":
                    return rankCommand(interaction, res);

                case "vouch":
                    return vouchCommand(interaction, res);

                default:
                    return res.send({
                        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                        data: { content: "❌ Unknown command." }
                    });
            }
        }

        // Unsupported interaction types
        return res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: { content: "⚠️ Unsupported interaction type." }
        });

    } catch (err) {
        console.error("❌ Handler Error:", err);
        return res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: { content: "❌ Internal bot error." }
        });
    }
}
