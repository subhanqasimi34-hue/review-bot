import express from "express";
import { verifyKeyMiddleware } from "discord-interactions";
import handler from "./handler.js";

const app = express();
app.use(express.json());

// Render Alive Check
app.get("/", (req, res) => {
    res.status(200).send("Discord Review Bot is running via Webhooks.");
});

// Discord Webhook Endpoint
app.post(
    "/interactions",
    verifyKeyMiddleware(process.env.PUBLIC_KEY),
    handler
);

// Port for Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Review Bot Webhook live on PORT ${PORT}`);
});
