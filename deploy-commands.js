import { REST, Routes } from "discord.js";
import fs from "fs";

const commands = [];

// Load all command JSON definitions
const commandFiles = fs.readdirSync("./commands-json").filter(f => f.endsWith(".json"));

for (const file of commandFiles) {
    const data = JSON.parse(fs.readFileSync(`./commands-json/${file}`, "utf8"));
    commands.push(data);
}

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

async function deploy() {
    try {
        console.log("🔧 Registering slash commands...");

        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: commands }
        );

        console.log("✅ Successfully registered all slash commands!");
    } catch (err) {
        console.error("❌ Error deploying commands:", err);
    }
}

deploy();