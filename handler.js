import { InteractionResponseType } from "discord-interactions";
import { handleReview } from "../commands/review.js";
import { handleProfile } from "../commands/profile.js";
import { handleLeaderboard } from "../commands/leaderboard.js";
import { handleRank } from "../commands/rank.js";
import { handleVouch } from "../commands/vouch.js";

export async function handleInteraction(req, res) {
    const interaction = req.body;

    // 1) Discord PING check
    if (interaction.type === 1) {
        return res.send({ type: 1 });
    }

    // 2) Slash Commands
    if (interaction.type === 2) {
        const command = interaction.data.name;

        try {
            switch (command) {
                case "review":
                    return await handleReview(interaction, res);

                case "profile":
                    return await handleProfile(interaction, res);

                case "leaderboard":
                    return await handleLeaderboard(interaction, res);

                case "rank":
                    return await handleRank(interaction, res);

                case "vouch":
                    return await handleVouch(interaction, res);

                default:
                    return res.send({
                        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                        data: {
                            content: "❌ Unknown command."
                        }
                    });
            }
        } catch (err) {
            console.error(`Command Error (${command}):`, err);

            return res.send({
                type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                data: {
                    content: "❌ An internal error occurred during the command execution."
                }
            });
        }
    }

    // 3) Unsupported Interaction Type
    return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
            content: "❌ Unsupported interaction type."
        }
    });
}
