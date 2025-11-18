import express from "express";
import { verifyKeyMiddleware } from "discord-interactions";
import { handleInteraction } from "./utils/handler.js";

const app = express();
app.use(express.json());

// Root endpoint
app.get("/", (req, res) => {
    res.status(200).send("Discord Bot Webhook is running.");
});

// Discord Interaction Webhook
app.post(
    "/interactions",
    verifyKeyMiddleware(process.env.PUBLIC_KEY),
    async (req, res) => {
        try {
            await handleInteraction(req, res);
        } catch (err) {
            console.error("Interaction Error:", err);

            // If something fails, send a fallback message to Discord
            return res.send({
                type: 4,
                data: {
                    content: "❌ Internal error occurred. Please try again later."
                }
            });
        }
    }
);

// Server listener
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server online at port ${PORT}`);
});
