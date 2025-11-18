import { REST, Routes } from "discord.js";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config(); // load .env if exists

// Load command JSON definitions
const commands = [];
const files = fs.readdirSync("./commands-json").filter(f => f.endsWith(".json"));

for (const file of files) {
    const json = JSON.parse(fs.readFileSync(`./commands-json/${file}`, "utf8"));
    commands.push(json);
}

const rest = new REST({ version: "10" }).setToken(process.env.BOT_TOKEN);

async function deploy() {
    try {
        console.log("🔧 Registering slash commands...");

        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: commands }
        );

        console.log("✅ Successfully registered ALL commands!");
    } catch (err) {
        console.error("❌ Error deploying slash commands:", err);
    }
}

deploy();
