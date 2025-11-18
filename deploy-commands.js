import { REST, Routes } from "discord.js";
import fs from "fs";
import config from "./config.json" assert { type: "json" };

// Load command JSON files
const commands = [];
const files = fs.readdirSync("./commands-json").filter(f => f.endsWith(".json"));

for (const file of files) {
    const data = JSON.parse(fs.readFileSync(`./commands-json/${file}`, "utf8"));
    commands.push(data);
}

const rest = new REST({ version: "10" }).setToken(config.botToken);

async function deploy() {
    try {
        console.log("🔧 Registering slash commands...");

        await rest.put(
            Routes.applicationCommands(config.clientId),
            { body: commands }
        );

        console.log("✅ Successfully registered ALL commands!");
    } catch (err) {
        console.error("❌ Error deploying slash commands:", err);
    }
}

deploy();
