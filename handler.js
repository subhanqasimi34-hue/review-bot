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
        // Slash command received
        if (interaction.type === InteractionType.APPLICATION_COMMAND) {
            const name = interaction.data.name;

            const commands = {
                review: reviewCommand,
                profile: profileCommand,
                leaderboard: leaderboardCommand,
                rank: rankCommand,
                vouch: vouchCommand
            };

            // command exists?
            if (commands[name]) {
                return commands[name](interaction, res);
            }

            // unknown command
            return res.send({
                type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                data: { content: "❌ Unknown command." }
            });
        }

        // unsupported type
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
